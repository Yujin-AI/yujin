import app from '@adonisjs/core/services/app'
import { encoding_for_model } from '@dqbd/tiktoken'

import { WebScrapeSystemPrompt } from '#lib/constants'

export const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '')
export const removeQueryParams = (value: string) => value.replace(/\?.*$/, '')

export const getToken = (value: string) => encoding_for_model('gpt-4-1106-preview').encode(value)

export const reformMDUsingAI = async (content: string) => {
  const ai = await app.container.make('ai')

  return await ai.askWithContext([
    {
      role: 'user',
      content: WebScrapeSystemPrompt,
    },
    {
      role: 'system',
      content: 'Now send me the markdown',
    },
    {
      role: 'user',
      content,
    },
  ])
}

export const isUUID = (value: string) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(value)
}
