import { encoding_for_model } from '@dqbd/tiktoken'

export const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '')
export const removeQueryParams = (value: string) => value.replace(/\?.*$/, '')

export const getToken = (value: string) => encoding_for_model('gpt-4-1106-preview').encode(value)
