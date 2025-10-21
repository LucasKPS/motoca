'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Gift, Pizza, Search, ShoppingBasket, Soup, Star } from "lucide-react";
import CategoryCard from "@/components/dashboard/category-card";
import Image from "next/image";
import Link from "next/link";

const restaurants = [
    { name: 'Pizzaria Delícia', rating: 4.5, category: 'Pizza', deliveryTime: '25-35 min', logo: 'mcdonalds' },
    { name: 'Burger Queen', rating: 4.8, category: 'Lanches', deliveryTime: '20-30 min', logo: 'burgerking' },
    { name: 'Sushi House', rating: 4.9, category: 'Japonesa', deliveryTime: '35-45 min', logo: 'subway' },
    { name: 'Cantina Italiana', rating: 4.7, category: 'Italiana', deliveryTime: '30-40 min', logo: 'starbucks' },
]

export default function ClientHome({ name }: { name?: string }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div>
            <p className="text-sm text-muted-foreground">Olá,</p>
            <h1 className="text-2xl font-bold font-headline text-foreground">{name}</h1>
            <p className="text-muted-foreground mt-1">O que você gostaria de pedir hoje?</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Buscar por pratos ou restaurantes..." className="pl-10 h-12 text-base" />
      </div>


      {/* Categories */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/dashboard/restaurants?category=Pizza">
              <CategoryCard icon={Pizza} label="Pizza" />
            </Link>
            <Link href="/dashboard/restaurants?category=Lanches">
              <CategoryCard icon={ShoppingBasket} label="Lanches" />
            </Link>
            <Link href="/dashboard/restaurants?category=Brasileira">
              <CategoryCard icon={Soup} label="Brasileira" />
            </Link>
            <Link href="/dashboard/restaurants?category=Promoções">
              <CategoryCard icon={Gift} label="Promoções" />
            </Link>
        </div>
      </div>
      
      {/* Promo Banner */}
      <Card className="bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between overflow-hidden">
        <CardContent className="p-6">
            <h2 className="font-headline font-bold text-2xl">Entrega grátis no seu primeiro pedido!</h2>
            <p className="mt-2 max-w-sm">Use o cupom <span className="font-bold bg-primary-foreground/20 px-2 py-1 rounded-md">PRIMEIRACOMPRA</span> e aproveite.</p>
            <Button variant="secondary" className="mt-4">
                Ver Restaurantes <ArrowRight className="ml-2" />
            </Button>
        </CardContent>
        <div className="w-full md:w-1/3 h-32 md:h-full relative">
            <Image 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"
                alt="Prato de comida"
                fill
                className="object-cover"
            />
        </div>
      </Card>

      {/* Restaurants */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-headline">Restaurantes Populares</h3>
            <Button variant="link" className="text-primary pr-0">Ver todos</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map(r => (
                <Card key={r.name} className="flex items-center gap-4 p-4 hover:shadow-lg transition-shadow cursor-pointer">
                     <img src={`https://logo.clearbit.com/${r.logo.toLowerCase().replace(/\s/g, '')}.com`} alt={r.name} className="h-12 w-12 object-contain rounded-md border p-1" />
                    <div className="flex-1">
                        <h4 className="font-semibold">{r.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                           <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {r.rating} <span>•</span> {r.category} <span>•</span> {r.deliveryTime}
                        </div>
                    </div>
                     <ArrowRight className="text-muted-foreground" />
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
