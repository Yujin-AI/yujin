import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chatbots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('url').notNullable()
      table.uuid('creator_id').nullable().references('users.id').onDelete('SET NULL')
      table.uuid('owner_id').notNullable().references('users.id').onDelete('CASCADE')

      table.timestamp('created_at').notNullable().defaultTo(this.db.rawQuery('now()').knexQuery)
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
