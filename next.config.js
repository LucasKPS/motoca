/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configurações para garantir que imagens externas sejam carregadas corretamente
    images: {
        dangerouslyAllowSVG: true,
        // Configuração de padrões de domínios remotos
        remotePatterns: [
            // 1. Domínio principal para Imagens de Capa (Unsplash)
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', 
                port: '',
                pathname: '/**', 
            },
            // 2. Domínio principal para Logos de Restaurante (Clearbit)
            {
                protocol: 'https',
                hostname: 'logo.clearbit.com', 
                port: '',
                pathname: '/**', 
            },
            // 3. Domínio de Logo Alternativo (Adicionado para o Sushi House)
            {
                protocol: 'https',
                hostname: 'api.logoduck.com',
                port: '',
                pathname: '/**', 
            },
            // 4. Domínio para Placeholders e Testes (TCDN)
            {
                protocol: 'https',
                hostname: 'images.tcdn.com.br',
                port: '',
                pathname: '/**', 
            },
            // 5. Domínios de Placeholders Genéricos
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