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
import { ArticleSourceType } from '#lib/enums'
import { generateRandomString, isUUID } from '#lib/utils'
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

  @column() // will it be used to train bot?
  declare isProcessed: boolean

  @column()
  declare slug: string

  @column() // is it published publicly?
  declare isPublished: boolean

  @column()
  declare isEnhanced: boolean

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
    let potentialSlug = article.title
    if (article.sourceUrl) {
      const url = new URL(article.sourceUrl)
      potentialSlug = url.pathname.slice(1).replaceAll('/', '-')
    }

    let slug = string.slug(`${potentialSlug} ${generateRandomString(5)}`, {
      lower: true,
      replacement: '-',
      strict: true,
      remove: /[|]/g,
    })

    while (true) {
      const existing = await Article.findBy('slug', slug)
      if (!existing) break

      slug = string.slug(`${potentialSlug} ${generateRandomString(5)}`, {
        lower: true,
        replacement: '-',
        strict: true,
        remove: /[|]/g,
      })
    }

    article.slug = slug
  }

  @afterSave()
  static async updateEmbeddingAndIndex(article: Article) {
    const typesense = await app.container.make('typesense')
    await typesense.collections(env.get('TYPESENSE_COLLECTION')).documents().upsert({
      id: article.id,
      title: article.title,
      content: article.content,
      sourceUrl: article.sourceUrl,
      chatbotId: article.chatbotId,
      createdAt: article.createdAt.toMillis(),
      updatedAt: article.updatedAt.toMillis(),
    })
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
