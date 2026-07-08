'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function RouteLoadingBar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const prevPath = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      clearTimeout(timeoutRef.current);
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
      if (!link || !link.href) return;

      try {
        const url = new URL(link.href);
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          setIsLoading(true);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setIsLoading(false), 8000);
        }
      } catch {}
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-[3px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: 1, transformOrigin: 'left' }}
            exit={{ scaleX: 0, transformOrigin: 'right', transition: { duration: 0.4 } }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 -right-1 h-full w-20 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm"
            animate={{ x: ['-100vw', '100vw'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
