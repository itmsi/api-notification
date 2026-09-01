const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const app = require('./app');
const { registerAISocketHandlers } = require('./modules/ai-assistant-socket');

// ─── Socket.IO Namespace untuk AI Assistant ────────────────────
const AI_SOCKET_PATH = process.env.AI_SOCKET_PATH || '/api/mosa/ai-assistant';
const AI_SOCKET_CORS_ORIGINS = process.env.AI_SOCKET_CORS_ORIGINS || '*';

// ─── Process Handlers ──────────────────────────────────────────
process.on('warning', (warning) => {
  console.warn(warning.name)
  console.warn(warning.message)
  console.warn(warning.stack)
})

const unhandledRejections = new Map()
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason)
  console.log(
    process.stderr.fd,
    `Caught rejection: ${promise}\n`
    + `Exception reason: ${reason}`
  )
})
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise)
})

process.on('uncaughtException', (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n`
    + `Exception origin: ${origin}`
  )
})

process.on('SIGTERM', () => {
  console.info('SIGTERM received')
})

// ─── HTTP Server dengan Socket.IO ──────────────────────────────
const server = http.createServer(app);

const aiSocketIO = new SocketIOServer(server, {
  path: AI_SOCKET_PATH,
  cors: {
    origin: AI_SOCKET_CORS_ORIGINS === '*' ? '*' : AI_SOCKET_CORS_ORIGINS.split(','),
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

registerAISocketHandlers(aiSocketIO);

server.listen(process.env.APP_PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.info(`${process?.env.APP_NAME} running in port ${process.env.APP_PORT}`)
  } else {
    console.info(`${process?.env.APP_NAME} is running`)
  }
})
