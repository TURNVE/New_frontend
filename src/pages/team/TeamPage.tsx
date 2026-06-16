import { ArrowRight } from 'lucide-react';

import { Header } from '../../components/layout/Header';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const teamMembers = [
  {
    name: 'Emejulu Esther',
    role: 'Founder',
    summary:
      'I shape TURNVE around one simple idea: practical proof should be easy to build and easy to trust.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=82',
  },
  {
    name: 'Nwosu Paul',
    role: 'CTO',
    summary:
      'I build the systems that keep our simulations fast, clear, and useful for real teams.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=82',
  },
];

function TeamPage() {
  return (
    <div className="marketing-page min-h-screen bg-white text-slate-950">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(115deg,#ffffff_0%,#f5f7ff_42%,#eef5ff_100%)] px-5 py-20 sm:py-24 lg:py-28">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#0b1b3a0d_1px,transparent_1px),linear-gradient(90deg,#0b1b3a0d_1px,transparent_1px)] [background-size:72px_72px]" />
          <ScrollReveal className="relative mx-auto max-w-6xl text-center">
            <p className="text-xs font-normal uppercase tracking-[0.3em] text-blue-700">
              Our Team
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl text-balance text-[clamp(2.4rem,5vw,4.9rem)] font-normal leading-[1] tracking-[-0.05em] text-slate-950">
              We build practical proof for Nigeria.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-8 text-slate-600 sm:text-lg">
              We help graduates, NYSC members, switchers, and junior talent practise real
              work before the interview. We keep the journey simple, the feedback clear,
              and the story very human.
            </p>

            <div className="mx-auto mt-16 grid max-w-4xl gap-5 md:grid-cols-2">
              {teamMembers.map((member, index) => (
                <ScrollReveal
                  key={member.name}
                  as="article"
                  delay={index * 0.08}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/4.7] overflow-hidden bg-slate-100">
                    <img
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 text-left">
                    <h2 className="text-2xl font-normal tracking-[-0.03em] text-slate-950">
                      {member.name}
                    </h2>
                    <p className="mt-2 text-sm font-normal text-blue-700">{member.role}</p>
                    <p className="mt-4 max-w-md text-sm font-normal leading-7 text-slate-600">
                      {member.summary}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section className="relative overflow-hidden px-5 py-16 sm:py-20">
          <ScrollReveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=82"
              alt="TURNVE team reviewing practical career work"
              className="h-[460px] w-full object-cover opacity-52"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/76 to-slate-950/20" />
            <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-14">
              <div className="max-w-2xl text-white">
                <h2 className="text-4xl font-normal leading-tight tracking-[-0.04em] sm:text-5xl">
                  For us, growth is a practice.
                </h2>
                <p className="mt-5 max-w-xl text-base font-normal leading-7 text-white/76">
                  We care about better hiring, better learning, and better chances for
                  practical talent across Nigeria.
                </p>
                <a
                  href="/sign-up"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-normal text-slate-950 transition hover:bg-blue-50"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="px-5 pb-20 sm:pb-28">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              ['Practical first', 'We turn work ideas into tasks people can practise.'],
              ['Nigeria focused', 'We write for local job paths, teams, and hiring needs.'],
              ['Proof driven', 'We help talent show what they can do, not just what they know.'],
            ].map(([title, description], index) => (
              <ScrollReveal
                key={title}
                as="article"
                delay={index * 0.08}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7"
              >
                <h3 className="text-xl font-normal text-slate-950">{title}</h3>
                <p className="mt-3 text-sm font-normal leading-6 text-slate-600">
                  {description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export default TeamPage;
