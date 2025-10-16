'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Utensils, Search, Star, SlidersHorizontal, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const restaurants = [
    // PIZZARIA DELÍCIA (URLs REVISADAS)
    { id: 'pizzaria-delicia', name: 'Pizzaria Delícia', rating: 4.5, category: 'Pizza', deliveryTime: '25-35 min', logo: 'https://images.unsplash.com/photo-1621332768593-0104e17e8878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTR8MHwxfGFsbHwxfHx8fHx8fHwxNzAzNDQzNzc0fA&ixlib=rb-4.0.3&q=80&w=1080', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },
    // BURGER QUEEN (URLs REVISADAS)
    { id: 'burger-queen', name: 'Burger Queen', rating: 4.8, category: 'Lanches', deliveryTime: '20-30 min', logo: 'https://images.unsplash.com/photo-1621332768593-0104e17e8878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTQ1fDB8MXxjb2xsZWN0aW9uLXRodW1ifDEzMjY2MTJ8MjE0NjU1Nnw4NDA0MTI0NjUz?ixlib=rb-4.0.3&q=80&w=1080', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', href: '/dashboard/order' },
    // SUSHI HOUSE (URLs REVISADAS)
    { id: 'sushi-house', name: 'Sushi House', rating: 4.9, category: 'Japonesa', deliveryTime: '35-45 min', logo: 'https://images.unsplash.com/photo-1621332768593-0104e17e8878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTQ1fDB8MXxjb2xsZWN0aW9uLXRodW1ifDE0Njc1NTM2fDI1NjYxMXw4NDA0MTI0NjUz?ixlib=rb-4.0.3&q=80&w=1080', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },
    // CANTINA ITALIANA (URLs REVISADAS)
    { id: 'cantina-italiana', name: 'Cantina Italiana', rating: 4.7, category: 'Italiana', deliveryTime: '30-40 min', logo: 'https://images.unsplash.com/photo-1621332768593-0104e17e8878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTQ1fDB8MXxjb2xsZWN0aW9uLXRodW1ifDQ1NzQ5MTB8MjE0NjU1Nnw4NDA0MTI0NjUz?ixlib=rb-4.0.3&q=80&w=1080', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },
    // FRANGO ASSADO EXPRESS (URLs REVISADAS)
    { id: 'frango-assado', name: 'Frango Assado Express', rating: 4.6, category: 'Brasileira', deliveryTime: '40-50 min', logo: 'https://images.unsplash.com/photo-1621332768593-0104e17e8878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTQ1fDB8MXxjb2xsZWN0aW9uLXRodW1ifDg0NTM2NDZ8MjE0NjU1Nnw4NDA0MTI0NjUz?ixlib=rb-4.0.3&q=80&w=1080', image: 'https://images.unsplash.com/photo-1598515213692-5f2841f45b64?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },
    // AÇAÍ POWER (URLs REVISADAS)
    { id: 'acai-power', name: 'Açaí Power', rating: 4.9, category: 'Açaí', deliveryTime: '15-25 min', logo: 'https://images.unsplash.com/photo-1621332768593-0104e17e8878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTQ1fDB8MXxjb2xsZWN0aW9uLXRodW1ifDI0OTAzNjYzfDIxNDY1NTZ8ODQwNDEyNDY1Mw?ixlib=rb-4.0.3&q=80&w=1080', image: 'https://images.unsplash.com/photo-1619597548318-65c320152553?q=80&w=1974&auto=format&fit=crop', href: '/dashboard/order' },
]

export default function RestaurantsPage() {
    // ... (Restante do código HTML/JSX mantido da Versão 3.0 anterior)
    return (
        <div className="flex flex-col gap-10 p-4 container max-w-7xl mx-auto">
            
            {/* Título Principal e Header */}
            <div className="flex flex-col gap-2 pt-4">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Utensils className="w-8 h-8 text-primary"/>
                    Encontre Seu Restaurante
                </h1>
                <p className="text-lg text-muted-foreground">
                    Milhares de opções deliciosas esperam por você.
                </p>
            </div>

            {/* Barra de Busca e Ações */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                        placeholder="Buscar por nome do restaurante..." 
                        className="pl-12 h-14 text-base rounded-xl border-2 shadow-sm focus:border-primary transition-colors" 
                    />
                </div>
                
                <Button 
                    variant="outline" 
                    className="h-14 px-6 border-2 font-semibold text-gray-700 hover:bg-primary/10 transition-colors rounded-xl"
                >
                    <SlidersHorizontal className="mr-2 h-5 w-5" />
                    Filtros
                </Button>
                
                <Button 
                    className="h-14 px-6 bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg shadow-primary/30 transition-shadow rounded-xl"
                >
                    <MapPin className="mr-2 h-5 w-5" />
                    Ver no Mapa
                </Button>
            </div>
            
            <hr className='border-gray-100' />

            {/* Lista de Restaurantes em Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {restaurants.map(r => (
                    <Link key={r.id} href={`${r.href}?id=${r.id}&role=client`} className="group block h-full">
                        <Card className="overflow-hidden h-full flex flex-col rounded-xl shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 ease-in-out border border-gray-100 hover:border-primary/50">
                            
                            {/* Imagem de Capa e Tags */}
                            <div className="relative h-40 w-full"> 
                                <Image 
                                    src={r.image}
                                    alt={r.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />

                                {/* Tag de Tempo de Entrega */}
                                <div className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <Clock className="w-3 h-3 text-primary" />
                                    {r.deliveryTime}
                                </div>

                                {/* Logo do Restaurante (Posicionamento mais discreto) */}
                                <Image 
                                    src={r.logo}
                                    alt={`${r.name} Logo`}
                                    width={56}
                                    height={56}
                                    className="absolute bottom-[-28px] left-4 rounded-xl border-2 border-white shadow-lg object-contain bg-white p-1"
                                />
                            </div>
                            
                            {/* Conteúdo do Card */}
                            <CardContent className="p-4 pt-10 flex-1 flex flex-col">
                                
                                <h3 className="font-extrabold text-xl text-gray-900 truncate mb-2">
                                    {r.name}
                                </h3>
                                
                                {/* Detalhes: Categoria e Avaliação */}
                                <div className="flex items-center text-sm gap-3 text-gray-500 pb-2 border-b border-gray-50">
                                    {/* Avaliação */}
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 
                                        <span className="font-bold text-gray-700">{r.rating}</span> 
                                    </div>
                                    
                                    <span className='text-xs'>•</span> 
                                    
                                    {/* Categoria (Tag) */}
                                    <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded text-xs">
                                        {r.category}
                                    </span>
                                </div>
                                
                                {/* Ação: Fazer Pedido (ocupa o espaço restante) */}
                                <div className="mt-4 pt-2 flex items-center justify-start text-sm">
                                    <div className="flex items-center gap-1 text-primary font-bold text-base transition-all opacity-0 group-hover:opacity-100 group-hover:gap-2">
                                        Pedir Agora 
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
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