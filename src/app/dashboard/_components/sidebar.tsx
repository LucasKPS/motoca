'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Settings, LogOut, Truck, DollarSign, ListOrdered, Utensils, ShoppingCart, BarChart, BookOpen } from 'lucide-react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

const courierSidebarItems = [
    { href: '/dashboard', label: 'Início', icon: Home },
    { href: '/dashboard/runs', label: 'Corridas', icon: Truck },
    { href: '/dashboard/earnings', label: 'Ganhos', icon: DollarSign },
    { href: '/dashboard/profile', label: 'Meu Perfil', icon: User },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

const clientSidebarItems = [
    { href: '/dashboard', label: 'Início', icon: Home },
    { href: '/dashboard/restaurants', label: 'Restaurantes', icon: Utensils },
    { href: '/dashboard/my-orders', label: 'Meus Pedidos', icon: ListOrdered },
    { href: '/dashboard/profile', label: 'Meu Perfil', icon: User },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

const merchantSidebarItems = [
    { href: '/dashboard', label: 'Visão Geral', icon: Home },
    { href: '/dashboard/orders', label: 'Pedidos', icon: ShoppingCart },
    { href: '/dashboard/menu', label: 'Cardápio', icon: BookOpen },
    { href: '/dashboard/finances', label: 'Financeiro', icon: BarChart },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

export default function DashboardSidebar({ userRole = 'courier' }: { userRole: 'client' | 'courier' | 'merchant' }) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const auth = useAuth();
  const router = useRouter();

  let sidebarItems;
  switch (userRole) {
    case 'client':
      sidebarItems = clientSidebarItems;
      break;
    case 'merchant':
      sidebarItems = merchantSidebarItems;
      break;
    case 'courier':
    default:
      sidebarItems = courierSidebarItems;
      break;
  }

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('userRole');
    router.push('/login');
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-primary" />
            <span className={`font-headline font-semibold text-lg ${!open && 'hidden'}`}>Rota Expressa</span>
            <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const href = `${item.href}?role=${userRole}`;

            return (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className="justify-start"
                >
                    <Link href={href}>
                    <item.icon />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
       <SidebarMenu className="p-2 mt-auto">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500">
                <LogOut />
                <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
       </SidebarMenu>
    </Sidebar>
  );
}
