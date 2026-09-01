const info = {
  description: 'Notification Service API — Push notification delivery via Firebase FCM for React Native mobile apps.',
  version: '1.0.0',
  title: 'Notification Service API Documentation',
  contact: {
    email: 'your-email@example.com'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  }
}

const servers = [
  {
    url: '/api/notification/',
    description: 'Development server'
  },
  {
    url: 'https://gateway.motorsights.com/api/notification',
    description: 'Production server'
  },
  {
    url: 'https://dev-gateway.motorsights.com/api/notification',
    description: 'Develop server'
  }
]

// Import schemas
// const exampleSchema = require('./schema/example');
const notificationSchema = require('./schema/notification');
const socketSchema = require('./schema/socket');
const rabbitSchema = require('./schema/rabbit');
const logsSchema = require('./schema/logs');

// Import paths
// const examplePaths = require('./path/example');
const notificationPaths = require('./path/notification');
const socketPaths = require('./path/socket');
const rabbitPaths = require('./path/rabbit');
const logsPaths = require('./path/logs');

// Combine all schemas
const schemas = {
  // ...exampleSchema,
  ...notificationSchema,
  ...socketSchema,
  ...rabbitSchema,
  ...logsSchema,
};

// Combine all paths
const paths = {
  // ...examplePaths,
  ...notificationPaths,
  ...socketPaths,
  ...rabbitPaths,
  ...logsPaths,
};

const index = {
  openapi: '3.0.0',
  info,
  servers,
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas
  }
}

module.exports = {
  index
}
