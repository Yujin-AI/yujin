import string from '@adonisjs/core/helpers/string'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { ArticleCrawlStatus, ArticleIndexStatus, ArticleSourceType } from '#lib/enums'
import { isUUID } from '#lib/utils'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Chatbot from './chatbot.js'

export default class Article extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare sourceUrl?: string

  @column()
  declare chatbotId: string

  @column()
  declare sourceType: ArticleSourceType

  /*
   * todo)) probably this and the next column should be
   * removed as we are not creating articles if it is not crawled.
   * And indexes happens after the article is created in a queue.
   */
  @column()
  declare crawlStatus: ArticleCrawlStatus

  @column()
  declare indexStatus: ArticleIndexStatus

  @column()
  declare error: string

  @column()
  declare contentLength?: number

  @column()
  declare isProcessed: boolean

  @column()
  declare slug: string

  @column()
  declare isPublished: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //todo)) when slugify package is migrated to v6 use it
  @beforeCreate()
  static async assignIdAndSlug(article: Article) {
    article.id = article.id || uuid()
    if (article.slug) return

    const slug = string.slug(article.title, {
      lower: true,
      replacement: '-',
      strict: true,
    })

    const rows = await Article.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      article.slug = slug
      return
    }

    const incrementor = rows.reduce<number[]>(
      (acc, row) => {
        const match = row.slug.match(new RegExp(`^${slug}-(\\d+)$`, 'i'))
        if (match) {
          acc.push(parseInt(match[1], 10))
        }
        return acc
      },
      [0]
    )

    article.slug = incrementor.length ? `${slug}-${Math.max(...incrementor) + 1}` : slug
  }

  //todo)) in job queue
  // @afterSave()
  // static async updateEmbeddingAndIndex(article: Article) {
  //   const typesense = new TypesenseService()

  //   await typesense.upsertDocument({
  //     id: article.id,
  //     title: article.title,
  //     content: article.content,
  //     sourceUrl: article.sourceUrl,
  //     chatbotId: article.chatbotId,
  //     createdAt: article.createdAt.toMillis(),
  //     updatedAt: article.updatedAt.toMillis(),
  //   })

  //   // update the index status
  //   article.indexStatus = ArticleIndexStatus.SUCCESS
  //   await article.save()
  // }

  // todo)) in job queue
  // @afterDelete()
  // static async deleteFromIndex(article: Article) {
  //   console.log('Deleting article from index', article.id)
  //   const typesense = new TypesenseService()

  //   const data = await typesense.deleteDocument(article.id)
  //   console.log('Deleted article from index', data)
  // }

  @belongsTo(() => Chatbot)
  declare chatbot: BelongsTo<typeof Chatbot>

  static getArticleBySlugOrId(slugOrId: string) {
    return isUUID(slugOrId)
      ? Article.query().where('id', slugOrId).first()
      : Article.query().where('slug', slugOrId).first()
  }
}
