// src/app/dashboard/menu/page.tsx
'use client'; 

import { useState } from 'react';
// Importação corrigida: usa o caminho relativo './'
import MenuPageUI from './menu-page-ui'; 
import type { MenuItem } from "@/lib/types"; // Mantenha sua importação de tipos

// DADOS INICIAIS (Simulação de itens já existentes)
const initialMenuItems: MenuItem[] = [
    { id: '1', name: 'Pizza Margherita', description: 'Molho de tomate, mussarela e manjericão.', price: 45.00, category: 'Pizzas Salgadas', imageUrl: 'https://placehold.co/600x400/22d3ee/FFFFFF?text=Item+Inicial' },
    { id: '2', name: 'Lasanha de Bolonhesa', description: 'Receita tradicional italiana.', price: 32.50, category: 'Massas', imageUrl: '' },
];

export default function MenuParentPage() {
    // ESTADO: Armazena a lista atual de itens do menu
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

    // FUNÇÃO PARA SALVAR/EDITAR UM ITEM
    const handleSaveItem = (newItem: MenuItem) => {
        // Se o item já tem ID, é EDIÇÃO
        if (newItem.id) {
            setMenuItems(prevItems =>
                prevItems.map(item => 
                    (item.id === newItem.id ? newItem : item)
                )
            );
        } else {
            // Se for CRIAÇÃO, adiciona um ID e insere no array
            const itemWithId = { ...newItem, id: Date.now().toString() }; 
            setMenuItems(prevItems => [...prevItems, itemWithId]);
        }
    };

    // FUNÇÃO PARA DELETAR UM ITEM
    const handleDeleteItem = (itemId: string) => {
        setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    return (
        <MenuPageUI
            menuItems={menuItems}          // Passa a lista atualizada
            onSaveItem={handleSaveItem}    // Passa a função de salvar
            onDeleteItem={handleDeleteItem} // Passa a função de exclusão
        />
    );
}