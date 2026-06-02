/**
 * Migration: create_notification_logs
 *
 * Stores the delivery history and status of notifications per channel.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable('notification_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    
    // Foreign key to notifications table
    table
      .uuid('notification_id')
      .notNullable()
      .references('id')
      .inTable('notifications')
      .onDelete('CASCADE')
      
    // Channel can be 'SOCKET', 'FCM', etc.
    table.string('channel', 50).notNullable()
    
    // Status can be 'SUCCESS', 'FAILED'
    table.string('status', 50).notNullable()
    
    // Detailed response from the provider (e.g. Firebase error message, messageId)
    table.jsonb('response').nullable()
    
    table.timestamp('created_at').defaultTo(knex.fn.now())

    // Index for faster queries on logs per notification and per status
    table.index(['notification_id', 'status'], 'idx_notification_logs_notif_status')
    table.index(['created_at'], 'idx_notification_logs_created_at')
  })

  console.log('[Migration] Table notification_logs created')
}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('notification_logs')
  console.log('[Migration] Table notification_logs dropped')
}
