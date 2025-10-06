'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Children, cloneElement, isValidElement } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './_components/sidebar';
import type { Delivery } from '@/lib/types';
import { deliveries } from '@/lib/data';

const newDeliveryOffers: Delivery[] = [
    {
      id: 'DEL-NEW-009',
      customerName: 'Mariana Oliveira',
      address: 'Avenida Brigadeiro Faria Lima, 4500, São Paulo, SP',
      restaurant: 'Fast Vegan',
      status: 'pending',
      deadline: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
      earnings: 9.80,
    },
    {
      id: 'DEL-NEW-010',
      customerName: 'Ricardo Alves',
      address: 'Rua da Consolação, 2100, São Paulo, SP',
      restaurant: 'Boteco do Chef',
      status: 'pending',
      deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      earnings: 11.20,
    },
    {
      id: 'DEL-NEW-011',
      customerName: 'Juliana Lima',
      address: 'Avenida Rebouças, 3970, São Paulo, SP',
      restaurant: 'Padaria Estrela',
      status: 'pending',
      deadline: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      earnings: 7.50,
    },
];


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [allDeliveries, setAllDeliveries] = useState<Delivery[]>(deliveries);
  
  const handleAccept = (newDeliveryOffer: Delivery) => {
    const newDelivery = {...newDeliveryOffer, status: 'in_transit' as const};
    setAllDeliveries(prev => [
        newDelivery,
        ...prev.filter(d => d.id !== newDeliveryOffer.id)
    ]);
  };

  const handleConfirmDelivery = (deliveryId: string) => {
    setAllDeliveries(prev => 
      prev.map(d => 
        d.id === deliveryId ? { ...d, status: 'delivered' } : d
      )
    );
  };
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child)) {
      // Here, we're assuming the child component can accept these props.
      // This is a common pattern for this kind of state sharing.
      return cloneElement(child as React.ReactElement<any>, { 
        deliveries: allDeliveries, 
        handleConfirmDelivery,
        handleAccept,
        newDeliveryOffers
      });
    }
    return child;
  });

  return (
      <SidebarProvider>
        <DashboardSidebar />
        <main className="ml-[3rem] flex-1 p-4 md:p-6 lg:p-8">
            {childrenWithProps}
        </main>
      </SidebarProvider>
  );
}
