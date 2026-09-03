import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileKey2,
  Gauge,
  HelpCircle,
  Home as HomeIcon,
  Info,
  Landmark,
  LockKeyhole,
  Menu,
  Pause,
  ReceiptText,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type FlowState = 'idle' | 'pending' | 'approved' | 'denied';

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function BrandMark() {
  return (
    <div className="flex items-center gap-3" data-testid="brand-horizon">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
        <span className="absolute bottom-[8px] h-[2px] w-[19px] rounded-full bg-current" />
        <span className="absolute bottom-[13px] h-[2px] w-[13px] rounded-full bg-current opacity-75" />
        <span className="absolute bottom-[18px] h-[2px] w-[7px] rounded-full bg-current opacity-50" />
      </div>
      <div>
        <div className="font-display text-[15px] font-bold tracking-[-.04em] text-[hsl(var(--foreground))]">horizon</div>
        <div className="font-mono-ui text-[8px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">preventive banking</div>
      </div>
    </div>
  );
}

function Sidebar({ onReset }: { onReset: () => void }) {
  const links = [
    { label: 'Overview', icon: HomeIcon, active: true, href: '#overview' },
    { label: 'Signals', icon: Activity, active: false, href: '#signals', count: '3' },
    { label: 'Protections', icon: ShieldCheck, active: false, href: '#protections' },
    { label: 'Commitments', icon: Target, active: false, href: '#commitments' },
  ];
  return (
    <aside className="hidden min-h-[100dvh] w-[230px] shrink-0 flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] px-4 py-6 md:flex">
      <BrandMark />
      <div className="mt-12 space-y-1">
        <p className="mb-3 px-3 font-mono-ui text-[9px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">Your money, ahead</p>
        {links.map(({ label, icon: Icon, active, href, count }) => (
          <a
            key={label}
            href={href}
            data-testid={`link-${label.toLowerCase()}`}
            className={`group flex items-center justify-between rounded-xl px-3 py-3 text-[12px] font-semibold transition-colors ${active ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--foreground))]'}`}
          >
            <span className="flex items-center gap-3"><Icon size={16} strokeWidth={active ? 2.3 : 1.8} /><span>{label}</span></span>
            {count ? <span className="rounded-full bg-[hsl(var(--primary))] px-1.5 py-0.5 font-mono-ui text-[9px] font-bold text-[hsl(var(--primary-foreground))]">{count}</span> : null}
          </a>
        ))}
      </div>
      <div className="mt-auto">
        <div className="mb-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="mb-3 flex items-center gap-2 text-[hsl(var(--accent))]"><LockKeyhole size={14} /><span className="font-mono-ui text-[9px] uppercase tracking-[.14em]">Demo mode</span></div>
          <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">No real money moves. Every protection is simulated for this walkthrough.</p>
        </div>
        <button type="button" onClick={onReset} data-testid="button-reset-demo" className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-[11px] font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--foreground))]"><RotateCcw size={14} /> Reset live demo</button>
        <div className="mt-4 flex items-center gap-3 border-t border-[hsl(var(--sidebar-border))] pt-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--accent)/.16)] font-display text-[11px] font-bold text-[hsl(var(--accent))]">AK</div>
          <div><p className="text-[11px] font-semibold">Aarav K.</p><p className="font-mono-ui text-[9px] text-[hsl(var(--muted-foreground))]">Personal account</p></div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({ onReset }: { onReset: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-4 md:hidden">
      <BrandMark />
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Reset demo" onClick={onReset} data-testid="button-mobile-reset" className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><RotateCcw size={16} /></button>
        <button type="button" aria-label="Open menu" data-testid="button-mobile-menu" className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><Menu size={18} /></button>
      </div>
    </header>
  );
}

function StatusChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'lime' | 'aqua' | 'red' }) {
  const tones = {
    neutral: 'border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
    lime: 'border-[hsl(var(--primary)/.25)] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]',
    aqua: 'border-[hsl(var(--accent)/.25)] bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]',
    red: 'border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.08em] ${tones[tone]}`} data-testid="status-chip">{children}</span>;
}

function ScoreCard({ score }: { score: number }) {
  const dash = 2 * Math.PI * 48;
  const offset = dash - (score / 100) * dash;
  return (
    <section className="surface-grid relative overflow-hidden rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6" data-testid="card-distress-score">
      <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[hsl(var(--primary)/.08)] blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><Gauge size={15} className="text-[hsl(var(--primary))]" /><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Distress score</p><Info size={13} className="text-[hsl(var(--muted-foreground))]" /></div>
          <h1 className="mt-4 max-w-[470px] font-display text-[clamp(1.7rem,3.4vw,2.8rem)] font-semibold leading-[1.05] tracking-[-.055em]">A little early is a lot easier.</h1>
          <p className="mt-3 max-w-[390px] text-[12px] leading-relaxed text-[hsl(var(--muted-foreground))]">Horizon spotted pressure building around your next 14 days and prepared a few quiet ways to soften it.</p>
        </div>
        <div className="relative hidden h-[126px] w-[126px] shrink-0 sm:block" data-testid="display-score-gauge">
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <circle cx="60" cy="60" r="48" fill="none" stroke="hsl(217 22% 24%)" strokeWidth="8" />
            <circle className="score-ring" cx="60" cy="60" r="48" fill="none" stroke="hsl(72 100% 67%)" strokeWidth="8" strokeLinecap="round" strokeDasharray={dash} strokeDashoffset={offset} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><strong className="font-display text-3xl font-semibold tracking-[-.06em]">{score}</strong><span className="font-mono-ui text-[8px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">today</span></div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[hsl(var(--border))] pt-4">
        <div><span className="font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">RECOVERY TARGET</span><div className="mt-1 flex items-center gap-2"><span className="font-display text-[18px] font-semibold text-[hsl(var(--primary))]">34</span><ArrowDownRight size={14} className="text-[hsl(var(--primary))]" /><span className="text-[11px] text-[hsl(var(--muted-foreground))]">with protections on</span></div></div>
        <div className="h-8 w-px bg-[hsl(var(--border))]" />
        <div><span className="font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">CASH YOU CAN RELY ON</span><div className="mt-1 font-display text-[18px] font-semibold">{money(10000)}<span className="ml-1 text-[11px] font-normal text-[hsl(var(--muted-foreground))]">floor</span></div></div>
      </div>
    </section>
  );
}

function FlowRail({ flow }: { flow: FlowState }) {
  const current = flow === 'idle' ? 1 : flow === 'pending' ? 2 : 3;
  const steps = ['signal', 'consent', 'protected'];
  return (
    <div className="mb-5 flex items-center gap-2" data-testid="flow-steps">
      {steps.map((step, index) => <div key={step} className="flex flex-1 items-center gap-2"><div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono-ui text-[10px] font-medium ${index + 1 <= current ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'}`}>{index + 1 <= current ? <Check size={12} strokeWidth={3} /> : index + 1}</div><span className={`hidden font-mono-ui text-[9px] uppercase tracking-[.12em] sm:block ${index + 1 <= current ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{step}</span>{index < 2 ? <div className={`h-px flex-1 ${index + 1 < current ? 'bg-[hsl(var(--primary)/.7)]' : 'bg-[hsl(var(--border))]'}`} /> : null}</div>)}
    </div>
  );
}

function GuardianFlow({ flow, setFlow }: { flow: FlowState; setFlow: (flow: FlowState) => void }) {
  return (
    <section className="rounded-[22px] border border-[hsl(var(--primary)/.35)] bg-[hsl(224 27% 16%)] p-5 shadow-[0_16px_55px_hsl(72_100%_67%/.05)] sm:p-6" data-testid="card-live-demo">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div><div className="flex items-center gap-2"><span className="live-dot h-2 w-2 rounded-full bg-[hsl(var(--primary))]" /><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Interactive demo</span></div><h2 className="mt-2 font-display text-xl font-semibold tracking-[-.04em]">Catch the wobble.</h2></div>
        <StatusChip tone="aqua"><LockKeyhole size={11} /> simulated</StatusChip>
      </div>
      <FlowRail flow={flow} />
      {flow === 'idle' ? (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] p-4" data-testid="state-demo-idle">
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--destructive)/.13)] text-[hsl(var(--destructive))]"><CreditCard size={17} /></div><div><p className="text-[12px] font-semibold">A large UPI payment is about to land</p><p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">₹16,000 to <span className="text-[hsl(var(--foreground))]">Northstar Electronics</span> would leave only ₹6,420 — below your reliable floor.</p></div></div>
          <div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--border))] pt-3"><span className="font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">WHY THIS MATTERS <Info size={11} className="ml-1 inline" /></span><button type="button" onClick={() => setFlow('pending')} data-testid="button-launch-upi" className="btn-lime flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-3.5 py-2.5 text-[11px] font-bold text-[hsl(var(--primary-foreground))]">Launch ₹16,000 UPI <ArrowUpRight size={14} /></button></div>
        </div>
      ) : flow === 'pending' ? (
        <div className="rounded-2xl border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--accent)/.06)] p-4" data-testid="state-guardian-pending">
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.13)] text-[hsl(var(--accent))]"><Bell size={17} /></div><div><p className="text-[12px] font-semibold">Guardian authorization requested</p><p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">Your chosen guardian would see the amount and reason. In this demo, we are simulating their response — no message is sent.</p></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setFlow('approved')} data-testid="button-approve-guardian" className="flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-3 py-2.5 text-[11px] font-bold text-[hsl(var(--primary-foreground))]"><Check size={14} /> Approve</button><button type="button" onClick={() => setFlow('denied')} data-testid="button-deny-guardian" className="flex items-center justify-center gap-2 rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-[11px] font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"><X size={14} /> Deny</button></div>
        </div>
      ) : flow === 'approved' ? (
        <div className="rounded-2xl border border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.07)] p-4" data-testid="state-demo-approved">
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary)/.16)] text-[hsl(var(--primary))]"><ShieldCheck size={17} /></div><div><p className="text-[12px] font-semibold">Protected with consent</p><p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">The simulated guardian approved. Your floor stays visible, your choice stays yours, and the pressure score settles.</p></div></div>
          <div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--primary)/.15)] pt-3"><div><span className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">DISTRESS SCORE</span><div className="mt-1 flex items-center gap-2 font-display text-xl font-semibold"><span className="text-[hsl(var(--muted-foreground))] line-through">68</span><ArrowDownRight size={15} className="text-[hsl(var(--primary))]" /><span className="text-[hsl(var(--primary))]">34</span></div></div><StatusChip tone="lime"><CheckCircle2 size={11} /> floor intact</StatusChip></div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.06)] p-4" data-testid="state-demo-denied">
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]"><ShieldAlert size={17} /></div><div><p className="text-[12px] font-semibold">Payment held for now</p><p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">No money moved. The payment is simulated as held so you can review the decision without pressure.</p></div></div>
          <button type="button" onClick={() => setFlow('idle')} data-testid="button-restart-upi" className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-[hsl(var(--primary))]">Review again <ChevronRight size={14} /></button>
        </div>
      )}
      <p className="mt-4 flex items-center gap-1.5 font-mono-ui text-[9px] leading-relaxed text-[hsl(var(--muted-foreground))]"><FileKey2 size={12} /> consent-first protection · live connections are simulated for this judge demo</p>
    </section>
  );
}

