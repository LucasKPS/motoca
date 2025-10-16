'use client'

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Clock, Utensils, ChevronLeft, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

// --- DADOS MOCADOS DO RESTAURANTE ---

// ... (Interfaces MenuItem, RestaurantData, CartItem mantidas)

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
}

interface RestaurantData {
    id: string;
    name: string;
    rating: number;
    category: string;
    deliveryTime: string;
    image: string;
    menu: MenuItem[];
}

interface CartItem extends MenuItem {
    quantity: number;
    subtotal: number;
}


const allRestaurants: RestaurantData[] = [
    { id: 'pizzaria-delicia', name: 'Pizzaria Delícia', rating: 4.5, category: 'Pizza', deliveryTime: '25-35 min', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', menu: [
        { id: 101, name: 'Pizza Margherita', description: 'Molho de tomate, mussarela, manjericão.', price: 45.00, category: 'Pizzas Clássicas' },
        { id: 102, name: 'Pizza Calabresa', description: 'Calabresa fatiada, cebola e azeitona.', price: 50.00, category: 'Pizzas Clássicas' },
        { id: 103, name: 'Refrigerante 2L', description: 'Coca-cola ou Guaraná.', price: 10.00, category: 'Bebidas' },
    ]},
    { id: 'burger-queen', name: 'Burger Queen', rating: 4.8, category: 'Lanches', deliveryTime: '20-30 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', menu: [
        { id: 201, name: 'Hambúrguer Clássico', description: 'Pão, carne, queijo, salada e molho especial.', price: 30.00, category: 'Hambúrgueres' },
        { id: 202, name: 'Batata Frita', description: 'Batata frita palito crocante.', price: 12.00, category: 'Acompanhamentos' },
    ]},
    { id: 'sushi-house', name: 'Sushi House', rating: 4.9, category: 'Japonesa', deliveryTime: '35-45 min', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop', menu: [
        { id: 301, name: 'Combinado Sushi (10 peças)', description: 'Salmão, atum e camarão.', price: 75.00, category: 'Combinados' },
        { id: 302, name: 'Temaki Salmão Cream Cheese', description: 'Cone de alga com arroz e recheio.', price: 35.00, category: 'Temakis' },
    ]},
    { id: 'cantina-italiana', name: 'Cantina Italiana', rating: 4.7, category: 'Italiana', deliveryTime: '30-40 min', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2070&auto=format&fit=crop', menu: [] },
    { id: 'frango-assado', name: 'Frango Assado Express', rating: 4.6, category: 'Brasileira', deliveryTime: '40-50 min', image: 'https://images.unsplash.com/photo-1598515213692-5f2841f45b64?q=80&w=2070&auto=format&fit=crop', menu: [] },
    { id: 'acai-power', name: 'Açaí Power', rating: 4.9, category: 'Açaí', deliveryTime: '15-25 min', image: 'https://images.unsplash.com/photo-1619597548318-65c320152553?q=80&w=1974&auto=format&fit=crop', menu: [] },
];

// --- COMPONENTE PRINCIPAL ---

