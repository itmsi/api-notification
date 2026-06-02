/**
 * Devices Validation
 *
 * Request validation rules using express-validator.
 */

const { body } = require('express-validator')

/**
 * Validation rules for POST /devices/register
 */
const registerValidation = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isString()
    .withMessage('userId must be a string'),

  body('deviceId')
    .notEmpty()
    .withMessage('deviceId is required')
    .isString()
    .withMessage('deviceId must be a string')
    .isLength({ max: 255 })
    .withMessage('deviceId must not exceed 255 characters'),

  body('platform')
    .notEmpty()
    .withMessage('platform is required')
    .isIn(['android', 'ios', 'web'])
    .withMessage('platform must be one of: android, ios, web'),

  body('fcmToken')
    .notEmpty()
    .withMessage('fcmToken is required')
    .isString()
    .withMessage('fcmToken must be a string'),
]

/**
 * Validation rules for DELETE /devices/register
 */
const unregisterValidation = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isString()
    .withMessage('userId must be a string'),

  body('deviceId')
    .notEmpty()
    .withMessage('deviceId is required')
    .isString()
    .withMessage('deviceId must be a string'),
]

module.exports = {
  registerValidation,
  unregisterValidation,
}
