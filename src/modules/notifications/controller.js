/**
 * Notifications Controller
 *
 * HTTP request/response handler for all notification endpoints.
 */

const service = require('./service')

/**
 * POST /api/v1/notifications/user
 * Send notification to a specific user
 */
const sendToUser = async (req, res) => {
  try {
    const { userId, title, message, type, payload } = req.body
    const result = await service.sendToUser({ userId, title, message, type, payload })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Notifications] sendToUser error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * POST /api/v1/notifications/broadcast
 * Send notification to ALL active devices
 */
const sendBroadcast = async (req, res) => {
  try {
    const { title, message, type, payload } = req.body
    const result = await service.sendBroadcast({ title, message, type, payload })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Notifications] broadcast error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * POST /api/v1/notifications/device
 * Send notification to a specific device
 */
const sendToDevice = async (req, res) => {
  try {
    const { deviceId, title, message, payload } = req.body
    const result = await service.sendToDevice({ deviceId, title, message, payload })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Notifications] sendToDevice error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * GET /api/v1/notifications/firebase-health
 * Check Firebase Admin SDK connection
 */
const firebaseHealth = (req, res) => {
  try {
    const health = service.checkFirebase()

    if (health.ok) {
      return res.status(200).json({
        success: true,
        firebase: 'connected',
        projectId: health.projectId,
      })
    }

    return res.status(503).json({
      success: false,
      firebase: 'disconnected',
      error: health.error,
    })
  } catch (error) {
    console.error('[Notifications] firebase-health error:', error.message)
    return res.status(500).json({
      success: false,
      firebase: 'error',
      message: error.message,
    })
  }
}

/**
 * POST /api/v1/notifications/test
 * Send a test push notification to a raw FCM token
 */
const testNotification = async (req, res) => {
  try {
    const { fcmToken } = req.body
    const result = await service.sendTestNotification(fcmToken)

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Notifications] test error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

module.exports = {
  sendToUser,
  sendBroadcast,
  sendToDevice,
  firebaseHealth,
  testNotification,
}
