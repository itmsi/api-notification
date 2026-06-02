/**
 * Socket.IO Singleton
 *
 * Menyimpan instance `io` yang di-init sekali dari server.js.
 * Dapat di-import dari mana saja dengan getIo().
 *
 * Usage:
 *   // server.js:
 *   const { initSocket } = require('./config/socket');
 *   initSocket(httpServer);
 *
 *   // anywhere else:
 *   const { getIo } = require('./config/socket');
 *   getIo().to('user:123').emit('event', payload);
 */

const { Server } = require('socket.io')

let _io = null

/**
 * Initialize Socket.IO server on top of the HTTP server.
 * Must be called once from server.js before any other Socket.IO usage.
 *
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
const initSocket = (httpServer) => {
  if (_io) {
    console.warn('[Socket.IO] Already initialized — skipping duplicate init')
    return _io
  }

  const corsOrigins = process.env.SOCKET_CORS_ORIGINS
    ? process.env.SOCKET_CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['*']

  _io = new Server(httpServer, {
    path: '/socket.io',
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Ping/pong heartbeat — keep connections alive
    pingTimeout: 60000,
    pingInterval: 25000,
    // Allow transport upgrade: polling → websocket
    transports: ['websocket', 'polling'],
  })

  console.log(`[Socket.IO] Initialized — CORS origins: ${corsOrigins.join(', ')}`)
  return _io
}

/**
 * Get the Socket.IO server instance.
 * Throws if initSocket() was not called first.
 *
 * @returns {import('socket.io').Server}
 */
const getIo = () => {
  if (!_io) {
    throw new Error('[Socket.IO] Not initialized. Call initSocket(httpServer) first.')
  }
  return _io
}

module.exports = { initSocket, getIo }
