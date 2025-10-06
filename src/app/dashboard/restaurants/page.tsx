'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Utensils, Search, Star, SlidersHorizontal, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const restaurants = [
    { name: 'Pizzaria Delícia', rating: 4.5, category: 'Pizza', deliveryTime: '25-35 min', logo: 'https://logo.clearbit.com/pizzahut.com', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },
    { name: 'Burger Queen', rating: 4.8, category: 'Lanches', deliveryTime: '20-30 min', logo: 'https://logo.clearbit.com/burgerking.com', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', href: '#' },
    { name: 'Sushi House', rating: 4.9, category: 'Japonesa', deliveryTime: '35-45 min', logo: 'https://logo.clearbit.com/sushiya.jp', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop', href: '#' },
    { name: 'Cantina Italiana', rating: 4.7, category: 'Italiana', deliveryTime: '30-40 min', logo: 'https://logo.clearbit.com/olivegarden.com', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2070&auto=format&fit=crop', href: '#' },
    { name: 'Frango Assado Express', rating: 4.6, category: 'Brasileira', deliveryTime: '40-50 min', logo: 'https://logo.clearbit.com/kfc.com', image: 'https://images.unsplash.com/photo-1598515213692-5f2841f45b64?q=80&w=2070&auto=format&fit=crop', href: '#' },
    { name: 'Açaí Power', rating: 4.9, category: 'Açaí', deliveryTime: '15-25 min', logo: 'https://logo.clearbit.com/jamba.com', image: 'https://images.unsplash.com/photo-1619597548318-65c320152553?q=80&w=1974&auto=format&fit=crop', href: '#' },
]

export default function RestaurantsPage() {
    return (
        <div className="flex flex-col gap-8 p-4 container">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                    <Utensils />
                    Restaurantes
                </h1>
                <p className="text-muted-foreground mt-1">Explore os melhores lugares para pedir sua próxima refeição.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input placeholder="Buscar por nome do restaurante..." className="pl-10 h-12 text-base" />
                </div>
                <Button variant="outline" className="h-12">
                    <SlidersHorizontal className="mr-2" />
                    Filtros
                </Button>
                 <Button className="h-12">
                    <MapPin className="mr-2" />
                    Ver no Mapa
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map(r => (
                    <Link key={r.name} href={`${r.href}?role=client`} className="group">
                        <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                            <div className="relative h-40 w-full">
                                <Image 
                                    src={r.image}
                                    alt={r.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-4 flex-1 flex flex-col">
                                <h3 className="font-headline font-semibold text-lg">{r.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {r.rating} <span>•</span> {r.category}
                                </div>
                                <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{r.deliveryTime}</span>
                                     <div className="flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Fazer Pedido <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
