/**
 * Socket Event Handler
 *
 * Manages all Socket.IO connection lifecycle events.
 * Called once from server.js after Socket.IO is initialized.
 *
 * Events handled:
 *   connection  — join user room, register in ConnectionRegistry
 *   ping        — respond with pong
 *   disconnect  — unregister from ConnectionRegistry
 *
 * Future events to add here:
 *   message, typing, read-receipt, etc.
 */

const registry = require('./ConnectionRegistry')

/**
 * Setup all Socket.IO event listeners.
 * Must be called after initSocket(httpServer).
 *
 * @param {import('socket.io').Server} io
 */
const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    const user = socket.data.user

    // ── Join personal room ──────────────────────────────────────────────────
    const room = `user:${user.id}`
    socket.join(room)

    // ── Register in connection tracking ─────────────────────────────────────
    registry.add(user.id, socket.id)

    console.log(
      `[Socket.IO] connect — userId: ${user.id}, socketId: ${socket.id}, room: ${room}`
    )

    // Notify the client they're connected
    socket.emit('connected', {
      socketId: socket.id,
      userId: user.id,
      room,
      timestamp: new Date().toISOString(),
    })

    // ── ping → pong ─────────────────────────────────────────────────────────
    socket.on('ping', (data) => {
      console.log(`[Socket.IO] ping — socketId: ${socket.id}`)
      socket.emit('pong', {
        timestamp: new Date().toISOString(),
        echo: data || null,
      })
    })

    // ── disconnect ──────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      registry.remove(user.id, socket.id)
      console.log(
        `[Socket.IO] disconnect — userId: ${user.id}, socketId: ${socket.id}, reason: ${reason}`
      )
    })

    // ── error handler ────────────────────────────────────────────────────────
    socket.on('error', (err) => {
      console.error(`[Socket.IO] socket error — socketId: ${socket.id}:`, err.message)
    })
  })

  // Global error handler
  io.engine.on('connection_error', (err) => {
    console.error('[Socket.IO] connection_error:', err.message, err.context)
  })

  console.log('[Socket.IO] Event handlers registered')
}

module.exports = { setupSocketHandlers }
