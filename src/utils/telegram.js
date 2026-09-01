const axios = require("axios");

const DEFAULT_TIMEOUT_MS = Number(process.env.TELEGRAM_TIMEOUT_MS || 15000);
const DEFAULT_RETRY_COUNT = Number(process.env.TELEGRAM_MAX_RETRIES || 2);

/**
 * Send a plain text message to the configured Telegram chat via Bot API.
 * Token/chat id are read from process.env so a missing config fails fast
 * instead of silently posting to the wrong chat.
 */
const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID is not configured");
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const timeoutMs = Number(
    process.env.TELEGRAM_TIMEOUT_MS || DEFAULT_TIMEOUT_MS,
  );
  const retries = Number(
    process.env.TELEGRAM_MAX_RETRIES || DEFAULT_RETRY_COUNT,
  );

  let lastError = null;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      const { data } = await axios.post(
        url,
        {
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        },
        {
          timeout: timeoutMs,
          validateStatus: (status) => status >= 200 && status < 300,
        },
      );

      return data;
    } catch (error) {
      lastError = error;
      if (attempt <= retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }
    }
  }

  throw lastError;
};

module.exports = {
  sendTelegramMessage,
};
