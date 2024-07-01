import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import {
  afterDelete,
  afterSave,
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import EmbeddingArticlesJob from '#jobs/embedding_articles_job'
import { ArticleSourceType } from '#lib/enums'
import { isUUID } from '#lib/utils'
import Chatbot from '#models/chatbot'
import env from '#start/env'

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

  @column()
  declare error: string

  @column()
  declare contentLength?: number

  @column() // will it be used to train bot?
  declare isProcessed: boolean

  @column()
  declare slug: string

  @column() // is it published publicly?
  declare isPublished: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Chatbot)
  declare chatbot: BelongsTo<typeof Chatbot>

  //todo)) when slugify package is migrated to v6 use it
  @beforeCreate()
  static async assignIdAndSlug(article: Article) {
    article.id = article.id || uuid()
    if (article.slug) return

    const slug = string.slug(article.title, {
      lower: true,
      replacement: '-',
      strict: true,
      remove: /[|]/g,
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

  @afterSave()
  static async updateEmbeddingAndIndex(article: Article) {
    await EmbeddingArticlesJob.enqueue({ articleId: article.id })
  }

  @afterDelete()
  static async deleteFromIndex(article: Article) {
    const typesense = await app.container.make('typesense')
    await typesense.collections(env.get('TYPESENSE_COLLECTION')).documents(article.id).delete()
  }

  static getArticleBySlugOrId(slugOrId: string) {
    return isUUID(slugOrId)
      ? Article.query().where('id', slugOrId).first()
      : Article.query().where('slug', slugOrId).first()
  }
}
