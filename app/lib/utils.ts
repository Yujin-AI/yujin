import app from '@adonisjs/core/services/app'
import { encoding_for_model } from '@dqbd/tiktoken'
import crypto from 'crypto'
import turndownService from 'turndown'

import {
  EncryptionAlgorithm,
  IVLength,
  ShopifyScrapePrompt,
  WebScrapeSystemPrompt,
} from '#lib/constants'
import env from '#start/env'

export const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '')
export const removeQueryParams = (value: string) => value.replace(/\?.*$/, '')

export const getToken = (value: string) => encoding_for_model('gpt-4-1106-preview').encode(value)

export const reformMDUsingAI = async (content: string) => {
  const ai = await app.container.make('ai')

  try {
    const response = await ai.askWithContext([
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
    const ans = response.choices[0].message.content ?? content
    const isEnhanced = !!response.choices[0]?.message?.content
    return { ans, isEnhanced }
  } catch (error) {
    console.error('Error extracting markdown using AI:', error)
    return { ans: content, isEnhanced: false }
  }
}

export const jsonToMDUsingAI = async (json: Record<string, any>, url: string) => {
  const { title, ...info } = json
  info.body_html = info.body_html && removeSvgTags(info.body_html)

  // [info] this will trim the token usage for the AI
  info.body_markdown = new turndownService().turndown(info.body_html)
  delete info.body_html
  
  try {
    const ai = await app.container.make('ai')
    const aiResponse = await ai.askWithContext([
      {
        role: 'system',
        content: ShopifyScrapePrompt.replace('{{title}}', title).replace('{{url}}', url),
      },
      {
        role: 'user',
        content: JSON.stringify({
          title,
          content: info,
        }),
      },
    ])

    const isEnhanced = !!aiResponse.choices[0]?.message?.content

    const ans = aiResponse.choices[0]?.message?.content ?? JSON.stringify(json)
    return { ans, isEnhanced }
  } catch (error) {
    console.error('Error converting JSON to markdown using AI:', error)

    return { ans: JSON.stringify(json), isEnhanced: false }
  }
}

export const isUUID = (value: string) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(value)
}

/**
 * Encrypts a string using the APP_KEY environment variable as the secret.
 *
 * @param text - The string to be encrypted.
 * @returns The encrypted string.
 */
export const encrypt = (text: string): string => {
  const secret = env.get('APP_KEY')
  const iv = crypto.randomBytes(IVLength)
  const key = crypto.scryptSync(secret, 'salt', 32) // Generate a key from the secret

  const cipher = crypto.createCipheriv(EncryptionAlgorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // The output is the IV and the encrypted text, concatenated together
  return iv.toString('hex') + encrypted
}

/**
 * Decrypts a string using the APP_KEY environment variable as the secret.
 *
 * @param text - The string to be decrypted.
 * @returns The decrypted string.
 */
export const decrypt = (text: string): string => {
  const secret = env.get('APP_KEY')
  const iv = Buffer.from(text.slice(0, IVLength * 2), 'hex')
  const key = crypto.scryptSync(secret, 'salt', 32) // Generate a key from the secret

  const decipher = crypto.createDecipheriv(EncryptionAlgorithm, key, iv)
  let decrypted = decipher.update(text.slice(IVLength * 2), 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length)
}

export const removeSvgTags = (htmlContent: string) => {
  const regex = /<svg\b[^>]*>[\s\S]*?<\/svg>/gi
  return htmlContent.replace(regex, '')
}
