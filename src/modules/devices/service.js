/**
 * Devices Service
 *
 * Business logic for device registration and management.
 */

const repository = require('./repository')

/**
 * Register (or update) a device for a user.
 * If the device already exists (same userId + deviceId), the FCM token is updated.
 *
 * @param {{ userId: string, deviceId: string, platform: string, fcmToken: string }} data
 * @returns {Promise<{ success: boolean }>}
 */
const registerDevice = async ({ userId, deviceId, platform, fcmToken }) => {
  console.log(`[Devices] register — userId: ${userId}, deviceId: ${deviceId}, platform: ${platform}`)

  await repository.upsertDevice({ userId, deviceId, platform, fcmToken })

  return { success: true }
}

/**
 * Unregister a device — sets is_active = false.
 *
 * @param {{ userId: string, deviceId: string }} data
 * @returns {Promise<{ success: boolean }>}
 */
const unregisterDevice = async ({ userId, deviceId }) => {
  console.log(`[Devices] unregister — userId: ${userId}, deviceId: ${deviceId}`)

  const device = await repository.deactivateDevice(userId, deviceId)

  if (!device) {
    const err = new Error('Device not found')
    err.statusCode = 404
    throw err
  }

  return { success: true }
}

module.exports = {
  registerDevice,
  unregisterDevice,
}
