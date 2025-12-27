'use client';

<<<<<<< HEAD
import Link from 'next/link';
import { usePathname } from 'next/navigation';
=======
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> c66372c (Final Commit)
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/50 backdrop-blur-xl">
      <div className="flex h-full flex-col gap-2 px-4 py-6">
        <div className="flex items-center gap-2 px-2 pb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">GearGuard</span>
        </div>
        
<<<<<<< HEAD
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
=======
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                  <Link
                    key={item.href}
                    href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}

                  >
                    <item.icon className={cn(
                      "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    )} />
                    {item.label}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-[-1] rounded-xl bg-primary"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
              );
            })}
          </nav>

>>>>>>> c66372c (Final Commit)

        <div className="mt-auto border-t pt-4">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
            <div className="h-8 w-8 rounded-full bg-accent" />
            <div className="flex flex-col">
              <span className="text-foreground">Admin User</span>
              <span className="text-xs">System Manager</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
