import { Job } from '@rlanz/bull-queue'
import { CheerioCrawler } from 'crawlee'

import { WebScrapeSystemPrompt } from '#lib/constants'
import { ArticleCrawlStatus } from '#lib/enums'
import { removeQueryParams, removeTrailingSlash } from '#lib/utils'
import Article from '#models/article'
import OpenAIService from '#services/open_ai_service'
import env from '#start/env'

interface ArticleProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class ArticleProcessorJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: ArticleProcessorJobPayload) {
    try {
      const { url, chatbotId } = payload
      if (url.endsWith('.json')) {
        const response = await fetch(url)
        const { product } = (await response.json()) as unknown as any //todo)) add proper typing
        const { title, ...info } = product

        const productURL = url.split('.json')[0]

        await Article.create({
          title,
          content: info,
          sourceUrl: productURL,
          chatbotId,
          crawlStatus: ArticleCrawlStatus.SUCCESS,
        })
        // todo)) emit event
        return
      }
      // run normal crawler for html

      const crawler = new CheerioCrawler({
        // Use the requestHandler to process each of the crawled pages.

        async requestHandler({ $, request }) {
          const formattedURL = removeQueryParams(removeTrailingSlash(request.url))
          const existingArticle = await Article.query()
            .where('sourceUrl', formattedURL)
            .andWhere('chatbotId', chatbotId)
            .andWhere('crawlStatus', ArticleCrawlStatus.SUCCESS)
            .first()

          if (existingArticle) {
            console.log(
              'Article already exists for  ',
              JSON.stringify({ url: formattedURL, chatbotId }, null, 2)
            )
            return
          }
          const title = $('title').text() || 'Untitled'
          console.log('Scrapping: ', JSON.stringify({ url: formattedURL, title }))

          $('body').find('style').remove()
          $('body').find('script').remove()
          $('body').find('nav').remove()
          $('body').find('footer').remove()
          $('body').find('.footer').remove()
          $('body').find('#footer').remove()
          $('body').find('iframe').remove()
          $('body').find('noscript').remove()
          $('body').find('header').remove()
          $('body').find('img').remove()
          $('body').find('img').remove()
          $('body').find('svg').remove()

          const aiService = new OpenAIService(env.get('AI_API_KEY'))

          const ans = await aiService.ask([
            {
              role: 'system',
              content: WebScrapeSystemPrompt,
            },
            {
              role: 'user',
              content: JSON.stringify({
                title,
                content: $('body').text(),
              }),
            },
          ])
          if (!ans) {
            console.log('No answer from AI')
            return
          }

          await Article.firstOrCreate(
            {
              sourceUrl: formattedURL,
              chatbotId,
            },
            {
              crawlStatus: ArticleCrawlStatus.SUCCESS,
              content: ans,
              title,
            }
          )

          // todo)) add embedding and create vector database
        },
      })

      // Add first URL to the queue and start the crawl.
      await crawler.run([url])
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}
