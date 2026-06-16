import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AutoplayVideo } from '../../components/media/AutoplayVideo';
import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const BUSINESS_HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

const BUSINESS_HERO_POSTER =
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=82';

function BusinessHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#07162f] text-white">
      <AutoplayVideo
        poster={BUSINESS_HERO_POSTER}
        src={BUSINESS_HERO_VIDEO}
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-[#07162f]/42" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(11,107,255,0.12),transparent_42%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07162f]/10 via-[#07162f]/26 to-[#07162f]/58" />

      <ScrollReveal className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:pb-20 sm:pt-32">
        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs tracking-[0.22em] text-white/78">
          Practical talent programs
        </div>

        <h1 className="mt-8 max-w-4xl text-balance text-[clamp(2.35rem,5vw,4.9rem)] font-normal leading-[0.95] tracking-[-0.05em]">
          Choose the Perfect Plan for Your Talent Growth
        </h1>

        <p className="mt-6 max-w-3xl text-pretty text-[1.02rem] font-normal leading-8 text-white/76 sm:text-[1.08rem]">
          TURNVE helps companies run practical simulations, compare readiness, and build proof
          employers can trust.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-[#1675ff] px-7 py-3.5 text-sm font-normal text-white transition-colors hover:bg-[#0f66e6]"
          >
            Get Started Now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center rounded-full border border-white/18 bg-white/6 px-7 py-3.5 text-sm font-normal text-white/88 transition-colors hover:bg-white/10"
          >
            Explore Services
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

function BusinessPage() {
  return (
    <MarketingPageShell headerVariant="dark" className="bg-white">
      <main>
        <BusinessHero />
      </main>
    </MarketingPageShell>
  );
}

export default BusinessPage;
