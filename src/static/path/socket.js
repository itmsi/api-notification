/**
 * Swagger Path Definitions for Socket.IO API
 */

const socketPaths = {
  '/socket/emit/user': {
    post: {
      tags: ['Socket.IO'],
      summary: 'Emit Event to User',
      description:
        'Send a Socket.IO event to all active connections of a specific user via their personal room `user:{userId}`. If the user is offline, the event is silently dropped.',
      operationId: 'socketEmitToUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/EmitToUserRequest' },
            example: {
              userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              event: 'TEST_EVENT',
              payload: { message: 'Hello User' },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Event emitted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmitSuccessResponse' },
              example: {
                success: true,
                room: 'user:a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                online: true,
              },
            },
          },
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
        503: {
          description: 'Socket.IO server not initialized',
        },
      },
    },
  },

  '/socket/emit/broadcast': {
    post: {
      tags: ['Socket.IO'],
      summary: 'Broadcast Event to All',
      description:
        'Broadcast a Socket.IO event to ALL currently connected clients. Equivalent to `io.emit(event, payload)`.',
      operationId: 'socketBroadcast',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BroadcastRequest' },
            example: {
              event: 'SYSTEM_NOTIFICATION',
              payload: { message: 'Maintenance Tonight' },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Broadcast sent successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BroadcastSuccessResponse' },
              example: { success: true, totalSockets: 18 },
            },
          },
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
      },
    },
  },

  '/socket/online-users': {
    get: {
      tags: ['Socket.IO'],
      summary: 'Get Online Users',
      description:
        'Returns a list of user IDs that currently have at least one active Socket.IO connection. Data is sourced from the in-memory ConnectionRegistry.',
      operationId: 'socketOnlineUsers',
      responses: {
        200: {
          description: 'List of online users',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OnlineUsersResponse' },
              example: {
                onlineUsers: [
                  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                ],
              },
            },
          },
        },
      },
    },
  },

  '/socket/health': {
    get: {
      tags: ['Socket.IO'],
      summary: 'Socket Health Check',
      description:
        'Returns Socket.IO server health statistics: total unique online users and total open socket connections.',
      operationId: 'socketHealth',
      responses: {
        200: {
          description: 'Socket.IO is healthy',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SocketHealthResponse' },
              example: {
                success: true,
                connectedUsers: 15,
                totalSockets: 18,
              },
            },
          },
        },
        503: {
          description: 'Socket.IO not initialized',
          content: {
            'application/json': {
              example: {
                success: false,
                message: 'Socket.IO not initialized',
              },
            },
          },
        },
      },
    },
  },
}

module.exports = socketPaths
