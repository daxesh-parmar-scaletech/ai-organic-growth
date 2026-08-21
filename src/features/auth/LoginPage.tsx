import { Loader2, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import sketchBackground from '@/assets/back.svg';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/hooks/useAuth';

const HIGHLIGHTS = [
  { label: 'Monitor', color: 'var(--brand-green-bright)' },
  { label: 'Diagnose', color: '#7C6BE8' },
  { label: 'Solve', color: '#F0A93B' },
  { label: 'Boost', color: '#5CA6E0' },
];

const TYPE_CHAR_MS = 70;
const DELETE_CHAR_MS = 40;
const TYPE_HOLD_MS = 650;
const DELETE_HOLD_MS = 250;
const BOOST_MS = 1200;

function TypewriterHighlights() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');

  const item = HIGHLIGHTS[wordIndex];
  const isLastWord = wordIndex === HIGHLIGHTS.length - 1;

  useEffect(() => {
    if (phase === 'typing') {
      if (charCount < item.label.length) {
        const timer = setTimeout(() => setCharCount((count) => count + 1), TYPE_CHAR_MS);
        return () => clearTimeout(timer);
      }
      setPhase('holding');
      return;
    }

    if (phase === 'holding') {
      const timer = setTimeout(() => setPhase('deleting'), isLastWord ? BOOST_MS : TYPE_HOLD_MS);
      return () => clearTimeout(timer);
    }

    if (charCount > 0) {
      const timer = setTimeout(() => setCharCount((count) => count - 1), DELETE_CHAR_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setWordIndex((index) => (index + 1) % HIGHLIGHTS.length);
      setPhase('typing');
    }, DELETE_HOLD_MS);
    return () => clearTimeout(timer);
  }, [phase, charCount, item.label.length, isLastWord]);

  const isBoosting = isLastWord && phase === 'holding';
  const text = item.label.slice(0, charCount);

  return (
    <div className="flex h-9 items-center">
      <span
        className={`inline-flex items-baseline text-[26px] font-extrabold tracking-tight transition-transform duration-300 ${isBoosting ? 'scale-110' : ''
          }`}
        style={{ color: item.color, textShadow: isBoosting ? `0 0 26px ${item.color}` : 'none' }}
      >
        {text}
        <span
          className="ml-1 inline-block h-[22px] w-[3px] animate-caret-blink"
          style={{ backgroundColor: item.color }}
        />
      </span>
    </div>
  );
}

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/projects');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden flex-[1.05] flex-col justify-between overflow-hidden bg-[#0A0F0C] px-16 py-16 text-white lg:flex">
        {/* Hand-drawn SEO sketch, inverted so the ink reads light on dark */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 invert mix-blend-screen"
          style={{ backgroundImage: `url(${sketchBackground})` }}
        />
        {/* Brand colour wash + bottom scrim to keep the copy legible */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(680px 520px at 6% 98%, rgba(91,91,214,.24), transparent 62%), radial-gradient(760px 520px at 94% 6%, rgba(11,107,60,.34), transparent 62%), linear-gradient(0deg, rgba(10,15,12,.28) 0%, rgba(10,15,12,.97) 100%, rgba(10,15,12,.55) 55%)',
          }}
        />

        <div className="relative max-w-[520px]">
          <div className="relative mb-9 inline-flex">
            <Logo
              iconSize={68}
              variant="mark"
              textClassName="text-[31px] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.55)]"
              className="relative drop-shadow-[0_2px_14px_rgba(0,0,0,.5)]"
            />
          </div>
          <h1 className="mb-5 text-[56px] leading-[1.03] font-extrabold tracking-tight">
            When Ads Say No,{' '}
            <span className="bg-linear-to-r from-brand-green-bright to-brand-green-tint bg-clip-text text-transparent">
              SEO Says Go.
            </span>
          </h1>
          <p className="max-w-[440px] text-lg leading-relaxed text-white/65">
            Built for businesses that can&apos;t rely on paid ads — Ranky AI reads your Search
            Console data and shows you{' '}
            <b className="font-semibold text-white">exactly what to fix to rank higher.</b>
          </p>
          <div className="mt-10 flex items-center gap-3">
            <p className="text-[13px] font-semibold tracking-[0.18em] text-white/50 uppercase">
              Ranky AI helps you
            </p>
            <TypewriterHighlights />
          </div>
        </div>

        <div className="relative pt-12">
          <div className="mb-5 h-px w-16 bg-white/15" />
          <p className="max-w-[420px] text-[13px] leading-relaxed text-white/45">
            Not just another SEO tool — an AI agent that turns data into growth decisions.
          </p>
        </div>
      </aside>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-background p-6 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(560px 380px at 85% 0%, rgba(11,107,60,.07), transparent 65%), radial-gradient(520px 380px at 0% 100%, rgba(91,91,214,.06), transparent 65%)',
          }}
        />

        <div className="relative w-full max-w-[400px]">
          <Logo iconSize={44} textClassName="text-[23px] text-primary" className="mb-8" />

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_50px_-30px_rgba(14,23,38,.28)]">
            <div className="h-1.5 w-full bg-linear-to-r from-[#0B6B3C] via-[#1FCB79] to-[#82DBB1]" />
            <div className="p-8">
              <h2 className="mb-2 text-[26px] font-bold tracking-tight">Sign in to your workspace</h2>
              <p className="mb-7 text-[15px] leading-relaxed text-muted-foreground">
                Use the email and password your admin gave you to access your projects.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3.5 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3.5 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
