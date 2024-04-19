import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeCreate, column, computed } from '@adonisjs/lucid/orm'

import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  public static async assignUUID(user: User) {
    user.id = user.id || uuid()
  }

  @computed()
  get name() {
    return `${this.firstName} ${this.lastName}`
  }

  static authTokens = DbAccessTokensProvider.forModel(User)
}
