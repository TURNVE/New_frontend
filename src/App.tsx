import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  School,
  UserRound,
} from 'lucide-react';

import { AnimatedGroup } from './components/ui/animated-group';
import { AutoplayVideo } from './components/media/AutoplayVideo';
import { MarketingPageShell } from './components/marketing/MarketingPageShell';
import { MissionPanel } from './components/marketing/MissionPanel';
import { ScrollReveal } from './components/ui/scroll-reveal';

const heroMedia = {
  video:
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4',
};

const featureCards = [
  {
    title: 'Team collaboration',
    description: 'Experience realistic work rooms and team decisions.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'Skill development',
    description: 'Build proof through briefs, tradeoffs, and work samples.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82',
  },
  {
    title: 'AI-powered insights',
    description: 'Get feedback that helps you improve before interviews.',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=82',
  },
];

const stackCards = [
  {
    label: 'Simulation 01',
    title: 'For companies',
    description:
      'Screen candidates with practical tasks, review decision logs, and compare readiness before interviews.',
    bullets: ['Candidate simulations', 'Comparable scorecards', 'Hiring proof reports'],
    tags: ['Screening', 'Hiring', 'Reports'],
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=82',
    icon: Building2,
    tint: 'bg-[#d8eaff]',
    ring: 'ring-[#afc8e3]',
    tagTone: 'bg-[#c1d0e3]',
  },
  {
    label: 'Simulation 02',
    title: 'For individuals',
    description:
      'Experience real workplace decisions, get AI feedback, and turn your work into a portfolio story.',
    bullets: ['AI feedback', 'Portfolio proof', 'Interview confidence'],
    tags: ['Experience', 'Proof', 'Growth'],
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82',
    icon: UserRound,
    tint: 'bg-[#e4e8f8]',
    ring: 'ring-[#c5cae4]',
    tagTone: 'bg-[#ccd1e9]',
  },
  {
    label: 'Simulation 03',
    title: 'For institutions',
    description:
      'Run practical career programs for cohorts, bootcamps, schools, and workforce development teams.',
    bullets: ['Cohort rooms', 'Progress tracking', 'Graduate readiness'],
    tags: ['Cohorts', 'Schools', 'Programs'],
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=82',
    icon: School,
    tint: 'bg-[#dff3ee]',
    ring: 'ring-[#b8d9d2]',
    tagTone: 'bg-[#c5e2dc]',
  },
];

const homeBlogPosts = [
  {
    title: 'How to prove workplace readiness without years of experience',
    author: 'Amina Okafor',
    date: 'Jun 12, 2026',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=82',
  },
  {
    title: 'Why companies should test practical judgment before interviews',
    author: 'Chinedu Eze',
    date: 'Jun 12, 2026',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=82',
  },
  {
    title: 'How institutions can run better career-readiness programs',
    author: 'Zainab Bello',
    date: 'Jun 12, 2026',
    image:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=82',
  },
];

