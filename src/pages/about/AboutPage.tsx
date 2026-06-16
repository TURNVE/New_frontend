import { ArrowRight, BadgeCheck, BrainCircuit, BriefcaseBusiness, ShieldCheck } from 'lucide-react';

import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { MissionPanel } from '../../components/marketing/MissionPanel';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=82',
    alt: 'TURNVE team planning practical simulation work',
  },
  {
    src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82',
    alt: 'Learner building portfolio proof on a laptop',
  },
  {
    src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82',
    alt: 'Team reviewing real workplace tasks',
  },
];

const proofCards = [
  {
    title: 'Practice',
    text: 'Real workplace tasks, not only lessons.',
    icon: BriefcaseBusiness,
    image:
      'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'Feedback',
    text: 'AI notes that show what to improve.',
    icon: BrainCircuit,
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'Proof',
    text: 'Reports and decision logs for interviews.',
    icon: BadgeCheck,
    image:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=82',
  },
];

const stats = [
  ['15k+', 'portfolio outputs'],
  ['30k+', 'practice decisions'],
  ['12+', 'role tracks'],
];

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(115deg,#f3f7ff_0%,#fff7f0_58%,#ffffff_100%)] px-5 py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#0a142f10_1px,transparent_1px),linear-gradient(90deg,#0a142f10_1px,transparent_1px)] [background-size:72px_72px]" />
      <ScrollReveal className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0b6bff]">
            About TURNVE
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-[clamp(2.6rem,8vw,4.75rem)] font-normal leading-[0.98] tracking-[-0.05em] text-slate-950 lg:mx-0 lg:text-[clamp(3.4rem,4.5vw,5.8rem)]">
            We help talent show real work.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base font-normal leading-7 text-slate-600 lg:mx-0">
            TURNVE helps Nigerian graduates, NYSC members, switchers, and junior talent
            practise workplace tasks and build proof employers can trust.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b6bff] px-6 py-4 text-sm font-normal text-white transition hover:-translate-y-0.5 hover:bg-[#0758d8]"
            >
              Start building proof
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/team"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-normal text-slate-950 transition hover:-translate-y-0.5 hover:border-[#0b6bff] hover:text-[#0b6bff]"
            >
              Meet the team
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ScrollReveal className="space-y-4 sm:col-span-1 lg:col-span-2" direction="left">
            <img
              src={heroImages[0].src}
              alt={heroImages[0].alt}
              className="h-40 w-full rounded-3xl object-cover sm:h-52 lg:h-72"
            />
            <div className="rounded-3xl bg-slate-950 p-5 text-white sm:p-6">
              <p className="text-3xl font-normal tracking-[-0.04em] sm:text-4xl">47%</p>
              <p className="mt-2 text-sm font-normal leading-6 text-white/70">
                readiness growth after guided practice.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal className="space-y-4 sm:col-span-1 lg:col-span-3" direction="right">
            <img
              src={heroImages[1].src}
              alt={heroImages[1].alt}
              className="h-48 w-full rounded-3xl object-cover sm:h-56 lg:h-80"
            />
            <img
              src={heroImages[2].src}
              alt={heroImages[2].alt}
              className="h-36 w-full rounded-3xl object-cover sm:h-40 lg:h-52"
            />
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </section>
  );
}

function ProofCards() {
  return (
    <section className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0b6bff]">
            What we do
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            From learning to visible proof.
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proofCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <ScrollReveal
                key={card.title}
                as="article"
                delay={index * 0.08}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#0b6bff]">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-normal tracking-[-0.03em] text-slate-950 sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm font-normal leading-6 text-slate-600">{card.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NigeriaSection() {
  return (
    <section className="px-5 pb-16 sm:pb-24">
      <ScrollReveal className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950 lg:grid-cols-[1fr_0.9fr]">
        <div className="p-7 text-white sm:p-10 lg:p-16">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7db7ff]">
            Built for Nigeria
          </p>
          <h2 className="mt-5 max-w-2xl text-balance text-[clamp(2rem,5vw,3.8rem)] font-normal leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            Career proof for a crowded job market.
          </h2>
          <p className="mt-5 max-w-xl text-sm font-normal leading-7 text-white/70">
            We focus on the gap between “I learned it” and “I can do it.” TURNVE makes
            that proof simple to practise, review, and share.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="text-2xl font-normal tracking-[-0.04em] text-white sm:text-3xl">
                  {value}
                </p>
                <p className="mt-2 text-xs font-normal uppercase tracking-wide text-white/52">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1100&q=82"
            alt="Nigerian-style professional team collaborating"
            className="absolute inset-0 h-full w-full object-cover opacity-86"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />
        </div>
      </ScrollReveal>
    </section>
  );
}

function ValuesStrip() {
  return (
    <section className="bg-slate-50 px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Simple', 'Grade-5 clear writing. No career jargon.'],
          ['Practical', 'Tasks that mirror real team decisions.'],
          ['Trusted', 'Proof that employers can inspect.'],
        ].map(([title, text], index) => (
          <ScrollReveal
            key={title}
            as="article"
            delay={index * 0.07}
            className="rounded-3xl bg-white p-6 sm:p-7"
          >
            <ShieldCheck className="h-6 w-6 text-[#0b6bff]" />
            <h3 className="mt-6 text-xl font-normal tracking-[-0.03em] text-slate-950 sm:text-2xl">
              {title}
            </h3>
            <p className="mt-3 text-sm font-normal leading-6 text-slate-600">{text}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <MarketingPageShell id="top" className="bg-white font-inter">
      <main>
        <AboutHero />
        <ProofCards />
        <NigeriaSection />
        <MissionPanel />
        <ValuesStrip />
      </main>
    </MarketingPageShell>
  );
}

export default AboutPage;
