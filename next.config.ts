// next.config.js - VERSÃO FINAL CORRIGIDA
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // ... outras configurações (typescript, eslint)
  images: {
    // CORREÇÃO: Mover 'dangerouslyAllowSVG' para o nível superior 'images'
    dangerouslyAllowSVG: true, 
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      { 
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;