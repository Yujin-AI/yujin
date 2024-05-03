/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | AI API Key
  |----------------------------------------------------------
  */
  AI_API_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | TypeSense Config
  |----------------------------------------------------------
  */
  TYPESENSE_HOST: Env.schema.string({ format: 'host' }),
  TYPESENSE_PORT: Env.schema.number(),
  TYPESENSE_PROTOCOL: Env.schema.enum(['http', 'https'] as const),
  TYPESENSE_API_KEY: Env.schema.string(),
  TYPESENSE_COLLECTION: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Constants
  |----------------------------------------------------------
  */
  MAX_CRAWLING_CONCURRENCY: Env.schema.number(),
  MAX_CRAWLING_DEPS: Env.schema.number(),
  CRAWLING_INTERVAL: Env.schema.number(),
  CRAWLER_TIME_LIMIT: Env.schema.number(),

  /*
  |----------------------------------------------------------
  | Redis Config
  |----------------------------------------------------------
  */
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
})
