'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MerchantOrder, MenuItem } from "@/lib/types"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShoppingCart, Bike, CheckCircle, Clock, Utensils, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Chave de identificação no LocalStorage (Deve ser a mesma usada em /menu/page.tsx)
const STORAGE_KEY = 'menu_items_motoca'; 

// --- FUNÇÕES DE LÓGICA E DADOS ---

/**
 * Carrega itens do cardápio do localStorage.
 * @returns {MenuItem[]} Lista de itens do cardápio.
 */
const getMenuFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
            return JSON.parse(storedItems) as MenuItem[];
        }
    }
    // Retorna um item fallback se o localStorage estiver vazio ou indisponível
    return [{ id: 'fallback', name: 'Sanduíche Básico', description: 'Item de fallback', price: 15.00, category: 'Lanches', imageUrl: '' }];
};

/**
 * Gera um novo pedido simulado baseado nos itens do cardápio.
 * @param {MenuItem[]} menuItems - Lista de itens disponíveis.
 * @returns {MerchantOrder} O objeto de pedido simulado.
 */
const generateSimulatedOrder = (menuItems: MenuItem[]): MerchantOrder => {
    // Garante que há pelo menos 1 item para o pedido
    if (menuItems.length === 0) {
        menuItems = getMenuFromLocalStorage();
    }

    const numItems = Math.floor(Math.random() * 2) + 1; // 1 ou 2 itens
    let total = 0;
    let itemDetails: { name: string, price: number }[] = [];
    
    // Seleciona itens aleatórios
    for (let i = 0; i < numItems; i++) {
        const item = menuItems[Math.floor(Math.random() * menuItems.length)];
        total += item.price;
        itemDetails.push({ name: item.name, price: item.price });
    }
    
    // Adiciona taxa de serviço/entrega
    const deliveryFee = 5.00; 
    total += deliveryFee;
    
    // Mock de Entregador
    const couriers = [
        { name: 'Lucas S.', rating: 4.8 }, 
        { name: 'Rafaela C.', rating: 4.5 }
    ];
    const courier = couriers[Math.floor(Math.random() * couriers.length)];

    return {
        id: `PEDIDO-${Math.floor(Math.random() * 10000)}`,
        customerName: 'Cliente Simulado',
        items: numItems, // Contador de itens
        total: total,
        status: 'preparing', // Começa em preparo
        courier: courier,
        itemDetails: itemDetails, // Usado para exibição detalhada, se necessário
    };
};


// --- COMPONENTES ---

