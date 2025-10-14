// src/hooks/useDeliveries.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Definição de tipo base (para estabilidade do TypeScript)
type Delivery = {
    id: number | string;
    status: 'delivered' | 'cancelled' | 'pending' | 'in_transit';
    earnings: number;
    deliveredAt: string; // Data de conclusão
    createdAt: string; // Data de criação
    customerName?: string;
    restaurant?: string;
};

const STORAGE_KEY = '@rota_expressa:deliveries';

// Dados de Simulação
const now = new Date();
const INITIAL_MOCK_DELIVERIES: Delivery[] = [
    { id: 101, status: 'in_transit', earnings: 18.50, deliveredAt: '', createdAt: now.toISOString(), customerName: 'Ana', restaurant: 'Restaurante A' },
    { id: 102, status: 'pending', earnings: 25.00, deliveredAt: '', createdAt: now.toISOString(), customerName: 'Bruno', restaurant: 'Restaurante B' },
    { id: 103, status: 'delivered', earnings: 14.75, deliveredAt: new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString(), createdAt: now.toISOString(), customerName: 'Carlos', restaurant: 'Restaurante C' },
    { id: 104, status: 'delivered', earnings: 32.20, deliveredAt: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(), createdAt: now.toISOString(), customerName: 'Daniela', restaurant: 'Restaurante A' },
];

const getInitialState = (initial: Delivery[] = []): Delivery[] => {
    if (typeof window !== 'undefined') {
        try {
            const storedValue = window.localStorage.getItem(STORAGE_KEY);
            return storedValue ? JSON.parse(storedValue) : INITIAL_MOCK_DELIVERIES;
        } catch (error) {
            console.error("Erro ao ler dados iniciais do localStorage:", error);
        }
    }
    return initial;
};

const getStartDate = (filter: string): Date | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'all') return null;

    const startDate = new Date(today);

    if (filter === 'today') {
        return startDate;
    } else if (filter === 'week') {
        startDate.setDate(today.getDate() - 7); 
    } else if (filter === 'month') {
        startDate.setDate(today.getDate() - 30); 
    }
    
    return startDate;
};

export function useDeliveries(initialDeliveries: Delivery[] = []) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => getInitialState(initialDeliveries));

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
        } catch (error) {
            console.error("Erro ao salvar dados no localStorage:", error);
        }
    }
  }, [deliveries]);

  // Funções que o RunsPage espera
  const addDelivery = useCallback((newDelivery: Delivery) => {
    setDeliveries((prev) => [...prev, newDelivery]);
  }, []);

  const confirmDelivery = useCallback((deliveryId: number | string) => { 
    setDeliveries((prev) => 
      prev.map((delivery) =>
        delivery.id === deliveryId 
            ? { ...delivery, status: 'delivered', deliveredAt: new Date().toISOString() } 
            : delivery
      )
    );
  }, []);

  // Arrays que o RunsPage espera
  const activeDeliveries = useMemo(() => 
    deliveries.filter(d => d.status === 'in_transit' || d.status === 'pending')
  , [deliveries]);

  const historicDeliveries = useMemo(() => 
    deliveries.filter(d => d.status === 'delivered' || d.status === 'cancelled')
  , [deliveries]);

  const getFilteredDeliveries = useCallback((filterPeriod: 'today' | 'week' | 'month' | 'all'): Delivery[] => {
      const startDate = getStartDate(filterPeriod);

      return historicDeliveries.filter(delivery => {
          if (delivery.status !== 'delivered') return false;
          if (!startDate) return true; 

          const deliveryDate = new Date(delivery.deliveredAt || delivery.createdAt);
          
          return deliveryDate >= startDate;
      });
  }, [historicDeliveries]); 

  return { 
    deliveries, 
    addDelivery, 
    confirmDelivery,
    activeDeliveries,
    historicDeliveries,
    getFilteredDeliveries,
  };
}