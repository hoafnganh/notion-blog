/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['prod-files-secure.s3.us-west-2.amazonaws.com','cdn.hashnode.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.fptcloud.com',
      },
      {
        protocol: 'https',
        hostname: 's3-sgn09.fptcloud.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
    ],
  },
};

export default nextConfig;
