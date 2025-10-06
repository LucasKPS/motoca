'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bike, Utensils, CheckCircle, Clock, DollarSign, ShoppingCart, TrendingUp, User, Star } from "lucide-react";
import EarningsChart from "@/components/earnings/earnings-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MerchantOrder } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusMap: Record<MerchantOrder['status'], { label: string; icon: React.ElementType, color: string, bgColor: string }> = {
  preparing: { label: 'Em Preparo', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  ready: { label: 'Pronto para Retirada', icon: Utensils, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  out_for_delivery: { label: 'Saiu para Entrega', icon: Bike, color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-100' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
};

export default function MerchantHome({ name, orders = [] }: { name?: string, orders: MerchantOrder[] }) {

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const averageTicket = totalRevenue / (orders.filter(o => o.status === 'delivered').length || 1);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground">Bem-vindo(a),</p>
                <h1 className="text-2xl font-bold font-headline text-foreground">{name}</h1>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline">Ver Loja</Button>
                <Button>Novo Pedido Manual</Button>
            </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Faturamento do Dia
                    <DollarSign className="text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                <p className="text-xs text-muted-foreground">+5.2% vs ontem</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Pedidos Hoje
                    <ShoppingCart className="text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{totalOrders}</p>
                <p className="text-xs text-muted-foreground">+2 novos pedidos na última hora</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Ticket Médio
                    <TrendingUp className="text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{averageTicket.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                <p className="text-xs text-muted-foreground">Média dos pedidos de hoje</p>
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Faturamento da Semana</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <EarningsChart />
          </CardContent>
        </Card>
         <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">Pedidos Recentes</CardTitle>
                        <CardDescription>Acompanhe os pedidos em tempo real.</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                        <Link href="/dashboard/orders?role=merchant">
                            Ver Todos <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {orders.slice(0, 4).map(order => {
                            const statusInfo = statusMap[order.status];
                            return (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-medium">{order.id}</div>
                                        <div className="text-sm text-muted-foreground">{order.customerName}</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={cn("gap-1.5", statusInfo.bgColor, statusInfo.color, 'border-none')}>
                                            <statusInfo.icon className="w-3 h-3" />
                                            {statusInfo.label}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
