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

// Device Registration — POST/DELETE /api/v1/devices/register
const devicesModule = require('../../modules/devices')
routing.use(`${API_TAG}/v1/devices`, devicesModule)

// Push Notifications — POST /api/v1/notifications/...
const notificationsModule = require('../../modules/notifications')
routing.use(`${API_TAG}/v1/notifications`, notificationsModule)

module.exports = routing;
