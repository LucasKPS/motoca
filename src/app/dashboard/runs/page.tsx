'use client';
import React, { useState, useEffect } from 'react';
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


// --- DADOS E COMPONENTE DO MODAL DE CORRIDA (INTEGRAÇÃO) ---

// Dados de exemplo para a corrida simulada
const simulatedOrder = {
  id: 'CORRIDA-456',
  type: 'Corrida',
  value: 18.11,
  timeToAccept: 30, // Segundos
  pickupLocation: 'Hamburgueria do Chef',
  deliveryAddress: 'Rua das Flores, 45, Rio de Janeiro - RJ',
};

// Componente para o Modal de "Nova Corrida" - Estilizado para ser idêntico à imagem
const NovaCorridaModal = ({ order, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(order.timeToAccept);

  // Efeito para o contador regressivo
  useEffect(() => {
    if (timeLeft <= 0) {
      console.log('Tempo esgotado! Corrida perdida.');
      onClose(); // Fechamos o modal automaticamente quando o tempo acaba
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Limpa o timer ao desmontar
  }, [timeLeft, onClose]);

  // Função de ação para Aceitar (simulação)
  const handleAccept = () => {
    console.log(`Corrida ${order.id} aceita.`);
    onClose();
  };

  // Função de ação para Recusar (simulação)
  const handleDecline = () => {
    console.log(`Corrida ${order.id} recusada.`);
    onClose();
  };

  return (
    // Fundo escuro do modal (usando classes Tailwind + estilos inline para fixar)
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]"
      // Estilo inline para garantir que o z-index seja maior que o de qualquer elemento shadcn
    >
      {/* Container principal do cartão do modal */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-red-500 overflow-hidden"
        style={{ borderColor: '#FF5050', maxWidth: '380px' }} // Mantendo o estilo da borda vermelha
      >
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center">
            {/* Ícone de sino */}
            <span className="text-3xl mr-3" style={{ color: '#FF5050' }}>🔔</span>
            <h3 className="m-0 text-xl font-bold" style={{ color: '#FF5050' }}>Nova Corrida!</h3>
          </div>
          <span className="text-2xl font-bold text-gray-800">
            R$ {order.value.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Tempo para aceitar */}
        <p className="text-sm text-gray-600 text-left px-5 mt-3">
          Você tem <span className="font-semibold text-red-500">{timeLeft}</span> segundos para aceitar.
        </p>

        {/* Seções de Coleta e Entrega */}
        <div className="p-5 space-y-3">
          {/* Cartão de Coleta */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
            <span className="mr-3 text-xl">🏪</span>
            <div>
              <p className="m-0 text-xs text-gray-500">Coleta:</p>
              <p className="m-0 font-bold text-base">{order.pickupLocation}</p>
            </div>
          </div>

          {/* Cartão de Entrega */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
            <span className="mr-3 text-xl">📍</span>
            <div>
              <p className="m-0 text-xs text-gray-500">Entrega:</p>
              <p className="m-0 font-bold text-base">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between gap-3 p-5 pt-0">
          <Button 
            onClick={handleDecline}
            variant="destructive"
            className="flex-1 h-12 text-base font-bold bg-red-600 hover:bg-red-700 rounded-lg"
          >
            <span className="mr-2">✕</span> Recusar
          </Button>
          <Button 
            onClick={handleAccept}
            className="flex-1 h-12 text-base font-bold bg-green-600 hover:bg-green-700 rounded-lg"
            style={{ backgroundColor: '#28a745' }} // Força o verde da imagem
          >
            <span className="mr-2">✓</span> Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (EXISTENTE COM MUDANÇAS) ---

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

// O componente principal agora gerencia o estado do modal
export default function MerchantOrdersPage({ orders = [] }: { orders: MerchantOrder[] }) {
    
  // 1. Estado para controlar a visibilidade do modal
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleSimulateOrder = () => {
    setShowOrderModal(true);
  };
  
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
        {/* 2. Botão de Simulação */}
        <Button 
          onClick={handleSimulateOrder}
          className="h-10 px-4 py-2 font-bold"
          style={{ backgroundColor: '#FF5050', color: 'white' }}
        >
          Simular Nova Corrida 🛵
        </Button>
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
        {/* 3. Renderiza o Modal de Nova Corrida condicionalmente */}
        {showOrderModal && (
          <NovaCorridaModal order={simulatedOrder} onClose={() => setShowOrderModal(false)} />
        )}
    </div>
  );
}
 