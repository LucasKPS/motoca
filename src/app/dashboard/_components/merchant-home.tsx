'use client';
import React from 'react';

export default function MerchantHome({ name = "Restaurante" }: { name?: string }) {

    return (
        <div className="p-5 text-2xl font-bold text-center text-muted-foreground">
            Tela Inicial - Rota Expressa
        </div>
    );
}
