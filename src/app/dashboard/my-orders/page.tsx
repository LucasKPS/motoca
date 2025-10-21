'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListOrdered, Package, CheckCircle, XCircle, Star, Clock } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";

// --- Definições de Tipos ---

type StatusKey = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

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

const ORDERS_STORAGE_KEY = 'orders';
const COOLDOWN_MS = 10000; // 10 segundos para cada estágio

// --- Componente Principal ---

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverRating, setHoverRating] = useState<{[orderId: string]: number | null}>({});

    const loadOrders = () => {
        try {
            const ordersString = localStorage.getItem(ORDERS_STORAGE_KEY);
            const loadedOrders: Order[] = ordersString ? JSON.parse(ordersString) : [];
            loadedOrders.sort((a, b) => b.createdAt - a.createdAt);
            setOrders(loadedOrders);
        } catch (e) {
            console.error("Erro ao carregar pedidos:", e);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const updateAndSaveOrders = (updatedOrders: Order[]) => {
        updatedOrders.sort((a, b) => b.createdAt - a.createdAt);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
    };

    const handleRatingChange = (orderId: string, newRating: number) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, rating: newRating } : order
        );
        updateAndSaveOrders(updatedOrders);
    };

    useEffect(() => {
        loadOrders();
        window.addEventListener('storage', loadOrders);

        const interval = setInterval(() => {
            const now = Date.now();
            let ordersChanged = false;

            const updatedOrders = orders.map(order => {
                const timeSinceCreation = now - order.createdAt;

                if (order.status === 'pending' && timeSinceCreation >= COOLDOWN_MS) {
                    ordersChanged = true;
                    return { ...order, status: 'in_transit' as StatusKey };
                }
                
                if (order.status === 'in_transit' && timeSinceCreation >= COOLDOWN_MS * 2) {
                    ordersChanged = true;
                    return { ...order, status: 'delivered' as StatusKey };
                }

                return order;
            });

            if (ordersChanged) {
                updateAndSaveOrders(updatedOrders);
            }
        });

        return () => {
            window.removeEventListener('storage', loadOrders);
            clearInterval(interval);
        };
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
                        const statusInfo = statusMap[order.status] || statusMap.pending;
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                            <Card key={order.id} className="shadow-lg border-gray-100 transition-shadow hover:shadow-xl">
                                <CardHeader className="flex flex-row justify-between items-start pb-3">
                                    <div className='flex flex-col'>
                                        <CardTitle className="font-bold text-lg text-gray-800">{order.restaurant}</CardTitle>
                                        <CardDescription className="text-sm text-gray-500 mt-1">
                                            Pedido #{order.id} • {new Date(order.createdAt).toLocaleDateString('pt-BR')}
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
                                        {order.status === 'delivered' ? (
                                            <div className="flex justify-between items-center w-full">
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
                                        ) : (
                                            <Button variant="secondary" size="sm" disabled>Acompanhar Pedido</Button>
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
