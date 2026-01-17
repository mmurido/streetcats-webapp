export function getCSRFToken(): string {
  const name = 'csrftoken'
  if (typeof document === 'undefined') return ''

  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1))
    }
  }
  return ''
}