function ActionCard({ icon: Icon, eyebrow, title, description, children, tone = 'aqua', testId }: { icon: typeof Activity; eyebrow: string; title: string; description: string; children: ReactNode; tone?: 'aqua' | 'lime' | 'red'; testId: string }) {
  const iconTone = tone === 'lime' ? 'bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]' : tone === 'red' ? 'bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]' : 'bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]';
  return <article className="action-card rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4" data-testid={testId}><div className="flex gap-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconTone}`}><Icon size={17} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">{eyebrow}</p>{children}</div><h3 className="mt-2 text-[13px] font-semibold">{title}</h3><p className="mt-1.5 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">{description}</p></div></div></article>;
}

function InsightList({ collisionResolved, setCollisionResolved, zombiePaused, setZombiePaused }: { collisionResolved: boolean; setCollisionResolved: (value: boolean) => void; zombiePaused: boolean; setZombiePaused: (value: boolean) => void }) {
  return (
    <section id="signals" className="mt-7" data-testid="section-signals">
      <div className="mb-3 flex items-end justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Signals becoming choices</p><h2 className="mt-1 font-display text-xl font-semibold tracking-[-.04em]">Small interventions, timed well.</h2></div><span className="hidden text-[11px] text-[hsl(var(--muted-foreground))] sm:block">3 active protections</span></div>
      <div className="grid gap-3 lg:grid-cols-3">
        <ActionCard icon={ReceiptText} eyebrow="Commitment collision" title={collisionResolved ? 'EMI protected · gym paused' : 'EMI vs. gym subscription'} description={collisionResolved ? '₹1,800 EMI gets the runway. The ₹1,500 gym subscription is paused for 30 days, not cancelled.' : 'Two commitments land inside the same 48-hour window. Horizon ranked the essential one first.'} tone="lime" testId="card-commitment-collision">
          {collisionResolved ? <StatusChip tone="lime"><Check size={11} /> resolved</StatusChip> : <button type="button" onClick={() => setCollisionResolved(true)} data-testid="button-resolve-collision" className="rounded-lg border border-[hsl(var(--primary)/.35)] px-2.5 py-1.5 text-[10px] font-bold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.1)]">Prioritize EMI</button>}
        </ActionCard>
        <ActionCard icon={Pause} eyebrow="Quiet leak found" title={zombiePaused ? 'Streambox paused · ₹2,400 kept' : 'A subscription you stopped using'} description={zombiePaused ? 'Streambox is paused. That is ₹200/month, or ₹2,400/year, no longer leaking quietly.' : 'Streambox has not been opened in 62 days. Keeping it costs ₹2,400 a year.'} tone="red" testId="card-zombie-subscription">
          {zombiePaused ? <StatusChip tone="lime"><Check size={11} /> leakage stopped</StatusChip> : <button type="button" onClick={() => setZombiePaused(true)} data-testid="button-pause-zombie" className="rounded-lg border border-[hsl(var(--destructive)/.35)] px-2.5 py-1.5 text-[10px] font-bold text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/.1)]">Pause +₹2,400</button>}
        </ActionCard>
        <ActionCard icon={Zap} eyebrow="Seasonal buffer" title="Electricity spike · ₹9,000 runway" description="Summer usage usually adds ₹9,000. Micro-savings are building a buffer before the first high bill." tone="aqua" testId="card-seasonal-buffer">
          <StatusChip tone="aqua"><Target size={11} /> August</StatusChip>
        </ActionCard>
      </div>
    </section>
  );
}

