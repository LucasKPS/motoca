import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <Logo className="w-8 h-8 text-primary" />
      </div>
      <div className="flex-1" />
      {/* Could add User menu here */}
    </header>
  );
};

export default Header;
