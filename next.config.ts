import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'media.istockphoto.com',
      },
      {
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        hostname: 'img.freepik.com',
      },
      {
        hostname: 'confeiteiro.agilecdn.com.br',
      },
      {
        hostname: 'promofarma.vtexassets.com',
      },
      {
        hostname: 'pt.petitchef.com',
      },
      {
        hostname: 'a-static.mlcdn.com.br',
      }
    ],
  },
};

export default nextConfig;
