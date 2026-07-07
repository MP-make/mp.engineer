# Admin Login + Lockout + CodeSkullBackground

Sistema de login con bloqueo temporal (15 min) tras 3 intentos fallidos, animación de calavera con código, terminal interactiva, y burla infinita "JAJAJAJA...".

## Archivos necesarios

### 1. `components/CodeSkullBackground.tsx`

Fondo animado con código cyan scrolling + calavera vectorial recortada al centro.

```tsx
'use client';

import React, { useMemo } from 'react';

const SKULL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <path d="M200 20C100 20 20 100 20 200c0 60 28 113 72 148l-12 52 60-30c18 6 38 10 60 10s42-4 60-10l60 30-12-52c44-35 72-88 72-148C380 100 300 20 200 20zm0 40c66 0 120 54 120 120s-54 120-120 120S80 246 80 180s54-120 120-120zm-50 80c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm100 0c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm-50 60c-22 0-40 18-40 40s18 40 40 40 40-18 40-40-18-40-40-40z" fill="white"/>
</svg>`;

const SKULL_MASK_DATA_URI = 'data:image/svg+xml,' + encodeURIComponent(SKULL_SVG);

const CODE_WORDS = [
  'login.credentials', 'access:denial', 'script src=', 'function', 'logged:#',
  'local.config', 'malicious code logged', 'input.false', 'status', 'code<',
  'true', 'unknown', 'lock.command', 'name<img>=spa', 'put.new(create)',
  'address', 'm#4:80a?:/q.s', '(245,23,068,789,a48)', 'trigger warning',
  '>>', '0xDEAD', 'auth.token=null', 'if(true){deny()}', 'credentials()',
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function randLine(rnd: () => number) {
  const n = 2 + Math.floor(rnd() * 3);
  const parts = [];
  for (let i = 0; i < n; i++) parts.push(CODE_WORDS[Math.floor(rnd() * CODE_WORDS.length)]);
  return parts.join(' ');
}

function generateRows(rowCount: number) {
  const rnd = seededRandom(11);
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const oneText = Array.from({ length: 6 }, () => randLine(rnd)).join('   ');
    rows.push({
      id: i,
      top: (i / rowCount) * 100 + (rnd() - 0.5) * 1.5,
      fontSize: 10 + rnd() * 6,
      opacity: 0.45 + rnd() * 0.55,
      text: oneText + '   ' + oneText,
      duration: 18 + rnd() * 40,
      direction: rnd() > 0.5 ? 1 : -1,
      flicker: rnd() > 0.8,
      flickerDelay: rnd() * 5,
      flickerDur: 2 + rnd() * 3,
    });
  }
  return rows;
}

function CodeField() {
  const rows = useMemo(() => generateRows(46), []);
  return (
    <div className="absolute inset-0 overflow-hidden whitespace-nowrap">
      <style>{`
        @keyframes csb-scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes csb-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes csb-row-flicker {
          0%, 100% { opacity: var(--base-op); }
          92% { opacity: var(--base-op); }
          94% { opacity: 0.08; }
          96% { opacity: var(--base-op); }
        }
      `}</style>
      {rows.map((r: any) => (
        <div
          key={r.id}
          className="absolute font-mono text-cyan-300 select-none"
          style={{
            top: r.top + '%',
            left: 0,
            fontSize: r.fontSize + 'px',
            opacity: r.opacity,
            textShadow: '0 0 6px rgba(56,220,255,0.6), 0 0 14px rgba(56,220,255,0.25)',
            animation: [
              (r.direction > 0 ? 'csb-scroll-left' : 'csb-scroll-right') + ' ' + r.duration + 's linear infinite',
              r.flicker ? 'csb-row-flicker ' + r.flickerDur + 's ease-in-out infinite ' + r.flickerDelay + 's' : null,
            ].filter(Boolean).join(', '),
            '--base-op': r.opacity,
          } as any}
        >
          {r.text}
        </div>
      ))}
    </div>
  );
}

