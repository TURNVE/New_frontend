import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';

import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const services = [
  {
    title: 'Career Proof Planning',
    description: 'Turn your goals into a clear practice path with outputs employers can inspect.',
    icon: ClipboardCheck,
    tone: 'bg-[#eaf4ff] border-[#bfe0ff]',
    accent: 'bg-[#0a142f]',
  },
  {
    title: 'Simulation Rooms',
    description: 'Practise product, operations, analyst, and business decisions in realistic rooms.',
    icon: BriefcaseBusiness,
    tone: 'bg-[#eef1fb] border-[#d4d9f1]',
    accent: 'bg-[#23305f]',
  },
  {
    title: 'AI Feedback',
    description: 'Get simple notes on your judgment, tradeoffs, writing, and next best action.',
    icon: BrainCircuit,
    tone: 'bg-[#e9f7f3] border-[#bfe2d9]',
    accent: 'bg-[#087989]',
  },
  {
    title: 'Portfolio Reports',
    description: 'Convert your work into decision logs, briefs, and interview-ready case proof.',
    icon: FileText,
    tone: 'bg-[#f2f5ff] border-[#d3ddfb]',
    accent: 'bg-[#0b6bff]',
  },
  {
    title: 'Talent Screening',
    description: 'Help teams in Nigeria compare practical readiness before final interviews.',
    icon: UsersRound,
    tone: 'bg-[#f5f7fa] border-[#dce4ec]',
    accent: 'bg-[#111827]',
  },
  {
    title: 'Readiness Analytics',
    description: 'Track skill signals across communication, prioritization, and business thinking.',
    icon: BarChart3,
    tone: 'bg-[#e8f2ff] border-[#c7ddf8]',
    accent: 'bg-[#123a6f]',
  },
];

const processSteps = [
  ['01. Goals', 'Choose your role path and career target.'],
  ['02. Brief', 'Enter a realistic workplace scenario.'],
  ['03. Work', 'Make decisions and submit useful outputs.'],
  ['04. Review', 'Get feedback and improve your proof.'],
];

function ServiceMockup({ index, accent }: { index: number; accent: string }) {
  return (
    <div className="relative flex h-[255px] items-center justify-center overflow-hidden rounded-[22px]">
      <div className="absolute inset-5 rounded-[18px] border border-white/70 bg-white/36" />
      {index % 3 === 0 ? (
        <div className={`relative w-44 rounded-2xl p-5 text-white shadow-[0_26px_70px_-38px_rgba(9,35,67,0.85)] ${accent}`}>
          <p className="text-xs font-black">TURNVE</p>
          <div className="mt-12 h-2 w-20 rounded bg-white/30" />
          <div className="mt-3 h-2 w-28 rounded bg-white/70" />
        </div>
      ) : index % 3 === 1 ? (
        <div className="relative w-48 space-y-4">
          {['Brief', 'Decision', 'Report'].map((label) => (
            <div key={label} className="rounded-xl bg-white p-4 shadow-[0_18px_45px_-30px_rgba(9,35,67,0.75)]">
              <p className="text-sm font-black text-slate-950">{label}</p>
              <div className="mt-2 h-2 w-28 rounded bg-[#b8d7ff]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative grid h-40 w-40 place-items-center rounded-2xl border border-white/80 bg-white shadow-[0_24px_58px_-35px_rgba(9,35,67,0.78)]">
          <div className="grid h-24 w-24 place-items-center rounded-full border-8 border-double border-slate-950">
            <Sparkles className="h-8 w-8 text-[#0b6bff]" />
          </div>
        </div>
      )}
    </div>
  );
}

function ServicesPage() {
  return (
    <MarketingPageShell className="bg-white">
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(115deg,#f3f7ff_0%,#fff7f0_58%,#ffffff_100%)] px-5 py-20 text-center">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#0a142f10_1px,transparent_1px),linear-gradient(90deg,#0a142f10_1px,transparent_1px)] [background-size:72px_72px]" />
          <ScrollReveal className="relative mx-auto max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0b6bff]">
              Services
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Practical career services for real proof.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-slate-600">
              TURNVE helps Nigerian talent practise workplace tasks, receive AI feedback,
              build portfolio proof, and show employers they are ready.
            </p>
          </ScrollReveal>
        </section>

        <section className="bg-white px-5 py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal
                  key={service.title}
                  as="article"
                  delay={index * 0.08}
                  className="group overflow-hidden rounded-[28px] border border-[#dbe7f6] bg-white p-4 shadow-[0_24px_80px_-58px_rgba(9,35,67,0.78)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_-56px_rgba(9,35,67,0.92)]"
                >
                  <div className={`rounded-[24px] border p-4 ${service.tone}`}>
                    <ServiceMockup index={index} accent={service.accent} />
                  </div>
                  <div className="flex items-start gap-4 px-2 pb-2 pt-6">
                    <span className={`grid h-11 w-11 flex-none place-items-center rounded-xl text-white shadow-[0_14px_34px_-22px_rgba(9,35,67,0.9)] ${service.accent}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-[25px] font-black leading-tight tracking-[-0.04em] text-[#0a142f]">
                        {service.title}
                      </h2>
                      <p className="mt-3 text-[15px] font-semibold leading-7 text-[#5f748c]">
                        {service.description}
                      </p>
                      <a
                        href="/sign-up"
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#bfd4ec] px-4 py-2 text-sm font-black text-[#0a142f] transition hover:border-[#0b6bff] hover:text-[#0b6bff]"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        <section className="mx-5 rounded-[2rem] border border-[#dbe7f6] bg-white px-5 py-20 text-center shadow-[0_28px_100px_-76px_rgba(9,35,67,0.75)] sm:mx-8">
          <ScrollReveal className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-black tracking-tight text-slate-950">The best process</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
              We keep the work simple: set a goal, practise a real task, get feedback, then
              turn the result into proof.
            </p>
          </ScrollReveal>
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-4">
            {processSteps.map(([title, description], index) => (
              <ScrollReveal
                key={title}
                as="article"
                delay={index * 0.08}
                className="rounded-3xl bg-[#f6faff] p-7 text-center shadow-[0_20px_60px_-48px_rgba(9,35,67,0.72)]"
              >
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#0b6bff] shadow-[0_18px_40px_-30px_rgba(9,35,67,0.8)]">
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-sm font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{description}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:py-24">
          <ScrollReveal className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                  We provide high quality and cost effective career proof.
                </h2>
                <p className="mt-6 max-w-2xl text-sm font-medium leading-7 text-white/70">
                  Our team helps talent and companies move from vague claims to clear work
                  evidence through simulations, feedback, and simple reporting.
                </p>
                <div className="mt-8 grid gap-4 text-sm font-semibold text-white/80 sm:grid-cols-3">
                  {['Flexible practice', 'Creative proof outputs', 'Custom talent programs'].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#7db7ff]" />
                      {item}
                    </span>
                  ))}
                </div>
                <a
                  href="/business"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-blue-50"
                >
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="relative min-h-[280px] rounded-[2rem] border border-white/10 bg-white/[0.03]">
                <div className="absolute right-10 top-8 h-72 w-72 rounded-[5rem] border border-white/15 rotate-45" />
                <div className="absolute bottom-12 left-10 h-40 w-40 rounded-full border border-[#0b6bff]/35" />
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </MarketingPageShell>
  );
}

export default ServicesPage;
