import { ApplicationService } from '@adonisjs/core/types'
import env from '#start/env'
import { CrawlData, CrawlPayload } from '#lib/types'
import ArticleProcessorJob from '#jobs/article_processor_job'
import { Socket } from 'socket.io-client'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    crawler: Socket
  }
}

export default class CrawlerProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('crawler', async () => {
      const io = (await import('socket.io-client')).io
      const crawlerAPI = env.get('CRAWLER_API')

      const socket = io(crawlerAPI)
      socket.on('error', (error) => {
        console.error('Error in crawler service:', error)
      })

      socket.on('article', async (data: CrawlData) => {
        await ArticleProcessorJob.enqueue(data)
      })

      socket.on('end', (payload: CrawlPayload) => {
        console.log('Crawling completed: ', payload)
      })

      return socket
    })
  }
}
