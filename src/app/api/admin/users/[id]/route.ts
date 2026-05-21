import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createNotification } from '@/lib/supabase/notify'

function isAdmin(request: NextRequest) {
  return request.cookies.get('admin_token')?.value === process.env.ADMIN_API_SECRET
}

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const admin = createAdminClient()

  const [{ data: profile, error: pe }, { data: transactions, error: te }] = await Promise.all([
    admin.from('profiles').select('*').eq('id', id).single(),
    admin.from('transactions').select('*').eq('user_id', id).order('created_at', { ascending: false }),
  ])

  if (pe) return NextResponse.json({ error: pe.message }, { status: 404 })
  return NextResponse.json({ data: { profile, transactions: transactions ?? [] } })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const body = await request.json()
  const admin = createAdminClient()

  // Only allow specific fields to be updated
  const allowed = ['balance', 'profit', 'plan', 'kyc_status', 'is_suspended', 'full_name', 'country']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const { data, error } = await admin
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Send notification when KYC is marked as Verified
  if (body.kyc_status === 'Verified') {
    await createNotification(id, 'KYC Verified ✓', 'Your identity has been verified. You now have full access to deposits, withdrawals, and higher limits.', 'success')
  }

  return NextResponse.json({ data })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const admin = createAdminClient()

  // Delete auth user — cascades to profile + transactions via FK
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
