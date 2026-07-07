'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LockoutGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const lockTime = localStorage.getItem('lockUntil');
    if (lockTime) {
      const remaining = parseInt(lockTime) - Date.now();
      if (remaining > 0 && !pathname.startsWith('/admin/login')) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
