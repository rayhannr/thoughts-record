import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Shared links carry the secret in the path and show therapy notes: never
        // cached, never indexed, and never leaked through a Referer header.
        source: '/s/:token',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ]
      }
    ]
  }
}

export default nextConfig
