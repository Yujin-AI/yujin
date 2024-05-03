import path from 'node:path'
import url from 'node:url'
import pkg from '../package.json' assert { type: 'json' }

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../', // for AdonisJS v6
  info: {
    title: 'Yujin API Documentation',
    version: pkg.version,
    description: '',
  },
  ignore: ['/swagger', '/docs'],
  tagIndex: 2,
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  snakeCase: false,
}
