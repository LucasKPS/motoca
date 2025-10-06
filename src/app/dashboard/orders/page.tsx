'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MerchantOrder } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShoppingCart, Bike, CheckCircle, Clock, Utensils, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    
  const tabs = [
    { value: 'all', label: 'Todos' },
    { value: 'preparing', label: 'Em Preparo' },
    { value: 'ready', label: 'Prontos para Retirada' },
    { value: 'out_for_delivery', label: 'Em Entrega' },
    { value: 'delivered', label: 'Concluídos' },
  ];
  
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
                    <TabsList className="p-2 h-auto flex-wrap">
                        {tabs.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.label} ({orders.filter(o => tab.value === 'all' || o.status === tab.value).length})
                            </TabsTrigger>
                        ))}
                    </TabsList>

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
                           {tabs.map(tab => (
                             <TabsContent key={tab.value} value={tab.value} asChild>
                                <>
                                  {orders.filter(o => tab.value === 'all' || o.status === tab.value).map(order => (
                                    <OrderRow key={order.id} order={order} />
                                  ))}
                                </>
                              </TabsContent>
                           ))}
                        </TableBody>
                    </Table>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
