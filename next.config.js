/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configurações para garantir que imagens externas sejam carregadas corretamente
    images: {
        dangerouslyAllowSVG: true,
        // ATENÇÃO: A configuração abaixo permite imagens de QUALQUER domínio.
        // Isso é conveniente para desenvolvimento, mas para produção,
        // é ALTAMENTE recomendado especificar apenas os domínios confiáveis.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },

    // Configuração para desabilitar o cache durante o desenvolvimento
    // Ajuda a evitar problemas de conteúdo obsoleto ao rodar localmente.
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
