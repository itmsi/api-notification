/**
 * Swagger Schema Definitions for Notifications & Devices Module
 */

const notificationSchemas = {
  // ─── Device Schemas ──────────────────────────────────────────────────────────

  RegisterDeviceRequest: {
    type: 'object',
    required: ['userId', 'deviceId', 'platform', 'fcmToken'],
    properties: {
      userId: {
        type: 'string',
        description: 'User UUID',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
      deviceId: {
        type: 'string',
        maxLength: 255,
        description: 'Unique device identifier',
        example: 'ANDROID-001',
      },
      platform: {
        type: 'string',
        enum: ['android', 'ios', 'web'],
        description: 'Device platform',
        example: 'android',
      },
      fcmToken: {
        type: 'string',
        description: 'Firebase Cloud Messaging token',
        example: 'fcm_token_example_abc123xyz...',
      },
    },
  },

  UnregisterDeviceRequest: {
    type: 'object',
    required: ['userId', 'deviceId'],
    properties: {
      userId: {
        type: 'string',
        description: 'User UUID',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
      deviceId: {
        type: 'string',
        description: 'Device identifier to unregister',
        example: 'ANDROID-001',
      },
    },
  },

  // ─── Notification Request Schemas ────────────────────────────────────────────

  SendToUserRequest: {
    type: 'object',
    required: ['userId', 'title', 'message', 'type'],
    properties: {
      userId: {
        type: 'string',
        description: 'Target user UUID',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
      title: {
        type: 'string',
        maxLength: 255,
        description: 'Notification title',
        example: 'Approval',
      },
      message: {
        type: 'string',
        description: 'Notification body message',
        example: 'Your request has been approved',
      },
      type: {
        type: 'string',
        maxLength: 100,
        description: 'Notification type/category',
        example: 'APPROVAL',
      },
      payload: {
        type: 'object',
        nullable: true,
        description: 'Optional additional data payload',
        example: { orderId: '12345', status: 'approved' },
      },
    },
  },

  BroadcastRequest: {
    type: 'object',
    required: ['title', 'message', 'type'],
    properties: {
      title: {
        type: 'string',
        maxLength: 255,
        description: 'Notification title',
        example: 'Maintenance',
      },
      message: {
        type: 'string',
        description: 'Notification body message',
        example: 'System maintenance at 23:00',
      },
      type: {
        type: 'string',
        description: 'Notification type/category',
        example: 'SYSTEM',
      },
      payload: {
        type: 'object',
        nullable: true,
        description: 'Optional additional data payload',
        example: { scheduledAt: '2026-06-01T23:00:00Z' },
      },
    },
  },

  SendToDeviceRequest: {
    type: 'object',
    required: ['deviceId', 'title', 'message'],
    properties: {
      deviceId: {
        type: 'string',
        description: 'Target device identifier',
        example: 'ANDROID-001',
      },
      title: {
        type: 'string',
        description: 'Notification title',
        example: 'Test Device',
      },
      message: {
        type: 'string',
        description: 'Notification body message',
        example: 'Device notification test',
      },
      payload: {
        type: 'object',
        nullable: true,
        description: 'Optional additional data payload',
        example: {},
      },
    },
  },

  TestNotificationRequest: {
    type: 'object',
    required: ['fcmToken'],
    properties: {
      fcmToken: {
        type: 'string',
        description: 'Raw FCM token to send test notification to',
        example: 'fcm_token_example_abc123xyz...',
      },
    },
  },

  // ─── Response Schemas ────────────────────────────────────────────────────────

  SuccessSimple: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
    },
  },

  FirebaseHealthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      firebase: { type: 'string', example: 'connected' },
      projectId: { type: 'string', example: 'my-firebase-project' },
    },
  },

  NotificationSentResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      notification: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          user_id: { type: 'string', nullable: true, example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          type: { type: 'string', example: 'APPROVAL' },
          title: { type: 'string', example: 'Approval' },
          message: { type: 'string', example: 'Your request has been approved' },
          payload: { type: 'object', nullable: true },
          is_read: { type: 'boolean', example: false },
          created_at: { type: 'string', format: 'date-time', example: '2026-06-01T10:00:00.000Z' },
        },
      },
      firebase: {
        type: 'object',
        properties: {
          successCount: { type: 'integer', example: 1 },
          failureCount: { type: 'integer', example: 0 },
        },
      },
    },
  },

  ValidationErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Validation failed' },
      errors: {
        type: 'array',
        items: { type: 'string' },
        example: ['userId is required', 'fcmToken is required'],
      },
    },
  },
}

module.exports = notificationSchemas