function App() {
  return (
    <MarketingPageShell headerVariant="dark">
      <main>
        <Hero />
        
        {/* Integrations Section */}
        <IntegrationsSection />

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium uppercase tracking-wider mb-4">
                Why Choose TURNVE
              </div>
              <h2 className="text-2xl font-normal tracking-[-0.02em] text-gray-900 mb-4 sm:text-3xl">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-gray-600">
                Practical career platform for entry-level and transitioning professionals
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featureCards.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                />
              ))}
            </div>
          </div>
        </section>

        <SuperiorFeaturesSection />
        <SimulationStackSection />
        <HomeBlogSection />
        <MissionPanel />

        {/* CTA Section */}
        <section id="pricing" className="relative min-h-[520px] overflow-hidden px-5 py-24 text-white sm:py-28">
          <AutoplayVideo
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0a142f]/74" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(11,107,255,0.38),transparent_42%)]" />
          <ScrollReveal className="relative mx-auto flex min-h-[340px] max-w-5xl flex-col items-center justify-center text-center">
            <h2 className="max-w-2xl text-3xl font-normal leading-[1.08] tracking-[-0.03em] sm:text-4xl">
              Ready to transform your career?
            </h2>
            <p className="mt-6 max-w-2xl text-base font-normal leading-8 text-white/76">
              Experience real work, get feedback, and build proof employers can trust.
            </p>
            <Link
              to="/sign-up"
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-normal text-[#0a142f] transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </ScrollReveal>
        </section>
      </main>
    </MarketingPageShell>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-gray-950 text-white">
      <AutoplayVideo
        src={heroMedia.video}
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-gray-950/38" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(37,99,235,0.12),transparent_42%)]" />
      <div className="mx-auto flex min-h-[100dvh] max-w-5xl items-center px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="relative z-20 text-center sm:mx-auto">
          <AnimatedGroup preset="fade">
            <h1 className="mx-auto mt-8 max-w-[760px] text-balance text-[1.75rem] font-normal leading-[1.04] tracking-[-0.05em] text-white min-[390px]:text-[2.05rem] sm:text-[3rem] lg:mt-12 lg:text-[4.2rem]">
              <span className="block whitespace-nowrap">Theory Gets You Noticed.</span>
              <span className="block whitespace-nowrap">Experience Gets You Hired.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-7 text-white/72 sm:text-[16px]">
              Turn your career knowledge into demonstrable management experience with AI-guided simulations and real projects.
            </p>
            <div className="mt-9 flex justify-center">
              <div className="bg-white/15 rounded-[14px] border border-white/20 p-0.5">
                <Link
                  to="/sign-up"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm text-gray-950 transition-all hover:bg-blue-50 whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </div>
    </section>

  );
}




