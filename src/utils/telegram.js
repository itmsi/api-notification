const axios = require('axios')

/**
 * Send a plain text message to the configured Telegram chat via Bot API.
 * Token/chat id are read from process.env so a missing config fails fast
 * instead of silently posting to the wrong chat.
 */
const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID is not configured')
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  const { data } = await axios.post(url, {
    chat_id: chatId,
    text,
    parse_mode: 'HTML'
  })

  return data
}

module.exports = {
  sendTelegramMessage
}
