export enum ArticleCrawlStatus {
  QUEUED = 'queued',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum ArticleIndexStatus {
  QUEUED = 'queued',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  DRAFT = 'draft',
}

export enum ArticleSourceType {
  BULK = 'bulk',
  SPIDER = 'spider',
  PDF = 'pdf',
  CSV = 'csv',
  MANUAL = 'manual',
}
