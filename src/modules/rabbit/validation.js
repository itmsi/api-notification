const { body } = require('express-validator')

const publishEventValidation = [
  body('event')
    .notEmpty()
    .withMessage('event is required')
    .isString()
    .withMessage('event must be a string')
    .isLength({ max: 100 })
    .withMessage('event must not exceed 100 characters'),

  body('userId')
    .optional()
    .isString()
    .withMessage('userId must be a string if provided'),

  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string if provided')
    .isLength({ max: 255 })
    .withMessage('title must not exceed 255 characters'),

  body('message')
    .optional()
    .isString()
    .withMessage('message must be a string if provided'),

  body('payload')
    .optional()
    .isObject()
    .withMessage('payload must be an object'),
]

module.exports = {
  publishEventValidation,
}
