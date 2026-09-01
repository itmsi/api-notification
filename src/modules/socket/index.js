/**
 * Socket API Router
 *
 * REST endpoints for testing and managing Socket.IO connections.
 * Base path: /api/socket
 *
 * These endpoints do NOT require a WebSocket connection —
 * they use regular HTTP and interact with the Socket.IO server via SocketService.
 */

const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { emitToUserValidation, broadcastValidation } = require('./validation')
const { validateMiddleware } = require('../../middlewares/validation')

/**
 * @route   POST /api/socket/emit/user
 * @desc    Emit a Socket.IO event to a specific user's room
 * @access  Public (add auth middleware in production)
 */
router.post(
  '/emit/user',
  emitToUserValidation,
  validateMiddleware,
  controller.emitToUser
)

/**
 * @route   POST /api/socket/emit/broadcast
 * @desc    Broadcast a Socket.IO event to all connected clients
 * @access  Public
 */
router.post(
  '/emit/broadcast',
  broadcastValidation,
  validateMiddleware,
  controller.emitBroadcast
)

/**
 * @route   GET /api/socket/online-users
 * @desc    Get list of currently online user IDs
 * @access  Public
 */
router.get('/online-users', controller.getOnlineUsers)

/**
 * @route   GET /api/socket/health
 * @desc    Get Socket.IO server health and connection stats
 * @access  Public
 */
router.get('/health', controller.health)

module.exports = router
