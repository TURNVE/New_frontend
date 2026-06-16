import { ArrowRight, BarChart3, BrainCircuit, BriefcaseBusiness, FileText, Sparkles, UsersRound } from 'lucide-react';

import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const heroImages = [
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=82',
];

const featureTiles = [
  {
    title: 'Decision practice',
    text: 'Real work calls.',
    icon: BriefcaseBusiness,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'AI feedback',
    text: 'Clear next steps.',
    icon: BrainCircuit,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'Portfolio proof',
    text: 'Reports to share.',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'Team rooms',
    text: 'Practice together.',
    icon: UsersRound,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'Readiness scores',
    text: 'Track growth.',
    icon: BarChart3,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'Role tracks',
    text: 'Focused paths.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=82',
  },
];

function FeaturesHero() {
  return (
    <section className="bg-[#0a142f] px-5 pb-20 pt-20 text-white sm:pt-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <ScrollReveal className="lg:pr-4">
          <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-black text-[#7db7ff]">
            Practical proof features
          </span>
          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl">
            See skill before the interview.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-white/68">
            Simulations, feedback, and proof for people, companies, and institutions.
          </p>
          <a
            href="/program1"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#0b6bff] px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-[#0758d8]"
          >
            Try TURNVE
            <ArrowRight className="h-4 w-4" />
          </a>
        </ScrollReveal>

        <ScrollReveal className="grid gap-4 sm:grid-cols-5" direction="left">
          <img
            src={heroImages[0]}
            alt="Team reviewing practical work"
            className="h-80 w-full rounded-3xl object-cover sm:col-span-3 sm:h-[430px]"
          />
          <div className="space-y-4 sm:col-span-2">
            <img src={heroImages[1]} alt="Learner practicing online" className="h-48 w-full rounded-3xl object-cover" />
            <img src={heroImages[2]} alt="Company team collaboration" className="h-48 w-full rounded-3xl object-cover" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="bg-white px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal as="section" className="max-w-3xl">
          <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.045em] text-[#0a142f] sm:text-6xl">
          Less theory. More visible work.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureTiles.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal
                key={feature.title}
                as="article"
                delay={index * 0.08}
                className="group overflow-hidden rounded-3xl bg-[#f3f7ff] shadow-[0_22px_70px_-54px_rgba(9,35,67,0.9)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#0b6bff] shadow-lg">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black tracking-[-0.035em] text-[#0a142f]">{feature.title}</h3>
                  <p className="mt-2 text-base font-semibold text-slate-600">{feature.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureStory() {
  return (
    <section className="bg-[#d8eaff] px-5 py-20 sm:py-24">
      <ScrollReveal className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-[#0a142f] lg:grid-cols-[0.86fr_1.14fr]">
        <div className="p-8 text-white sm:p-12 lg:p-14">
          <h2 className="text-4xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
            Built for real teams and real job paths.
          </h2>
          <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-white/66">
            Use TURNVE to assign tasks, review outputs, and see readiness clearly.
          </p>
          <a href="/services" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-[#0a142f]">
            Explore services
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=82"
            alt="Professional team collaborating"
            className="h-[420px] w-full object-cover lg:h-full"
            loading="lazy"
          />
      </ScrollReveal>
    </section>
  );
}

function FeaturesPage() {
  return (
    <MarketingPageShell headerVariant="dark" className="bg-white font-inter">
      <main>
        <FeaturesHero />
        <FeatureGrid />
        <FeatureStory />
      </main>
    </MarketingPageShell>
  );
}

export default FeaturesPage;
