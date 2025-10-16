// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configurações para garantir que imagens externas sejam carregadas corretamente
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            // 1. Domínio principal para Imagens de Capa (Unsplash)
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', 
                port: '',
                pathname: '/**', 
            },
            // 2. Domínio dos Logos de Restaurante (Clearbit)
            {
                protocol: 'https',
                hostname: 'logo.clearbit.com', 
                port: '',
                pathname: '/**', 
            },
            // 3. Domínio para Placeholders e Testes (TCDN)
            {
                protocol: 'https',
                hostname: 'images.tcdn.com.br',
                port: '',
                pathname: '/**', 
            },
            // 4. Domínios de Placeholders Genéricos
            {
                protocol: 'https',
                hostname: 'placehold.co',
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

module.exports = nextConfig;