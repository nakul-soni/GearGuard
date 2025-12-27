'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
<<<<<<< HEAD
import { useAuth } from '@/components/providers/auth-provider';
=======
import { useAuth } from '@/components/providers/firebase-auth-provider';
>>>>>>> c66372c (Final Commit)
import { useStore } from '@/store/useStore';

const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { initializeData, subscribeToData, loading: dataLoading } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading) {
      if (!user && !PUBLIC_ROUTES.includes(pathname)) {
        router.push('/login');
      } else if (user && PUBLIC_ROUTES.includes(pathname)) {
        router.push('/');
      }
    }
  }, [user, authLoading, pathname, router]);

  useEffect(() => {
    if (user) {
      initializeData();
      const unsubscribe = subscribeToData();
      return () => unsubscribe();
    }
  }, [user, initializeData, subscribeToData]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && dataLoading && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
