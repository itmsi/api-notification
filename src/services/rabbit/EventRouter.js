/**
 * EventRouter
 *
 * Routes incoming RabbitMQ events to the NotificationDispatcher.
 * Provides fallback titles/messages if they are not included in the payload.
 */

const notificationDispatcher = require('../notification/NotificationDispatcher')

class EventRouter {
  /**
   * Process an incoming event
   * 
   * @param {Object} eventData
   * @param {string} eventData.event
   * @param {string|number} [eventData.userId]
   * @param {string} [eventData.title]
   * @param {string} [eventData.message]
   * @param {Object} [eventData.payload]
   */
  async processEvent(eventData) {
    console.log(`[EventRouter] Processing event: ${eventData.event}`)

    const { event, userId, payload = {} } = eventData
    
    // Fallback titles and messages if not provided by publisher
    let title = eventData.title
    let message = eventData.message

    if (!title || !message) {
      const defaults = this._getDefaultText(event)
      title = title || defaults.title
      message = message || defaults.message
    }

    // Attach event type back into payload so clients know what it is
    const enrichedPayload = { ...payload, event }

    // If userId exists, send to specific user, else broadcast
    if (userId) {
      return notificationDispatcher.dispatchToUser({
        userId,
        type: event,
        title,
        message,
        payload: enrichedPayload
      })
    } else if (event === 'SYSTEM_NOTIFICATION') {
      return notificationDispatcher.dispatchBroadcast({
        type: event,
        title,
        message,
        payload: enrichedPayload
      })
    } else {
      console.warn(`[EventRouter] Received event ${event} without userId and it's not a SYSTEM_NOTIFICATION. Dropping.`)
    }
  }

  _getDefaultText(event) {
    switch (event) {
      case 'TASK_ASSIGNED':
        return { title: 'New Task', message: 'You have been assigned a new task' }
      case 'REQUEST_CREATED':
        return { title: 'Request Created', message: 'Your request has been successfully created' }
      case 'REQUEST_APPROVED':
        return { title: 'Request Approved', message: 'Your request has been approved' }
      case 'REQUEST_REJECTED':
        return { title: 'Request Rejected', message: 'Your request has been rejected' }
      case 'CHAT_MESSAGE':
        return { title: 'New Message', message: 'You have a new message' }
      case 'GPS_ALERT':
        return { title: 'GPS Alert', message: 'A GPS alert has been triggered' }
      case 'SYSTEM_NOTIFICATION':
        return { title: 'System Notice', message: 'You have a new system notification' }
      case 'USER_NOTIFICATION':
        return { title: 'Notification', message: 'You have a new notification' }
      default:
        return { title: 'Notification', message: `Event received: ${event}` }
    }
  }
}

module.exports = new EventRouter()
