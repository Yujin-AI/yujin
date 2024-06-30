import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import CustomAttributeKey from '#models/custom_attribute_key'

export default class CustomAttributeValue extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare attributeValue: string

  @column()
  declare customAttributeKeyId: string

  @column()
  declare entityId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => CustomAttributeKey)
  declare customAttributeKey: BelongsTo<typeof CustomAttributeKey>

  @beforeCreate()
  public static async assignUUID(customAttributeValue: CustomAttributeValue) {
    customAttributeValue.id = customAttributeValue.id || uuid()
  }
}