function BufferCard({ saved, setSaved }: { saved: number; setSaved: (value: number) => void }) {
  const target = 9000;
  const progress = Math.min(100, Math.round((saved / target) * 100));
  const add = () => setSaved(Math.min(target, saved + 750));
  return (
    <section id="protections" className="mt-7 grid gap-4 lg:grid-cols-[1.35fr_.65fr]" data-testid="section-protections">
      <div className="rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[hsl(var(--accent))]" /><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Ring-fenced buffer</p></div><h2 className="mt-2 font-display text-xl font-semibold tracking-[-.04em]">Keep future-you comfortable.</h2></div><span className="font-mono-ui text-[11px] text-[hsl(var(--accent))]">{progress}%</span></div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--accent))] transition-all duration-500" style={{ width: `${Math.max(progress, 3)}%` }} /></div>
        <div className="mt-3 flex items-center justify-between text-[11px]"><span className="text-[hsl(var(--muted-foreground))]">{money(saved)} saved</span><span className="font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">goal {money(target)}</span></div>
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.4)] p-3.5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-2.5"><Sparkles size={15} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" /><p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]"><span className="font-semibold text-[hsl(var(--foreground))]">One micro-save at a time.</span> Add ₹750 to the simulated electricity buffer.</p></div><button type="button" onClick={add} disabled={saved >= target} data-testid="button-add-microsave" className="shrink-0 rounded-lg bg-[hsl(var(--primary))] px-3 py-2 text-[10px] font-bold text-[hsl(var(--primary-foreground))] disabled:cursor-not-allowed disabled:opacity-40">{saved >= target ? 'Buffer ready' : 'Add ₹750'}</button></div>
      </div>
      <div className="rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(185_78%_68%/.06)] p-5 sm:p-6"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--accent))]">Your safety floor</p><div className="mt-4 font-display text-4xl font-semibold tracking-[-.07em]">{money(10000)}</div><p className="mt-2 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">A floor is not a restriction. It is the amount Horizon protects before asking you to pause and choose.</p><div className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[hsl(var(--accent))]"><LockKeyhole size={13} /> Based on your upcoming essentials</div></div>
    </section>
  );
}

