/**
 * NotificationDispatcher
 *
 * Orchestrates saving notifications to the database, dispatching them
 * to the registered providers (Firebase, Socket), and logging the delivery results.
 */

const { pgCore } = require('../../config/database')
const FirebaseNotificationProvider = require('./FirebaseNotificationProvider')
const SocketNotificationProvider = require('./SocketNotificationProvider')

class NotificationDispatcher {
  constructor() {
    this.firebaseProvider = new FirebaseNotificationProvider()
    this.socketProvider = new SocketNotificationProvider()
  }

  /**
   * Dispatch a notification to a specific user
   */
  async dispatchToUser({ userId, type, title, message, payload = {} }) {
    // 1. Save to notifications table
    const [notification] = await pgCore('notifications').insert({
      user_id: userId,
      type,
      title,
      message,
      payload
    }).returning('*')

    // 2. Dispatch to providers concurrently
    const [firebaseResult, socketResult] = await Promise.allSettled([
      this.firebaseProvider.sendToUser(userId, title, message, payload),
      this.socketProvider.sendToUser(userId, title, message, payload)
    ])

    // 3. Log results
    await this._logResult(notification.id, 'FCM', firebaseResult)
    await this._logResult(notification.id, 'SOCKET', socketResult)

    return notification
  }

  /**
   * Dispatch a broadcast notification to all users
   */
  async dispatchBroadcast({ type, title, message, payload = {} }) {
    // 1. Save to notifications table
    const [notification] = await pgCore('notifications').insert({
      user_id: null,
      type,
      title,
      message,
      payload
    }).returning('*')

    // 2. Dispatch to providers concurrently
    const [firebaseResult, socketResult] = await Promise.allSettled([
      this.firebaseProvider.sendBroadcast(title, message, payload),
      this.socketProvider.sendBroadcast(title, message, payload)
    ])

    // 3. Log results
    await this._logResult(notification.id, 'FCM', firebaseResult)
    await this._logResult(notification.id, 'SOCKET', socketResult)

    return notification
  }

  /**
   * Log the delivery result into notification_logs
   */
  async _logResult(notificationId, channel, settledResult) {
    let status = 'SUCCESS'
    let response = {}

    if (settledResult.status === 'rejected') {
      status = 'FAILED'
      response = { error: settledResult.reason.message || String(settledResult.reason) }
    } else {
      const val = settledResult.value
      // Determine if it was a partial failure or success based on provider specific logic
      if (val && val.failureCount && val.failureCount > 0 && val.successCount === 0) {
        status = 'FAILED'
      }
      response = val
    }

    try {
      await pgCore('notification_logs').insert({
        notification_id: notificationId,
        channel,
        status,
        response
      })
    } catch (err) {
      console.error(`[NotificationDispatcher] Failed to log result for ${channel}`, err)
    }

    if (status === 'FAILED') {
      console.warn(`[NotificationDispatcher] Delivery FAILED for ${channel} on notification ${notificationId}`)
    }
  }
}

module.exports = new NotificationDispatcher()