export default function CodeSkullBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 46%, black 55%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 46%, black 55%, transparent 95%)',
        }}
      >
        <CodeField />
      </div>
      <div className="absolute inset-0"
        style={{
          filter: 'blur(5px)',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 46%, transparent 45%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 46%, transparent 45%, black 100%)',
        }}
      >
        <CodeField />
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 46%, transparent 55%, rgba(0,0,0,0.75) 100%)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            width: 'min(64vw, 560px)',
            height: 'min(64vw, 560px)',
            backgroundColor: '#000000',
            WebkitMaskImage: 'url("' + SKULL_MASK_DATA_URI + '")',
            maskImage: 'url("' + SKULL_MASK_DATA_URI + '")',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            animation: 'csb-skull-pulse 3.4s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes csb-skull-pulse {
            0%, 100% { filter: drop-shadow(0 0 12px rgba(56,220,255,0.5)) drop-shadow(0 0 26px rgba(56,220,255,0.25)); }
            50% { filter: drop-shadow(0 0 18px rgba(56,220,255,0.75)) drop-shadow(0 0 40px rgba(56,220,255,0.4)); }
          }
        `}</style>
      </div>
    </div>
  );
}
```

### 2. `app/admin/login/page.tsx`

Login con límite de 3 intentos, lockout 15 min, terminal animada, glitch, risa infinita.

```tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import CodeSkullBackground from '@/components/CodeSkullBackground';

const LAUGH_ROWS = Array.from({ length: 20 }).map((_, i) => ({
  top: 5 + i * 5,
  size: 14 + ((i * 7) % 24),
  dir: i % 2 === 0 ? 1 : -1,
  speed: 8 + ((i * 13) % 12),
  delay: (i * 0.4) % 8,
  reps: 20 + ((i * 11) % 30),
}));

const TYPING_LINES = [
  '> INTRUSO DETECTADO...',
  '> PROTOCOLO DE SEGURIDAD ACTIVADO',
  '> BLOQUEANDO ACCESO...',
  '> DATOS DEL ATACANTE REGISTRADOS',
  '> IP: ********************',
  '> UBICACION: *************',
  '> REPORTE ENVIADO AL ADMIN',
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showSkull, setShowSkull] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [glitchText, setGlitchText] = useState('');
  const [showLaugh, setShowLaugh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = parseInt(sessionStorage.getItem('loginAttempts') || '0');
    const lockTime = localStorage.getItem('lockUntil');
    if (lockTime) {
      const remaining = parseInt(lockTime) - Date.now();
      if (remaining > 0) {
        setAttempts(3);
        startLockSequence();
        return;
      } else {
        localStorage.removeItem('lockUntil');
        sessionStorage.removeItem('loginAttempts');
      }
    }
    setAttempts(saved);
    if (saved >= 3) startLockSequence();
  }, []);

  const startLockSequence = () => {
    setLocked(true);
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countInterval);
          setShowSkull(true);
          typeLines();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const typeLines = () => {
    let lineIndex = 0;
    const typeInterval = setInterval(() => {
      if (lineIndex < TYPING_LINES.length) {
        setTypedLines((prev) => [...prev, TYPING_LINES[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(typeInterval);
        startGlitch();
      }
    }, 600);
  };

  const startGlitch = () => {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const glitchInterval = setInterval(() => {
      let text = '';
      for (let i = 0; i < 20; i++) text += chars[Math.floor(Math.random() * chars.length)];
      setGlitchText(text);
    }, 80);
    setTimeout(() => { clearInterval(glitchInterval); setGlitchText(''); }, 3000);
    setTimeout(() => { setShowLaugh(true); }, 8000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    sessionStorage.setItem('loginAttempts', String(newAttempts));
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        if (newAttempts >= 3) {
          localStorage.setItem('lockUntil', String(Date.now() + 15 * 60 * 1000));
          startLockSequence();
        } else {
          setError('Credenciales incorrectas. Intento ' + newAttempts + '/3.');
        }
      } else {
        sessionStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockUntil');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Error al iniciar sesion.');
    } finally {
      setLoading(false);
    }
  };

  if (locked) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 overflow-hidden relative">
        <CodeSkullBackground />

        {countdown !== null && countdown > 0 && !showSkull && (
          <div className="relative z-10 text-center">
            <p className="text-cyan-400 text-8xl sm:text-9xl font-mono font-black animate-pulse tracking-[0.3em] drop-shadow-[0_0_30px_rgba(56,220,255,0.6)]">
              {countdown}
            </p>
            <p className="text-cyan-500/60 text-xl font-mono mt-6 animate-pulse">
              SISTEMA DE SEGURIDAD ACTIVADO *_*
            </p>
          </div>
        )}

        {showSkull && (
          <div className="relative z-10 text-center max-w-2xl w-full">
            {glitchText && (
              <div className="text-red-500/70 text-xs font-mono mb-4 break-all drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                {glitchText}
              </div>
            )}
            <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-6 mb-6 text-left max-w-lg mx-auto shadow-[0_0_30px_rgba(56,220,255,0.1)]">
              {typedLines.map((line, i) => (
                <p key={i} className={'font-mono text-xs sm:text-sm mb-1 ' + (i === typedLines.length - 1 ? 'text-cyan-400 after:content-["▊"] after:animate-pulse after:ml-1' : 'text-cyan-600')}>
                  {line}
                </p>
              ))}
              {typedLines.length >= TYPING_LINES.length && (
                <p className="text-red-500 font-mono text-xs sm:text-sm mt-4 animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                  !!! SISTEMA BLOQUEADO PERMANENTEMENTE *_* !!!
                </p>
              )}
            </div>
          </div>
        )}

        {showLaugh && (
          <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
            <style>{`
              @keyframes laugh-scroll-left { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }
              @keyframes laugh-scroll-right { from { transform: translateX(-100%); } to { transform: translateX(100vw); } }
            `}</style>
            {LAUGH_ROWS.map((row, i) => (
              <div key={i}
                className="absolute font-mono font-black text-red-500/40 whitespace-nowrap select-none"
                style={{
                  top: row.top + '%',
                  fontSize: row.size + 'px',
                  animation: (row.dir > 0 ? 'laugh-scroll-left' : 'laugh-scroll-right') + ' ' + row.speed + 's linear infinite',
                  animationDelay: row.delay + 's',
                  textShadow: '0 0 20px rgba(255,0,0,0.3)',
                }}
              >
                {'JA'.repeat(row.reps)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 relative">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/50">
            <Lock size={40} className="text-on-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Panel de Administracion</h1>
          <p className="text-text-muted">Inicia sesion para continuar</p>
        </div>
        <div className="bg-card-bg p-8 rounded-2xl border border-border-color shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2">Correo</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary text-foreground"
                placeholder="admin@ejemplo.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-secondary mb-2">Contrasena</label>
              <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary text-foreground"
                placeholder="......" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3"><p className="text-red-400 text-sm text-center">{error}</p></div>}
            <div className="text-xs text-text-muted">Intento {Math.min(attempts + 1, 3)}/3</div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-600 px-6 py-3 rounded-xl font-bold text-on-primary">
              {loading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### 3. `app/admin/layout.tsx`

Protege las rutas admin durante el lockout. Si hay un `lockUntil` activo y no es la página de login, redirige automáticamente.

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
```

## Cómo funciona

1. **sessionStorage** guarda `loginAttempts` (se reinicia al cerrar pestaña)
2. **localStorage** guarda `lockUntil` timestamp (persiste 15 min aunque cierres el navegador)
3. Al llegar a 3 intentos fallidos se guarda `lockUntil = Date.now() + 15*60*1000`
4. La pantalla de bloqueo reproduce: countdown 3…2…1 → terminal typing → glitch → "SISTEMA BLOQUEADO" → 5s después → "JAJAJAJAJA..." infinito
5. El layout `/admin/layout.tsx` verifica `lockUntil` en cada ruta admin y redirige al login si está bloqueado

## Dependencias (Tailwind CSS classes usadas)

- `bg-black`, `bg-surface`, `bg-card-bg`, `bg-input`, `bg-primary`, `bg-primary-hover`
- `text-cyan-400/500/600`, `text-red-500`, `text-text-primary/muted/secondary`
- `font-mono`, `rounded-xl/2xl`, `backdrop-blur-sm`, `drop-shadow-[...]`
- `animate-pulse`, `after:animate-pulse`

Ajusta las clases de color según tu tema si no usas las mismas variables CSS.
