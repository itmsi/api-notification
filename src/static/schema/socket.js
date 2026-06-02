/**
 * Swagger Schema Definitions for Socket.IO API
 */

const socketSchemas = {
  // ─── Request Schemas ─────────────────────────────────────────────────────────

  EmitToUserRequest: {
    type: 'object',
    required: ['userId', 'event'],
    properties: {
      userId: {
        oneOf: [
          { type: 'string', description: 'User UUID or string ID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          { type: 'integer', description: 'Numeric user ID', example: 10 },
        ],
        description: 'Target user ID',
      },
      event: {
        type: 'string',
        maxLength: 100,
        description: 'Socket.IO event name',
        example: 'TEST_EVENT',
      },
      payload: {
        type: 'object',
        nullable: true,
        description: 'Data to send with the event',
        example: { message: 'Hello User', type: 'INFO' },
      },
    },
  },

  BroadcastRequest: {
    type: 'object',
    required: ['event'],
    properties: {
      event: {
        type: 'string',
        maxLength: 100,
        description: 'Socket.IO event name',
        example: 'SYSTEM_NOTIFICATION',
      },
      payload: {
        type: 'object',
        nullable: true,
        description: 'Data to broadcast to all clients',
        example: { message: 'Maintenance Tonight', scheduledAt: '2026-06-01T23:00:00Z' },
      },
    },
  },

  // ─── Response Schemas ────────────────────────────────────────────────────────

  EmitSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      room: { type: 'string', example: 'user:a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      online: {
        type: 'boolean',
        description: 'Whether the user currently has active connections',
        example: true,
      },
    },
  },

  BroadcastSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      totalSockets: {
        type: 'integer',
        description: 'Number of sockets that received the broadcast',
        example: 18,
      },
    },
  },

  OnlineUsersResponse: {
    type: 'object',
    properties: {
      onlineUsers: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of user IDs that currently have active Socket.IO connections',
        example: ['user-uuid-1', 'user-uuid-2', 'user-uuid-3'],
      },
    },
  },

  SocketHealthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      connectedUsers: {
        type: 'integer',
        description: 'Number of unique users with at least one active connection',
        example: 15,
      },
      totalSockets: {
        type: 'integer',
        description: 'Total number of open socket connections (multi-device users counted separately)',
        example: 18,
      },
    },
  },
}

module.exports = socketSchemas
