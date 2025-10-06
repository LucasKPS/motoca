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
import { Home, User, Settings, LogOut, Truck, DollarSign, ShoppingCart, ListOrdered, Utensils } from 'lucide-react';
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
    { href: '/dashboard/order', label: 'Fazer Pedido', icon: ShoppingCart },
    { href: '/dashboard/my-orders', label: 'Meus Pedidos', icon: ListOrdered },
    { href: '/dashboard/restaurants', label: 'Restaurantes', icon: Utensils },
    { href: '/dashboard/profile', label: 'Meu Perfil', icon: User },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

export default function DashboardSidebar({ userRole = 'courier' }: { userRole: 'client' | 'courier' }) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const auth = useAuth();
  const router = useRouter();

  const sidebarItems = userRole === 'client' ? clientSidebarItems : courierSidebarItems;

  const handleLogout = () => {
    auth.signOut();
    router.push('/login');
  }

  // Hide some items for client role on certain pages
  const isClientAndNotHome = userRole === 'client' && pathname !== '/dashboard';
  const visibleItems = isClientAndNotHome 
    ? sidebarItems.filter(item => ['/dashboard', '/dashboard/my-orders', '/dashboard/profile', '/dashboard/settings'].includes(item.href))
    : sidebarItems;


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
          {visibleItems.map((item) => {
            // For client, only 'Início' is active on the root, others are exact matches
            const isActive = userRole === 'client' 
                ? (item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href) && item.href !== '/dashboard')
                : pathname === item.href;
            
            // Client specific logic for href
            const href = userRole === 'client' && item.href === '/dashboard' ? '/dashboard?role=client' : item.href;

            if (userRole === 'client' && (item.label === 'Fazer Pedido' || item.label === 'Restaurantes')) {
                return null;
            }

            return (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                >
                    <Link href={item.href}>
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
