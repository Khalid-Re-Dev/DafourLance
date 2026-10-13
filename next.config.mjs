/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/login', destination: '/admin/login', permanent: false }]
  },
  images: { formats: ['image/webp'] },
}
export default nextConfig
