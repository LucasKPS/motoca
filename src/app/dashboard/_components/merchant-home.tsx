'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Users, Utensils, TrendingUp, AlertTriangle, DoorClosed } from "lucide-react";
import type { MerchantOrder } from "@/lib/types"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SalesChart from '@/components/dashboard/sales-chart';
import { Switch } from "@/components/ui/switch";

const ORDERS_STORAGE_KEY = 'merchant_orders_motoca'; 
const RESTAURANT_STATUS_KEY = 'restaurant_status_motoca';

interface DashboardMetrics {
    totalEarnings: number;
    deliveredOrders: number;
    pendingOrders: number;
    averageTicket: number;
    chartData: any[];
}

const calculateDashboardMetrics = (): DashboardMetrics => {
    if (typeof window === 'undefined') {
        return { totalEarnings: 0, deliveredOrders: 0, pendingOrders: 0, averageTicket: 0, chartData: [] };
    }

    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!storedOrders) {
        return { totalEarnings: 0, deliveredOrders: 0, pendingOrders: 0, averageTicket: 0, chartData: [] };
    }

    try {
        const orders: MerchantOrder[] = JSON.parse(storedOrders);
        
        const delivered = orders.filter(order => order.status === 'delivered');
        const totalEarnings = delivered.reduce((sum, order) => sum + order.total, 0);
        const pending = orders.filter(order => order.status !== 'delivered');
        const averageTicket = delivered.length > 0 ? totalEarnings / delivered.length : 0;

        const dailyData = delivered.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            if (!acc[date]) {
                acc[date] = { date, completedOrders: 0, totalSales: 0 };
            }
            acc[date].completedOrders++;
            acc[date].totalSales += order.total;
            return acc;
        }, {} as Record<string, { date: string; completedOrders: number; totalSales: number }>);

        const chartData = Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { 
            totalEarnings, 
            deliveredOrders: delivered.length, 
            pendingOrders: pending.length,
            averageTicket,
            chartData,
        };
    } catch (error) {
        console.error("Erro ao processar pedidos do localStorage:", error);
        return { totalEarnings: 0, deliveredOrders: 0, pendingOrders: 0, averageTicket: 0, chartData: [] };
    }
};

export default function MerchantHome({ name = "Restaurante" }: { name?: string }) {
    const [metrics, setMetrics] = useState<DashboardMetrics>(() => calculateDashboardMetrics());
    const [isRestaurantOpen, setIsRestaurantOpen] = useState(() => {
        if (typeof window === 'undefined') return true;
        const savedStatus = localStorage.getItem(RESTAURANT_STATUS_KEY);
        return savedStatus ? JSON.parse(savedStatus) : true;
    });
    
    useEffect(() => {
        const handleStorageChange = () => {
            setMetrics(calculateDashboardMetrics());
        };
        handleStorageChange(); 
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem(RESTAURANT_STATUS_KEY, JSON.stringify(isRestaurantOpen));
    }, [isRestaurantOpen]);

    const formatCurrency = (value: number) => 
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
    const greeting = `Olá, ${name}.`;

    return (
        <div className="flex flex-col gap-8 p-4 container">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-gray-800">
                        Visão Geral
                    </h1>
                    <p className="text-lg text-muted-foreground mt-1">{greeting} Seu resumo de performance de hoje.</p>
                </div>
                
                <Alert className={`w-full md:w-auto mt-4 md:mt-0 flex items-center justify-between ${isRestaurantOpen ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    <div className="flex items-center">
                        {isRestaurantOpen ? <Utensils className="h-4 w-4 text-green-600 mr-2" /> : <DoorClosed className="h-4 w-4 text-red-600 mr-2" />}
                        <div>
                            <AlertTitle className={isRestaurantOpen ? 'text-green-700' : 'text-red-700'}>
                                {isRestaurantOpen ? 'Restaurante Aberto' : 'Restaurante Fechado'}
                            </AlertTitle>
                            <AlertDescription className={isRestaurantOpen ? 'text-sm text-green-600' : 'text-sm text-red-600'}>
                                {isRestaurantOpen ? 'Pronto para receber novos pedidos.' : 'Você não está recebendo pedidos.'}
                            </AlertDescription>
                        </div>
                    </div>
                    <Switch checked={isRestaurantOpen} onCheckedChange={setIsRestaurantOpen} className="ml-4" />
                </Alert>

            </div>

            <hr className="my-2" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                
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

            <Card className="col-span-1 lg:col-span-4 mt-4">
                <CardHeader>
                    <CardTitle>Performance de Vendas nos Últimos 7 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                    <SalesChart data={metrics.chartData} />
                </CardContent>
            </Card>

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