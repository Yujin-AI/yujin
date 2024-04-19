import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Extensions extends BaseSchema {
  public async up() {
    await this.db.rawQuery(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp" schema pg_catalog version "1.1";'
    ).knexQuery
  }

  public async down() {
    await this.db.rawQuery('DROP EXTENSION IF EXISTS "uuid-ossp";').knexQuery
  }
}
