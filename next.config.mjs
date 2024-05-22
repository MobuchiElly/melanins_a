/** @type {import('next').NextConfig} */

const endpoint_url = process.env.ENDPOINT_URL || "http://localhost:5000"

const nextConfig = {
  // reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/**",
      }
    ]
  },
  env: {
    ENDPOINT_URL: endpoint_url,
  },
  icons: true,
};

export default nextConfig;