function ActivityStrip({ flow, collisionResolved, zombiePaused }: { flow: FlowState; collisionResolved: boolean; zombiePaused: boolean }) {
  const entries = useMemo(() => [
    { icon: flow === 'approved' ? CheckCircle2 : flow === 'denied' ? ShieldAlert : Clock3, text: flow === 'approved' ? 'UPI protection approved' : flow === 'denied' ? 'UPI held for review' : 'UPI signal waiting for your choice', time: 'just now', tone: flow === 'approved' ? 'text-[hsl(var(--primary))]' : flow === 'denied' ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--muted-foreground))]' },
    { icon: collisionResolved ? CheckCircle2 : ReceiptText, text: collisionResolved ? 'EMI prioritized · gym paused' : 'Commitment collision identified', time: '2 min ago', tone: collisionResolved ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--accent))]' },
    { icon: zombiePaused ? CheckCircle2 : Pause, text: zombiePaused ? 'Streambox leakage stopped' : 'Subscription leakage surfaced', time: '6 min ago', tone: zombiePaused ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--destructive))]' },
  ], [collisionResolved, flow, zombiePaused]);
  return <section id="commitments" className="mt-7 border-t border-[hsl(var(--border))] pt-6" data-testid="section-activity"><div className="mb-4 flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Protection log</p><h2 className="mt-1 font-display text-lg font-semibold tracking-[-.035em]">What changed, in plain view.</h2></div><button type="button" data-testid="button-view-history" className="flex items-center gap-1 text-[10px] font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">View history <ChevronRight size={13} /></button></div><div className="mini-scrollbar flex gap-3 overflow-x-auto pb-2">{entries.map(({ icon: Icon, text, time, tone }, index) => <div key={text} className="min-w-[245px] flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] p-3"><div className="flex items-center gap-2"><Icon size={14} className={tone} /><span className="font-mono-ui text-[9px] text-[hsl(var(--muted-foreground))]">{time}</span></div><p className="mt-2 text-[11px] font-semibold">{text}</p><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">Consent and context recorded</p></div>)}</div></section>;
}

function Home() {
  const [flow, setFlow] = useState<FlowState>('idle');
  const [collisionResolved, setCollisionResolved] = useState(false);
  const [zombiePaused, setZombiePaused] = useState(false);
  const [saved, setSaved] = useState(2250);
  const score = flow === 'approved' ? 34 : 68;
  const reset = () => { setFlow('idle'); setCollisionResolved(false); setZombiePaused(false); setSaved(2250); };
  return (
    <div className="noise flex min-h-[100dvh] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Sidebar onReset={reset} />
      <div className="min-w-0 flex-1">
        <MobileHeader onReset={reset} />
        <main id="overview" className="mx-auto max-w-[1400px] px-4 pb-12 pt-6 sm:px-7 sm:pt-8 lg:px-10">
          <header className="entrance mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><div className="mb-2 flex items-center gap-2"><span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">Tuesday · 09 July 2024</span><span className="h-1 w-1 rounded-full bg-[hsl(var(--muted-foreground))]" /><StatusChip tone="aqua"><span className="live-dot h-1.5 w-1.5 rounded-full bg-current" /> demo environment</StatusChip></div><h2 className="font-display text-[clamp(1.8rem,3.5vw,2.65rem)] font-semibold tracking-[-.06em]">Good morning, Aarav.</h2><p className="mt-2 text-[12px] text-[hsl(var(--muted-foreground))]">Here is what your money is trying to tell you before it becomes urgent.</p></div>
            <div className="flex items-center gap-3"><div className="hidden items-center gap-2 text-right sm:flex"><p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Last checked</p><p className="text-[11px] font-semibold">a moment ago</p></div><button type="button" data-testid="button-notifications" className="relative rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"><Bell size={16} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" /></button></div>
          </header>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(380px,.72fr)]">
            <div className="entrance entrance-2 min-w-0"><ScoreCard score={score} /><InsightList collisionResolved={collisionResolved} setCollisionResolved={setCollisionResolved} zombiePaused={zombiePaused} setZombiePaused={setZombiePaused} /><BufferCard saved={saved} setSaved={setSaved} /><ActivityStrip flow={flow} collisionResolved={collisionResolved} zombiePaused={zombiePaused} /></div>
            <div className="entrance entrance-3 xl:sticky xl:top-6 xl:self-start"><GuardianFlow flow={flow} setFlow={setFlow} /><div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] p-4"><div className="flex gap-3"><HelpCircle size={15} className="mt-0.5 shrink-0 text-[hsl(var(--muted-foreground))]" /><div><p className="text-[11px] font-semibold">Why Horizon feels different</p><p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">It never silently declines or moves money. It explains the signal, asks for consent, then helps you act.</p></div></div></div><div className="mt-4 flex items-center gap-3 px-1 text-[10px] text-[hsl(var(--muted-foreground))]"><Landmark size={14} /><span>Bank connections, UPI, and guardian actions are simulated.</span></div></div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;