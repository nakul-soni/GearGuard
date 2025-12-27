'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthGuard } from "@/components/providers/auth-guard";
import { motion, AnimatePresence } from "framer-motion";

const PUBLIC_ROUTES = ['/login'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <AuthProvider>
      <AuthGuard>
        {isPublicRoute ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          ) : (
            <div className="flex min-h-screen bg-transparent text-foreground transition-colors duration-300">
              <Sidebar />

            <div className="pl-64 flex flex-col w-full">
              <Header />
              <main className="flex-1 overflow-x-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      duration: 0.3 
                    }}
                    className="p-8"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </AuthGuard>
    </AuthProvider>
  );
}
