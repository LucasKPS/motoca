// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... outras configurações que você possa ter
    
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.tcdn.com.br', // <-- ESSE É O DOMÍNIO QUE RESOLVE SEU ERRO
                port: '',
                pathname: '/**', 
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**', 
            },
            // ... Mantenha os outros domínios de placeholder aqui (unsplash, picsum, etc.)
        ],
    },
};

module.exports = nextConfig;