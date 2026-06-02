/**
 * Notifications Router
 *
 * Mounts all notification delivery endpoints.
 * Base path: /api/v1/notifications
 */

const express = require('express')
const router = express.Router()
const controller = require('./controller')
const {
  sendToUserValidation,
  broadcastValidation,
  sendToDeviceValidation,
  testNotificationValidation,
} = require('./validation')
const { validateMiddleware } = require('../../middlewares/validation')

/**
 * @route   POST /api/v1/notifications/user
 * @desc    Send push notification to a specific user (all their active devices)
 * @access  Public
 */
router.post('/user', sendToUserValidation, validateMiddleware, controller.sendToUser)

/**
 * @route   POST /api/v1/notifications/broadcast
 * @desc    Broadcast push notification to ALL active devices
 * @access  Public
 */
router.post('/broadcast', broadcastValidation, validateMiddleware, controller.sendBroadcast)

/**
 * @route   POST /api/v1/notifications/device
 * @desc    Send push notification to a specific device
 * @access  Public
 */
router.post('/device', sendToDeviceValidation, validateMiddleware, controller.sendToDevice)

/**
 * @route   GET /api/v1/notifications/firebase-health
 * @desc    Check Firebase Admin SDK connection status
 * @access  Public
 */
router.get('/firebase-health', controller.firebaseHealth)

/**
 * @route   POST /api/v1/notifications/test
 * @desc    Send a test notification directly to a raw FCM token
 * @access  Public
 */
router.post('/test', testNotificationValidation, validateMiddleware, controller.testNotification)

module.exports = router
