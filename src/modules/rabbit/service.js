/**
 * Rabbit API Service
 *
 * Wrapper for publishing internal test events and getting RabbitMQ health.
 */

const { publishToRabbitMqQueueSingle } = require('../../config/rabbitmq')
const rabbitManager = require('../../services/rabbit/RabbitConnectionManager')

/**
 * Publish an internal event to RabbitMQ
 */
const publishEvent = async (eventData) => {
  const queueName = rabbitManager.getQueueName()
  const channel = rabbitManager.getChannel()
  
  if (!channel) {
    throw new Error('RabbitMQ channel is not ready')
  }

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(eventData)), { persistent: true })
  return { success: true, message: 'Event published to RabbitMQ' }
}

/**
 * Get RabbitMQ health status
 */
const getHealthStats = () => {
  const channel = rabbitManager.getChannel()
  return {
    success: true,
    connected: !!channel,
    queue: rabbitManager.getQueueName()
  }
}

module.exports = {
  publishEvent,
  getHealthStats
}
