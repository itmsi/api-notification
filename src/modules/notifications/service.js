/**
 * Notifications Service
 *
 * Orchestrates notification delivery:
 *   1. Saves notification record to DB
 *   2. Delegates push delivery to FirebaseNotificationProvider
 *
 * FirebaseNotificationProvider implements the NotificationProvider interface,
 * making it easy to swap in a SocketIoNotificationProvider later without
 * changing any controller code.
 */

const repository = require('./repository')
const FirebaseNotificationProvider = require('../../services/notification/FirebaseNotificationProvider')
const { checkFirebaseHealth } = require('../../config/firebase')

// Singleton provider instance — swap this line to use a different provider
const notificationProvider = new FirebaseNotificationProvider()

/**
 * Send notification to a specific user (all their active devices)
 *
 * @param {{ userId: string, title: string, message: string, type: string, payload?: object }} data
 */
const sendToUser = async ({ userId, title, message, type, payload }) => {
  console.log(`[Notifications] sendToUser — userId: ${userId}, type: ${type}`)

  // 1. Persist notification record
  const notification = await repository.saveNotification({ userId, type, title, message, payload })

  // 2. Send push via Firebase
  const firebaseResponse = await notificationProvider.sendToUser(userId, title, message, payload)

  console.log(`[Notifications] Firebase response for user ${userId}:`, firebaseResponse)

  return {
    success: true,
    notification,
    firebase: firebaseResponse,
  }
}

/**
 * Broadcast notification to ALL active devices
 *
 * @param {{ title: string, message: string, type: string, payload?: object }} data
 */
const sendBroadcast = async ({ title, message, type, payload }) => {
  console.log(`[Notifications] broadcast — type: ${type}`)

  // 1. Save a generic broadcast notification (no specific user)
  const notification = await repository.saveNotification({
    userId: null,
    type,
    title,
    message,
    payload,
  })

  // 2. Send to all active devices in batches
  const firebaseResponse = await notificationProvider.sendBroadcast(title, message, payload)

  console.log('[Notifications] Broadcast Firebase response:', firebaseResponse)

  return {
    success: true,
    notification,
    firebase: firebaseResponse,
  }
}

/**
 * Send notification to a specific device
 *
 * @param {{ deviceId: string, title: string, message: string, payload?: object }} data
 */
const sendToDevice = async ({ deviceId, title, message, payload }) => {
  console.log(`[Notifications] sendToDevice — deviceId: ${deviceId}`)

  const firebaseResponse = await notificationProvider.sendToDevice(deviceId, title, message, payload)

  console.log(`[Notifications] Firebase response for device ${deviceId}:`, firebaseResponse)

  return {
    success: true,
    firebase: firebaseResponse,
  }
}

/**
 * Validate Firebase Admin SDK connection
 */
const checkFirebase = () => {
  const health = checkFirebaseHealth()
  return health
}

/**
 * Send a test push notification directly to a raw FCM token
 *
 * @param {string} fcmToken
 */
const sendTestNotification = async (fcmToken) => {
  console.log(`[Notifications] test notification — token: ${fcmToken.substring(0, 20)}...`)

  const firebaseResponse = await notificationProvider.sendToToken(
    fcmToken,
    'Test Notification',
    'Firebase integration success'
  )

  console.log('[Notifications] Test notification Firebase response:', firebaseResponse)

  return {
    success: true,
    firebase: firebaseResponse,
  }
}

module.exports = {
  sendToUser,
  sendBroadcast,
  sendToDevice,
  checkFirebase,
  sendTestNotification,
}
