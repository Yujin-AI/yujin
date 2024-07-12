import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import { BaseModel, afterDelete, beforeCreate, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { isUUID } from '#lib/utils'
import Article from '#models/article'
import Conversation from '#models/conversation'
import CustomAttributeKey from '#models/custom_attribute_key'
import Customer from '#models/customer'
import User from '#models/user'
import env from '#start/env'

export default class Chatbot extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare url: string

  @column()
  declare creatorId?: string

  @column()
  declare ownerId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => User, {
    localKey: 'creatorId',
    foreignKey: 'id',
  })
  declare creator: HasOne<typeof User>

  @hasOne(() => User, {
    localKey: 'ownerId',
    foreignKey: 'id',
  })
  declare owner: HasOne<typeof User>

  @hasMany(() => Article)
  declare articles: HasMany<typeof Article>

  @hasMany(() => Conversation)
  declare conversations: HasMany<typeof Conversation>

  @hasMany(() => CustomAttributeKey)
  declare customAttributeKeys: HasMany<typeof CustomAttributeKey>

  @hasMany(() => Customer)
  declare customers: HasMany<typeof Customer>

  //todo)) when slugify package is migrated to v6 use it
  @beforeCreate()
  static async assignIdAndSlug(chatbot: Chatbot) {
    chatbot.id = chatbot.id || uuid()
    if (chatbot.slug) return

    const slug = string.slug(chatbot.name, {
      lower: true,
      replacement: '-',
      strict: true,
    })

    const rows = await Chatbot.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      chatbot.slug = slug
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

    chatbot.slug = incrementor.length ? `${slug}-${Math.max(...incrementor) + 1}` : slug
  }

  @afterDelete()
  static async deleteArticlesIndexes(chatbot: Chatbot) {
    const typesense = await app.container.make('typesense')
    await typesense
      .collections(env.get('TYPESENSE_COLLECTION'))
      .documents()
      .delete({ filter_by: `chatbotId:${chatbot.id}` })
  }

  static getChatbotBySlugOrId(slugOrId: string) {
    return isUUID(slugOrId)
      ? Chatbot.query().where('id', slugOrId).first()
      : Chatbot.query().where('slug', slugOrId).first()
  }

  async validateArticleOwnership(articleId: string) {
    const article = await Article.getArticleBySlugOrId(articleId)
    if (!article) return false
    return article.chatbotId === this.id
  }
}
