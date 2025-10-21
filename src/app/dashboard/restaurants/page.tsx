'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Utensils, Search, Star, SlidersHorizontal, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const RESTAURANTS_DATA = [
    // PIZZARIA DELÍCIA
    { id: 'pizzaria-delicia', name: 'Pizzaria Delícia', rating: 4.5, category: 'Pizza', deliveryTime: '25-35 min', logo: 'https://logo.clearbit.com/pizzahut.com', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },
    // BURGER QUEEN
    { id: 'burger-queen', name: 'Burger Queen', rating: 4.8, category: 'Lanches', deliveryTime: '20-30 min', logo: 'https://logo.clearbit.com/burgerking.com', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', href: '/dashboard/order' },
    // SUSHI MASTER
    { id: 'sushi-master', name: 'Sushi Master', rating: 4.9, category: 'Japonês', deliveryTime: '30-45 min', logo: 'https://logo.clearbit.com/sushijin.com', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },
    // PASTA LA VISTA
    { id: 'pasta-la-vista', name: 'Pasta La Vista', rating: 4.3, category: 'Italiano', deliveryTime: '35-50 min', logo: 'https://logo.clearbit.com/olivegarden.com', image: 'https://images.unsplash.com/photo-1621996346565-e326b20f545c?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order' },

]

export default function RestaurantsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [tempRating, setTempRating] = useState(ratingFilter);

    const handleApplyFilters = () => {
        setRatingFilter(tempRating);
    };

    const filteredRestaurants = RESTAURANTS_DATA.filter(r =>
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        r.rating >= ratingFilter
    );

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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome do restaurante ou categoria..."
                        className="pl-12 h-14 text-base rounded-xl border-2 shadow-sm focus:border-primary transition-colors"
                    />
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-14 px-6 border-2 font-semibold text-gray-700 hover:bg-primary/10 transition-colors rounded-xl"
                        >
                            <SlidersHorizontal className="mr-2 h-5 w-5" />
                            Filtros
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Filtros Avançados</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="flex flex-col gap-3">
                                <label htmlFor="rating" className="text-base font-semibold">Avaliação Mínima</label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        id="rating"
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        value={[tempRating]}
                                        onValueChange={(value) => setTempRating(value[0])}
                                        className="w-full"
                                    />
                                    <span className="font-bold text-lg text-primary w-16 text-center">{tempRating.toFixed(1)} ★</span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" onClick={handleApplyFilters}>Aplicar Filtros</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button
                    className="h-14 px-6 bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg shadow-primary/30 transition-shadow rounded-xl"
                >
                    <MapPin className="mr-2 h-5 w-5" />
                    Ver no Mapa
                </Button>
            </div>

            <hr className='border-gray-100' />

            {/* Lista de Restaurantes em Grid */}
            {filteredRestaurants.length === 0 ? (
                <div className="text-center py-10">
                     <p className="text-xl text-gray-500">Nenhum restaurante encontrado.</p>
                     {searchTerm && <p className="text-lg text-gray-400">Tente ajustar sua busca ou filtros.</p>}
                </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRestaurants.map(r => (
                    <Link key={r.id} href={`${r.href}?id=${r.id}&role=client`} className="group block h-full">
                        <Card className="overflow-visible h-full flex flex-col rounded-xl shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 ease-in-out border border-gray-100 hover:border-primary/50">

                            {/* Imagem de Capa e Logo (Área Crítica) */}
                            <div className="relative h-40 w-full mb-8"> {/* Adicionamos mb-8 para criar espaço no fluxo */}
                                <Image
                                    src={r.image}
                                    alt={r.name}
                                    fill
                                    className="object-cover rounded-t-xl transition-transform group-hover:scale-105"
                                />

                                {/* Tag de Tempo de Entrega */}
                                <div className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <Clock className="w-3 h-3 text-primary" />
                                    {r.deliveryTime}
                                </div>

                                {/* Logo do Restaurante: Posicionado 50% para baixo da imagem e 50% para cima do conteúdo */}
                                <div className="absolute bottom-0 left-4 translate-y-1/2 rounded-xl border-2 border-white shadow-lg bg-white p-1">
                                    <Image
                                        src={r.logo}
                                        alt={`${r.name} Logo`}
                                        width={56}
                                        height={56}
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Conteúdo do Card - Sem padding-top, pois o mb-8 já empurrou tudo */}
                            <CardContent className="p-4 pt-0 flex-1 flex flex-col">

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
            )}
        </div>
    );
}
