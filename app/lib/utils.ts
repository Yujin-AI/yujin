import app from '@adonisjs/core/services/app'
import { encoding_for_model } from '@dqbd/tiktoken'

import { WebScrapeSystemPrompt } from '#lib/constants'

export const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '')
export const removeQueryParams = (value: string) => value.replace(/\?.*$/, '')

export const getToken = (value: string) => encoding_for_model('gpt-4-1106-preview').encode(value)

export const reformMDUsingAI = async (content: string) => {
  const gemini = await app.container.make('gemini')

  return await gemini.askWithContext([
    {
      role: 'user',
      parts: [{ text: WebScrapeSystemPrompt }],
    },
    {
      role: 'model',
      parts: [{ text: 'Now send me the markdown' }],
    },
    {
      role: 'user',
      parts: [{ text: content }],
    },
  ])
}

export const isUUID = (value: string) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(value)
}
