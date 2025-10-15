// src/app/dashboard/menu/menu-page-ui.tsx
'use client';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { MenuItemDialog } from "@/components/dashboard/menu-item-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";

interface MenuPageProps {
    menuItems: MenuItem[]; // Agora obrigatório
    onSaveItem: (item: MenuItem) => void;
    onDeleteItem: (itemId: string) => void;
}

export default function MenuPageUI({ menuItems, onSaveItem, onDeleteItem }: MenuPageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);
    const [itemToDelete, setItemToDelete] = useState<MenuItem | undefined>(undefined);

    const handleOpenDialog = (item?: MenuItem) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedItem(undefined);
    };

    const handleSave = (item: MenuItem) => {
        onSaveItem(item); // Chama a função passada pelo pai
        handleCloseDialog();
    };
    
    return (
        <div className="flex flex-col gap-8 p-4 container">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                        <BookOpen />
                        Meu Cardápio
                    </h1>
                    <p className="text-muted-foreground mt-1">Gerencie os itens disponíveis em seu restaurante.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2"/>
                    Adicionar Novo Item
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {menuItems.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader className="p-0 relative">
                             <div className="absolute top-2 right-2 z-10">
                                 <AlertDialog>
                                     <DropdownMenu>
                                         <DropdownMenuTrigger asChild>
                                             <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/70 hover:bg-background">
                                                 <MoreHorizontal className="h-4 w-4" />
                                             </Button>
                                         </DropdownMenuTrigger>
                                         <DropdownMenuContent align="end">
                                             <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="gap-2"><Edit/> Editar</DropdownMenuItem>
                                             <AlertDialogTrigger asChild>
                                                 <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive gap-2" onClick={() => setItemToDelete(item)}>
                                                    <Trash2 /> Remover
                                                 </DropdownMenuItem>
                                             </AlertDialogTrigger>
                                         </DropdownMenuContent>
                                     </DropdownMenu>
                                     {itemToDelete?.id === item.id && (
                                     <AlertDialogContent>
                                         <AlertDialogHeader>
                                         <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                         <AlertDialogDescription>
                                             Essa ação não pode ser desfeita. Isso irá remover permanentemente o item "{item.name}" do seu cardápio.
                                         </AlertDialogDescription>
                                         </AlertDialogHeader>
                                         <AlertDialogFooter>
                                         <AlertDialogCancel onClick={() => setItemToDelete(undefined)}>Cancelar</AlertDialogCancel>
                                         <AlertDialogAction onClick={() => onDeleteItem(item.id)} className="bg-destructive hover:bg-destructive/90">Remover</AlertDialogAction>
                                         </AlertDialogFooter>
                                     </AlertDialogContent>
                                     )}
                                 </AlertDialog>
                             </div>
                             <div className="aspect-video w-full relative overflow-hidden rounded-t-lg">
                                 <Image
                                     // Lógica de fallback: se não tiver URL, usa o placeholder "Sem Foto"
                                     src={item.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=Sem+Foto'}
                                     alt={item.name}
                                     fill
                                     className="object-cover"
                                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                 />
                             </div>
                         </CardHeader>
                         <CardContent className="p-4 flex-1">
                             <Badge variant="outline" className="mb-2">{item.category}</Badge>
                             <h3 className="font-headline font-semibold">{item.name}</h3>
                             <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                         </CardContent>
                         <CardFooter className="p-4 pt-0">
                             <p className="w-full text-lg font-bold text-primary">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                         </CardFooter>
                     </Card>
                 ))}
            </div>

            <MenuItemDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                item={selectedItem}
                onSave={handleSave} 
            />
        </div>
    );
}