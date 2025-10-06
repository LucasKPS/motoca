'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MinusCircle, PlusCircle, ArrowLeft, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
    { name: 'Pizza Margherita', description: 'Molho de tomate, mussarela e manjericão', price: 35.00 },
    { name: 'Pizza Calabresa', description: 'Molho de tomate, mussarela, calabresa e cebola', price: 38.00 },
    { name: 'Pizza Portuguesa', description: 'Molho, mussarela, presunto, ovo, cebola e azeitona', price: 42.00 },
    { name: 'Refrigerante 2L', description: 'Coca-Cola, Guaraná ou Fanta', price: 10.00 },
    { name: 'Água sem gás', description: 'Garrafa de 500ml', price: 4.00 },
]

export default function OrderPage({ onCreateOrder = () => {} }: { onCreateOrder?: () => void }) {

    const cartTotal = 73.00; // Simulação
    const deliveryFee = 5.99;
    
  return (
    <div className="flex flex-col gap-8 p-4 container">
      <div className="relative h-48 md:h-64 w-full rounded-lg overflow-hidden">
        <Image 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
            alt="Pizzaria"
            fill
            className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-white">Pizzaria Delícia</h1>
            <div className="flex items-center text-sm text-white/90 gap-4 mt-2">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.5 (200+)
                </div>
                 <span>•</span>
                 <span>Pizza</span>
                 <span>•</span>
                <span>25-35 min</span>
            </div>
        </div>
        <Button asChild variant="outline" size="icon" className="absolute top-4 left-4 bg-background/80 hover:bg-background">
            <Link href="/dashboard/restaurants?role=client"><ArrowLeft /></Link>
        </Button>
      </div>

     <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 flex flex-col gap-6">
            <h2 className="text-2xl font-headline font-semibold">Cardápio</h2>
            {menuItems.map(item => (
                <Card key={item.name} className="flex items-center">
                    <CardContent className="p-4 flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="font-semibold mt-2">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </CardContent>
                    <CardFooter className="p-4">
                        <Button variant="outline" size="icon"><PlusCircle className="w-5 h-5 text-primary" /></Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

        <div className="md:col-span-1 sticky top-24">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <ShoppingCart />
                        Seu Pedido
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="w-6 h-6"><MinusCircle className="text-muted-foreground"/></Button>
                            <span className="font-bold">1</span>
                             <Button variant="ghost" size="icon" className="w-6 h-6"><PlusCircle className="text-primary"/></Button>
                        </div>
                        <p className="flex-1 ml-2">Pizza Margherita</p>
                        <p>{(35.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" className="w-6 h-6"><MinusCircle className="text-muted-foreground"/></Button>
                            <span className="font-bold">1</span>
                             <Button variant="ghost" size="icon" className="w-6 h-6"><PlusCircle className="text-primary"/></Button>
                        </div>
                        <p className="flex-1 ml-2">Pizza Calabresa</p>
                        <p>{(38.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>

                    <Separator />

                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Taxa de entrega</p>
                            <p>{deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                         <div className="flex justify-between font-bold text-base">
                            <p>Total</p>
                            <p>{(cartTotal + deliveryFee).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={onCreateOrder}>Finalizar Pedido</Button>
                </CardFooter>
            </Card>
        </div>
     </div>

    </div>
  );
}