const statusMap: Record<MerchantOrder['status'], { label: string; icon: React.ElementType, color: string; bgColor: string }> = {
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

// Componente para o Modal de "Novo Pedido"
const NovoPedidoModal = ({ order, onClose, onAccept }) => {
  const [timeLeft, setTimeLeft] = useState(30); // 30 segundos para aceitar

  useEffect(() => {
    // Previne o loop infinito usando a dependência estável
    if (timeLeft <= 0) {
      console.log('Tempo esgotado! Pedido perdido.');
      onClose(); 
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose]);


  return (
    // Fundo escuro do modal
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
      {/* Container principal do cartão do modal */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-red-500 overflow-hidden"
        style={{ borderColor: '#FF5050', maxWidth: '380px' }}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center">
            <span className="text-3xl mr-3" style={{ color: '#FF5050' }}>🔔</span>
            <h3 className="m-0 text-xl font-bold" style={{ color: '#FF5050' }}>Novo Pedido!</h3>
          </div>
          <span className="text-2xl font-bold text-gray-800">
            R$ {order.total.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Tempo para aceitar */}
        <p className="text-sm text-gray-600 text-left px-5 mt-3">
          Você tem <span className="font-semibold text-red-500">{timeLeft}</span> segundos para aceitar.
        </p>

        {/* Seções de Itens e Cliente */}
        <div className="p-5 space-y-3">
          {/* Cartão de Itens */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
            <span className="mr-3 text-xl">🍔</span>
            <div>
              <p className="m-0 text-xs text-gray-500">Itens:</p>
              <p className="m-0 font-bold text-base">{order.items} {order.items > 1 ? 'itens' : 'item'}</p>
            </div>
          </div>

          {/* Cartão de Cliente */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
            <span className="mr-3 text-xl">👤</span>
            <div>
              <p className="m-0 text-xs text-gray-500">Cliente:</p>
              <p className="m-0 font-bold text-base">{order.customerName}</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between gap-3 p-5 pt-0">
          <Button 
            onClick={onClose} // Recusar fecha o modal
            variant="destructive"
            className="flex-1 h-12 text-base font-bold bg-red-600 hover:bg-red-700 rounded-lg"
          >
            <span className="mr-2">✕</span> Recusar
          </Button>
          <Button 
            onClick={onAccept} // Aceitar chama a função que adiciona o pedido e fecha
            className="flex-1 h-12 text-base font-bold bg-green-600 hover:bg-green-700 rounded-lg"
            style={{ backgroundColor: '#28a745' }}
          >
            <span className="mr-2">✓</span> Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---

export default function MerchantOrdersPage({ orders = [] }: { orders: MerchantOrder[] }) {
    // 1. Estado para gerenciar todos os pedidos (incluindo os simulados)
    const [liveOrders, setLiveOrders] = useState<MerchantOrder[]>(orders);

    // 2. Estado para controlar o modal e o pedido que está sendo oferecido
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentSimulatedOrder, setCurrentSimulatedOrder] = useState<MerchantOrder | null>(null);

    // 3. Estado para carregar os itens do cardápio (ocorre apenas uma vez)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    useEffect(() => {
        setMenuItems(getMenuFromLocalStorage());
    }, []); 
    
    // --- LÓGICAS DE FLUXO ---

    // Função estável para fechar o modal
    const handleCloseModal = useCallback(() => {
        setShowOrderModal(false);
        setCurrentSimulatedOrder(null);
    }, []);

    // Função estável para adicionar o pedido aceito e iniciar o ciclo de entrega
    const addSimulatedOrder = useCallback((newOrder: MerchantOrder) => {
        // 1. Adiciona o pedido na lista como 'preparing'
        setLiveOrders(prevOrders => [...prevOrders, newOrder]);
        handleCloseModal();

        // 2. Simula o tempo de preparo (3 segundos) -> READY
        setTimeout(() => {
            console.log(`Pedido ${newOrder.id} está pronto.`);
            setLiveOrders(prevOrders => prevOrders.map(order => 
                order.id === newOrder.id ? { ...order, status: 'ready' } : order
            ));
            
            // 3. Simula a chegada do motoboy (2 segundos) -> OUT_FOR_DELIVERY
            setTimeout(() => {
                console.log(`Motoboy pegou o pedido ${newOrder.id}.`);
                setLiveOrders(prevOrders => prevOrders.map(order => 
                    order.id === newOrder.id ? { ...order, status: 'out_for_delivery' } : order
                ));

                // 4. Simula a entrega (5 segundos) -> DELIVERED (CONCLUÍDO)
                setTimeout(() => {
                    console.log(`Pedido ${newOrder.id} concluído.`);
                    setLiveOrders(prevOrders => prevOrders.map(order => 
                        order.id === newOrder.id ? { ...order, status: 'delivered' } : order
                    ));
                }, 5000); // 5 segundos para a entrega final
            }, 2000); // 2 segundos para o motoboy pegar
        }, 3000); // 3 segundos de preparo
    }, [handleCloseModal]);


    // Função que é chamada ao clicar no botão 'Simular Novo Pedido'
    const handleSimulateOrder = () => {
        const newOrder = generateSimulatedOrder(menuItems);
        setCurrentSimulatedOrder(newOrder);
        setShowOrderModal(true);
    };


    // --- RENDERING PRINCIPAL ---
    
    const tabs: { value: MerchantOrder['status'] | 'all', label: string }[] = [
        { value: 'all', label: 'Todos' },
        { value: 'preparing', label: 'Em Preparo' },
        { value: 'ready', label: 'Prontos' },
        { value: 'out_for_delivery', label: 'Em Entrega' },
        { value: 'delivered', label: 'Concluídos' },
    ];

    const getFilteredOrders = (status: MerchantOrder['status'] | 'all') => {
        if (status === 'all') return liveOrders;
        return liveOrders.filter(o => o.status === status);
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
                {/* Botão de Simulação */}
                <Button 
                    onClick={handleSimulateOrder}
                    className="h-10 px-4 py-2 font-bold"
                    style={{ backgroundColor: '#FF5050', color: 'white' }}
                    disabled={menuItems.length === 0} // Desabilita se não houver itens no cardápio
                >
                    Simular Novo Pedido 🛒
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
                                                {/* Ordena para que os mais novos (simulados) fiquem em cima */}
                                                {filteredOrders.sort((a, b) => b.id.localeCompare(a.id)).map(order => (
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
            
            {/* Modal de Novo Pedido (Simulação) */}
            {showOrderModal && currentSimulatedOrder && (
                <NovoPedidoModal 
                    order={currentSimulatedOrder}
                    onClose={handleCloseModal}
                    onAccept={() => addSimulatedOrder(currentSimulatedOrder)}
                />
            )}
        </div>
    );
}
