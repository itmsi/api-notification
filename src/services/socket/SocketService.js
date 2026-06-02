/**
 * SocketService
 *
 * Abstraction layer for Socket.IO operations.
 * Controllers never touch `io` directly — they go through this service.
 *
 * This makes it easy to:
 *   - Test without a real Socket.IO server
 *   - Add logging/metrics in one place
 *   - Later add RabbitMQ or Firebase fallback alongside Socket.IO
 *
 * Future integration:
 *   When RabbitMQ is added, this service can consume a queue
 *   and emit to the correct room without touching any controller.
 */

const { getIo } = require('../../config/socket')
const registry = require('./ConnectionRegistry')

class SocketService {
  /**
   * Send an event to all active connections of a specific user.
   * Uses Socket.IO room: `user:${userId}`
   *
   * @param {string|number} userId
   * @param {string} event - Event name
   * @param {object} payload - Data to send
   * @returns {{ success: boolean, room: string, online: boolean }}
   */
  sendToUser(userId, event, payload) {
    const io = getIo()
    const room = `user:${userId}`
    const online = registry.isOnline(String(userId))

    io.to(room).emit(event, payload)

    console.log(`[SocketService] sendToUser — room: ${room}, event: ${event}, online: ${online}`)
    return { success: true, room, online }
  }

  /**
   * Send an event to a specific Socket.IO room.
   *
   * @param {string} room - Room name (e.g. 'user:123', 'broadcast')
   * @param {string} event - Event name
   * @param {object} payload - Data to send
   * @returns {{ success: boolean, room: string }}
   */
  sendToRoom(room, event, payload) {
    const io = getIo()
    io.to(room).emit(event, payload)

    console.log(`[SocketService] sendToRoom — room: ${room}, event: ${event}`)
    return { success: true, room }
  }

  /**
   * Broadcast an event to ALL connected sockets.
   *
   * @param {string} event - Event name
   * @param {object} payload - Data to send
   * @returns {{ success: boolean, totalSockets: number }}
   */
  broadcast(event, payload) {
    const io = getIo()
    const totalSockets = io.sockets.sockets.size

    io.emit(event, payload)

    console.log(`[SocketService] broadcast — event: ${event}, totalSockets: ${totalSockets}`)
    return { success: true, totalSockets }
  }

  /**
   * Get list of online user IDs from the in-memory registry.
   *
   * @returns {string[]}
   */
  getOnlineUsers() {
    return registry.getOnlineUserIds()
  }

  /**
   * Get total number of connected sockets from Socket.IO server.
   *
   * @returns {{ connectedUsers: number, totalSockets: number }}
   */
  getConnectedSockets() {
    const io = getIo()
    return {
      connectedUsers: registry.getOnlineUsersCount(),
      totalSockets: io.sockets.sockets.size,
    }
  }
}

// Export singleton instance
module.exports = new SocketService()
