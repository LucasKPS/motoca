'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Truck, Calendar, TrendingUp } from "lucide-react";
import EarningsChart from "@/components/earnings/earnings-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Delivery } from "@/lib/types";

export default function EarningsPage({ deliveries }: { deliveries: Delivery[] }) {
    const deliveredDeliveries = deliveries.filter(d => d.status === 'delivered');

    const totalEarnings = deliveredDeliveries.reduce((acc, d) => acc + d.earnings, 0);
    const totalDeliveries = deliveredDeliveries.length;
    const bestEarning = totalDeliveries > 0 ? Math.max(...deliveredDeliveries.map(d => d.earnings)) : 0;
    const averageEarning = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;
    
    const recentDeliveries = deliveredDeliveries.slice(0, 5);

  return (
    <div className="flex flex-col gap-8 p-4 container">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                <DollarSign />
                Meus Ganhos
            </h1>
            <p className="text-muted-foreground mt-1">Acompanhe seu desempenho e histórico financeiro.</p>
        </div>
        <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar período" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos (Total)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {totalEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">Soma de todas as entregas concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corridas Concluídas</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">Total de entregas finalizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Corrida</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {averageEarning.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
             <p className="text-xs text-muted-foreground">Média geral</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Ganho</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {bestEarning.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">Recorde de ganho em uma única corrida</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Desempenho da Semana</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <EarningsChart />
          </CardContent>
        </Card>
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">Corridas Recentes</CardTitle>
                <CardDescription>Suas últimas 5 entregas finalizadas.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentDeliveries.map(d => (
                            <TableRow key={d.id}>
                                <TableCell>
                                    <div className="font-medium">{d.customerName}</div>
                                    <div className="text-sm text-muted-foreground">{d.restaurant}</div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {d.earnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
