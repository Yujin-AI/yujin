import app from '@adonisjs/core/services/app'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Chatbot from '#models/chatbot'
import Conversation from '#models/conversation'
import CustomAttributeKey from '#models/custom_attribute_key'

export default class Customer extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare externalId: string

  @column()
  declare chatbotId: string

  @column()
  declare source: string

  @column()
  declare lastSeenAt?: DateTime

  @column()
  declare isOnline: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Conversation)
  declare conversations: HasMany<typeof Conversation>

  @belongsTo(() => Chatbot)
  declare chatbot: BelongsTo<typeof Chatbot>
  @hasMany(() => CustomAttributeKey, {
    foreignKey: 'entityId',
    onQuery(query) {
      query.where('entity_type', 'customer')
    },
  })
  declare attributes: HasMany<typeof CustomAttributeKey>

  @beforeCreate()
  public static async assignUUID(customer: Customer) {
    customer.id = customer.id || uuid()
    const haikunator = await app.container.make('haikunator')
    customer.name = customer.name || 'anonymous ' + haikunator.haikunate()
  }

  static async findOrCreateAttributeKeys(chatbotId: string, keys: string[]) {
    // Find existing keys
    const existingKeys = await CustomAttributeKey.query()
      .where('chatbot_id', chatbotId)
      .whereIn('attribute_key', keys)

    // Create missing keys
    const missingKeys = keys.filter(
      (key) => !existingKeys.find((existingKey) => existingKey.attributeKey === key)
    )
    const createdKeys = await CustomAttributeKey.createMany(
      missingKeys.map((key) => ({
        chatbotId,
        attributeKey: key,
        entityType: 'customer',
      }))
    )

    return [...existingKeys, ...createdKeys]
  }

  async findOrCreateAttributeValue(customerAttributes: Record<string, string>) {
    const attributeKeys = await Customer.findOrCreateAttributeKeys(
      this.chatbotId,
      Object.keys(customerAttributes)
    )

    await Promise.all(
      attributeKeys.map(async (key) => {
        const attributeValue = customerAttributes[key.attributeKey]
        await key.related('customAttributeValues').firstOrCreate(
          {
            entityId: this.id,
          },
          {
            attributeValue,
          }
        )
      })
    )
  }

  async getAttributeValues() {
    const key = await CustomAttributeKey.query()
      .where('chatbot_id', this.chatbotId)
      .andWhere('entity_type', 'customer')
      .select('id', 'attribute_key')
      .preload('customAttributeValues', (query) => {
        query.where('entity_id', this.id).select('id', 'attribute_value')
      })

    return key.reduce(
      (acc, key) => {
        acc[key.attributeKey] = key.customAttributeValues[0]?.attributeValue
        return acc
      },
      {} as Record<string, string>
    )
  }

  async updateLastSeen() {
    this.lastSeenAt = DateTime.now()
    await this.save()
  }
}
