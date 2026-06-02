/**
 * Notifications Validation
 *
 * Request validation rules using express-validator.
 */

const { body } = require('express-validator')

/**
 * POST /notifications/user — send to specific user
 */
const sendToUserValidation = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isString()
    .withMessage('userId must be a string'),

  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isString()
    .withMessage('title must be a string')
    .isLength({ max: 255 })
    .withMessage('title must not exceed 255 characters'),

  body('message')
    .notEmpty()
    .withMessage('message is required')
    .isString()
    .withMessage('message must be a string'),

  body('type')
    .notEmpty()
    .withMessage('type is required')
    .isString()
    .withMessage('type must be a string')
    .isLength({ max: 100 })
    .withMessage('type must not exceed 100 characters'),

  body('payload')
    .optional()
    .isObject()
    .withMessage('payload must be an object'),
]

/**
 * POST /notifications/broadcast — send to all users
 */
const broadcastValidation = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isString()
    .withMessage('title must be a string')
    .isLength({ max: 255 })
    .withMessage('title must not exceed 255 characters'),

  body('message')
    .notEmpty()
    .withMessage('message is required')
    .isString()
    .withMessage('message must be a string'),

  body('type')
    .notEmpty()
    .withMessage('type is required')
    .isString()
    .withMessage('type must be a string'),

  body('payload')
    .optional()
    .isObject()
    .withMessage('payload must be an object'),
]

/**
 * POST /notifications/device — send to specific device
 */
const sendToDeviceValidation = [
  body('deviceId')
    .notEmpty()
    .withMessage('deviceId is required')
    .isString()
    .withMessage('deviceId must be a string'),

  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isString()
    .withMessage('title must be a string'),

  body('message')
    .notEmpty()
    .withMessage('message is required')
    .isString()
    .withMessage('message must be a string'),

  body('payload')
    .optional()
    .isObject()
    .withMessage('payload must be an object'),
]

/**
 * POST /notifications/test — test raw FCM token
 */
const testNotificationValidation = [
  body('fcmToken')
    .notEmpty()
    .withMessage('fcmToken is required')
    .isString()
    .withMessage('fcmToken must be a string'),
]

module.exports = {
  sendToUserValidation,
  broadcastValidation,
  sendToDeviceValidation,
  testNotificationValidation,
}
