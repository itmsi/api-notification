const fs = require('fs')

const generateFolderLogs = (dynamicFolder, path) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const date = today.getDate()
  const folderPath = `./${dynamicFolder}/${path}/${year}/${month}/${date}/`
  const pathForDatabase = `${dynamicFolder}/${path}/${year}/${month}/${date}/`
  if (!fs.existsSync(folderPath)) {
    console.log('generated folder');
    fs.mkdirSync(folderPath, { recursive: true, mode: 0o755 })
  }
  return {
    pathForDatabase,
    folderPath
  }
}

// No-op writable used when the log file/folder can't be created (e.g. read-only
// filesystem), so callers can still call `.write()` without crashing the process.
const noopWriter = { write: () => true }

const logger = (fileName, type) => {
  try {
    const { folderPath } = generateFolderLogs('logs', type)
    const finalPath = `${__dirname}/../../${folderPath}/${fileName}`
    const stream = fs.createWriteStream(finalPath, {
      flags: 'a',
      mode: 0o755
    })
    stream.on('error', (error) => {
      console.error('Failed to write to log file:', error)
    })
    return stream
  } catch (error) {
    console.error('Failed to prepare log file:', error)
    return noopWriter
  }
}

// Enhanced logger with different log levels
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    }
    this.currentLevel = this.levels.info
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}\n`
  }

  log(level, message, meta = {}) {
    if (this.levels[level] <= this.currentLevel) {
      const formattedMessage = this.formatMessage(level, message, meta)
      console.log(formattedMessage.trim())
      
      // Also write to file
      try {
        const { folderPath } = generateFolderLogs('logs', 'application')
        const finalPath = `${__dirname}/../../${folderPath}/app.log`
        fs.appendFileSync(finalPath, formattedMessage)
      } catch (error) {
        console.error('Failed to write to log file:', error)
      }
    }
  }

  error(message, meta = {}) {
    this.log('error', message, meta)
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta)
  }

  info(message, meta = {}) {
    this.log('info', message, meta)
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta)
  }
}

module.exports = {
  logger,
  Logger: new Logger()
}
