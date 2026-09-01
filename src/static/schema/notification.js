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
      notification: {
        type: 'object',
        properties: {
          userId: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          title: { type: 'string', example: 'Approval' },
          body: { type: 'string', example: 'Your request has been approved' },
          type: { type: 'string', example: 'APPROVAL' },
          payload: { 
            type: 'object', 
            example: { orderId: '12345', status: 'approved' }
          },
        },
      },
      data: {
        type: 'object',
        properties: {
          screen: { type: 'string', example: 'RoaRoaManage' },
          type: { type: 'string', example: 'APPROVAL' },
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
