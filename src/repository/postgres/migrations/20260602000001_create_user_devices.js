/**
 * Migration: create_user_devices
 *
 * Stores FCM device tokens for mobile users (React Native).
 * Unique constraint on (user_id, device_id) ensures upsert behavior.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable('user_devices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))

    // Optional FK to users table — comment out if users table not yet present
    // table
    //   .uuid('user_id')
    //   .nullable()
    //   .references('id')
    //   .inTable('users')
    //   .onDelete('CASCADE')
    table.uuid('user_id').nullable()
    table.string('device_id', 255).nullable()
    table.string('platform', 50).nullable().comment('android | ios | web')
    table.text('fcm_token').nullable()
    table.boolean('is_active').defaultTo(true).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    // Unique constraint — one entry per (user, device) pair
    table.unique(['user_id', 'device_id'])
  })

  console.log('[Migration] Table user_devices created')
}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('user_devices')
  console.log('[Migration] Table user_devices dropped')
}
