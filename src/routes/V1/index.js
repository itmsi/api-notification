const express = require('express')
// const { verifyToken } = require('../../middlewares')

const routing = express();
const API_TAG = '/api';

/* RULE
naming convention endpoint: using plural
Example:
- GET /api/examples
- POST /api/examples
- GET /api/examples/:id
- PUT /api/examples/:id
- DELETE /api/examples/:id
*/

// Example Module (Template untuk module Anda)
const exampleModule = require('../../modules/example')
routing.use(`${API_TAG}/examples`, exampleModule)

// ─── Notification Service Modules ────────────────────────────────────────────

// Device Registration — POST/DELETE /api/devices/register
const devicesModule = require('../../modules/devices')
routing.use(`${API_TAG}/notification/devices`, devicesModule)

// Push Notifications — POST /api/notifications/...
const notificationsModule = require('../../modules/notifications')
routing.use(`${API_TAG}/notification/notifications`, notificationsModule)

// ─── Socket.IO Management API ─────────────────────────────────────────────────

// Socket REST API — /api/notification/socket/emit/user, /api/notification/socket/health, etc.
const socketModule = require('../../modules/socket')
routing.use(`${API_TAG}/notification/socket`, socketModule)

module.exports = routing;

