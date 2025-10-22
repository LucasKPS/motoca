'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Truck, TrendingUp, Calendar, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CourierRun, RunStatus } from '../runs/page';

type Period = 'today' | 'week' | 'month' | 'all';
const RUNS_STORAGE_KEY = 'courier_runs_motoca'; 

interface EarningsRun extends CourierRun {
    deliveredAt: string;
}

const getDeliveredRuns = (): EarningsRun[] => {
    if (typeof window === 'undefined') return [];

    const storedRuns = localStorage.getItem(RUNS_STORAGE_KEY);
    if (!storedRuns) return [];

    try {
        const runs: CourierRun[] = JSON.parse(storedRuns);
        
        return runs
            .filter(run => run.status === 'delivered')
            .map(run => ({
                ...run,
                deliveredAt: (run as any).deliveredAt || new Date().toISOString(), 
            } as EarningsRun));

    } catch (error) {
        console.error("Erro ao processar corridas do localStorage:", error);
        return [];
    }
};

const filterRunsByPeriod = (runs: EarningsRun[], period: Period): EarningsRun[] => {
    if (period === 'all') return runs;

    const now = new Date();
    let startDate = new Date();

    if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
        startDate.setDate(now.getDate() - now.getDay()); 
        startDate.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return runs.filter(run => {
        const runDate = new Date(run.deliveredAt);
        return runDate >= startDate;
    });
};

export default function EarningsPage() {
    const [period, setPeriod] = useState<Period>('week');
    const [allDeliveredRuns, setAllDeliveredRuns] = useState<EarningsRun[]>([]);

    useEffect(() => {
        const updateRuns = () => setAllDeliveredRuns(getDeliveredRuns());
        
        updateRuns();
        window.addEventListener('storage', updateRuns);
        return () => window.removeEventListener('storage', updateRuns);
    }, []);

    const { totalEarnings, totalDeliveries, averageEarning, bestEarning, recentDeliveries } = useMemo(() => {
        
        const filteredRuns = filterRunsByPeriod(allDeliveredRuns, period);

        const totalEarnings = filteredRuns.reduce((sum, run) => sum + run.value, 0);
        const count = filteredRuns.length;
        
        const averageEarning = count > 0 ? totalEarnings / count : 0;

        const bestEarning = count > 0 
            ? Math.max(...filteredRuns.map(r => r.value)) 
            : 0;

        const recentDeliveries = filteredRuns
            .sort((a, b) => new Date(b.deliveredAt).getTime() - new Date(a.deliveredAt).getTime())
            .slice(0, 5);

        return { 
            totalEarnings, 
            totalDeliveries: count, 
            averageEarning, 
            bestEarning, 
            recentDeliveries 
        };
    }, [period, allDeliveredRuns]);

    const formatCurrency = (value: number) => 
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


    return (
        <div className="flex flex-col gap-8 p-6 container">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                        <DollarSign className="w-6 h-6"/>
                        Meus Ganhos
                    </h1>
                    <p className="text-muted-foreground mt-1">Acompanhe seu desempenho e histórico financeiro.</p>
                </div>
                <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-2 border-primary/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Ganhos Totais</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-extrabold text-primary">{formatCurrency(totalEarnings)}</div>
                        <p className="text-xs text-muted-foreground mt-2">Soma no período selecionado</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Corridas Concluídas</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-extrabold text-foreground">{totalDeliveries}</div>
                        <p className="text-xs text-muted-foreground mt-2">Entregas no período</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Média por Corrida</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-extrabold text-foreground">{formatCurrency(averageEarning)}</div>
                        <p className="text-xs text-muted-foreground mt-2">Média de ganho por entrega</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maior Ganho</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-extrabold text-foreground">{formatCurrency(bestEarning)}</div>
                        <p className="text-xs text-muted-foreground mt-2">Seu recorde</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Corridas Recentes</CardTitle>
                    <p className="text-sm text-muted-foreground">Últimas 5 entregas do período.</p>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Local</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentDeliveries.length > 0 ? (
                                recentDeliveries.map((d: EarningsRun) => (
                                    <TableRow key={d.id}>
                                        <TableCell>
                                            <div className="font-medium">{d.pickupLocation}</div>
                                            <div className="text-sm text-muted-foreground">{new Date(d.deliveredAt).toLocaleDateString('pt-BR')}</div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-600">
                                            {formatCurrency(d.value)}
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

            {totalDeliveries === 0 && (
                <Alert className="border-l-4 border-l-red-500 mt-4">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <AlertTitle>Sem Dados de Ganhos</AlertTitle>
                    <AlertDescription>
                        Para ver seus ganhos aqui, aceite e **finalize manualmente** corridas na aba **Minhas Corridas**.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}