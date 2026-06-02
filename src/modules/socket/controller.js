/**
 * Socket API Controller
 *
 * HTTP request/response handler for Socket.IO test/management endpoints.
 * All Socket.IO logic is in SocketService — not here.
 */

const service = require('./service')

/**
 * POST /api/socket/emit/user
 * Emit a Socket.IO event to a specific user's room.
 */
const emitToUser = (req, res) => {
  try {
    const { userId, event, payload } = req.body
    const result = service.emitToUser({ userId, event, payload })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Socket API] emitToUser error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * POST /api/socket/emit/broadcast
 * Broadcast a Socket.IO event to all connected clients.
 */
const emitBroadcast = (req, res) => {
  try {
    const { event, payload } = req.body
    const result = service.emitBroadcast({ event, payload })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[Socket API] broadcast error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * GET /api/socket/online-users
 * Return list of currently online user IDs.
 */
const getOnlineUsers = (req, res) => {
  try {
    const onlineUsers = service.getOnlineUsers()

    return res.status(200).json({ onlineUsers })
  } catch (error) {
    console.error('[Socket API] online-users error:', error.message)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * GET /api/socket/health
 * Return Socket.IO server connection statistics.
 */
const health = (req, res) => {
  try {
    const stats = service.getHealthStats()

    return res.status(200).json({
      success: true,
      ...stats,
    })
  } catch (error) {
    console.error('[Socket API] health error:', error.message)
    return res.status(503).json({
      success: false,
      message: error.message || 'Socket.IO not initialized',
    })
  }
}

module.exports = {
  emitToUser,
  emitBroadcast,
  getOnlineUsers,
  health,
}
