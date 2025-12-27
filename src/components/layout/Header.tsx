'use client';

import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/providers/auth-provider';
import { signOut } from '@/lib/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ModeToggle } from './mode-toggle';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border/40 bg-background/40 px-8 backdrop-blur-2xl transition-all duration-300">
      <div className="flex w-full max-w-sm items-center gap-3 group glass px-4 py-2 rounded-2xl border-none shadow-none bg-muted/30 focus-within:bg-muted/50 transition-all">
        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          type="search" 
          placeholder="Quick search..." 
          className="h-8 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 glass p-1 rounded-xl">
          <ModeToggle />
          
          <Button variant="ghost" size="icon" className="h-9 w-9 relative hover:bg-primary/10 transition-colors rounded-lg">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive animate-ping" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
        </div>
        
        <div className="h-8 w-px bg-border/40 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
              <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary">{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
