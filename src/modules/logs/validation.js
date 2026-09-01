/**
 * Logs Validation
 *
 * Request validation for publishing an API log entry to RabbitMQ.
 */

const { body } = require('express-validator')

const publishLogValidation = [
  body('system')
    .notEmpty()
    .withMessage('system is required')
    .isString()
    .withMessage('system must be a string'),

  body('id')
    .notEmpty()
    .withMessage('id is required'),

  body('url')
    .notEmpty()
    .withMessage('url is required')
    .isString()
    .withMessage('url must be a string'),

  body('method')
    .notEmpty()
    .withMessage('method is required')
    .isString()
    .withMessage('method must be a string'),

  body('status_code')
    .optional(),

  body('status')
    .optional(),

  body('response')
    .optional(),

  body('curl')
    .optional()
    .isString()
    .withMessage('curl must be a string'),

  body('notes')
    .optional()
    .isString()
    .withMessage('notes must be a string'),

  body('created_at')
    .optional()
    .isString()
    .withMessage('created_at must be a string'),

  body('created_by')
    .optional()
    .isString()
    .withMessage('created_by must be a string'),

  body('updated_by')
    .optional()
    .isString()
    .withMessage('updated_by must be a string'),

  body('send')
    .optional()
    .isBoolean()
    .withMessage('send must be a boolean'),
]

module.exports = {
  publishLogValidation,
}
