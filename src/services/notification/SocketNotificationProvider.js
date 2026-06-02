/**
 * SocketNotificationProvider
 *
 * Implements NotificationProvider using the internal SocketService.
 */

const NotificationProvider = require('./NotificationProvider')
const socketService = require('../socket/SocketService')

class SocketNotificationProvider extends NotificationProvider {
  /**
   * Send realtime event to all active connections of a user
   */
  async sendToUser(userId, title, message, payload = {}) {
    const event = payload.event || 'USER_NOTIFICATION'
    
    // We pass the full payload to the client so they get title and message as well
    const eventPayload = {
      title,
      message,
      ...payload
    }

    try {
      const result = socketService.sendToUser(userId, event, eventPayload)
      return { successCount: result.online ? 1 : 0, failureCount: 0, room: result.room }
    } catch (error) {
      console.error(`[SocketProvider] Failed to send to user ${userId}`, error)
      return { successCount: 0, failureCount: 1, error: error.message }
    }
  }

  /**
   * Send realtime event to a specific device (Not heavily used in generic socket routing)
   */
  async sendToDevice(deviceId, title, message, payload = {}) {
    console.warn('[SocketProvider] sendToDevice is not supported natively in this socket implementation, delegating to broadcast/user rooms')
    return { messageId: null, ignored: true }
  }

  /**
   * Broadcast realtime event to ALL connected sockets
   */
  async sendBroadcast(title, message, payload = {}) {
    const event = payload.event || 'SYSTEM_NOTIFICATION'
    
    const eventPayload = {
      title,
      message,
      ...payload
    }

    try {
      const result = socketService.broadcast(event, eventPayload)
      return { successCount: result.totalSockets, failureCount: 0, broadcast: true }
    } catch (error) {
      console.error('[SocketProvider] Failed to broadcast', error)
      return { successCount: 0, failureCount: 1, error: error.message }
    }
  }
}

module.exports = SocketNotificationProvider
