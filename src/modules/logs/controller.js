/**
 * Logs Controller
 */

const service = require('./service')

/**
 * POST /api/notification/logs
 * Publish an API call log entry to the RabbitMQ queue
 */
const publishLog = async (req, res) => {
  try {
    const result = await service.publishLog(req.body)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[Logs] publishLog error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

module.exports = {
  publishLog,
}
