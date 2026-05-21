import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createNotification } from '@/lib/supabase/notify'

function isAdmin(request: NextRequest) {
  return request.cookies.get('admin_token')?.value === process.env.ADMIN_API_SECRET
}

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { status } = await request.json()
  const admin = createAdminClient()

  // Fetch the current transaction
  const { data: tx, error: fetchErr } = await admin
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  if (tx.status !== 'Pending') return NextResponse.json({ error: 'Transaction already resolved' }, { status: 400 })

  // Update transaction status
  const { error: updateErr } = await admin
    .from('transactions')
    .update({ status })
    .eq('id', id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400 })

  // Update user balance + send notification
  if (status === 'Completed') {
    const { data: profile } = await admin
      .from('profiles')
      .select('balance')
      .eq('id', tx.user_id)
      .single()

    const currentBalance = profile?.balance ?? 0
    const newBalance = tx.type === 'Deposit'
      ? currentBalance + tx.amount
      : Math.max(0, currentBalance - tx.amount)

    await admin.from('profiles').update({ balance: newBalance }).eq('id', tx.user_id)

    const fmt = (n: number) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (tx.type === 'Deposit') {
      await createNotification(tx.user_id, 'Deposit Approved', `Your deposit of ${fmt(tx.amount)} via ${tx.method} has been approved and credited to your account.`, 'success')
    } else {
      await createNotification(tx.user_id, 'Withdrawal Approved', `Your withdrawal of ${fmt(tx.amount)} via ${tx.method} is being processed and will arrive within 1–3 business days.`, 'success')
    }
  }

  if (status === 'Rejected') {
    const fmt = (n: number) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (tx.type === 'Deposit') {
      await createNotification(tx.user_id, 'Deposit Rejected', `Your deposit of ${fmt(tx.amount)} via ${tx.method} was not approved. Please contact support for assistance.`, 'error')
    } else {
      await createNotification(tx.user_id, 'Withdrawal Rejected', `Your withdrawal of ${fmt(tx.amount)} via ${tx.method} was rejected. Please contact support if you have questions.`, 'error')
    }
  }

  return NextResponse.json({ success: true })
}
