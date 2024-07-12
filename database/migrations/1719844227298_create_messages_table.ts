import { BaseSchema } from '@adonisjs/lucid/schema'

import { MessageSenderType } from '#lib/enums'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.text('content').notNullable()
      table
        .enum('sender_type', Object.values(MessageSenderType), {
          enumName: 'message_sender_type',
          useNative: true,
        })
        .notNullable()
        .defaultTo(MessageSenderType.CUSTOMER)
      table.uuid('conversation_id').notNullable().references('conversations.id').onDelete('CASCADE')
      table.string('external_id').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
