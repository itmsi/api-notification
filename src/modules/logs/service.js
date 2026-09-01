/**
 * Logs Service
 *
 * Publishes an API call log entry to RabbitMQ. The `send` flag travels
 * inside the payload and is read by the listener to decide whether the
 * entry should also be forwarded to Telegram.
 */

const { publishToRabbitMqQueueSingle } = require('../../config/rabbitmq')
const { EXCHANGES, QUEUE } = require('../../utils/constant')

const publishLog = async (data) => {
  const now = new Date().toISOString()

  const payload = {
    system: data?.system,
    id: data?.id,
    url: data?.url,
    method: data?.method,
    payload: data?.payload,
    status_code: data?.status_code,
    status: data?.status,
    response: data?.response,
    curl: data?.curl,
    notes: data?.notes,
    created_at: data?.created_at || now,
    created_by: data?.created_by,
    updated_at: data?.updated_at || now,
    updated_by: data?.updated_by,
    send: data?.send === true
  }

  await publishToRabbitMqQueueSingle(EXCHANGES.API_LOG, QUEUE.API_LOG, payload)

  return payload
}

module.exports = {
  publishLog,
}
