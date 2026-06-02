/**
 * Rabbit API Controller
 */

const service = require('./service')

/**
 * POST /api/internal/events
 * Publish an event to RabbitMQ
 */
const publishEvent = async (req, res) => {
  try {
    const eventData = req.body
    const result = await service.publishEvent(eventData)

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Rabbit API] publishEvent error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * GET /api/rabbit/health
 * Return RabbitMQ health
 */
const health = (req, res) => {
  try {
    const stats = service.getHealthStats()
    return res.status(200).json(stats)
  } catch (error) {
    console.error('[Rabbit API] health error:', error.message)
    return res.status(503).json({
      success: false,
      message: error.message || 'RabbitMQ not reachable',
    })
  }
}

module.exports = {
  publishEvent,
  health
}
