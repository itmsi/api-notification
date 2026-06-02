const http = require('http')
// make sure for crashing handler continues to run
const app = require('./app')
const { initSocket } = require('./config/socket')
const { socketAuthMiddleware } = require('./middlewares/socketAuth')
const { setupSocketHandlers } = require('./services/socket/socketHandler')

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

const server = http.createServer(app)

// Initialize Socket.IO
const io = initSocket(server)

// Apply JWT authentication middleware for Socket.IO connections
io.use(socketAuthMiddleware)

// Setup Socket.IO event handlers
setupSocketHandlers(io)

server.listen(process.env.APP_PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.info(`${process?.env.APP_NAME} running in port ${process.env.APP_PORT}`)
  } else {
    console.info(`${process?.env.APP_NAME} is running`)
  }
})
