/**
 * Swagger Schema Definitions for Logs API
 */

const logsSchema = {
  PublishLogRequest: {
    type: 'object',
    required: ['system', 'id', 'url', 'method'],
    properties: {
      system: { type: 'string', example: 'api-gateway' },
      id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      url: { type: 'string', example: '/api/users/login' },
      method: { type: 'string', example: 'POST' },
      payload: { type: 'object', example: { username: 'john.doe' } },
      status_code: { type: 'integer', example: 200 },
      status: { type: 'string', example: 'success' },
      response: { type: 'object', example: { success: true } },
      curl: { type: 'string', example: 'curl -X POST https://example.com/api/users/login' },
      notes: { type: 'string', example: 'Retried after timeout, succeeded on second attempt' },
      created_at: { type: 'string', example: '2026-09-01T10:00:00.000Z' },
      created_by: { type: 'string', example: 'system' },
      updated_by: { type: 'string', example: 'system' },
      send: { type: 'boolean', example: true, description: 'Whether the log entry should also be forwarded to Telegram' }
    }
  },
  PublishLogSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { $ref: '#/components/schemas/PublishLogRequest' }
    }
  }
}

module.exports = logsSchema
