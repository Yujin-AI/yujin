import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import { afterDelete, BaseModel, beforeCreate, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { generateRandomString, isUUID } from '#lib/utils'
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

    let slug = string.slug(chatbot.name, {
      lower: true,
      replacement: '-',
      strict: true,
    })

    while (true) {
      const existing = await Chatbot.findBy('slug', slug)
      if (!existing) break
      slug = string.slug(`${chatbot.name} ${generateRandomString(5)}`, {
        lower: true,
        replacement: '-',
        strict: true,
        remove: /[|]/g,
      })
    }

    chatbot.slug = slug
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

  async getConversations() {
    const conversations = await Conversation.query()
      .where('chatbotId', this.id)
      .select('id', 'title', 'source', 'status', 'customer_id', 'created_at')
      .preload('messages', (q) => {
        q.where('sender_type', 'customer')
          .orderBy('created_at', 'desc')
          .select('id', 'conversation_id', 'content', 'created_at', 'seen')
          .as('lastMessage')
          .first()
      })
      .withCount('messages', (q) => {
        q.where('sender_type', 'customer').andWhere('seen', false).as('unseenMessages')
      })
      .orderBy('created_at', 'desc')
      .preload('customer', (q) => {
        q.select('id', 'name')
      })

    return conversations.map((conversation) => {
      const { messages, ...rest } = conversation.serialize()
      return {
        ...rest,
        lastMessage: messages[0] || null,
      }
    })
  }
}
