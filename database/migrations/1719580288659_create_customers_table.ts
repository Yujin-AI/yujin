import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('name').notNullable()
      table.string('external_id').notNullable()
      table.uuid('chatbot_id').notNullable().references('chatbots.id').onDelete('CASCADE')
      table.timestamp('last_seen_at').notNullable().defaultTo(this.db.rawQuery('now()').knexQuery)
      table.boolean('is_online').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
