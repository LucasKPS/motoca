// motoca/src/app/dashboard/page.tsx

'use client';
// CORREÇÃO: Importe useState e useEffect aqui!
import React, { useState, useEffect } from 'react'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike } from "lucide-react";

// ... o restante do seu componente CourierHome
// ... (O código abaixo é o mesmo que você forneceu, apenas com a importação corrigida)

export default function CourierHome({ name = "João da Silva" }: { name?: string }) {
    
    // Simulação do Status Online/Offline
    const [isOnline, setIsOnline] = useState(true); // Agora useState está definido!

    const handleToggleStatus = () => {
        setIsOnline(prev => !prev);
    };

    // ... (restante do JSX)
    return (
        <div className="flex flex-col gap-8 container py-8 px-4 sm:px-6 lg:px-8">
            
            {/* Top Bar / Status Selector */}
            <div className="flex justify-end pt-2">
            </div>

            {/* Conteúdo Central: Saudação e Status */}
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
                
                {/* 1. Nome e Saudação Centralizados */}
                <div className="text-center">
                    <p className="text-xl text-muted-foreground">Bem-vindo de volta,</p>
                    <h1 className="text-4xl sm:text-5xl font-extrabold font-headline text-foreground tracking-tight mt-1">
                        {name}
                    </h1>
                </div>
                
                {/* 2. Botão de Status Online (o destaque verde) */}
                <Button 
                    onClick={handleToggleStatus}
                    className={`
                        py-6 px-10 text-lg font-bold shadow-xl transition-colors duration-300
                        ${isOnline 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-gray-400 hover:bg-gray-500 text-white'
                        }
                    `}
                >
                    <div className={`w-3 h-3 rounded-full mr-3 ${isOnline ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
                    {isOnline ? 'Online' : 'Offline'}
                </Button>
            </div>

            {/* Separador Visual (para manter o espaço) */}
            <div className="py-4"></div>


            {/* Seção Inferior: Cartões de Estatísticas (Corridas do Dia) */}
            <div className="flex justify-center w-full">
                <Card className="w-full max-w-xs md:max-w-md border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-muted-foreground text-center">
                            Corridas do Dia
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 text-center">
                        <div className="flex items-center justify-center mt-3">
                             <Bike className="w-8 h-8 text-primary opacity-50" />
                        </div>
                        
                        <p className="text-4xl font-extrabold text-foreground mt-2">
                            04
                        </p>
                        
                    </CardContent>
                </Card>
            </div>
            
        </div>
    );
}