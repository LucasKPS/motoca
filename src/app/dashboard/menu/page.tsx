// src/app/dashboard/menu/page.tsx
'use client'; 

import { useState, useEffect } from 'react'; // Importamos 'useEffect'
import MenuPageUI from './menu-page-ui'; 
import type { MenuItem } from "@/lib/types"; 

// 1. Chave de identificação no LocalStorage
const STORAGE_KEY = 'menu_items_motoca';

// Itens Padrão (Fallback)
const FALLBACK_ITEMS: MenuItem[] = [
    { id: '1', name: 'Sanduíche Básico', description: 'Pão, queijo e presunto', price: 15.00, category: 'Lanches', imageUrl: '' },
];

export default function MenuParentPage() {
    // 2. Inicialização do Estado (Carregamento do localStorage)
    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        // Verifica se está rodando no navegador antes de tentar acessar 'window'
        if (typeof window !== 'undefined') { 
            const storedItems = localStorage.getItem(STORAGE_KEY);
            if (storedItems) {
                // Se houver dados salvos, retorna eles
                return JSON.parse(storedItems) as MenuItem[];
            }
        }
        // Se não houver dados ou não estiver no navegador, retorna os padrões
        return FALLBACK_ITEMS; 
    });


    // 3. Efeito Lateral (Persistência/Salvamento)
    // Roda toda vez que o array 'menuItems' é atualizado (depois de salvar, editar ou deletar)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Salva a lista atual no localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems));
        }
    }, [menuItems]); // Dependência: A função roda quando 'menuItems' muda


    // FUNÇÃO PARA SALVAR/EDITAR UM ITEM (Chamada pelo Modal)
    const handleSaveItem = (newItem: MenuItem) => {
        if (newItem.id) {
            // Edição: Mapeia e substitui o item
            setMenuItems(prevItems =>
                prevItems.map(item => 
                    (item.id === newItem.id ? newItem : item)
                )
            );
        } else {
            // Criação: Adiciona novo ID e insere
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
            menuItems={menuItems}
            onSaveItem={handleSaveItem}
            onDeleteItem={handleDeleteItem}
        />
    );
}