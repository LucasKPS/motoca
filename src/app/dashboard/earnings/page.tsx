// src/app/earnings/page.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Truck, TrendingUp, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeliveries } from "@/hooks/useDeliveries"; 

import EarningsChart from "../_components/earnings/EarningsChart";

type Period = 'today' | 'week' | 'month' | 'all';

export default function EarningsPage() {
    const [period, setPeriod] = useState<Period>('week');
    
    // Obtém a função de filtro do hook
    const { getFilteredDeliveries } = useDeliveries();

    // Cálculos otimizados que dependem do filtro
    const { totalEarnings, totalDeliveries, averageEarning, bestEarning, recentDeliveries } = useMemo(() => {
        
        const filteredDeliveries = getFilteredDeliveries(period);

        const earningsStats = filteredDeliveries.reduce((acc, d) => {
            acc.totalEarnings += d.earnings || 0;
            return acc;
        }, { totalEarnings: 0 });

        const count = filteredDeliveries.length;
        
        const totalEarnings = earningsStats.totalEarnings;
        const averageEarning = count > 0 ? totalEarnings / count : 0;

        const bestEarning = count > 0 
            ? Math.max(...filteredDeliveries.map(d => d.earnings || 0)) 
            : 0;

        const recentDeliveries = filteredDeliveries
            .sort((a, b) => 
                Date.parse(b.deliveredAt || b.createdAt) - Date.parse(a.deliveredAt || a.createdAt)
            )
            .slice(0, 5);

        return { 
            totalEarnings, 
            totalDeliveries: count, 
            averageEarning, 
            bestEarning, 
            recentDeliveries 
        };
    }, [period, getFilteredDeliveries]);

    const formatCurrency = (value: number) => 
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


    return (
        <div className="flex flex-col gap-8 p-6 container">
            {/* Título e Filtro de Período */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                        <DollarSign className="w-6 h-6"/>
                        Meus Ganhos
                    </h1>
                    <p className="text-muted-foreground mt-1">Acompanhe seu desempenho e histórico financeiro.</p>
                </div>
                <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="week">Última Semana</SelectItem>
                        <SelectItem value="month">Último Mês</SelectItem>
                        <SelectItem value="all">Histórico Total</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-2 border-primary/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Ganhos Totais</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-extrabold text-primary">{formatCurrency(totalEarnings)}</div>
                        <p className="text-xs text-muted-foreground mt-2">Soma no período selecionado</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Corridas Concluídas</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-extrabold text-foreground">{totalDeliveries}</div>
                        <p className="text-xs text-muted-foreground mt-2">Entregas no período</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Média por Corrida</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-extrabold text-foreground">{formatCurrency(averageEarning)}</div>
                        <p className="text-xs text-muted-foreground mt-2">Média de ganho por entrega</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maior Ganho</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-extrabold text-foreground">{formatCurrency(bestEarning)}</div>
                        <p className="text-xs text-muted-foreground mt-2">Seu recorde</p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico e Tabela de Histórico */}
            <div className="grid gap-8 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="font-headline">Desempenho no Período</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <EarningsChart />
                    </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">Corridas Recentes</CardTitle>
                        <p className="text-sm text-muted-foreground">Últimas 5 entregas do período.</p>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Detalhes</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentDeliveries.length > 0 ? (
                                    recentDeliveries.map((d: any) => (
                                        <TableRow key={d.id}>
                                            <TableCell>
                                                <div className="font-medium">{d.customerName || 'Cliente Anônimo'}</div>
                                                <div className="text-sm text-muted-foreground">{d.restaurant}</div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                {formatCurrency(d.earnings)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                                            Nenhuma corrida concluída neste período.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}