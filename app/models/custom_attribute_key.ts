import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Chatbot from '#models/chatbot'
import CustomAttributeValue from '#models/custom_attribute_value'

export default class CustomAttributeKey extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare entityType: string

  @column()
  declare attributeKey: string

  @column()
  declare attributeDescription?: string

  @column()
  declare chatbotId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Chatbot)
  declare chatbot: BelongsTo<typeof Chatbot>

  @hasMany(() => CustomAttributeValue)
  declare customAttributeValues: HasMany<typeof CustomAttributeValue>

  @beforeCreate()
  public static async assignUUID(customAttributeKey: CustomAttributeKey) {
    customAttributeKey.id = customAttributeKey.id || uuid()
  }
}
