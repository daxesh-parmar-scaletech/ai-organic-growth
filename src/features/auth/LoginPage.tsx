import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import sketchBackground from '@/assets/back.svg';
import { Logo } from '@/components/common/Logo';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
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

  const handleSignIn = () => {
    signIn();
    navigate('/projects');
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
            Built for businesses that can&apos;t rely on paid ads. Ranky AI shows{' '}
            <b className="font-semibold text-white">exactly what to fix to rank higher.</b> ⭐
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
            Not just another SEO tool an AI agent that turns data into growth decisions.
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

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_50px_-30px_rgba(14,23,38,.28)]">
            <div className="h-1.5 w-full bg-linear-to-r from-[#0B6B3C] via-[#1FCB79] to-[#82DBB1]" />
            <div className="p-8">
              <h2 className="mb-2 text-[26px] font-bold tracking-tight">Sign in to your workspace</h2>
              <p className="mb-7 text-[15px] leading-relaxed text-muted-foreground">
                Connect your Google Search Console account to monitor and grow your organic traffic.
              </p>

              <GoogleSignInButton onClick={handleSignIn} />

              <div className="my-6 flex items-center gap-3.5 text-[11px] font-medium tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <ShieldCheck className="size-3.5 text-primary" />
                SECURE OAUTH 2.0
                <span className="h-px flex-1 bg-border" />
              </div>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                By continuing you agree to our{' '}
                <a className="font-medium text-primary hover:underline" href="#">
                  Terms
                </a>{' '}
                and{' '}
                <a className="font-medium text-primary hover:underline" href="#">
                  Privacy Policy
                </a>
                . We only request read access to your Search Console data.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
