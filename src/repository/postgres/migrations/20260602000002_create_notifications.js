/**
 * Migration: create_notifications
 *
 * Stores all notification records sent through the service.
 * Supports read/unread tracking and arbitrary JSON payload.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))

    // Optional FK to users table — nullable for broadcast notifications
    table
      .uuid('user_id')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')

    table.string('type', 100).notNullable().comment('e.g. APPROVAL, SYSTEM, BROADCAST')
    table.string('title', 255).notNullable()
    table.text('message').notNullable()
    table.jsonb('payload').nullable()
    table.boolean('is_read').defaultTo(false).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())

    // Index for quick user notification lookups
    table.index(['user_id', 'is_read'], 'idx_notifications_user_read')
    table.index(['created_at'], 'idx_notifications_created_at')
  })

  console.log('[Migration] Table notifications created')
}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('notifications')
  console.log('[Migration] Table notifications dropped')
}
