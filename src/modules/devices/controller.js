/**
 * Devices Controller
 *
 * HTTP request/response handler for device registration endpoints.
 */

const service = require('./service')

/**
 * POST /api/v1/devices/register
 * Register or update a device FCM token
 */
const register = async (req, res) => {
  try {
    const { userId, deviceId, platform, fcmToken } = req.body
    const result = await service.registerDevice({ userId, deviceId, platform, fcmToken })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Devices] register error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * DELETE /api/v1/devices/register
 * Unregister a device (set is_active = false)
 */
const unregister = async (req, res) => {
  try {
    const { userId, deviceId } = req.body
    const result = await service.unregisterDevice({ userId, deviceId })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Devices] unregister error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

module.exports = {
  register,
  unregister,
}
