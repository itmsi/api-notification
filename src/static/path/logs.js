/**
 * Swagger Path Definitions for Logs API
 */

const logsPaths = {
  '/logs': {
    post: {
      tags: ['Logs'],
      summary: 'Publish API Call Log',
      description: 'Publish an API call log entry to RabbitMQ. The entry is consumed by the Telegram listener, which forwards it to Telegram when `send` is true.',
      operationId: 'publishLog',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PublishLogRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Log entry published successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PublishLogSuccessResponse' }
            }
          }
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
            }
          }
        }
      }
    }
  }
}

module.exports = logsPaths
