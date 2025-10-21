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

const ORDERS_STORAGE_KEY = 'academic_orders';
const COOLDOWN_MS = 10000;

// --- Componente Principal ---

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // Estado para o efeito de hover nas estrelas
    const [hoverRating, setHoverRating] = useState<{[orderId: string]: number | null}>({});

    // Função para carregar dados do localStorage
    const loadOrders = () => {
        try {
            const ordersString = localStorage.getItem(ORDERS_STORAGE_KEY);
            const loadedOrders: Order[] = ordersString ? JSON.parse(ordersString) : [];
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
            let existingOrders: Order[] = existingOrdersString ? JSON.parse(existingOrdersString) : [];
            
            existingOrders = existingOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            );

            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));
            // Recarrega os pedidos para refletir a mudança
            loadOrders();
            
        } catch (e) {
            console.error("Erro ao atualizar status no LocalStorage:", e);
        }
    };
    
    // ⭐️ Função para atualizar a avaliação
    const handleRatingChange = (orderId: string, newRating: number) => {
        try {
            const existingOrdersString = localStorage.getItem(ORDERS_STORAGE_KEY);
            let existingOrders: Order[] = existingOrdersString ? JSON.parse(existingOrdersString) : [];

            const updatedOrders = existingOrders.map(order =>
                order.id === orderId ? { ...order, rating: newRating } : order
            );
            
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
            
            // Atualiza o estado local para refletir a mudança imediatamente
            updatedOrders.sort((a, b) => b.createdAt - a.createdAt);
            setOrders(updatedOrders);

        } catch (e) {
            console.error("Erro ao atualizar avaliação no LocalStorage:", e);
        }
    };
    
    // Efeito para carregar os pedidos na montagem e escutar mudanças
    useEffect(() => {
        loadOrders();
        window.addEventListener('storage', loadOrders);
        return () => {
            window.removeEventListener('storage', loadOrders);
        };
    }, []);

    // Efeito para Cooldown de Status
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            let needsUpdate = false;
            
            const updatedOrders = orders.map(order => {
                if (order.status === 'pending' && now - order.createdAt >= COOLDOWN_MS) {
                    console.log(`Pedido ${order.id} movido para 'delivered' após cooldown.`);
                    needsUpdate = true;
                    return { ...order, status: 'delivered' as StatusKey };
                }
                return order;
            });

            if (needsUpdate) {
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
                // Dispara a atualização do estado
                loadOrders(); 
            }
        }, 2000); 

        return () => clearInterval(timer);
    }, [orders]); 

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
                                    <div className="flex justify-end items-center w-full">
                                        
                                        {order.status === 'pending' && (
                                            <Button variant="default" size="sm">Acompanhar Preparação</Button>
                                        )}
                                        
                                        {order.status === 'in_transit' && (
                                            <Button variant="default" size="sm">Acompanhar Pedido</Button>
                                        )}
                                        
                                        {order.status === 'delivered' && (
                                            <div className="flex justify-between items-center w-full">
                                                {/* ⭐️ Sistema de Avaliação Interativo ⭐️ */}
                                                <div 
                                                    className="flex items-center gap-1"
                                                    onMouseLeave={() => setHoverRating(prev => ({ ...prev, [order.id]: null }))}
                                                >
                                                    <span className="text-muted-foreground mr-2 text-sm">Sua avaliação:</span>
                                                    {Array.from({ length: 5 }).map((_, i) => {
                                                        const ratingValue = i + 1;
                                                        return (
                                                            <Star 
                                                                key={i} 
                                                                className={`w-5 h-5 cursor-pointer transition-all ${
                                                                    ratingValue <= (hoverRating[order.id] || order.rating || 0)
                                                                    ? 'text-amber-400 fill-amber-400' 
                                                                    : 'text-gray-300 hover:text-amber-300'
                                                                }`}
                                                                onClick={() => handleRatingChange(order.id, ratingValue)}
                                                                onMouseEnter={() => setHoverRating(prev => ({ ...prev, [order.id]: ratingValue }))}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <Button variant="outline" size="sm">Pedir Novamente</Button>
                                            </div>
                                        )}
                                        
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
