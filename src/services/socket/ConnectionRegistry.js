/**
 * ConnectionRegistry
 *
 * In-memory registry tracking which socketIds belong to which userId.
 * Supports multiple simultaneous connections per user (multi-device).
 *
 * Structure:
 *   Map<userId, Set<socketId>>
 *
 * Example:
 *   {
 *     "user-uuid-1": Set { "socket-abc", "socket-def" },
 *     "user-uuid-2": Set { "socket-xyz" }
 *   }
 *
 * NOTE: This is process-local (single instance).
 * For horizontal scaling, replace with Redis Adapter.
 */

class ConnectionRegistry {
  constructor() {
    /** @type {Map<string, Set<string>>} */
    this._registry = new Map()
  }

  /**
   * Register a new socket connection for a user.
   *
   * @param {string|number} userId
   * @param {string} socketId
   */
  add(userId, socketId) {
    const key = String(userId)
    if (!this._registry.has(key)) {
      this._registry.set(key, new Set())
    }
    this._registry.get(key).add(socketId)
    console.log(
      `[Registry] add — userId: ${key}, socketId: ${socketId}, total sockets for user: ${this._registry.get(key).size}`
    )
  }

  /**
   * Remove a socket connection for a user.
   * If the user has no more connections, removes the user entry entirely.
   *
   * @param {string|number} userId
   * @param {string} socketId
   */
  remove(userId, socketId) {
    const key = String(userId)
    if (!this._registry.has(key)) return

    const sockets = this._registry.get(key)
    sockets.delete(socketId)

    if (sockets.size === 0) {
      this._registry.delete(key)
      console.log(`[Registry] remove — userId: ${key} fully disconnected`)
    } else {
      console.log(
        `[Registry] remove — userId: ${key}, socketId: ${socketId}, remaining: ${sockets.size}`
      )
    }
  }

  /**
   * Get all socketIds for a user.
   *
   * @param {string|number} userId
   * @returns {string[]}
   */
  getSocketIds(userId) {
    const key = String(userId)
    const sockets = this._registry.get(key)
    return sockets ? Array.from(sockets) : []
  }

  /**
   * Get all currently online userId strings.
   *
   * @returns {string[]}
   */
  getOnlineUserIds() {
    return Array.from(this._registry.keys())
  }

  /**
   * Total number of online users (unique userIds).
   *
   * @returns {number}
   */
  getOnlineUsersCount() {
    return this._registry.size
  }

  /**
   * Total number of socket connections across all users.
   *
   * @returns {number}
   */
  getTotalSocketsCount() {
    let total = 0
    for (const sockets of this._registry.values()) {
      total += sockets.size
    }
    return total
  }

  /**
   * Check if a user has at least one active connection.
   *
   * @param {string|number} userId
   * @returns {boolean}
   */
  isOnline(userId) {
    const key = String(userId)
    return this._registry.has(key) && this._registry.get(key).size > 0
  }
}

// Export singleton instance
module.exports = new ConnectionRegistry()
