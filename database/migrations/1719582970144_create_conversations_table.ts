import { BaseSchema } from '@adonisjs/lucid/schema'

import { ConversationStatus } from '#lib/enums'

export default class extends BaseSchema {
  protected tableName = 'conversations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('title').nullable()
      table.string('source').notNullable().defaultTo('widget')
      table
        .enum('status', Object.values(ConversationStatus), {
          enumName: 'conversation_status_enum',
          useNative: true,
          existingType: false,
        })
        .notNullable()
        .defaultTo(ConversationStatus.ACTIVE)
      table.string('session_id').notNullable()
      table.boolean('seen').notNullable().defaultTo(false)
      table.enum('type', ['chat', 'ticket']).notNullable().defaultTo('chat')
      table.uuid('chatbot_id').notNullable().references('chatbots.id').onDelete('CASCADE')
      table.uuid('customer_id').notNullable().references('customers.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
