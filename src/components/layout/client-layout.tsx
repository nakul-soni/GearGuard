'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
<<<<<<< HEAD
import { AuthProvider } from "@/components/providers/auth-provider";
=======
>>>>>>> c66372c (Final Commit)
import { AuthGuard } from "@/components/providers/auth-guard";

const PUBLIC_ROUTES = ['/login'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
<<<<<<< HEAD
    <AuthProvider>
      <AuthGuard>
        {isPublicRoute ? (
          children
        ) : (
          <>
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </>
        )}
      </AuthGuard>
    </AuthProvider>
=======
    <AuthGuard>
      {isPublicRoute ? (
        children
      ) : (
        <>
          <Sidebar />
          <div className="pl-64 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </>
      )}
    </AuthGuard>
>>>>>>> c66372c (Final Commit)
  );
}
