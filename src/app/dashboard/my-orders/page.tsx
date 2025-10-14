'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Importação corrigida: Clock já estava no seu código, garantindo que ele seja usado.
import { ListOrdered, Package, CheckCircle, XCircle, Star, Clock } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/types"; 

// 1. Atualização do statusMap: Adicionando o status 'pending' (Ativo)
const statusMap: Record<string, { label: string; icon: React.ElementType, color: string }> = {
  // NOVO STATUS: Usado para pedidos recém-finalizados (ativo/em preparação)
  pending: { label: 'Em Preparação', icon: Clock, color: 'text-orange-600' }, 
  
  in_transit: { label: 'A caminho', icon: Package, color: 'text-blue-600' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-red-600' },
};


// SIMULAÇÃO: Esta lista é apenas um *fallback* caso a prop 'orders' não seja passada.
// Você deve remover ou modificar este array 'defaultOrders' quando integrar com o Estado Global/Firebase.
const defaultOrders: Order[] = [
    {
        id: '123456',
        restaurant: 'Pizzaria Central',
        date: new Date().toLocaleDateString('pt-BR'),
        total: 78.99,
        status: 'pending', // Este pedido aparecerá como "Em Preparação" (Ativo)
        rating: 0,
    },
    {
        id: '123455',
        restaurant: 'Hamburgueria do Zé',
        date: '01/09/2024',
        total: 45.50,
        status: 'delivered',
        rating: 5,
    },
];


export default function MyOrdersPage({ orders = defaultOrders }: { orders: Order[] }) {
  // ATENÇÃO: Se você usa um gerenciador de estado (Redux, Context, Zustand)
  // você deve **substituir** `orders = defaultOrders` pela leitura do seu estado.
  // Exemplo (se fosse React Redux): const orders = useSelector(state => state.pedidos.lista);
  
  return (
    <div className="flex flex-col gap-8 p-4 container">
      <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
        <ListOrdered />
        Meus Pedidos
      </h1>

      <div className="flex flex-col gap-4">
        {orders.map(order => {
          // O fallback para statusInfo é importante caso o status não exista no mapa
          // Usamos 'in_transit' como fallback visual se a chave for inválida.
          const statusInfo = statusMap[order.status] || statusMap.in_transit;
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="font-headline">{order.restaurant}</CardTitle>
                  <CardDescription>{order.date} • {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</CardDescription>
                </div>
                <div className={`flex items-center gap-2 font-semibold ${statusInfo.color}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span>{statusInfo.label}</span>
                </div>
              </CardHeader>
              
              {/* Lógica para o novo status 'pending' (Pedido Ativo) */}
              {order.status === 'pending' && (
                  <CardContent className="flex justify-end items-center pt-4 border-t mt-4">
                      <Button variant="outline" size="sm">Acompanhar Preparação</Button>
                  </CardContent>
              )}
              
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