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

let lockSequenceStarted = false;

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
  const [showPassword, setShowPassword] = useState(false);
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

  const logIntrusion = async (path: string) => {
    try {
      await fetch('/api/admin/intrusion-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
    } catch {}
  };

  useEffect(() => {
    logIntrusion('/admin/login');
    if (lockSequenceStarted) return;
    lockSequenceStarted = true;

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
    if (saved >= 3) {
      startLockSequence();
    }
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
      for (let i = 0; i < 20; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
      }
      setGlitchText(text);
    }, 80);

    setTimeout(() => {
      clearInterval(glitchInterval);
      setGlitchText('');
    }, 3000);

    setTimeout(() => {
      setShowLaugh(true);
      console.log('POR CHISTOSITO.');
      console.log('JA'.repeat(200));
    }, 8000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    sessionStorage.setItem('loginAttempts', String(newAttempts));

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        logIntrusion('/admin/login?failed=true');
        if (newAttempts >= 3) {
          localStorage.setItem('lockUntil', String(Date.now() + 15 * 60 * 1000));
          startLockSequence();
        } else {
          setError(`Credenciales incorrectas. Intento ${newAttempts}/3.`);
        }
      } else {
        sessionStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockUntil');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Error al iniciar sesión.');
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
                <p
                  key={i}
                  className={`font-mono text-xs sm:text-sm mb-1 ${
                    i === typedLines.length - 1
                      ? 'text-cyan-400 after:content-["▊"] after:animate-pulse after:ml-1'
                      : 'text-cyan-600'
                  }`}
                >
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
              <div
                key={i}
                className="absolute font-mono font-black text-red-500/40 whitespace-nowrap select-none"
                style={{
                  top: `${row.top}%`,
                  fontSize: `${row.size}px`,
                  animation: `${row.dir > 0 ? 'laugh-scroll-left' : 'laugh-scroll-right'} ${row.speed}s linear infinite`,
                  animationDelay: `${row.delay}s`,
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
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="text-center mb-8 relative">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/50">
            <Lock size={40} className="text-on-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Panel de Administración</h1>
          <p className="text-text-muted">Inicia sesión para continuar</p>
        </div>

        <div className="bg-card-bg p-8 rounded-2xl border border-border-color shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-text-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-foreground placeholder-text-muted"
                  placeholder="admin@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-secondary mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-text-muted" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-input border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-foreground placeholder-text-muted"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Intento {Math.min(attempts + 1, 3)}/3</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 text-on-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-on-primary"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 relative">
          <button
            onClick={() => router.push('/')}
            className="text-text-muted hover:text-primary transition-colors text-sm"
          >
            ← Volver al sitio web
          </button>
        </div>
      </div>
    </div>
  );
}
