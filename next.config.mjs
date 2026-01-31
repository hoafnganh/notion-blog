/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // ← Đã comment
  images: {
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com'],
    unoptimized: true
  }
}

export default nextConfig  // ← Đổi từ module.exports thành export default