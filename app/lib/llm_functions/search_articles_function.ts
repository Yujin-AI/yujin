import { LLMFunctionDeclaration } from '#lib/types'
import app from '@adonisjs/core/services/app'
import env from '#start/env'

export const searchArticlesFunction: LLMFunctionDeclaration = {
  name: 'searchArticles',
  description:
    "Search for relevant articles or documents based on the user's query, except for handling basic greetings.",
  parameters: {
    type: 'object',
    description: "Contains the search keyword or phrase derived from the user's query.",
    properties: {
      searchKeyword: {
        type: 'string',
        description:
          "The keyword extracted from the user's question to search for relevant articles.",
      },
    },
    required: ['searchKeyword'],
  },
  // return: {
  //   type: 'object',
  //   properties: {
  //     data: {
  //       type: 'object',
  //       description: 'The search results containing relevant articles or documents.',
  //       properties: {
  //         articles: {
  //           type: 'array',
  //           description: 'An array of articles or documents that match the search keyword.',
  //         },
  //       },
  //     },
  //   },
  // },
}

export const searchArticles = async (keyword: string, chatbotId: string) => {
  const typesense = await app.container.make('typesense')
  const result = await typesense
    .collections(env.get('TYPESENSE_COLLECTION'))
    .documents()
    .search({
      q: keyword,
      filter_by: `chatbotId:${chatbotId}`,
      query_by: 'title',
      per_page: 10,
      include_fields: 'title,content,sourceUrl',
    })
  console.log(
    'searchArticles hits:',
    JSON.stringify({ hits: result.hits?.length, chatbotId, keyword }, null, 2)
  )
  if (!result.hits) {
    return []
  }
  return result.hits.map((hit) => hit.document)
}
