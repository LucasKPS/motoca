'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Users, Utensils, TrendingUp, AlertTriangle } from "lucide-react";
import type { MerchantOrder } from "@/lib/types"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Chave para buscar os pedidos (a mesma das páginas Orders e Finances)
const ORDERS_STORAGE_KEY = 'merchant_orders_motoca'; 

interface DashboardMetrics {
    totalEarnings: number;
    deliveredOrders: number;
    pendingOrders: number;
    averageTicket: number;
}

/**
 * Calcula as métricas chave do dashboard a partir dos pedidos no LocalStorage.
 */
const calculateDashboardMetrics = (): DashboardMetrics => {
    if (typeof window === 'undefined') {
        return { totalEarnings: 0, deliveredOrders: 0, pendingOrders: 0, averageTicket: 0 };
    }

    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!storedOrders) {
        return { totalEarnings: 0, deliveredOrders: 0, pendingOrders: 0, averageTicket: 0 };
    }

    try {
        const orders: MerchantOrder[] = JSON.parse(storedOrders);
        
        // 1. Pedidos Concluídos e Ganhos
        const delivered = orders.filter(order => order.status === 'delivered');
        const totalEarnings = delivered.reduce((sum, order) => sum + order.total, 0);

        // 2. Pedidos em Andamento
        const pending = orders.filter(order => order.status !== 'delivered');
        
        // 3. Ticket Médio
        const averageTicket = delivered.length > 0 ? totalEarnings / delivered.length : 0;

        return { 
            totalEarnings, 
            deliveredOrders: delivered.length, 
            pendingOrders: pending.length,
            averageTicket,
        };
    } catch (error) {
        console.error("Erro ao processar pedidos do localStorage:", error);
        return { totalEarnings: 0, deliveredOrders: 0, pendingOrders: 0, averageTicket: 0 };
    }
};

// Componente Placeholder para o Gráfico de Vendas
const SalesChartPlaceholder: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
            <TrendingUp className="w-10 h-10 text-primary mb-3" />
            <p className="text-lg font-semibold text-primary">Gráfico de Vendas (Placeholder)</p>
            <p className="text-sm text-muted-foreground">Implementação de biblioteca de gráficos pendente (Ex: Recharts).</p>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function MerchantHome({ name = "Restaurante" }: { name?: string }) {
    const [metrics, setMetrics] = useState<DashboardMetrics>(() => calculateDashboardMetrics());
    
    // Recarrega os dados do dashboard quando o LocalStorage é alterado
    useEffect(() => {
        const handleStorageChange = () => {
            setMetrics(calculateDashboardMetrics());
        };

        handleStorageChange(); 
        
        // Listener para sincronização
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Formatação de Moeda
    const formatCurrency = (value: number) => 
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
    const greeting = `Olá, ${name}.`;

    return (
        <div className="flex flex-col gap-8 p-4 container">
            
            {/* 1. Cabeçalho e Saudação */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-gray-800">
                        Visão Geral
                    </h1>
                    <p className="text-lg text-muted-foreground mt-1">{greeting} Seu resumo de performance de hoje.</p>
                </div>
                {/* Status Operacional */}
                <Alert className="w-full md:w-auto mt-4 md:mt-0 border-green-500 bg-green-50">
                    <Utensils className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700">Restaurante Aberto</AlertTitle>
                    <AlertDescription className="text-sm text-green-600">
                        Pronto para receber novos pedidos.
                    </AlertDescription>
                </Alert>
            </div>

            <hr className="my-2" />

            {/* 2. Cartões de Métricas Chave */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                
                {/* Cartão 1: Total de Ganhos */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ganhos Totais (Concluído)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(metrics.totalEarnings)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Baseado em {metrics.deliveredOrders} pedidos.
                        </p>
                    </CardContent>
                </Card>

                {/* Cartão 2: Pedidos em Andamento */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pedidos Ativos
                        </CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Em preparo ou em rota de entrega.
                        </p>
                    </CardContent>
                </Card>
                
                {/* Cartão 3: Ticket Médio */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ticket Médio
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(metrics.averageTicket)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Valor médio por pedido.
                        </p>
                    </CardContent>
                </Card>

                {/* Cartão 4: Pedidos Concluídos */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pedidos Concluídos
                        </CardTitle>
                        <Utensils className="h-4 w-4 text-fuchsia-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.deliveredOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total de pedidos finalizados.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Gráfico de Tendências */}
            <Card className="col-span-1 lg:col-span-4 mt-4">
                <CardHeader>
                    <CardTitle>Performance de Vendas nos Últimos 7 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                    <SalesChartPlaceholder />
                </CardContent>
            </Card>

            {/* 4. Alerta de Dica */}
            <Alert className="border-l-4 border-l-orange-500 mt-4">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <AlertTitle>Dica de Simulação</AlertTitle>
                <AlertDescription>
                    Vá para a aba **Pedidos** e clique em **"Simular Novo Pedido"** para ver as métricas de **Pedidos Ativos** sendo atualizadas em tempo real.
                </AlertDescription>
            </Alert>
            
        </div>
    );
}