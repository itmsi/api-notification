/**
 * Socket API Validation
 *
 * Request validation rules using express-validator.
 */

const { body } = require('express-validator')

/**
 * POST /api/socket/emit/user
 */
const emitToUserValidation = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required'),

  body('event')
    .notEmpty()
    .withMessage('event is required')
    .isString()
    .withMessage('event must be a string')
    .isLength({ max: 100 })
    .withMessage('event must not exceed 100 characters'),

  body('payload')
    .optional()
    .isObject()
    .withMessage('payload must be an object'),
]

/**
 * POST /api/socket/emit/broadcast
 */
const broadcastValidation = [
  body('event')
    .notEmpty()
    .withMessage('event is required')
    .isString()
    .withMessage('event must be a string')
    .isLength({ max: 100 })
    .withMessage('event must not exceed 100 characters'),

  body('payload')
    .optional()
    .isObject()
    .withMessage('payload must be an object'),
]

module.exports = {
  emitToUserValidation,
  broadcastValidation,
}
