'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  ClipboardList, 
  Trello, 
  Calendar, 
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Equipment', icon: Settings, href: '/equipment' },
  { label: 'Teams', icon: Users, href: '/teams' },
  { label: 'Requests', icon: ClipboardList, href: '/requests' },
  { label: 'Kanban', icon: Trello, href: '/kanban' },
  { label: 'Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar/40 backdrop-blur-2xl transition-all duration-300">
      <div className="flex h-full flex-col gap-2 px-4 py-6">
        <Link href="/" className="flex items-center gap-3 px-2 pb-10 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all glow-primary"
          >
            <ShieldCheck className="h-7 w-7" />
          </motion.div>
          <span className="text-2xl font-black tracking-tighter text-gradient">GearGuard</span>
        </Link>
        
        <nav className="flex-1 space-y-2.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group block"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-primary rounded-2xl shadow-xl shadow-primary/20 glow-primary"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                  <item.icon className={cn(
                    "h-5 w-5 relative z-10 transition-all duration-500",
                    isActive ? "text-primary-foreground" : "group-hover:scale-110 group-hover:rotate-6"
                  )} />
                  <span className="relative z-10">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border/50 pt-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/30"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
              <div className="h-7 w-7 rounded-full bg-primary/20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">System Admin</span>
              <span className="text-xs text-muted-foreground">Maintenance Lead</span>
            </div>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
