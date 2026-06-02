/**
 * Devices Repository
 *
 * Database layer for user_devices table operations.
 */

const { pgCore } = require('../../config/database')

const TABLE = 'user_devices'

/**
 * Find a device by userId + deviceId
 */
const findDevice = async (userId, deviceId) => {
  return pgCore(TABLE).where({ user_id: userId, device_id: deviceId }).first()
}

/**
 * Register or update a device.
 * Uses INSERT ... ON CONFLICT DO UPDATE (upsert) to avoid duplicates.
 */
const upsertDevice = async ({ userId, deviceId, platform, fcmToken }) => {
  const now = new Date().toISOString()

  const result = await pgCore(TABLE)
    .insert({
      user_id: userId,
      device_id: deviceId,
      platform,
      fcm_token: fcmToken,
      is_active: true,
      created_at: now,
      updated_at: now,
    })
    .onConflict(['user_id', 'device_id'])
    .merge({
      fcm_token: fcmToken,
      platform,
      is_active: true,
      updated_at: now,
    })
    .returning('*')

  return result[0]
}

/**
 * Soft-unregister a device — sets is_active = false
 */
const deactivateDevice = async (userId, deviceId) => {
  const result = await pgCore(TABLE)
    .where({ user_id: userId, device_id: deviceId })
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .returning('*')

  return result[0]
}

/**
 * Get all active FCM tokens for a user
 */
const getActiveTokensByUser = async (userId) => {
  return pgCore(TABLE)
    .where({ user_id: userId, is_active: true })
    .whereNotNull('fcm_token')
    .select('fcm_token', 'device_id', 'platform')
}

/**
 * Get FCM token for a specific device
 */
const getTokenByDevice = async (deviceId) => {
  return pgCore(TABLE)
    .where({ device_id: deviceId, is_active: true })
    .whereNotNull('fcm_token')
    .first()
}

module.exports = {
  findDevice,
  upsertDevice,
  deactivateDevice,
  getActiveTokensByUser,
  getTokenByDevice,
}
