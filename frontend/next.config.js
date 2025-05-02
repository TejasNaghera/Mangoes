// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Client-side માં node core modules માટે fallback પૂરા પાડે છે
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        path: false,
        os: false,
        crypto: false,
        v8: false,
      };
    }
    return config;
  },
};
module.exports = nextConfig;