/**
 * Swagger Path Definitions for Devices & Notifications Module
 */

const notificationPaths = {
  // ─── Devices ─────────────────────────────────────────────────────────────────

  '/devices/register': {
    post: {
      tags: ['Devices'],
      summary: 'Register Device',
      description:
        'Register a mobile device FCM token for a user. If the device already exists (same userId + deviceId), the token is updated.',
      operationId: 'registerDevice',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterDeviceRequest' },
            example: {
              userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              deviceId: 'ANDROID-001',
              platform: 'android',
              fcmToken: 'fcm_token_example_abc123xyz...',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Device registered or updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessSimple' },
              example: { success: true },
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
        500: {
          description: 'Internal server error',
        },
      },
    },
    delete: {
      tags: ['Devices'],
      summary: 'Unregister Device',
      description: 'Deactivate a device by setting is_active = false. The device will no longer receive push notifications.',
      operationId: 'unregisterDevice',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UnregisterDeviceRequest' },
            example: {
              userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              deviceId: 'ANDROID-001',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Device unregistered successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessSimple' },
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
        404: {
          description: 'Device not found',
        },
      },
    },
  },

  // ─── Notifications ───────────────────────────────────────────────────────────

  '/notifications/user': {
    post: {
      tags: ['Notifications'],
      summary: 'Send Notification to User',
      description:
        'Send a push notification to all active devices registered for a specific user. The notification is saved to the database first, then delivered via Firebase FCM.',
      operationId: 'sendNotificationToUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SendToUserRequest' },
            example: {
              userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              title: 'Approval',
              message: 'Your request has been approved',
              type: 'APPROVAL',
              payload: { orderId: '12345', status: 'approved' },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Notification sent successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NotificationSentResponse' },
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

  '/notifications/broadcast': {
    post: {
      tags: ['Notifications'],
      summary: 'Broadcast Notification to All Users',
      description:
        'Send a push notification to ALL active devices. Processed in batches of 500 tokens to comply with Firebase limits.',
      operationId: 'broadcastNotification',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BroadcastRequest' },
            example: {
              title: 'Maintenance',
              message: 'System maintenance at 23:00',
              type: 'SYSTEM',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Broadcast sent successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  notification: { type: 'object' },
                  firebase: {
                    type: 'object',
                    properties: {
                      successCount: { type: 'integer', example: 150 },
                      failureCount: { type: 'integer', example: 2 },
                      batchCount: { type: 'integer', example: 1 },
                    },
                  },
                },
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
      },
    },
  },

  '/notifications/device': {
    post: {
      tags: ['Notifications'],
      summary: 'Send Notification to Specific Device',
      description: 'Send a push notification to a single device identified by deviceId.',
      operationId: 'sendNotificationToDevice',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SendToDeviceRequest' },
            example: {
              deviceId: 'ANDROID-001',
              title: 'Test Device',
              message: 'Device notification',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Notification sent to device',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  firebase: {
                    type: 'object',
                    properties: {
                      messageId: { type: 'string', example: 'projects/my-project/messages/abc123' },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation error',
        },
        404: {
          description: 'Device not found or inactive',
        },
      },
    },
  },

  '/notifications/firebase-health': {
    get: {
      tags: ['Notifications'],
      summary: 'Firebase Health Check',
      description: 'Validate that the Firebase Admin SDK is properly initialized and connected.',
      operationId: 'firebaseHealth',
      responses: {
        200: {
          description: 'Firebase is connected',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FirebaseHealthResponse' },
              example: {
                success: true,
                firebase: 'connected',
                projectId: 'my-firebase-project',
              },
            },
          },
        },
        503: {
          description: 'Firebase not configured or disconnected',
          content: {
            'application/json': {
              example: {
                success: false,
                firebase: 'disconnected',
                error: 'Firebase configuration is incomplete',
              },
            },
          },
        },
      },
    },
  },

  '/notifications/test': {
    post: {
      tags: ['Notifications'],
      summary: 'Test Push Notification',
      description:
        'Send a test push notification directly to a supplied FCM token. Useful for verifying Firebase integration.',
      operationId: 'testNotification',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/TestNotificationRequest' },
            example: {
              fcmToken: 'fcm_token_example_abc123xyz...',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Test notification sent successfully',
          content: {
            'application/json': {
              example: {
                success: true,
                firebase: {
                  messageId: 'projects/my-project/messages/test-abc123',
                },
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
      },
    },
  },
}

module.exports = notificationPaths
