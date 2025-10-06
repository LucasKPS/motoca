'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListOrdered, Package, CheckCircle, XCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/types";

const statusMap: Record<string, { label: string; icon: React.ElementType, color: string }> = {
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600' },
  in_transit: { label: 'A caminho', icon: Package, color: 'text-blue-600' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-red-600' },
};


export default function MyOrdersPage({ orders = [] }: { orders: Order[] }) {
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
                        {order.status === 'in_transit' && (
                             <CardContent className="flex justify-end items-center pt-4 border-t mt-4">
                                <Button variant="outline" size="sm">Acompanhar Pedido</Button>
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