export default function OrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // O ID DO RESTAURANTE É RECEBIDO VIA QUERY PARAMETER 'id'
    const restaurantId = searchParams.get('id'); 

    // ESTADO DO CARRINHO: Guarda a lista de itens no carrinho
    const [cart, setCart] = useState<CartItem[]>([]);

    // 1. Encontra o restaurante
    const restaurant = useMemo(() => {
        return allRestaurants.find(r => r.id === restaurantId);
    }, [restaurantId]);
    
    // CÁLCULOS DO CARRINHO (usando useMemo para otimização)
    const { subtotal, totalItems } = useMemo(() => {
        const initialValue = { subtotal: 0, totalItems: 0 };
        return cart.reduce((acc, item) => {
            acc.subtotal += item.subtotal;
            acc.totalItems += item.quantity;
            return acc;
        }, initialValue);
    }, [cart]);

    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;

    // --- LÓGICA DO CARRINHO ---

    const updateItemQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            // Remove o item se a quantidade for 0 ou menor
            setCart(prevCart => prevCart.filter(item => item.id !== itemId));
        } else {
            setCart(prevCart => prevCart.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        quantity: newQuantity,
                        subtotal: newQuantity * item.price,
                    };
                }
                return item;
            }));
        }
    };

    const addToCart = (menuItem: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === menuItem.id);

            if (existingItem) {
                // Se o item já existe, aumenta a quantidade
                return prevCart.map(item => {
                    if (item.id === menuItem.id) {
                        const newQuantity = item.quantity + 1;
                        return {
                            ...item,
                            quantity: newQuantity,
                            subtotal: newQuantity * item.price,
                        };
                    }
                    return item;
                });
            } else {
                // Se for um novo item, adiciona ao carrinho
                return [
                    ...prevCart,
                    { 
                        ...menuItem, 
                        quantity: 1, 
                        subtotal: menuItem.price 
                    }
                ];
            }
        });
    };

    // --- RENDERIZAÇÃO ---

    if (!restaurant) {
        // COMPONENTE DE ERRO (JÁ EXISTENTE E CORRETO)
        return (
            <div className="flex flex-col items-center justify-center p-10 h-[80vh]">
                <h1 className="text-3xl font-bold text-red-500">Restaurante Não Encontrado</h1>
                <p className="text-muted-foreground mt-2">Verifique o link ou volte para a lista de restaurantes.</p>
                <Button onClick={() => router.push('/dashboard/restaurants')} className="mt-6">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </div>
        );
    }
    
    // Agrupa o menu por categoria
    const menuByCategory = restaurant.menu.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const formatCurrency = (value: number) => 
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


    return (
        <div className="flex flex-col container p-0 sm:p-4">
            {/* 1. Imagem de Capa e Header Fixo */}
            <div className="relative h-60 w-full shadow-lg">
                <Image 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    fill 
                    className="object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-start p-4">
                    <Button 
                        onClick={() => router.back()} 
                        variant="default" 
                        size="icon" 
                        className="bg-white/30 hover:bg-white/50 text-white rounded-full backdrop-blur-sm"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6 lg:p-8">
                {/* 2. Coluna Principal: Detalhes e Menu */}
                <div className="flex-1">
                    {/* Detalhes do Restaurante (Mantido) */}
                    <h1 className="text-4xl font-headline font-bold text-gray-900">{restaurant.name}</h1>
                    <div className="flex items-center text-sm text-muted-foreground gap-4 mt-2 border-b pb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-amber-500" /> {restaurant.rating}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Utensils className="w-4 h-4" /> {restaurant.category}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {restaurant.deliveryTime}
                        </div>
                    </div>

                    {/* Menu por Categoria */}
                    {Object.keys(menuByCategory).length > 0 ? (
                        <div className="mt-8 space-y-8">
                            {Object.entries(menuByCategory).map(([category, items]) => (
                                <section key={category}>
                                    <h2 className="text-2xl font-semibold font-headline text-primary border-b pb-2 mb-4">
                                        {category}
                                    </h2>
                                    <div className="space-y-4">
                                        {items.map(item => (
                                            <Card key={item.id} className="hover:border-primary transition-colors">
                                                <CardContent className="p-4 flex justify-between items-center">
                                                    <div className='flex-1 pr-4'>
                                                        <h3 className="text-lg font-medium">{item.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xl font-bold text-gray-800">
                                                            {formatCurrency(item.price)}
                                                        </span>
                                                        <Button 
                                                            size="sm" 
                                                            className="mt-2 bg-primary hover:bg-primary/90"
                                                            onClick={() => addToCart(item)} // CHAMA ADD TO CART
                                                        >
                                                            Adicionar
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (
                         <div className="mt-10 p-8 text-center bg-gray-50 rounded-lg">
                            <Utensils className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-lg text-muted-foreground">O menu para este restaurante ainda não foi cadastrado.</p>
                         </div>
                    )}
                </div>

                {/* 3. Coluna Lateral: Carrinho (ATUALIZADO) */}
                <div className="lg:w-80 w-full sticky top-4 self-start">
                    <Card className="shadow-xl border-2 border-primary/10">
                        <CardHeader className="p-4 border-b">
                            <CardTitle className="text-xl font-headline flex items-center justify-between">
                                <span className='flex items-center gap-2'><ShoppingCart className="w-5 h-5"/> Seu Pedido</span>
                                <span className="text-sm font-normal text-muted-foreground">({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {cart.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Itens do Carrinho */}
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                                            <div className='flex items-center gap-2'>
                                                <Button 
                                                    size="icon" 
                                                    variant="outline" 
                                                    className="w-6 h-6 p-0 text-red-500 border-red-500 hover:bg-red-50"
                                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                >
                                                    {item.quantity === 1 ? <Trash2 className='h-3 w-3'/> : <Minus className='h-3 w-3'/>}
                                                </Button>
                                                <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                                                <Button 
                                                    size="icon" 
                                                    variant="outline" 
                                                    className="w-6 h-6 p-0 text-green-500 border-green-500 hover:bg-green-50"
                                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className='h-3 w-3'/>
                                                </Button>
                                                <div className='pl-2'>
                                                     <p className='text-sm font-medium leading-tight'>{item.name}</p>
                                                     <p className='text-xs text-muted-foreground'>{formatCurrency(item.price)} cada</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-sm text-gray-800">{formatCurrency(item.subtotal)}</span>
                                        </div>
                                    ))}

                                    {/* Detalhes do Total */}
                                    <div className="pt-3 space-y-2 border-t mt-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Taxa de Entrega</span>
                                            <span>{formatCurrency(deliveryFee)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-primary pt-1">
                                            <span>Total</span>
                                            <span>{formatCurrency(total)}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                                        Finalizar Pedido ({formatCurrency(total)})
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-muted-foreground mx-auto mb-2"/>
                                    <p className="text-muted-foreground text-sm">Seu carrinho está vazio. Adicione itens do menu!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}