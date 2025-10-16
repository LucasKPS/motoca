'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListOrdered, Package, CheckCircle, XCircle, Star, Clock } from "lucide-react"; 
import { Button } from "@/components/ui/button";

// --- Definições de Tipos ---

type StatusKey = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

interface Order {
    id: string;
    restaurant: string;
    date: string; 
    total: number;
    status: StatusKey;
    rating: number; 
    // Campo usado para rastrear o tempo de criação do pedido (cooldown)
    createdAt: number; 
}

interface StatusInfo {
    label: string;
    icon: React.ElementType;
    color: string;
}

// --- Mapeamento de Status ---

const statusMap: Record<StatusKey, StatusInfo> = {
  pending: { label: 'Em Preparação', icon: Clock, color: 'text-orange-600' }, 
  in_transit: { label: 'A caminho', icon: Package, color: 'text-blue-600' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-red-600' },
};

// CHAVE FIXA PARA SIMULAÇÃO NO LOCAL STORAGE
const ORDERS_STORAGE_KEY = 'academic_orders';

// Cooldown de 10 segundos (10000 ms)
const COOLDOWN_MS = 10000;


// --- Componente Principal ---

export default function MyOrdersPage() {
    // 🛑 ESTADO LOCAL: Carregar pedidos do LocalStorage
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Função para carregar dados do localStorage
    const loadOrders = () => {
        try {
            const ordersString = localStorage.getItem(ORDERS_STORAGE_KEY);
            // Certifique-se de que o objeto é um array antes de setar
            const loadedOrders: Order[] = ordersString ? JSON.parse(ordersString) : [];
            // Ordena do mais novo para o mais velho
            loadedOrders.sort((a, b) => b.createdAt - a.createdAt);
            setOrders(loadedOrders);
        } catch (e) {
            console.error("Erro ao carregar pedidos do LocalStorage:", e);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para atualizar o status no LocalStorage
    const updateOrderStatusInStorage = (orderId: string, newStatus: StatusKey) => {
        try {
            const existingOrdersString = localStorage.getItem(ORDERS_STORAGE_KEY);
            const existingOrders: Order[] = existingOrdersString ? JSON.parse(existingOrdersString) : [];
            
            const updatedOrders = existingOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            );

            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
            
            // Atualiza o estado local para refletir a mudança imediatamente
            setOrders(updatedOrders); 
            
        } catch (e) {
            console.error("Erro ao atualizar status no LocalStorage:", e);
        }
    };
    
    // Efeito para carregar os pedidos na montagem e escutar mudanças de outras abas/páginas
    useEffect(() => {
        loadOrders();

        // 🛑 Gatilho para "tempo real" (Escuta o evento de armazenamento para atualização)
        window.addEventListener('storage', loadOrders);

        return () => {
            // Limpa o listener ao desmontar o componente
            window.removeEventListener('storage', loadOrders);
        };
    }, []);

    // 🛑 Efeito para Cooldown de Status
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            let hasUpdated = false;

            // Filtra e verifica apenas os pedidos pendentes
            orders.forEach(order => {
                if (order.status === 'pending' && order.createdAt) {
                    // Verifica se o tempo decorrido é maior ou igual ao cooldown (10 segundos)
                    if (now - order.createdAt >= COOLDOWN_MS) {
                        console.log(`Pedido ${order.id} movido de pending para delivered após cooldown.`);
                        updateOrderStatusInStorage(order.id, 'delivered');
                        hasUpdated = true;
                    }
                }
            });

            // Se houve atualização, o useEffect será reexecutado e um novo timer criado
            
        }, 1000); // Verifica a cada 1 segundo

        return () => clearInterval(timer);
        
    }, [orders]); // Depende do array orders para rodar a cada mudança

    // Fim da lógica de cooldown

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-primary">Carregando pedidos...</p>
            </div>
        );
        }

    return (
        <div className="flex flex-col gap-8 p-4 container max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 border-b pb-4">
                <ListOrdered className="w-8 h-8 text-primary"/>
                Meus Pedidos
            </h1>

            <div className="flex flex-col gap-6">
                {orders.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        Nenhum pedido encontrado. Finalize um pedido na página de restaurantes!
                    </div>
                ) : (
                    orders.map(order => {
                        const statusInfo = statusMap[order.status] || statusMap.in_transit;
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                            <Card key={order.id} className="shadow-lg border-gray-100 transition-shadow hover:shadow-xl">
                                <CardHeader className="flex flex-row justify-between items-start pb-3">
                                    <div className='flex flex-col'>
                                        <CardTitle className="font-bold text-lg text-gray-800">{order.restaurant}</CardTitle>
                                        <CardDescription className="text-sm text-gray-500 mt-1">
                                            Pedido #{order.id} • {order.date}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className={`flex items-center gap-1 text-sm font-semibold ${statusInfo.color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            {statusInfo.label}
                                        </span>
                                        <p className="text-xl font-extrabold text-gray-900 mt-1">
                                            {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="pt-4 border-t border-gray-100 mt-2">
                                    
                                    {/* Botões de Ação Dinâmicos */}
                                    <div className="flex justify-end items-center w-full">
                                        
                                        {/* Pendente / Em Preparação */}
                                        {order.status === 'pending' && (
                                            <Button variant="default" size="sm">Acompanhar Preparação</Button>
                                        )}
                                        
                                        {/* A Caminho */}
                                        {order.status === 'in_transit' && (
                                            <Button variant="default" size="sm">Acompanhar Pedido</Button>
                                        )}
                                        
                                        {/* Entregue (Avaliação) */}
                                        {order.status === 'delivered' && (
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground mr-2 text-sm">Sua avaliação:</span>
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < (order.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <Button variant="outline" size="sm">Pedir Novamente</Button>
                                            </div>
                                        )}
                                        
                                        {/* Cancelado */}
                                        {order.status === 'cancelled' && (
                                            <Button variant="secondary" size="sm">Ver Detalhes</Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    );
}
