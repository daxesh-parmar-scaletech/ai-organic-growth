import { ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router';
import sketchBackground from '@/assets/back.svg';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { useAuth } from '@/hooks/useAuth';

const HIGHLIGHTS = [
  { label: 'Monitor', color: '#12D06A' },
  { label: 'Diagnose', color: '#7C6BE8' },
  { label: 'Solve', color: '#F0A93B' },
];

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
              'radial-gradient(760px 520px at 10% 6%, rgba(18,161,80,.34), transparent 62%), radial-gradient(680px 520px at 94% 98%, rgba(91,91,214,.24), transparent 62%), linear-gradient(180deg, rgba(10,15,12,.28) 0%, rgba(10,15,12,.55) 55%, rgba(10,15,12,.97) 100%)',
          }}
        />

        <div className="relative max-w-[520px]">
          <span className="mb-8 inline-flex size-11 items-center justify-center rounded-xl bg-primary shadow-[0_8px_28px_-8px_rgba(18,208,106,.7)]">
            <Sprout className="size-6 text-primary-foreground" />
          </span>
          <h1 className="mb-5 text-[56px] leading-[1.03] font-extrabold tracking-tight">
            Organic{' '}
            <span className="bg-linear-to-r from-[#12D06A] to-[#7CE0A8] bg-clip-text text-transparent">
              Growth
            </span>
          </h1>
          <p className="max-w-[440px] text-lg leading-relaxed text-white/65">
            Helping businesses that cannot rely on paid advertising grow through{' '}
            <b className="font-semibold text-white">AI-powered organic acquisition.</b>
          </p>
          <div className="mt-9 flex flex-wrap gap-2.5">
            {HIGHLIGHTS.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-2 text-[13px] font-medium text-white/85 backdrop-blur-sm"
              >
                <span className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
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
              'radial-gradient(560px 380px at 85% 0%, rgba(18,161,80,.07), transparent 65%), radial-gradient(520px 380px at 0% 100%, rgba(91,91,214,.06), transparent 65%)',
          }}
        />

        <div className="relative w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="inline-flex size-[38px] items-center justify-center rounded-[11px] bg-primary">
              <Sprout className="size-[22px] text-primary-foreground" />
            </span>
            <span className="text-[21px] font-extrabold tracking-tight">Organiq</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_18px_50px_-30px_rgba(14,23,38,.28)]">
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
      </main>
    </div>
  );
}
