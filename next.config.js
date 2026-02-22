/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Security Headers including CSP for Cloudflare Turnstile
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.cloudflare.com https://cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data: https://challenges.cloudflare.com",
              "connect-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://*.supabase.co wss://*.supabase.co",
              "frame-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
              "worker-src 'self' blob:",
              "child-src 'self' blob: https://challenges.cloudflare.com https://*.cloudflare.com",
              "media-src 'self' blob: https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
  // PWA Configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
