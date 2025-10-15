// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... Aqui você pode ter outras configurações de typescript, eslint, etc.
    
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            // 1. Domínio da imagem de teste (Whisky Jameson)
            {
                protocol: 'https',
                hostname: 'images.tcdn.com.br',
                port: '',
                pathname: '/**', 
            },
            // 2. Domínio do erro mais recente (Unsplash)
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', 
                port: '',
                pathname: '/**', 
            },
            // 3. Domínios de Placeholders e Testes
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
            // Adicione qualquer outro domínio que você precisar usar aqui
        ],
    },
};

module.exports = nextConfig;