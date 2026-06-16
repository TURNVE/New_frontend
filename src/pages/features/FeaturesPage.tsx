import { ArrowRight, BarChart3, BrainCircuit, BriefcaseBusiness, FileText, Sparkles, UsersRound } from 'lucide-react';

import { AutoplayVideo } from '../../components/media/AutoplayVideo';
import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const heroVideo =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4';

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
    <section className="relative isolate overflow-hidden bg-[#071126] px-5 py-24 text-white sm:py-28 lg:min-h-[82dvh] lg:py-32">
      <img
        src="/images/video-posters/hero-fallback.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <AutoplayVideo
        src={heroVideo}
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[#071126]/78" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(11,107,255,0.26),transparent_34%),linear-gradient(90deg,rgba(7,17,38,0.96),rgba(7,17,38,0.76)_46%,rgba(7,17,38,0.62))]" />

      <div className="mx-auto flex min-h-[58dvh] max-w-6xl items-center">
        <ScrollReveal className="max-w-3xl">
          <span className="inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-normal text-[#9bc7ff] backdrop-blur">
            Practical proof features
          </span>
          <h1 className="mt-7 max-w-2xl text-5xl font-normal leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
            See skill before the interview.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-8 text-white/72">
            Simulations, feedback, and proof for people, companies, and institutions.
          </p>
          <a
            href="/program1"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b6bff] px-6 py-4 text-sm font-normal text-white transition hover:-translate-y-0.5 hover:bg-[#0758d8]"
          >
            Try TURNVE
            <ArrowRight className="h-4 w-4" />
          </a>
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
          <h2 className="max-w-2xl text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0a142f] sm:text-4xl">
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
                  <h3 className="text-xl font-normal tracking-[-0.02em] text-[#0a142f]">{feature.title}</h3>
                  <p className="mt-2 text-base font-normal text-slate-600">{feature.text}</p>
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
          <h2 className="text-3xl font-normal leading-tight tracking-[-0.03em] sm:text-4xl">
            Built for real teams and real job paths.
          </h2>
          <p className="mt-5 max-w-md text-sm font-normal leading-7 text-white/66">
            Use TURNVE to assign tasks, review outputs, and see readiness clearly.
          </p>
          <a href="/services" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-normal text-[#0a142f]">
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
