'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, MoreHorizontal, PlusCircle } from "lucide-react";

const menuItems = [
    { id: 'item-1', name: 'Pizza Margherita', description: 'Molho de tomate, mussarela e manjericão fresco.', price: 45.00, category: 'Pizzas Salgadas' },
    { id: 'item-2', name: 'Pizza Calabresa', description: 'Molho de tomate, mussarela, calabresa e cebola.', price: 48.50, category: 'Pizzas Salgadas' },
    { id: 'item-3', name: 'Pizza Romeu e Julieta', description: 'Mussarela, goiabada e um toque de canela.', price: 52.00, category: 'Pizzas Doces' },
    { id: 'item-4', name: 'Coca-Cola 2L', description: 'Refrigerante Coca-Cola, garrafa de 2 litros.', price: 12.00, category: 'Bebidas' },
    { id: 'item-5', name: 'Água Mineral 500ml', description: 'Água sem gás.', price: 5.00, category: 'Bebidas' },
];


export default function MenuPage() {
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
                <Button>
                    <PlusCircle className="mr-2"/>
                    Adicionar Novo Item
                </Button>
            </div>
            
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead className="text-right">Preço</TableHead>
                                <TableHead className="w-[80px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {menuItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-muted-foreground hidden md:inline">{item.description}</div>
                                    </TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell className="text-right font-medium">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Remover</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}