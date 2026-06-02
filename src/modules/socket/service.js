/**
 * Socket API Service
 *
 * Thin wrapper that delegates to SocketService.
 * Keeps controller clean and provides a consistent module boundary.
 */

const socketService = require('../../services/socket/SocketService')

/**
 * Emit event to a specific user's room.
 *
 * @param {{ userId: string|number, event: string, payload: object }} data
 */
const emitToUser = ({ userId, event, payload = {} }) => {
  console.log(`[Socket Module] emitToUser — userId: ${userId}, event: ${event}`)
  return socketService.sendToUser(userId, event, payload)
}

/**
 * Broadcast event to all connected clients.
 *
 * @param {{ event: string, payload: object }} data
 */
const emitBroadcast = ({ event, payload = {} }) => {
  console.log(`[Socket Module] broadcast — event: ${event}`)
  return socketService.broadcast(event, payload)
}

/**
 * Get list of currently online user IDs.
 *
 * @returns {string[]}
 */
const getOnlineUsers = () => {
  return socketService.getOnlineUsers()
}

/**
 * Get Socket.IO connection stats.
 *
 * @returns {{ connectedUsers: number, totalSockets: number }}
 */
const getHealthStats = () => {
  return socketService.getConnectedSockets()
}

module.exports = {
  emitToUser,
  emitBroadcast,
  getOnlineUsers,
  getHealthStats,
}
