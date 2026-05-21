import { createAdminClient } from './admin'

/**
 * Insert a notification for a user.
 * Called from admin API routes — uses service role to bypass RLS.
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) {
  const admin = createAdminClient()
  await admin.from('notifications').insert({ user_id: userId, title, message, type })
}
