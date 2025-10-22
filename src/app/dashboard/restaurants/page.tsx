'use client'
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
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
import { ArrowRight, Utensils, Search, Star, SlidersHorizontal, MapPin, Clock, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/lib/types";

const INITIAL_RESTAURANTS_DATA = [
    { id: 'pizzaria-delicia', name: 'Pizzaria Delícia', category: 'Pizza', deliveryTime: '25-35 min', logo: 'https://logo.clearbit.com/pizzahut.com', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', href: '/dashboard/order', address: 'Rua das Flores, 123' },
    { id: 'burger-queen', name: 'Burger Queen', category: 'Lanches', deliveryTime: '20-30 min', logo: 'https://logo.clearbit.com/burgerking.com', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', href: '/dashboard/order', address: 'Avenida Principal, 456' },
]

const CATEGORIES = [...new Set(INITIAL_RESTAURANTS_DATA.map(r => r.category))];

export default function RestaurantsPage() {
    const searchParams = useSearchParams();
    const initialSearchTerm = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category');
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [ratingFilter, setRatingFilter] = useState(0);
    const [tempRating, setTempRating] = useState(ratingFilter);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
    const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS_DATA.map(r => ({ ...r, rating: 0 })));
    const [editingRestaurant, setEditingRestaurant] = useState<any>(null);

    useEffect(() => {
        const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedRestaurants = restaurants.map(r => {
            const restaurantOrders = orders.filter(o => o.restaurant === r.name && o.rating);
            const totalRating = restaurantOrders.reduce((acc, o) => acc + (o.rating || 0), 0);
            const averageRating = restaurantOrders.length > 0 ? totalRating / restaurantOrders.length : 0;
            return { ...r, rating: averageRating };
        });
        setRestaurants(updatedRestaurants);
    }, []);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleApplyFilters = () => {
        setRatingFilter(tempRating);
    };

    const handleEditRestaurant = (restaurant: any) => {
        setEditingRestaurant(restaurant);
    };

    const handleSaveRestaurant = () => {
        if (!editingRestaurant) return;
        setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? editingRestaurant : r));
        setEditingRestaurant(null);
    };

    const filteredRestaurants = restaurants.filter(r =>
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        r.rating >= ratingFilter &&
        (selectedCategories.length === 0 || selectedCategories.includes(r.category))
    );

    return (
        <div className="flex flex-col gap-10 p-4 container max-w-7xl mx-auto">

            {/* ... (código do header e filtros) ... */}

            {/* Lista de Restaurantes em Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRestaurants.map(r => (
                    <Card key={r.id} className="overflow-visible h-full flex flex-col rounded-xl shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 ease-in-out border border-gray-100 hover:border-primary/50">
                        <div className="relative h-40 w-full mb-8">
                            <Image src={r.image} alt={r.name} layout='fill' className="object-cover rounded-t-xl" />
                            <div className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                <Clock className="w-3 h-3 text-primary" />
                                {r.deliveryTime}
                            </div>
                            <div className="absolute bottom-0 left-4 translate-y-1/2 rounded-xl border-2 border-white shadow-lg bg-white p-1">
                                <Image src={r.logo} alt={`${r.name} Logo`} width={56} height={56} className="object-contain" />
                            </div>
                        </div>
                        <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                            <h3 className="font-extrabold text-xl text-gray-900 truncate mb-2">{r.name}</h3>
                            <div className="flex items-center text-sm gap-3 text-gray-500 pb-2 border-b border-gray-50">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="font-bold text-gray-700">{r.rating.toFixed(1)}</span>
                                </div>
                                <span className='text-xs'>•</span>
                                <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded text-xs">{r.category}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.address}</a>
                            </div>
                            <div className="mt-auto pt-4 flex items-center justify-between">
                                <Link href={`${r.href}?id=${r.id}&role=client`} className="flex items-center gap-1 text-primary font-bold text-base">
                                    Pedir Agora
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => handleEditRestaurant(r)}><Edit className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal de Edição */}
            <Dialog open={!!editingRestaurant} onOpenChange={() => setEditingRestaurant(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Restaurante</DialogTitle>
                    </DialogHeader>
                    {editingRestaurant && (
                        <div className="grid gap-4 py-4">
                            <Input value={editingRestaurant.name} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })} placeholder="Nome" />
                            <Input value={editingRestaurant.address} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, address: e.target.value })} placeholder="Endereço" />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingRestaurant(null)}>Cancelar</Button>
                        <Button onClick={handleSaveRestaurant}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
