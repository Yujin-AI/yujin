import { BaseCheck, Result } from '@adonisjs/core/health'
import type { HealthCheckResult } from '@adonisjs/core/types/health'
import app from '@adonisjs/core/services/app'

export default class TypesenseHealthCheck extends BaseCheck {
  name = 'typesense'

  async run(): Promise<HealthCheckResult> {
    const typesense = await app.container.make('typesense')
    const health = await typesense.health.retrieve()
    const meta = await typesense.stats.retrieve()
    if (health.ok) return Result.ok('typesense working fine').mergeMetaData(meta)
    return Result.failed('typesense not working fine').mergeMetaData(meta)
  }
}
