/**
 * Rabbit API Router
 */

const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { publishEventValidation } = require('./validation')
const { validateMiddleware } = require('../../middlewares/validation')

/**
 * @route   POST /api/internal/events
 * @desc    Publish an event to RabbitMQ
 * @access  Internal
 */
router.post(
  '/internal/events',
  publishEventValidation,
  validateMiddleware,
  controller.publishEvent
)

/**
 * @route   GET /api/rabbit/health
 * @desc    Get RabbitMQ health
 * @access  Public
 */
router.get('/rabbit/health', controller.health)

module.exports = router
