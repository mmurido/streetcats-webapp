import { ofetch } from 'ofetch'
import { getCSRFToken } from './csrf'

let refreshPromise: Promise<any> | null = null

export const api = ofetch.create({
  baseURL: '/api',
  credentials: 'include',
  headers: {
    'X-CSRFToken': getCSRFToken(),
  },
})

export async function protectedFetch(url: string, options: any = {}) {
  try {
    return await api(url, options)
  } catch (err: any) {
    if (err.response?.status === 401) {
      if (!refreshPromise) {
        refreshPromise = api('/auth/refresh-access', {
          method: 'POST',
        }).finally(() => {
          refreshPromise = null
        })
      }

      await refreshPromise
      return await api(url, options)
    }
    throw err
  }
}
