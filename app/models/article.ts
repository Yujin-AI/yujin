import string from '@adonisjs/core/helpers/string'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { ArticleCrawlStatus, ArticleIndexStatus, ArticleSourceType } from '#lib/enums'
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
  declare sourceUrl: string

  @column()
  declare chatbotId: string

  @column()
  declare sourceType: ArticleSourceType

  @column()
  declare crawlStatus: ArticleCrawlStatus

  @column()
  declare indexStatus: ArticleIndexStatus

  @column()
  declare error: string

  @column()
  declare contentLength: number

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

  @belongsTo(() => Chatbot)
  declare chatbot: BelongsTo<typeof Chatbot>
}
