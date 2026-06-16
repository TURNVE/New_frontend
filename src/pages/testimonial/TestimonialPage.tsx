import { ArrowUpRight, Menu, Quote, Star } from 'lucide-react';
import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
];

const testimonials = [
  {
    quote:
      'TURNVE gave me a way to prove how I think. The simulation report became the clearest story I had in interviews.',
    name: 'Ethan Carter',
    role: 'Junior Product Manager',
  },
  {
    quote:
      'We used TURNVE to compare practical judgment across candidates. The portfolio evidence was much more useful than generic interview answers.',
    name: 'Amara Collins',
    role: 'Talent Lead',
  },
  {
    quote:
      'The AI feedback helped me see the gaps in my decisions and improve before I had to perform in front of an employer.',
    name: 'Maya Brooks',
    role: 'Career Switcher',
  },
];

const companyCards = [
  { title: 'Portfolio proof reviewed', value: '240+' },
  { title: 'Readiness reports generated', value: '15k+' },
  { title: 'Role tracks practiced', value: '12+' },
];

function Logo() {
  return (
    <a href="/" aria-label="TURNVE home" className="inline-flex items-center">
      <img src="/turnve-logo.svg" alt="TURNVE" className="h-12 w-auto" />
    </a>
  );
}

function TestimonialHeader() {
  return (
    <header className="bg-[#0a142f] px-5 py-6 text-white">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            className="grid h-14 w-14 place-items-center rounded-full border border-[#154956] bg-[#07313d]"
          >
            <Menu className="h-6 w-6" />
          </button>
          <a
            href="/organization"
            className="hidden rounded-lg bg-[#0b6bff] px-6 py-4 text-base font-black text-white sm:inline-flex"
          >
            Contact Sales
          </a>
          <a
            href="/program1"
            className="hidden rounded-lg border border-white/70 px-6 py-4 text-base font-black text-white sm:inline-flex"
          >
            Program 2
          </a>
        </div>
      </nav>
    </header>
  );
}

function TrustHero() {
  return (
    <section className="bg-[#d8eaff] px-5 py-24 text-[#08243a]">
      <ScrollReveal className="mx-auto max-w-[1120px]">
        <h1 className="max-w-5xl text-[42px] font-black leading-tight sm:text-[56px]">
          Trusted by Leading Companies Worldwide
        </h1>
        <p className="mt-7 max-w-6xl text-[21px] font-semibold leading-8 text-[#18384f]">
          Do not just take our word for it. Read the experiences of learners, organizations,
          and professionals who trust TURNVE to help them prove practical readiness.
        </p>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex pl-4">
            {avatars.map((avatar, index) => (
              <img
                key={avatar}
                src={avatar}
                alt={`TURNVE testimonial avatar ${index + 1}`}
                className="-ml-4 h-14 w-14 rounded-full border-4 border-[#d8eaff] object-cover"
              />
            ))}
          </div>
          <div>
            <div className="flex gap-1 text-[#d89b24]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-xl font-black">240+ Trusted Companies</p>
          </div>
        </div>

        <a
          href="/program1"
          className="mt-9 inline-flex rounded-lg bg-[#08243a] px-7 py-4 text-lg font-black text-white"
        >
          Try TURNVE Process
        </a>

        <div className="mt-20 rounded-lg bg-[#c9e0fa] p-3">
          <article className="rounded-lg bg-[#d8eaff] p-8 shadow-[0_18px_50px_rgba(8,36,58,0.08)] sm:p-12">
            <Quote className="h-10 w-10 text-[#08243a]" />
            <p className="mt-8 max-w-5xl text-[26px] font-black leading-10">
              Their practical simulations and attention to evidence set TURNVE apart from any
              course I have tried. I am now thriving in my new role, and I owe so much of my
              confidence to the portfolio proof I built here.
            </p>
            <div className="mt-10">
              <p className="text-xl font-black">Ethan Carter</p>
              <p className="mt-2 text-base font-semibold text-[#405a70]">Junior Product Manager</p>
            </div>
          </article>
        </div>
      </ScrollReveal>
    </section>
  );
}

function TestimonialGrid() {
  return (
    <section className="bg-white px-5 py-20 text-[#071214]">
      <div className="mx-auto max-w-[1060px]">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.name}
              as="article"
              delay={index * 0.08}
              className="rounded-lg border border-[#e1e5ea] bg-[#fbfbfb] p-7"
            >
              <div className="flex gap-1 text-[#d89b24]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-8 text-lg font-black leading-8">{testimonial.quote}</p>
              <div className="mt-8">
                <p className="text-sm font-black">{testimonial.name}</p>
                <p className="mt-1 text-sm text-[#667076]">{testimonial.role}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 grid gap-4 rounded-lg bg-[#0a142f] p-6 text-white md:grid-cols-3">
          {companyCards.map((card, index) => (
            <ScrollReveal
              key={card.title}
              delay={index * 0.08}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-[34px] font-black text-[#7db7ff]">{card.value}</p>
              <p className="mt-3 text-sm font-semibold text-white/68">{card.title}</p>
            </ScrollReveal>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

function TestimonialFooter() {
  return (
    <footer className="bg-[#0a142f] px-5 py-12 text-white">
      <div className="mx-auto flex max-w-[1060px] flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <a href="/organization" className="inline-flex items-center gap-2 text-sm font-black text-[#7db7ff]">
          Contact Sales <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}

function TestimonialPage() {
  return (
    <MarketingPageShell headerVariant="dark" className="bg-white font-inter">
      <main>
        <TrustHero />
        <TestimonialGrid />
      </main>
    </MarketingPageShell>
  );
}

export default TestimonialPage;
