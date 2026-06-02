/**
 * Notifications Repository
 *
 * Database layer for notifications table operations.
 */

const { pgCore } = require('../../config/database')

const TABLE = 'notifications'

/**
 * Save a notification record to the database
 *
 * @param {{ userId?: string, type: string, title: string, message: string, payload?: object }} data
 * @returns {Promise<object>} Saved notification row
 */
const saveNotification = async ({ userId = null, type, title, message, payload = null }) => {
  const result = await pgCore(TABLE)
    .insert({
      user_id: userId,
      type,
      title,
      message,
      payload: payload ? JSON.stringify(payload) : null,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    .returning('*')

  return result[0]
}

/**
 * Get all notifications for a user (most recent first)
 *
 * @param {string} userId
 * @param {{ limit?: number, offset?: number }} options
 */
const getNotificationsByUser = async (userId, { limit = 20, offset = 0 } = {}) => {
  return pgCore(TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
}

/**
 * Mark a notification as read
 *
 * @param {string} id - Notification UUID
 */
const markAsRead = async (id) => {
  const result = await pgCore(TABLE)
    .where({ id })
    .update({ is_read: true })
    .returning('*')

  return result[0]
}

module.exports = {
  saveNotification,
  getNotificationsByUser,
  markAsRead,
}
