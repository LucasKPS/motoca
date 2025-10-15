// motoca/src/app/dashboard/finances/page.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle } from "lucide-react"; // Adicionando ícones
import type { MerchantOrder } from "@/lib/types"; 

// Chave para buscar os pedidos (deve ser a mesma definida na tela de orders)
const ORDERS_STORAGE_KEY = 'merchant_orders_motoca'; 

interface EarningsData {
    totalEarnings: number;
    deliveredOrdersCount: number;
    pendingOrdersCount: number;
    pendingOrdersValue: number;
}

/**
 * Carrega pedidos do LocalStorage e calcula os totais de ganhos e andamento.
 * @returns {EarningsData} Os dados de ganhos e pedidos.
 */
const calculateFinancialData = (): EarningsData => {
    if (typeof window === 'undefined') {
        return { totalEarnings: 0, deliveredOrdersCount: 0, pendingOrdersCount: 0, pendingOrdersValue: 0 };
    }

    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!storedOrders) {
        return { totalEarnings: 0, deliveredOrdersCount: 0, pendingOrdersCount: 0, pendingOrdersValue: 0 };
    }

    try {
        const orders: MerchantOrder[] = JSON.parse(storedOrders);
        
        // Pedidos Concluídos
        const deliveredOrders = orders.filter(order => order.status === 'delivered');
        const totalEarnings = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

        // Pedidos em Andamento (preparing, ready, out_for_delivery)
        const pendingOrders = orders.filter(order => order.status !== 'delivered');
        const pendingOrdersValue = pendingOrders.reduce((sum, order) => sum + order.total, 0);

        return { 
            totalEarnings, 
            deliveredOrdersCount: deliveredOrders.length, 
            pendingOrdersCount: pendingOrders.length,
            pendingOrdersValue,
        };
    } catch (error) {
        console.error("Erro ao processar pedidos do localStorage:", error);
        return { totalEarnings: 0, deliveredOrdersCount: 0, pendingOrdersCount: 0, pendingOrdersValue: 0 };
    }
};

export default function FinancesPage() {
    const [financialData, setFinancialData] = useState<EarningsData>(() => calculateFinancialData());
    
    // Efeito para recarregar os dados sempre que o LocalStorage mudar
    useEffect(() => {
        const handleStorageChange = () => {
            setFinancialData(calculateFinancialData());
        };

        // Recarrega na montagem
        handleStorageChange(); 

        // Adiciona um listener para o evento 'storage' (para sincronização entre abas/abas)
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); 

    // Função auxiliar de formatação
    const formatCurrency = (value: number) => 
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    return (
        <div className="flex flex-col gap-8 p-4 container">
            <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                <DollarSign />
                Financeiro
            </h1>
            <p className="text-muted-foreground mt-1">Visão geral dos ganhos do restaurante.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                
                {/* 1. Cartão de Ganhos Totais Concluídos */}
                <Card className="col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ganhos Concluídos
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-700">
                            {formatCurrency(financialData.totalEarnings)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Baseado em **{financialData.deliveredOrdersCount}** pedidos finalizados.
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Cartão de Pedidos em Andamento (Valor) */}
                <Card className="col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Valor em Andamento
                        </CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-700">
                            {formatCurrency(financialData.pendingOrdersValue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Valor a receber de **{financialData.pendingOrdersCount}** pedidos ativos.
                        </p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}