'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MerchantOrder } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShoppingCart, Bike, CheckCircle, Clock, Utensils, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const statusMap: Record<MerchantOrder['status'], { label: string; icon: React.ElementType, color: string, bgColor: string }> = {
  preparing: { label: 'Em Preparo', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  ready: { label: 'Pronto', icon: Utensils, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  out_for_delivery: { label: 'Em Entrega', icon: Bike, color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-100' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
};

const OrderRow = ({ order }: { order: MerchantOrder }) => {
    const statusInfo = statusMap[order.status];
    return (
        <TableRow>
            <TableCell className="font-bold">{order.id}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
                 <Badge variant="outline" className={cn("gap-1.5", statusInfo.bgColor, statusInfo.color, 'border-none')}>
                    <statusInfo.icon className="w-3 h-3" />
                    {statusInfo.label}
                </Badge>
            </TableCell>
             <TableCell className="text-center">{order.items}</TableCell>
            <TableCell className="font-medium text-right">{order.total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</TableCell>
            <TableCell>
                {order.courier ? (
                     <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{order.courier.name}</span>
                        <Badge variant="secondary" className="gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" />{order.courier.rating}</Badge>
                    </div>
                ) : (
                    <span className="text-muted-foreground text-xs italic">Aguardando...</span>
                )}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como "Pronto"</DropdownMenuItem>
                        <DropdownMenuItem>Chamar Entregador</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export default function MerchantOrdersPage({ orders = [] }: { orders: MerchantOrder[] }) {
    
  const tabs: { value: MerchantOrder['status'] | 'all', label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'preparing', label: 'Em Preparo' },
    { value: 'ready', label: 'Prontos' },
    { value: 'out_for_delivery', label: 'Em Entrega' },
    { value: 'delivered', label: 'Concluídos' },
  ];

  const getFilteredOrders = (status: MerchantOrder['status'] | 'all') => {
      if (status === 'all') return orders;
      return orders.filter(o => o.status === status);
  }
  
  return (
    <div className="flex flex-col gap-8 p-4 container">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                <ShoppingCart />
                Pedidos
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie e acompanhe todos os pedidos do seu restaurante.</p>
        </div>
      </div>
        <Card>
            <CardContent className="p-0">
                <Tabs defaultValue="all">
                    <div className="p-2">
                        <TabsList className="h-auto flex-wrap justify-start">
                            {tabs.map(tab => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.label} ({getFilteredOrders(tab.value).length})
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {tabs.map(tab => {
                        const filteredOrders = getFilteredOrders(tab.value);
                        return (
                            <TabsContent key={tab.value} value={tab.value}>
                                {filteredOrders.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Pedido</TableHead>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-center">Itens</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead>Entregador</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredOrders.map(order => (
                                                <OrderRow key={order.id} order={order} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8">
                                         <Alert className="text-center">
                                            <ShoppingCart className="w-4 h-4" />
                                            <AlertTitle>Nenhum pedido encontrado</AlertTitle>
                                            <AlertDescription>
                                                Não há pedidos com o status "{tab.label}" no momento.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                )}
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
