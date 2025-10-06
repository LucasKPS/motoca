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
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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

const initialOrders: Order[] = [
    { id: 'ORD-001', restaurant: 'Pizzaria Delícia', date: 'Hoje, 20:30', status: 'delivered', total: 58.50, rating: 5 },
    { id: 'ORD-002', restaurant: 'Burger Queen', date: 'Ontem, 19:45', status: 'delivered', total: 35.00, rating: 4 },
    { id: 'ORD-003', restaurant: 'Sushi House', date: '2 dias atrás, 21:00', status: 'cancelled', total: 90.00 },
    { id: 'ORD-004', restaurant: 'Açaí Power', date: '5 dias atrás, 15:00', status: 'delivered', total: 25.00, rating: 5 },
]

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
  const { toast } = useToast();
  
  const roleQuery = searchParams.get('role');
  
  const getInitialRole = (): UserRole => {
    if (typeof window !== 'undefined') {
        const savedRole = localStorage.getItem('userRole') as UserRole;
        if (savedRole) return savedRole;
    }
    return roleQuery === 'client' ? 'client' : 'courier';
  }

  const [userRole, setUserRole] = useState<UserRole>(getInitialRole());

  useEffect(() => {
    const currentRole = getInitialRole();
    setUserRole(currentRole);
    if (!isUserLoading && user) {
        const params = new URLSearchParams(searchParams);
        if (params.get('role') !== currentRole) {
            params.set('role', currentRole);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }
  }, [roleQuery, user, isUserLoading]);


  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    const params = new URLSearchParams(searchParams);
    params.set('role', role);
    router.push(`/dashboard?${params.toString()}`);
  };

  // Courier State
  const [allDeliveries, setAllDeliveries] = useState<Delivery[]>(deliveries);
  const [showNewRun, setShowNewRun] = useState(false);
  const [newDeliveryOffer, setNewDeliveryOffer] = useState<Delivery | null>(null);

  // Client State
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Profile & Settings State (shared)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('(11) 99999-8888');
  const [vehicle, setVehicle] = useState('moto');
  const [plate, setPlate] = useState('BRA2E19');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notifyNewRuns, setNotifyNewRuns] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(true);
  const [notifySummary, setNotifySummary] = useState(false);

  useEffect(() => {
     if (user) {
        setName(user.displayName ?? (userRole === 'courier' ? 'João da Silva' : 'Ana Cliente'));
        setAvatarUrl(user.photoURL ?? `https://i.pravatar.cc/150?u=${user.uid}`);
     }
  }, [user, userRole]);
  
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
  
  const handleCreateOrder = () => {
    const newOrder: Order = {
        id: `ORD-${String(orders.length + 5).padStart(3, '0')}`,
        restaurant: 'Pizzaria Delícia',
        date: 'Hoje',
        status: 'in_transit',
        total: 78.99,
    };
    setOrders(prev => [newOrder, ...prev]);
    toast({
        title: 'Pedido Realizado!',
        description: 'Seu pedido da Pizzaria Delícia está a caminho.',
    });
    router.push('/dashboard/my-orders?role=client');
  }
  
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
        const isDashboardHome = pathname === '/dashboard';
        
        if (isDashboardHome) return child;

        const commonProps = {
            name, setName,
            phone, setPhone,
            avatarUrl, setAvatarUrl,
            notifyPromos, setNotifyPromos,
            notifySummary, setNotifySummary,
        };

        if (userRole === 'courier') {
            return cloneElement(child as React.ReactElement<any>, {
                ...commonProps,
                deliveries: allDeliveries, 
                handleConfirmDelivery,
                newDeliveryOffer,
                showNewRun,
                onAcceptRun: handleAccept,
                onDeclineRun: handleDecline,
                onShowNewRun: handleShowNewRun,
                vehicle, setVehicle,
                plate, setPlate,
                notifyNewRuns, setNotifyNewRuns,
            });
        }
        
        if (userRole === 'client') {
             // Define specific props for client pages
             const clientProps: any = {
                ...commonProps,
            };

            if (pathname === '/dashboard/my-orders') {
                clientProps.orders = orders;
            }
            
            if (pathname === '/dashboard/order') {
                clientProps.onCreateOrder = handleCreateOrder;
            }

            return cloneElement(child as React.ReactElement<any>, clientProps);
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
