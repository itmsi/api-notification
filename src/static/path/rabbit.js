/**
 * Swagger Path Definitions for RabbitMQ API
 */

const rabbitPaths = {
  '/internal/events': {
    post: {
      tags: ['RabbitMQ / Internal'],
      summary: 'Publish Internal Event',
      description: 'Publish an event payload to the RabbitMQ notifications queue. Useful for testing without the upstream API Service.',
      operationId: 'rabbitPublishEvent',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PublishEventRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Event published successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PublishSuccessResponse' }
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
  },

  '/rabbit/health': {
    get: {
      tags: ['RabbitMQ / Internal'],
      summary: 'RabbitMQ Health Check',
      description: 'Returns connection status of the RabbitMQ consumer.',
      operationId: 'rabbitHealth',
      responses: {
        200: {
          description: 'RabbitMQ connected',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RabbitHealthResponse' }
            }
          }
        },
        503: {
          description: 'RabbitMQ disconnected',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'RabbitMQ not reachable' }
                }
              }
            }
          }
        }
      }
    }
  }
}

module.exports = rabbitPaths
