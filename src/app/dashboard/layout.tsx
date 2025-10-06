'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Children, cloneElement, isValidElement } from 'react';
import { Loader2, Users } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './_components/sidebar';
import type { Delivery } from '@/lib/types';
import { deliveries } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import CourierHome from './_components/courier-home';
import ClientHome from './_components/client-home';

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

type UserRole = 'client' | 'courier';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const roleQuery = searchParams.get('role');
  const [userRole, setUserRole] = useState<UserRole>((roleQuery === 'client' ? 'client' : 'courier'));

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    const params = new URLSearchParams(searchParams);
    params.set('role', role);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Courier State
  const [allDeliveries, setAllDeliveries] = useState<Delivery[]>(deliveries);
  const [showNewRun, setShowNewRun] = useState(false);
  const [newDeliveryOffer, setNewDeliveryOffer] = useState<Delivery | null>(null);
  
  // Profile & Settings State (shared)
  const [name, setName] = useState(user?.displayName ?? (userRole === 'courier' ? 'João da Silva' : 'Ana Cliente'));
  const [phone, setPhone] = useState('(11) 99999-8888');
  const [vehicle, setVehicle] = useState('moto');
  const [plate, setPlate] = useState('BRA2E19');
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL ?? `https://i.pravatar.cc/150?u=${user?.uid}`);
  const [notifyNewRuns, setNotifyNewRuns] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(true);
  const [notifySummary, setNotifySummary] = useState(false);
  
  const handleAccept = () => {
    if (newDeliveryOffer) {
        const newDelivery = {...newDeliveryOffer, status: 'in_transit' as const};
        setAllDeliveries(prev => [
            newDelivery,
            ...prev.filter(d => d.id !== newDeliveryOffer.id)
        ]);
        setShowNewRun(false);
        setNewDeliveryOffer(null);
    }
  };

  const handleDecline = () => {
    setShowNewRun(false);
    setNewDeliveryOffer(null);
  }

  const handleShowNewRun = () => {
    const offer = newDeliveryOffers[Math.floor(Math.random() * newDeliveryOffers.length)];
    setNewDeliveryOffer(offer);
    setShowNewRun(true);
  }

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
  
   useEffect(() => {
    setName(userRole === 'courier' ? 'João da Silva' : 'Ana Cliente');
  }, [userRole]);


  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child)) {
      // Pass props for courier pages
      if (userRole === 'courier') {
          return cloneElement(child as React.ReactElement<any>, { 
            deliveries: allDeliveries, 
            handleConfirmDelivery,
            newDeliveryOffer,
            showNewRun,
            onAcceptRun: handleAccept,
            onDeclineRun: handleDecline,
            onShowNewRun: handleShowNewRun,

            name, setName,
            phone, setPhone,
            vehicle, setVehicle,
            plate, setPlate,
            avatarUrl, setAvatarUrl,
            notifyNewRuns, setNotifyNewRuns,
            notifyPromos, setNotifyPromos,
            notifySummary, setNotifySummary,
          });
      }
      // Pass props for client pages
      if (userRole === 'client') {
           return cloneElement(child as React.ReactElement<any>, { 
            name, setName,
            phone, setPhone,
            avatarUrl, setAvatarUrl,
            notifyNewRuns, setNotifyNewRuns,
            notifyPromos, setNotifyPromos,
            notifySummary, setNotifySummary,
          });
      }
    }
    return child;
  });

  const isDashboardHome = pathname === '/dashboard';

  return (
      <SidebarProvider>
        <DashboardSidebar userRole={userRole} />
        <main className="ml-[3rem] flex-1">
             <Card className="m-4 p-4 border-dashed flex items-center gap-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                    <h3 className="font-semibold">Simulação de Papel</h3>
                    <p className="text-sm text-muted-foreground">Alterne entre a visão de Cliente e Entregador para ver as diferentes interfaces.</p>
                </div>
                <Select value={userRole} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecionar Papel" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="courier">Entregador</SelectItem>
                        <SelectItem value="client">Cliente</SelectItem>
                    </SelectContent>
                </Select>
            </Card>
            <div className="p-4 md:p-6 lg:p-8 pt-0">
              {isDashboardHome ? (
                userRole === 'courier' ? <CourierHome name={name} /> : <ClientHome name={name} />
              ) : childrenWithProps}
            </div>
        </main>
      </SidebarProvider>
  );
}
