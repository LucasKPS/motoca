'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { LayoutDashboard, Route, DollarSign, UserCircle } from 'lucide-react';
import { Separator } from '../ui/separator';

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-lg font-headline font-semibold">Rota Expressa</span>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/" passHref>
            <SidebarMenuButton
              isActive={pathname === '/'}
              tooltip="Dashboard"
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/optimize" passHref>
            <SidebarMenuButton
              isActive={pathname === '/optimize'}
              tooltip="Otimizar Rota"
            >
              <Route />
              <span>Otimizar Rota</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/earnings" passHref>
            <SidebarMenuButton
              isActive={pathname === '/earnings'}
              tooltip="Ganhos"
            >
              <DollarSign />
              <span>Ganhos</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
             <Link href="/profile" passHref>
                <SidebarMenuButton 
                    isActive={pathname === '/profile'}
                    tooltip="Perfil"
                >
                <UserCircle />
                <span>Meu Perfil</span>
                </SidebarMenuButton>
             </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
