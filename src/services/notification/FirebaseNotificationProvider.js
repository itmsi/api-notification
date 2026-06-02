/**
 * FirebaseNotificationProvider
 *
 * Implements NotificationProvider using Firebase Admin SDK (FCM).
 * Supports single-token, multi-cast, and batched broadcast sends.
 *
 * To add SocketIoNotificationProvider in the future:
 *   1. Create src/services/notification/SocketIoNotificationProvider.js
 *   2. Implement the same sendToUser / sendToDevice / sendBroadcast interface
 *   3. Swap the import in notifications/service.js — zero controller changes needed.
 */

const NotificationProvider = require('./NotificationProvider')
const { getMessaging } = require('../../config/firebase')
const { pgCore } = require('../../config/database')

// Firebase FCM max tokens per multicast call
const FCM_BATCH_SIZE = 500

class FirebaseNotificationProvider extends NotificationProvider {
  /**
   * Send notification to all active devices of a user
   */
  async sendToUser(userId, title, message, payload = {}) {
    const devices = await pgCore('user_devices')
      .where({ user_id: userId, is_active: true })
      .whereNotNull('fcm_token')
      .select('fcm_token')

    if (!devices.length) {
      console.warn(`[Firebase] No active devices found for user: ${userId}`)
      return { successCount: 0, failureCount: 0, responses: [] }
    }

    const tokens = devices.map((d) => d.fcm_token)
    return this._sendMulticast(tokens, title, message, payload)
  }

  /**
   * Send notification to a specific device by deviceId
   */
  async sendToDevice(deviceId, title, message, payload = {}) {
    const device = await pgCore('user_devices')
      .where({ device_id: deviceId, is_active: true })
      .whereNotNull('fcm_token')
      .first()

    if (!device) {
      throw new Error(`No active device found with deviceId: ${deviceId}`)
    }

    const fcmMessage = this._buildMessage(device.fcm_token, title, message, payload)
    const messaging = getMessaging()
    const messageId = await messaging.send(fcmMessage)
    console.log(`[Firebase] sendToDevice success — messageId: ${messageId}`)
    return { messageId }
  }

  /**
   * Broadcast to ALL active devices (batched in groups of 500)
   */
  async sendBroadcast(title, message, payload = {}) {
    const devices = await pgCore('user_devices')
      .where({ is_active: true })
      .whereNotNull('fcm_token')
      .select('fcm_token')

    if (!devices.length) {
      console.warn('[Firebase] No active devices found for broadcast')
      return { successCount: 0, failureCount: 0, batchCount: 0 }
    }

    const tokens = [...new Set(devices.map((d) => d.fcm_token))]
    const batches = []

    for (let i = 0; i < tokens.length; i += FCM_BATCH_SIZE) {
      batches.push(tokens.slice(i, i + FCM_BATCH_SIZE))
    }

    let totalSuccess = 0
    let totalFailure = 0

    for (const batch of batches) {
      const result = await this._sendMulticast(batch, title, message, payload)
      totalSuccess += result.successCount
      totalFailure += result.failureCount
    }

    console.log(
      `[Firebase] broadcast complete — success: ${totalSuccess}, failure: ${totalFailure}, batches: ${batches.length}`
    )

    return {
      successCount: totalSuccess,
      failureCount: totalFailure,
      batchCount: batches.length,
    }
  }

  /**
   * Send a raw notification directly to a FCM token (for testing)
   */
  async sendToToken(fcmToken, title, message, payload = {}) {
    const fcmMessage = this._buildMessage(fcmToken, title, message, payload)
    const messaging = getMessaging()
    const messageId = await messaging.send(fcmMessage)
    console.log(`[Firebase] sendToToken success — messageId: ${messageId}`)
    return { messageId }
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Build a FCM message object
   */
  _buildMessage(token, title, body, data = {}) {
    return {
      token,
      notification: { title, body },
      data: this._stringifyData(data),
      android: {
        priority: 'high',
        notification: { sound: 'default' },
      },
      apns: {
        payload: {
          aps: { sound: 'default', badge: 1 },
        },
      },
    }
  }

  /**
   * Send multicast message to an array of tokens
   */
  async _sendMulticast(tokens, title, message, payload = {}) {
    const messaging = getMessaging()
    const multicastMessage = {
      tokens,
      notification: { title, body: message },
      data: this._stringifyData(payload),
      android: {
        priority: 'high',
        notification: { sound: 'default' },
      },
      apns: {
        payload: {
          aps: { sound: 'default', badge: 1 },
        },
      },
    }

    const response = await messaging.sendEachForMulticast(multicastMessage)

    console.log(
      `[Firebase] multicast — success: ${response.successCount}, failure: ${response.failureCount}`
    )

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`[Firebase] token[${idx}] error:`, resp.error?.message)
        }
      })
    }

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    }
  }

  /**
   * FCM data payload values must all be strings
   */
  _stringifyData(data) {
    const result = {}
    if (data && typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        result[key] =
          typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key])
      })
    }
    return result
  }
}

module.exports = FirebaseNotificationProvider
