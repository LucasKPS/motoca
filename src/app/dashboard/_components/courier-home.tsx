'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bike, Gift, Pizza, ShoppingBasket, Star, TrendingUp } from "lucide-react";
import CategoryCard from "@/components/dashboard/category-card";
import Image from "next/image";

export default function CourierHome({ name = "Entregador" }: { name?: string }) {
  return (
    <div className="flex flex-col gap-10 container py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground">Bem-vindo de volta,</p>
                <h1 className="text-3xl font-extrabold font-headline text-foreground tracking-tight">{name}</h1>
            </div>
            
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3">
                <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></div>
                Online
            </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Corridas */}
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
                    Corridas do Dia
                    <Bike className="text-primary w-5 h-5" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-extrabold text-foreground">5</p>
                <p className="text-sm text-green-600 font-medium mt-1">+2 desde ontem</p>
            </CardContent>
        </Card>
        {/* Card Ganhos */}
        <Card className="border-2 border-primary/50 bg-primary/5 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-primary font-bold">
                    Ganhos do Dia (Foco)
                    <TrendingUp className="text-primary w-5 h-5" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-extrabold text-primary">R$ 47,50</p>
                <p className="text-sm text-green-600 font-medium mt-1">+15% vs semana passada</p>
            </CardContent>
        </Card>
        {/* Card Avaliação */}
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
                    Sua Avaliação
                    <Star className="text-yellow-500 w-5 h-5" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-extrabold flex items-center text-foreground">
                    4.9 <Star className="w-6 h-6 ml-2 text-yellow-500 fill-yellow-500"/>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Baseado nas últimas 50 corridas</p>
            </CardContent>
        </Card>
      </div>
      
      {/* Promo Banner */}
      <Card className="bg-primary/90 text-primary-foreground flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl rounded-xl">
        <CardContent className="p-6 md:p-8 flex-1">
            <h2 className="font-headline font-extrabold text-3xl tracking-tight">Ganhe mais nos horários de pico! 🚀</h2>
            <p className="mt-3 max-w-lg text-sm md:text-base opacity-90">Aproveite as taxas dinâmicas durante o **almoço (11h-14h)** e **jantar (19h-21h)** para aumentar seus ganhos.</p>
            <Button variant="default" className="mt-5 bg-white text-primary hover:bg-gray-100 font-bold shadow-md">
                Ver Zonas de Alta Demanda <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </CardContent>
        <div className="w-full md:w-1/3 h-40 md:h-full relative overflow-hidden">
            <Image 
                src="https://placehold.co/300x150/ffffff/000000?text=GR%C3%81FICO" 
                alt="Gráfico de ganhos ou mapa de calor"
                fill
                className="object-cover md:object-contain md:p-4"
                sizes="(max-width: 768px) 100vw, 33vw"
            />
        </div>
      </Card>

      {/* Categories */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold font-headline mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <CategoryCard icon={Pizza} label="Restaurantes" />
            <CategoryCard icon={ShoppingBasket} label="Mercados" />
            <CategoryCard icon={Gift} label="Promoções" />
            <CategoryCard icon={Bike} label="Retiradas" />
        </div>
      </div>
      
      {/* A parte dos parceiros foi removida daqui. */}
    </div>
  );
}