import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';

import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const servicePanels = [
  {
    eyebrow: 'For learners',
    title: 'Gain experience by doing real work.',
    description:
      'Use TURNVE simulations to practise workplace tasks. Make decisions, submit work, get feedback, and build proof for jobs.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82',
    icon: BriefcaseBusiness,
    cta: 'Start practising',
    href: '/sign-up',
  },
  {
    eyebrow: 'For organizations',
    title: 'Create simulations for teams and talent.',
    description:
      'Train staff, test job candidates, and run internship programs with practical simulations your team can review.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=82',
    icon: UsersRound,
    cta: 'Build simulations',
    href: '/business',
  },
];

const processSteps = [
  ['01. Goals', 'Choose your role path and career target.'],
  ['02. Brief', 'Enter a realistic workplace scenario.'],
  ['03. Work', 'Make decisions and submit useful outputs.'],
  ['04. Review', 'Get feedback and improve your proof.'],
];

function ServicesPage() {
  return (
    <MarketingPageShell className="bg-white">
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(115deg,#f3f7ff_0%,#fff7f0_58%,#ffffff_100%)] px-5 py-20 text-center">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#0a142f10_1px,transparent_1px),linear-gradient(90deg,#0a142f10_1px,transparent_1px)] [background-size:72px_72px]" />
          <ScrollReveal className="relative mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#0b6bff]">
              Services
            </p>
            <h1 className="mt-5 text-4xl font-normal tracking-[-0.035em] text-slate-950 sm:text-5xl">
              Practical career services for real proof.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-7 text-slate-600">
              TURNVE helps Nigerian talent practise workplace tasks, receive AI feedback,
              build portfolio proof, and show employers they are ready.
            </p>
          </ScrollReveal>
        </section>

        <section className="bg-white px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl space-y-8">
            {servicePanels.map((service, index) => {
              const Icon = service.icon;
              const imageFirst = index % 2 === 1;

              return (
                <ScrollReveal
                  key={service.title}
                  as="article"
                  delay={index * 0.08}
                  className="grid overflow-hidden rounded-[30px] border border-[#dbe7f6] bg-white lg:grid-cols-2"
                >
                  <div className={`relative min-h-[320px] ${imageFirst ? 'lg:order-1' : ''}`}>
                    <img
                      src={service.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#061225]/16" />
                  </div>
                  <div className="flex min-h-[320px] flex-col justify-center p-7 sm:p-10 lg:p-12">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0b6bff] text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-7 text-xs font-medium uppercase tracking-[0.2em] text-[#0b6bff]">
                      {service.eyebrow}
                    </p>
                    <h2 className="mt-4 max-w-md text-2xl font-normal leading-tight tracking-[-0.025em] text-[#0a142f] sm:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-5 max-w-md text-base font-normal leading-7 text-[#5f748c]">
                      {service.description}
                    </p>
                    <a
                      href={service.href}
                      className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#0b6bff] px-5 py-3 text-sm font-normal text-white transition hover:bg-[#0758d8]"
                    >
                      {service.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        <section className="mx-5 rounded-[2rem] border border-[#dbe7f6] bg-white px-5 py-20 text-center shadow-[0_28px_100px_-76px_rgba(9,35,67,0.75)] sm:mx-8">
          <ScrollReveal className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-normal tracking-[-0.025em] text-slate-950">The best process</h2>
            <p className="mt-4 text-sm font-normal leading-6 text-slate-600">
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
                <h3 className="mt-6 text-sm font-medium text-slate-950">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{description}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:py-24">
          <ScrollReveal className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h2 className="max-w-2xl text-3xl font-normal tracking-[-0.025em] sm:text-4xl">
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
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-normal text-slate-950 transition hover:bg-blue-50"
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
