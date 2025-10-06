'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListOrdered, Package, CheckCircle, XCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const orders = [
    { id: 'ORD-001', restaurant: 'Pizzaria Delícia', date: 'Hoje, 20:30', status: 'delivered', total: 58.50, rating: 5 },
    { id: 'ORD-002', restaurant: 'Burger Queen', date: 'Ontem, 19:45', status: 'delivered', total: 35.00, rating: 4 },
    { id: 'ORD-003', restaurant: 'Sushi House', date: '2 dias atrás, 21:00', status: 'cancelled', total: 90.00 },
    { id: 'ORD-004', restaurant: 'Açaí Power', date: '5 dias atrás, 15:00', status: 'delivered', total: 25.00, rating: 5 },
];

const statusMap: Record<string, { label: string; icon: React.ElementType, color: string }> = {
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600' },
  in_transit: { label: 'A caminho', icon: Package, color: 'text-blue-600' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-red-600' },
};


export default function MyOrdersPage() {
  return (
    <div className="flex flex-col gap-8 p-4 container">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <ListOrdered />
            Meus Pedidos
        </h1>

        <div className="flex flex-col gap-4">
            {orders.map(order => {
                const statusInfo = statusMap[order.status];
                return (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <CardTitle className="font-headline">{order.restaurant}</CardTitle>
                                <CardDescription>{order.date} • {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</CardDescription>
                            </div>
                             <div className={`flex items-center gap-2 font-semibold ${statusInfo.color}`}>
                                <statusInfo.icon className="w-5 h-5" />
                                <span>{statusInfo.label}</span>
                            </div>
                        </CardHeader>
                         {order.status === 'delivered' && (
                            <CardContent className="flex justify-between items-center pt-4 border-t mt-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground mr-2">Sua avaliação:</span>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < (order.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50'}`} />
                                    ))}
                                </div>
                                <Button variant="outline" size="sm">Pedir Novamente</Button>
                            </CardContent>
                        )}
                        {order.status === 'cancelled' && (
                             <CardContent className="flex justify-end items-center pt-4 border-t mt-4">
                                <Button variant="secondary" size="sm">Ver Detalhes</Button>
                            </CardContent>
                        )}
                    </Card>
                )
            })}
        </div>
    </div>
  );
}
