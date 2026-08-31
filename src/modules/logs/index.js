/**
 * Logs Router
 *
 * Base path: /api/notification/logs
 */

const express = require('express')

const router = express.Router()
const controller = require('./controller')
const { publishLogValidation } = require('./validation')
const { validateMiddleware } = require('../../middlewares/validation')

/**
 * @route   POST /api/notification/logs
 * @desc    Publish an API call log entry to RabbitMQ (consumed by the Telegram listener)
 * @access  Internal
 */
router.post('/', publishLogValidation, validateMiddleware, controller.publishLog)

module.exports = router
