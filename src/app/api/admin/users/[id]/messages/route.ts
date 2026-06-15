import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === process.env.ADMIN_API_SECRET
}

type Params = { params: Promise<{ id: string }> }

// GET — fetch conversation for a user
export async function GET(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('messages')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Mark all user messages as read when admin opens conversation
  await admin.from('messages').update({ read: true }).eq('user_id', id).eq('sender', 'user').eq('read', false)

  return NextResponse.json({ data: data ?? [] })
}

// POST — admin sends a message
export async function POST(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { content } = await req.json()

  if (!content?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('messages')
    .insert({ user_id: id, sender: 'admin', content: content.trim(), read: false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ data })
}

// PATCH — admin edits a previously sent message
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { messageId, content } = await req.json()

  if (!messageId) return NextResponse.json({ error: 'messageId is required' }, { status: 400 })
  if (!content?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('messages')
    .update({ content: content.trim(), edited_at: new Date().toISOString() })
    .eq('id', messageId)
    .eq('user_id', id)
    .eq('sender', 'admin') // admins may only edit their own (admin) messages
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

  return NextResponse.json({ data })
}
