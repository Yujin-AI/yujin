import { DiskSpaceCheck, HealthChecks, MemoryHeapCheck } from '@adonisjs/core/health'
import { DbCheck, DbConnectionCountCheck } from '@adonisjs/lucid/database'
import db from '@adonisjs/lucid/services/db'
import { RedisCheck, RedisMemoryUsageCheck } from '@adonisjs/redis'
import redis from '@adonisjs/redis/services/main'

import TypesenseHealthCheck from '../app/health_checks/typesense_health_check.js'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck().warnWhenExceeds(90).failWhenExceeds(95),
  new MemoryHeapCheck(),
  new DbCheck(db.connection()),
  new DbConnectionCountCheck(db.connection()),
  new RedisCheck(redis.connection()),
  new RedisMemoryUsageCheck(redis.connection()),
  new TypesenseHealthCheck(),
])
