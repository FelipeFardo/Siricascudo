/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'loremflickr.com' },
      { hostname: 'picsum.photos' },
      { hostname: 'pub-9448e6c9570e405b8072625bd2387965.r2.dev' },
      {
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

export default nextConfig
