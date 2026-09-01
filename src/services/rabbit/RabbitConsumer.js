/**
 * RabbitConsumer
 *
 * Connects to RabbitMQ via RabbitConnectionManager,
 * consumes messages from the notification queue, and forwards them to EventRouter.
 */

const rabbitManager = require('./RabbitConnectionManager')
const eventRouter = require('./EventRouter')

class RabbitConsumer {
  constructor() {
    this.isConsuming = false;
  }

  async start() {
    if (this.isConsuming) return;

    try {
      const channel = await rabbitManager.connect();
      if (!channel) {
        console.warn('[RabbitConsumer] Channel not ready, retrying in 5s...');
        setTimeout(() => this.start(), 5000);
        return;
      }

      const queue = rabbitManager.getQueueName();
      
      // Ensure we process 10 messages concurrently max
      await channel.prefetch(10);

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const content = msg.content.toString();
            const eventData = JSON.parse(content);
            
            await eventRouter.processEvent(eventData);
            
            // Acknowledge success
            channel.ack(msg);
          } catch (error) {
            console.error('[RabbitConsumer] Error processing message, sending to DLQ:', error.message);
            // NACK without requeue sends it to the Dead Letter Exchange
            channel.nack(msg, false, false);
          }
        }
      });

      this.isConsuming = true;
      console.log(`[RabbitConsumer] Started consuming from queue: ${queue}`);
    } catch (error) {
      console.error('[RabbitConsumer] Failed to start consuming:', error);
      setTimeout(() => this.start(), 5000);
    }
  }
}

module.exports = new RabbitConsumer();
