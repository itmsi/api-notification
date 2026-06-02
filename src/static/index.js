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
    url: '/api/',
    description: 'Development server'
  },
  {
    url: 'https://your-production-url.com/api/',
    description: 'Production server'
  }
]

// Import schemas
const exampleSchema = require('./schema/example');
const notificationSchema = require('./schema/notification');

// Import paths
const examplePaths = require('./path/example');
const notificationPaths = require('./path/notification');

// Combine all schemas
const schemas = {
  ...exampleSchema,
  ...notificationSchema,
};

// Combine all paths
const paths = {
  ...examplePaths,
  ...notificationPaths,
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
