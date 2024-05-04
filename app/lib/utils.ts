import app from '@adonisjs/core/services/app'
import { encoding_for_model } from '@dqbd/tiktoken'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'

import { WebScrapeSystemPrompt } from './constants.js'

export const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '')
export const removeQueryParams = (value: string) => value.replace(/\?.*$/, '')

export const getToken = (value: string) => encoding_for_model('gpt-4-1106-preview').encode(value)

export const extractMDFromHTML = async (page: string) => {
  const $ = cheerio.load(page)

  $('script').remove()
  $('body').find('script').remove()
  $('body').find('nav').remove()
  $('body').find('footer').remove()
  $('[class*="footer"]').find('').remove()
  $('[id*="footer"]').find('').remove()
  $('body').find('.footer').remove()
  $('body').find('#footer').remove()
  $('body').find('iframe').remove()
  $('body').find('noscript').remove()
  $('body').find('header').remove()
  $('body').find('svg').remove()

  const finalHTML = $('body')
    .find('*')
    .each(function () {
      if (!$(this).text().trim()) {
        $(this).remove()
      }
    })
    .end()
    .html()
    ?.trim()!

  const turndown = new TurndownService()

  const final = turndown.turndown(finalHTML || '')

  const openai = await app.container.make('openai')

  return openai.ask([
    {
      role: 'system',
      content: WebScrapeSystemPrompt,
    },
    {
      role: 'user',
      content: JSON.stringify({
        title: $('title').text() || 'Untitled',
        content: final,
      }),
    },
  ])
}
