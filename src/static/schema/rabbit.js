/**
 * Swagger Schema Definitions for RabbitMQ API
 */

const rabbitSchema = {
  PublishEventRequest: {
    type: 'object',
    required: ['event'],
    properties: {
      event: { type: 'string', example: 'TASK_ASSIGNED' },
      userId: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      title: { type: 'string', example: 'New Task' },
      message: { type: 'string', example: 'You have been assigned a new task' },
      payload: { type: 'object', example: { taskId: '12345' } }
    }
  },
  PublishSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Event published to RabbitMQ' }
    }
  },
  RabbitHealthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      connected: { type: 'boolean', example: true },
      queue: { type: 'string', example: 'notifications' }
    }
  }
}

module.exports = rabbitSchema
