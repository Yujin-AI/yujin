import string from '@adonisjs/core/helpers/string'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import User from './user.js'

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
  declare ownerId?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

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
}
