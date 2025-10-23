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
import { useToast } from "@/hooks/use-toast";

// Chaves de Storage
const MENU_STORAGE_KEY = 'menu_items_motoca'; 
const ORDERS_STORAGE_KEY = 'merchant_orders_motoca'; 
const RESTAURANT_STATUS_KEY = 'restaurant_status_motoca';


// --- FUNÇÕES DE LÓGICA E DADOS ---

const getMenuFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem(MENU_STORAGE_KEY);
        if (storedItems) {
            return JSON.parse(storedItems) as MenuItem[];
        }
    }
    return [{ id: 'fallback', name: 'Sanduíche Básico', description: 'Item de fallback', price: 15.00, category: 'Lanches', imageUrl: '' }];
};

const getOrdersFromLocalStorage = (): MerchantOrder[] => {
    if (typeof window !== 'undefined') {
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (storedOrders) {
            return JSON.parse(storedOrders) as MerchantOrder[];
        }
    }
    return [];
};

const saveOrdersToLocalStorage = (orders: MerchantOrder[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
};

const getRestaurantStatus = (): boolean => {
    if (typeof window !== 'undefined') {
        const status = localStorage.getItem(RESTAURANT_STATUS_KEY);
        return status ? JSON.parse(status) : true;
    }
    return true;
};

const generateSimulatedOrder = (menuItems: MenuItem[]): MerchantOrder => {
    if (menuItems.length === 0) {
        menuItems = getMenuFromLocalStorage();
    }

    const numItems = Math.floor(Math.random() * 2) + 1; 
    let total = 0;
    let itemDetails: { name: string, price: number }[] = [];
    
    for (let i = 0; i < numItems; i++) {
        const item = menuItems[Math.floor(Math.random() * menuItems.length)];
        total += item.price;
        itemDetails.push({ name: item.name, price: item.price });
    }
    
    const deliveryFee = 5.00; 
    total += deliveryFee;
    
    const couriers = [
        { name: 'Lucas S.', rating: 4.8 }, 
        { name: 'Rafaela C.', rating: 4.5 }
    ];
    const courier = couriers[Math.floor(Math.random() * couriers.length)];

    return {
        id: `PEDIDO-${Math.floor(Math.random() * 10000)}`,
        customerName: 'Cliente Simulado',
        items: numItems, 
        total: total,
        status: 'preparing', 
        createdAt: new Date().toISOString(),
        courier: courier,
        itemDetails: itemDetails, 
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

interface NovoPedidoModalProps {
    order: MerchantOrder;
    onClose: () => void;
    onAccept: () => void;
}

const NovoPedidoModal: React.FC<NovoPedidoModalProps> = ({ order, onClose, onAccept }) => {
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (timeLeft <= 0) {
            onClose(); 
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onClose]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-red-500 overflow-hidden" style={{ borderColor: '#FF5050', maxWidth: '380px' }}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <div className="flex items-center">
                        <span className="text-3xl mr-3">🔔</span>
                        <h3 className="m-0 text-xl font-bold" style={{ color: '#FF5050' }}>Novo Pedido!</h3>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{order.total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                </div>
                <p className="text-sm text-gray-600 text-left px-5 mt-3">
                    Você tem <span className="font-semibold text-red-500">{timeLeft}</span> segundos para aceitar.
                </p>
                <div className="p-5 space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
                        <span className="mr-3 text-xl">🍔</span>
                        <div>
                            <p className="m-0 text-xs text-gray-500">Itens:</p>
                            <p className="m-0 font-bold text-base">{order.items} {order.items > 1 ? 'itens' : 'item'}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
                        <span className="mr-3 text-xl">👤</span>
                        <div>
                            <p className="m-0 text-xs text-gray-500">Cliente:</p>
                            <p className="m-0 font-bold text-base">{order.customerName}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-3 p-5 pt-0">
                    <Button onClick={onClose} variant="destructive" className="flex-1 h-12 text-base font-bold bg-red-600 hover:bg-red-700 rounded-lg"><span>✕</span> Recusar</Button>
                    <Button onClick={onAccept} className="flex-1 h-12 text-base font-bold bg-green-600 hover:bg-green-700 rounded-lg"><span>✓</span> Aceitar</Button>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---

export default function MerchantOrdersPage() {
    const { toast } = useToast();
    const [liveOrders, setLiveOrders] = useState<MerchantOrder[]>(getOrdersFromLocalStorage());
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentSimulatedOrder, setCurrentSimulatedOrder] = useState<MerchantOrder | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);

    useEffect(() => {
        setMenuItems(getMenuFromLocalStorage());
        setIsRestaurantOpen(getRestaurantStatus());
        
        const handleStorageUpdate = () => {
            setIsRestaurantOpen(getRestaurantStatus());
        };
        window.addEventListener('storage', handleStorageUpdate);
        return () => window.removeEventListener('storage', handleStorageUpdate);
    }, []);
    
    useEffect(() => {
        saveOrdersToLocalStorage(liveOrders);
    }, [liveOrders]);

    const handleCloseModal = useCallback(() => {
        setShowOrderModal(false);
        setCurrentSimulatedOrder(null);
    }, []);

    const addSimulatedOrder = useCallback((newOrder: MerchantOrder) => {
        setLiveOrders(prev => [...prev, newOrder]);
        handleCloseModal();
        setTimeout(() => {
            setLiveOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'ready' } : o));
            setTimeout(() => {
                setLiveOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'out_for_delivery' } : o));
                setTimeout(() => {
                    setLiveOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'delivered' } : o));
                }, 5000);
            }, 2000);
        }, 3000);
    }, [handleCloseModal]);

    const handleSimulateOrder = () => {
        if (!isRestaurantOpen) {
            toast({
                title: "Restaurante Fechado",
                description: "Você não pode simular novos pedidos enquanto o restaurante estiver fechado.",
                variant: "destructive",
            });
            return;
        }
        const newOrder = generateSimulatedOrder(menuItems);
        setCurrentSimulatedOrder(newOrder);
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
        if (status === 'all') return liveOrders;
        return liveOrders.filter(o => o.status === status);
    }
    
    return (
        <div className="flex flex-col gap-8 p-4 container">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2"><ShoppingCart /> Pedidos</h1>
                    <p className="text-muted-foreground mt-1">Gerencie e acompanhe todos os pedidos do seu restaurante.</p>
                </div>
                <Button 
                    onClick={handleSimulateOrder}
                    className="h-10 px-4 py-2 font-bold"
                    style={{ backgroundColor: isRestaurantOpen ? '#FF5050' : '#a0a0a0', color: 'white' }}
                    disabled={!isRestaurantOpen || menuItems.length === 0} 
                    title={!isRestaurantOpen ? "Abra o restaurante para receber novos pedidos." : ""}
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
                                    <TabsTrigger key={tab.value} value={tab.value} disabled={liveOrders.length === 0}>
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
                                                {filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
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