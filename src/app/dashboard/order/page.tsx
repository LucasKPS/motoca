'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, X, Utensils, CheckCircle, Package, ArrowLeft, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

// --- Configurações e Tipos ---

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface CartItem extends MenuItem {
    quantity: number;
}

interface Order {
    id: string;
    restaurant: string;
    date: string;
    total: number;
    status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
    items: { id: number, name: string, price: number, quantity: number }[];
    rating: number;
    createdAt: number; 
    deliveryAddress: string; // Endereço de entrega
}

// Dados de Simulação
const RESTAURANT_DETAILS = {
    name: 'Pizzaria Delícia',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    menu: [
        { id: 1, name: 'Pizza Margherita', description: 'Molho de tomate, mussarela e manjericão.', price: 45.00 },
        { id: 2, name: 'Pizza Pepperoni', description: 'Mussarela, pepperoni e orégano.', price: 55.50 },
        { id: 3, name: 'Refrigerante 2L', description: 'Coca-Cola ou Guaraná.', price: 10.00 },
        { id: 4, name: 'Água Mineral', description: 'Com ou sem gás.', price: 4.50 },
    ]
};

// CHAVE FIXA PARA SIMULAÇÃO NO LOCAL STORAGE
const ORDERS_STORAGE_KEY = 'academic_orders';


// --- Componente Principal ---

export default function OrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const restaurantName = searchParams.get('name') || RESTAURANT_DETAILS.name;

    const [cart, setCart] = useState<CartItem[]>([]);
    const [deliveryAddress, setDeliveryAddress] = useState(''); // Estado para o endereço
    const [isSendingOrder, setIsSendingOrder] = useState(false);
    const [orderSent, setOrderSent] = useState(false);
    const [error, setError] = useState('');

    // Calcula Subtotal e Total
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 8.00 : 0;
    const total = subtotal + deliveryFee;


    // --- Funções do Carrinho ---

    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.id === item.id);
            if (existingItem) {
                return prevCart.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
        setError(''); 
    };

    const updateQuantity = (itemId: number, change: number) => {
        setCart(prevCart => {
            const newCart = prevCart.map(i =>
                i.id === itemId ? { ...i, quantity: i.quantity + change } : i
            ).filter(i => i.quantity > 0);
            return newCart;
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart(prevCart => prevCart.filter(i => i.id !== itemId));
    };


    // --- Função de Finalizar Pedido ---

    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            setError('O carrinho está vazio. Adicione itens antes de finalizar.');
            return;
        }

        // Validação do endereço
        if (!deliveryAddress.trim()) {
            setError('Por favor, informe o endereço de entrega.');
            return;
        }

        setIsSendingOrder(true);
        setError('');

        const orderId = Date.now().toString().slice(-6);

        const newOrder: Order = {
            id: orderId,
            restaurant: restaurantName,
            total: parseFloat(total.toFixed(2)),
            status: 'pending',
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            date: new Date().toLocaleDateString('pt-BR'),
            rating: 0,
            createdAt: Date.now(),
            deliveryAddress: deliveryAddress, // Salva o endereço no pedido
        };

        try {
            const existingOrdersString = localStorage.getItem(ORDERS_STORAGE_KEY);
            const existingOrders: Order[] = existingOrdersString ? JSON.parse(existingOrdersString) : [];
            
            const updatedOrders = [newOrder, ...existingOrders];

            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
            
            window.dispatchEvent(new Event('storage'));

            setCart([]);
            setDeliveryAddress(''); // Limpa o endereço após o envio
            setOrderSent(true);

        } catch (e) {
            console.error("Erro ao salvar pedido no LocalStorage:", e);
            setError('Falha ao salvar o pedido no navegador.');
        } finally {
            setIsSendingOrder(false);
        }
    };


    // --- Renderização de Sucesso ---
    if (orderSent) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4 md:p-8 bg-gray-50">
                <Card className="max-w-md w-full text-center p-8 shadow-2xl border-green-500 border-t-8 rounded-xl">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <CardTitle className="text-3xl font-extrabold text-green-700">Pedido Enviado com Sucesso!</CardTitle>
                    <CardDescription className="mt-4 text-gray-600">
                        Seu pedido em **{restaurantName}** foi salvo localmente. 
                        Acompanhe o status na tela "Meus Pedidos".
                    </CardDescription>
                    <div className="mt-8 flex flex-col gap-3">
                        <Button onClick={() => router.push('/dashboard/my-orders')} className="bg-green-600 hover:bg-green-700 text-lg">
                            <Package className="mr-2 h-5 w-5" />
                            Ver Meus Pedidos
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/dashboard/restaurants')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Restaurantes
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }


    // --- Renderização Principal ---
    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-8 container max-w-7xl mx-auto">
            
            {/* Coluna Esquerda: Menu e Detalhes do Restaurante */}
            <div className="lg:w-2/3 flex flex-col gap-6">
                
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Utensils className="w-9 h-9 text-primary"/>
                    Pedido em {restaurantName}
                </h1>
                
                <Card className='shadow-xl rounded-xl'>
                    <div className="relative h-48 w-full">
                        <Image 
                            src={RESTAURANT_DETAILS.image}
                            alt={restaurantName}
                            fill
                            className="object-cover rounded-t-xl"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl">{RESTAURANT_DETAILS.name}</CardTitle>
                        <CardDescription>Monte seu pedido escolhendo os itens abaixo.</CardDescription>
                    </CardHeader>
                    <CardContent className='pt-0'>
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Menu</h2>
                        <div className="space-y-4">
                            {RESTAURANT_DETAILS.menu.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-primary mr-2">
                                            {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                        <Button 
                                            onClick={() => addToCart(item)}
                                            size="icon" 
                                            className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600"
                                            title="Adicionar ao carrinho"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Coluna Direita: Carrinho e Checkout */}
            <div className="lg:w-1/3 flex flex-col gap-6 sticky top-8 h-full">
                <Card className='shadow-xl rounded-xl'>
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Package className='w-6 h-6 text-primary' /> Seu Carrinho
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {cart.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">Carrinho vazio.</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-gray-800">{item.quantity}x</span>
                                            <span className="text-gray-700">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-600 text-sm">
                                                {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                            <Button 
                                                onClick={() => updateQuantity(item.id, -1)} 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-7 w-7 text-primary/70 hover:text-primary"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                onClick={() => updateQuantity(item.id, 1)} 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-7 w-7 text-primary/70 hover:text-primary"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                onClick={() => removeFromCart(item.id)} 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-7 w-7 text-red-500 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Endereço de Entrega e Resumo da Compra */}
                        {cart.length > 0 && (
                            <div className="pt-4 space-y-4 border-t mt-4">
                                {/* Endereço de Entrega */}
                                <div className="space-y-2">
                                     <label htmlFor="address" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        Endereço de Entrega
                                    </label>
                                    <Input
                                        id="address"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Digite sua rua, número e bairro..."
                                        className="h-12 text-base"
                                    />
                                </div>

                                {/* Resumo Financeiro */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal:</span>
                                        <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Entrega:</span>
                                        <span>{deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-extrabold text-gray-900 border-t pt-2 mt-2">
                                        <span>Total:</span>
                                        <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-red-500 text-sm mt-3 p-2 border border-red-200 bg-red-50 rounded-lg text-center">{error}</p>
                        )}
                        
                        <Button
                            onClick={handlePlaceOrder}
                            disabled={cart.length === 0 || isSendingOrder}
                            className="w-full h-12 mt-4 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                        >
                            {isSendingOrder ? (
                                'Enviando Pedido...'
                            ) : (
                                `Finalizar Pedido (${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
