import typesense from 'typesense'
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'

import env from '#start/env'

export default class TypesenseService {
  private client: typesense.Client
  private readonly collectionName = 'articles'
  private readonly schema: CollectionCreateSchema = {
    name: this.collectionName,
    fields: [
      { name: 'id', type: 'string' },
      { name: 'title', type: 'string', infix: true },
      { name: 'content', type: 'string' },
      { name: 'sourceUrl', type: 'string' },
      { name: 'chatbotId', type: 'string' },
      { name: 'createdAt', type: 'int64', sort: true },
      { name: 'updatedAt', type: 'int64' },
      {
        name: 'embedding_vector',
        type: 'float[]',
        embed: {
          from: ['content', 'title'],
          model_config: {
            model_name: 'openai/text-embedding-ada-002',
            api_key: env.get('AI_API_KEY'),
          },
        },
      },
    ],
  }
  constructor() {
    this.client = new typesense.Client({
      nodes: [
        {
          host: env.get('TYPESENSE_HOST'),
          port: env.get('TYPESENSE_PORT'),
          protocol: env.get('TYPESENSE_PROTOCOL'),
        },
      ],
      apiKey: env.get('TYPESENSE_API_KEY'),
    })
  }

  async createCollection() {
    try {
      await this.client.collections().create(this.schema)
    } catch (error) {
      // check it error is instance of ObjectAlreadyExists then ignore
      if (error.name === 'ObjectAlreadyExists') {
        console.log(this.collectionName, ' Collection already exists')
        return
      }
      throw error
    }
  }

  async upsertDocument(document: any) {
    return this.client.collections(this.collectionName).documents().upsert(document)
  }

  async deleteDocument(id: string) {
    return this.client.collections(this.collectionName).documents(id).delete()
  }

  async deleteDocumentsByChatbotId(chatbotId: string) {
    return this.client
      .collections(this.collectionName)
      .documents()
      .delete({
        filter_by: `chatbotId:${chatbotId}`,
      })
  }

  async indexDocument(document: any) {
    return this.client.collections(this.collectionName).documents().create(document)
  }
}
