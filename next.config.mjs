/** @type {import('next').NextConfig} */

const endpoint_url = process.env.ENDPOINT_URL || "http://localhost:5000"

const nextConfig = {
  // reactStrictMode: true,
  env: {
    ENDPOINT_URL: endpoint_url,
  }
};

export default nextConfig;
