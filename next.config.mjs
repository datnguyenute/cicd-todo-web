/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gom server + đúng những dependency cần thiết vào .next/standalone → Docker image nhỏ
  output: 'standalone',
};

export default nextConfig;
