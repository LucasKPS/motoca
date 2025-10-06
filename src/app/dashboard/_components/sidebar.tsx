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
import { Home, User, Settings, LogOut, Truck, DollarSign } from 'lucide-react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    { href: '/dashboard', label: 'Início', icon: Home },
    { href: '/dashboard/runs', label: 'Corridas', icon: Truck },
    { href: '/dashboard/earnings', label: 'Ganhos', icon: DollarSign },
    { href: '/dashboard/profile', label: 'Meu Perfil', icon: User },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
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
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
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
