export function getStoreSlugFromHost(hostHeader: string | null): string {
  const host = (hostHeader || '').trim()
  if (!host) return 'acme'
  const hostname = host.split(':')[0]
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'acme'
  const parts = hostname.split('.')
  if (hostname.endsWith('.localhost')) {
    return parts[0] || 'acme'
  }
  if (parts.length <= 1) return 'acme'
  return parts[0]
}