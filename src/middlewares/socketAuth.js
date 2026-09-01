/**
 * Socket.IO JWT Authentication Middleware
 *
 * Reads token from handshake.auth.token, verifies with JWT_SECRET,
 * extracts user payload, and stores in socket.data.user.
 *
 * Client usage (React Native / Web):
 *   import { io } from 'socket.io-client';
 *   const socket = io(SERVER_URL, {
 *     auth: { token: 'your_jwt_token' }
 *   });
 */

const jwt = require('jsonwebtoken')

/**
 * Socket.IO middleware that authenticates connections via JWT.
 *
 * @param {import('socket.io').Socket} socket
 * @param {Function} next
 */
const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token

    if (!token) {
      const err = new Error('Authentication error: token is required')
      err.data = { code: 'TOKEN_MISSING' }
      return next(err)
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      const err = new Error('Server configuration error: JWT_SECRET not set')
      err.data = { code: 'SERVER_ERROR' }
      return next(err)
    }

    const decoded = jwt.verify(token, secret)

    // Extract user fields — support common JWT payload structures
    const user = {
      id: decoded.id || decoded.sub || decoded.userId || decoded.user_id,
      username: decoded.username || decoded.name || decoded.email || 'unknown',
      email: decoded.email || null,
    }

    if (!user.id) {
      const err = new Error('Authentication error: token payload missing user id')
      err.data = { code: 'TOKEN_INVALID' }
      return next(err)
    }

    // Store user on socket for access in event handlers
    socket.data.user = user

    console.log(`[Socket.IO] Auth OK — userId: ${user.id}, socketId: ${socket.id}`)
    next()
  } catch (error) {
    let code = 'TOKEN_INVALID'
    if (error.name === 'TokenExpiredError') code = 'TOKEN_EXPIRED'
    if (error.name === 'JsonWebTokenError') code = 'TOKEN_MALFORMED'

    console.warn(`[Socket.IO] Auth failed — ${error.message}`)
    const err = new Error(`Authentication error: ${error.message}`)
    err.data = { code }
    next(err)
  }
}

module.exports = { socketAuthMiddleware }
