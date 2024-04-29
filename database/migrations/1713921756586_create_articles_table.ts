import { BaseSchema } from '@adonisjs/lucid/schema'

import { ArticleCrawlStatus, ArticleIndexStatus, ArticleSourceType } from '#lib/enums'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('title').notNullable()
      table.text('content').nullable()
      table.string('source_url').notNullable()
      table.uuid('chatbot_id').notNullable().references('chatbots.id').onDelete('CASCADE')

      table
        .enum('source_type', Object.values(ArticleSourceType), {
          enumName: 'article_source_type_enum',
          useNative: true,
          existingType: false,
        })
        .notNullable()
        .defaultTo(ArticleSourceType.SPIDER)
      table
        .enum('crawl_status', Object.values(ArticleCrawlStatus), {
          enumName: 'article_crawl_status_enum',
          useNative: true,
          existingType: false,
        })
        .notNullable()
        .defaultTo(ArticleCrawlStatus.PENDING)
      table
        .enum('index_status', Object.values(ArticleIndexStatus), {
          enumName: 'article_index_status_enum',
          useNative: true,
          existingType: false,
        })
        .notNullable()
        .defaultTo(ArticleIndexStatus.QUEUED)

      table.string('error').nullable()
      table.integer('content_length').nullable()
      table.boolean('is_processed').notNullable().defaultTo(true)
      table.string('slug').notNullable().unique()
      table.boolean('is_published').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    await this.schema.dropTable(this.tableName)
    await this.schema.raw('DROP TYPE IF EXISTS "article_crawl_status_enum"')
    await this.schema.raw('DROP TYPE IF EXISTS "article_index_status_enum"')
    await this.schema.raw('DROP TYPE IF EXISTS "article_source_type_enum"')
  }
}
