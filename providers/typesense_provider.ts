import { ApplicationService } from '@adonisjs/core/types'
import { Client } from 'typesense'
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'

import env from '#start/env'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    typesense: Client
  }
}

export default class TypesenseProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('typesense', async () => {
      const typesense = await import('typesense')
      return new typesense.Client({
        nodes: [
          {
            host: env.get('TYPESENSE_HOST'),
            port: env.get('TYPESENSE_PORT'),
            protocol: env.get('TYPESENSE_PROTOCOL'),
          },
        ],
        apiKey: env.get('TYPESENSE_API_KEY'),
        connectionTimeoutSeconds: 10000,
      })
    })
  }

  async ready() {
    const schema: CollectionCreateSchema = {
      name: env.get('TYPESENSE_COLLECTION'),
      fields: [
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string', infix: true },
        { name: 'content', type: 'string' },
        { name: 'sourceUrl', type: 'string*' },
        { name: 'chatbotId', type: 'string' },
        { name: 'createdAt', type: 'int64', sort: true },
        { name: 'updatedAt', type: 'int64' },

        {
          name: 'embedding_vector',
          type: 'float[]',
          embed: {
            from: ['content', 'title'],
            model_config: {
              model_name: 'ts/distiluse-base-multilingual-cased-v2',
            },
          },
        },
      ],
    }
    const typesense = await this.app.container.make('typesense')
    try {
      const res = await typesense.collections().create(schema)
      console.log(res)
    } catch (error) {
      if (error.name === 'ObjectAlreadyExists') return
      throw error
    }
  }
}