function IntegrationsSection() {

  const integrations = [
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "LinkedIn", url: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
    { name: "Slack", url: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png" },
    { name: "Microsoft", url: "https://cdn-icons-png.flaticon.com/512/174/174872.png" },
    { name: "Facebook", url: "https://cdn-icons-png.flaticon.com/512/733/733547.png" },
    { name: "Stripe", url: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png" },
    { name: "Dropbox", url: "https://cdn-icons-png.flaticon.com/512/888/888853.png" },
    { name: "Jira", url: "https://cdn-icons-png.flaticon.com/512/906/906324.png" },
    { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Square", url: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png" },
    { name: "Shopify", url: "https://cdn-icons-png.flaticon.com/512/732/732218.png" },
    { name: "Zapier", url: "https://cdn-icons-png.flaticon.com/512/5968/5968755.png" },
    { name: "Google Drive", url: "https://cdn-icons-png.flaticon.com/512/5968/5968520.png" },
    { name: "YouTube", url: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
    { name: "Airtable", url: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png" },
    { name: "Discord", url: "https://cdn-icons-png.flaticon.com/512/2111/2111370.png" },
  ];

  return (
    <section className="max-w-7xl mx-auto my-20 px-6">
      <ScrollReveal className="border border-gray-100 p-8 md:p-12 rounded-3xl bg-white">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <ScrollReveal className="space-y-6">
            <h2 className="text-2xl font-normal tracking-[-0.025em] text-gray-900 sm:text-3xl">
              Model organization-style workspaces
            </h2>
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              TURNVE recreates the way strong teams plan, review, and decide so learners can build proof inside
              realistic company-style workspaces without needing access to the actual organizations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/services"
                className="inline-flex items-center whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
              >
                Explore workspaces
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal className="grid grid-cols-4 gap-4" direction="left">
            {integrations.map((integration, idx) => (
              <div key={idx} className="w-14 h-14 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300">
                <img src={integration.url} alt={integration.name} className="w-full h-full object-contain" loading="lazy" />
              </div>
            ))}
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </section>
  );
}

function SuperiorFeaturesSection() {
  return (
    <section className="bg-[#d8eaff] px-5 py-16 text-[#10213f] sm:py-20">
      <div className="mx-auto max-w-[1180px]">
        <ScrollReveal className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <h2 className="max-w-2xl text-sm font-medium uppercase leading-6 tracking-[0.18em] text-[#10213f]/80">
            Superior simulation features that raise real readiness
          </h2>
          <p className="max-w-xl text-base font-normal leading-8 text-[#5a718b] lg:pt-4">
            TURNVE helps companies, individuals, and institutions run practical tasks,
            review decisions, and build trusted career proof.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.14fr_0.86fr]">
          <ScrollReveal as="article" className="relative min-h-[315px] overflow-hidden rounded-[20px] bg-[#07798a] p-7 text-white sm:p-10">
            <div className="relative z-10 grid h-full min-h-[250px] gap-8 sm:grid-cols-[0.9fr_1fr] sm:items-start">
              <div className="max-w-sm text-left">
                <h3 className="text-2xl font-normal leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                  Our mission is to look after talent readiness with practical proof
                </h3>
                <p className="mt-5 text-[15px] font-normal leading-7 text-white/74">
                  15k+ learners and teams move from claims to work samples,
                  decision logs, and readiness reports.
                </p>
              </div>
              <div className="hidden space-y-4 opacity-38 sm:block">
              {['Companies', 'Individuals', 'Institutions', 'Talent teams'].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/18 px-6 py-4 text-lg font-medium backdrop-blur-sm"
                  style={{ transform: `translateX(${index * 18}px)` }}
                >
                  {item}
                </div>
              ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal as="article" direction="left" className="rounded-[20px] bg-[#cbe9e8] p-7 sm:p-10">
            <h3 className="max-w-md text-2xl font-normal leading-tight tracking-[-0.02em] sm:text-3xl">
              Simulate and plan your career-readiness success
            </h3>
            <p className="mt-5 text-[15px] font-normal leading-7 text-[#5a718b]">
              Match role tracks with tasks, rubrics, feedback, and clear portfolio outputs.
            </p>
            <p className="mt-10 text-[38px] font-normal tracking-[-0.035em] text-[#d18473]">
              78% <span className="text-base font-medium tracking-normal text-[#10213f]">yearly growth</span>
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['Practice tasks', 'Work on clear briefs that feel like real jobs.'],
            ['Get feedback', 'See what was strong and what to improve next.'],
            ['Show proof', 'Turn decisions and outputs into simple reports.'],
          ].map(([title, text], index) => (
            <ScrollReveal
              key={title}
              as="article"
              delay={index * 0.08}
              className="rounded-[18px] border border-[#b7d0e8] bg-white/58 p-6 text-left"
            >
              <h3 className="text-xl font-normal tracking-[-0.02em] text-[#10213f]">{title}</h3>
              <p className="mt-3 text-sm font-normal leading-6 text-[#5a718b]">{text}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimulationStackSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="bg-white px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-[clamp(2rem,6vw,3rem)] font-normal leading-[1.08] tracking-[-0.035em] text-[#10213f] sm:text-[46px]">
            One platform, three practical paths
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-7 text-[#5a718b] sm:text-lg sm:leading-8">
            Scroll through practical simulations for companies, individuals, and institutions.
          </p>
        </div>

        <div ref={stackRef} className="relative h-[280vh] sm:h-[300vh] lg:h-[330vh]">
          <div className="sticky top-20 h-[calc(100vh-5rem)] sm:top-24 sm:h-[calc(100vh-7rem)]">
            {stackCards.map((card, index) => (
              <StackMotionCard key={card.title} card={card} index={index} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StackMotionCard({
  card,
  index,
  progress,
}: {
  card: (typeof stackCards)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const Icon = card.icon;
  const enterStart = index === 0 ? 0 : index * 0.28 - 0.08;
  const enterEnd = index === 0 ? 0.18 : index * 0.28 + 0.16;
  const y = useTransform(
    progress,
    [enterStart, enterEnd],
    [index === 0 ? 0 : 820, index * 24],
  );
  const scale = useTransform(
    progress,
    [0, 0.35, 0.7, 1],
    [
      index === 0 ? 1 : 0.985,
      index === 0 ? 0.97 : 1,
      index === 0 ? 0.94 : index === 1 ? 0.97 : 1,
      1 - (stackCards.length - 1 - index) * 0.018,
    ],
  );
  return (
    <motion.article
      className={`absolute inset-x-0 top-0 isolate mx-auto min-h-[520px] overflow-hidden rounded-[18px] p-5 ring-1 sm:min-h-[575px] sm:p-8 lg:p-10 ${card.tint} ${card.ring}`}
      style={{
        y,
        scale,
        zIndex: index + 1,
      }}
    >
      <div className="grid min-h-[auto] gap-5 lg:min-h-[495px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-0">
        <div className="order-2 flex flex-col justify-between lg:order-1 lg:pr-7">
          <div>
            <span className="inline-flex rounded-md bg-white/72 px-4 py-2 text-xs font-medium text-slate-700 sm:text-sm">
              {card.label}
            </span>
            <h3 className="mt-5 text-[clamp(1.9rem,6vw,2.8rem)] font-normal leading-[1.08] tracking-[-0.035em] text-[#222b4b] sm:mt-16 sm:text-[42px]">
              {card.title}
            </h3>
            <p className="mt-4 max-w-xl text-[15px] font-normal leading-7 text-[#5f748c] sm:mt-5 sm:text-[17px] sm:leading-8">
              {card.description}
            </p>
            <ul className="mt-6 space-y-3 sm:mt-10 sm:space-y-4">
              {card.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-base font-medium text-[#222b4b] sm:text-lg">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
            {card.tags.map((tag) => (
              <span key={tag} className={`rounded-md px-3 py-2 text-xs font-medium text-slate-700 sm:px-4 sm:text-sm ${card.tagTone}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="order-1 overflow-hidden rounded-[14px] lg:order-2">
          <img
            src={card.image}
            alt={card.title}
            className="h-[240px] w-full object-cover sm:h-[340px] lg:h-full lg:min-h-[485px]"
            loading="lazy"
          />
        </div>
      </div>
    </motion.article>
  );
}

function HomeBlogSection() {
  return (
    <section className="bg-[#d8eaff] px-5 py-20 text-[#10213f] sm:py-24">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-md bg-[#c4d8ee] px-4 py-2 text-sm font-medium text-slate-700">
            News & Insights
          </span>
          <h2 className="mt-6 text-[32px] font-normal leading-[1.1] tracking-[-0.035em] sm:text-[44px]">
            Latest career proof insights and trends
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-9 md:grid-cols-3">
          {homeBlogPosts.map((post, index) => (
            <ScrollReveal key={post.title} as="article" delay={index * 0.08} className="group">
              <div className="overflow-hidden rounded-[9px] shadow-[0_20px_70px_-52px_rgba(9,35,67,0.9)]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-[295px] w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-b border-[#a9c0d8] pb-4 text-[15px] font-medium text-[#5f748c]">
                <span>• {post.author}</span>
                <span>{post.date}</span>
              </div>
              <h3 className="mt-6 text-[22px] font-normal leading-[1.2] tracking-[-0.02em] text-[#222b4b]">
                {post.title}
              </h3>
              <p className="mt-4 text-[16px] font-normal leading-7 text-[#5f748c]">
                Practical notes for learners, companies, and institutions building career readiness.
              </p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-14 flex justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-5 rounded-md bg-[#222b4b] py-2 pl-8 pr-2 text-sm font-medium text-white shadow-[0_18px_48px_-32px_rgba(9,35,67,0.9)] transition hover:-translate-y-0.5 hover:bg-[#0a142f]"
          >
            View More News
            <span className="grid h-12 w-12 place-items-center rounded-md bg-[#d8eaff] text-[#10213f]">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FeatureCard({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
      <img src={image} alt="" className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="p-6">
        <h3 className="text-xl font-normal text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default App;
