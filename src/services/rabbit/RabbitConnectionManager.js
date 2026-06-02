const amqp = require('amqplib');

class RabbitConnectionManager {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    this.queue = process.env.RABBITMQ_NOTIFICATION_QUEUE || 'notifications';
    this.dlqExchange = `${this.queue}.dlx`;
    this.dlqQueue = `${this.queue}.dlq`;
  }

  async connect() {
    if (this.connection && this.channel) {
      return this.channel;
    }

    try {
      this.connection = await amqp.connect(this.url);
      
      this.connection.on('error', (err) => {
        console.error('[RabbitMQ] Connection error', err);
        this.connection = null;
        this.channel = null;
      });

      this.connection.on('close', () => {
        console.error('[RabbitMQ] Connection closed, will attempt to reconnect');
        this.connection = null;
        this.channel = null;
        setTimeout(() => this.connect(), 5000);
      });

      this.channel = await this.connection.createChannel();
      
      // Setup Dead Letter Exchange and Queue
      await this.channel.assertExchange(this.dlqExchange, 'direct', { durable: true });
      await this.channel.assertQueue(this.dlqQueue, { durable: true });
      await this.channel.bindQueue(this.dlqQueue, this.dlqExchange, 'dlq-routing-key');

      // Setup Main Queue with DLX configured
      await this.channel.assertQueue(this.queue, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': this.dlqExchange,
          'x-dead-letter-routing-key': 'dlq-routing-key'
        }
      });

      console.log(`[RabbitMQ] Connected successfully. Queue: ${this.queue}`);
      return this.channel;
    } catch (error) {
      console.error('[RabbitMQ] Failed to connect', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  getChannel() {
    return this.channel;
  }

  getQueueName() {
    return this.queue;
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.channel = null;
    this.connection = null;
    console.log('[RabbitMQ] Connection closed cleanly');
  }
}

module.exports = new RabbitConnectionManager();
