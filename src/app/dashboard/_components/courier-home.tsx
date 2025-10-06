'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bike, Gift, Pizza, ShoppingBasket, Star, TrendingUp } from "lucide-react";
import CategoryCard from "@/components/dashboard/category-card";
import Image from "next/image";

export default function CourierHome({ name }: { name?: string }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground">Bem-vindo de volta,</p>
                <h1 className="text-2xl font-bold font-headline text-foreground">{name}</h1>
            </div>
             <div className="flex items-center gap-2 p-2 rounded-full border bg-card">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600">Online</span>
            </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Corridas do Dia
                    <Bike className="text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">+2 desde ontem</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Ganhos do Dia
                    <TrendingUp className="text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">R$ 47,50</p>
                <p className="text-xs text-muted-foreground">+15% vs semana passada</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Sua Avaliação
                    <Star className="text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold flex items-center">4.9 <Star className="w-5 h-5 ml-1 text-amber-400 fill-amber-400"/></p>
                <p className="text-xs text-muted-foreground">Baseado nas últimas 50 corridas</p>
            </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <CategoryCard icon={Pizza} label="Restaurantes" />
            <CategoryCard icon={ShoppingBasket} label="Mercados" />
            <CategoryCard icon={Gift} label="Promoções" />
            <CategoryCard icon={Bike} label="Retiradas" />
        </div>
      </div>
      
      {/* Promo Banner */}
      <Card className="bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between overflow-hidden">
        <CardContent className="p-6">
            <h2 className="font-headline font-bold text-2xl">Ganhe mais nos horários de pico!</h2>
            <p className="mt-2 max-w-sm">Aproveite as taxas dinâmicas durante o almoço (11h-14h) e jantar (19h-21h) para aumentar seus ganhos.</p>
            <Button variant="secondary" className="mt-4">
                Ver Zonas de Alta Demanda <ArrowRight className="ml-2" />
            </Button>
        </CardContent>
        <div className="w-full md:w-1/3 h-32 md:h-full relative">
            <Image 
                src="https://images.unsplash.com/photo-1579751626652-3a5518bf322b?q=80&w=2070&auto=format&fit=crop"
                alt="Delivery driver on a scooter"
                fill
                className="object-cover"
            />
        </div>
      </Card>

      {/* Partner Restaurants */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-headline">Principais Parceiros</h3>
            <Button variant="link" className="text-primary pr-0">Ver todos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['McDonalds', 'Burger King', 'Subway', 'Starbucks'].map(partner => (
                <Card key={partner} className="flex items-center justify-center p-6 hover:shadow-lg transition-shadow">
                    <img src={`https://logo.clearbit.com/${partner.toLowerCase().replace(/\s/g, '')}.com`} alt={partner} className="h-8 object-contain" />
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
