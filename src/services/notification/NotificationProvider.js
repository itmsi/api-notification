/**
 * NotificationProvider Interface
 *
 * Defines the contract that all notification providers must implement.
 * This allows swapping between FirebaseNotificationProvider, SocketIoNotificationProvider,
 * or any other provider without changing controller code.
 *
 * @interface NotificationProvider
 */

// eslint-disable-next-line no-unused-vars
class NotificationProvider {
  /**
   * Send a push notification to all active devices of a specific user.
   *
   * @param {string} userId - The user's UUID
   * @param {string} title - Notification title
   * @param {string} message - Notification body
   * @param {object} [payload={}] - Optional additional data payload
   * @returns {Promise<{ successCount: number, failureCount: number, responses: Array }>}
   */
  // eslint-disable-next-line no-unused-vars
  async sendToUser(userId, title, message, payload = {}) {
    throw new Error('NotificationProvider.sendToUser() must be implemented')
  }

  /**
   * Send a push notification to a specific device.
   *
   * @param {string} deviceId - The device identifier
   * @param {string} title - Notification title
   * @param {string} message - Notification body
   * @param {object} [payload={}] - Optional additional data payload
   * @returns {Promise<{ messageId: string }>}
   */
  // eslint-disable-next-line no-unused-vars
  async sendToDevice(deviceId, title, message, payload = {}) {
    throw new Error('NotificationProvider.sendToDevice() must be implemented')
  }

  /**
   * Broadcast a push notification to ALL active devices.
   *
   * @param {string} title - Notification title
   * @param {string} message - Notification body
   * @param {object} [payload={}] - Optional additional data payload
   * @returns {Promise<{ successCount: number, failureCount: number, batchCount: number }>}
   */
  // eslint-disable-next-line no-unused-vars
  async sendBroadcast(title, message, payload = {}) {
    throw new Error('NotificationProvider.sendBroadcast() must be implemented')
  }
}

module.exports = NotificationProvider
