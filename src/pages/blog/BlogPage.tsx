import { ArrowRight } from 'lucide-react';

import { MarketingPageShell } from '../../components/marketing/MarketingPageShell';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

const posts = [
  {
    title: 'How to prove workplace readiness without years of experience',
    category: 'Career Proof',
    author: 'Amina Okafor',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=82',
  },
  {
    title: 'Why Nigerian employers need practical evidence before interviews',
    category: 'Hiring',
    author: 'Chinedu Eze',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=82',
  },
  {
    title: 'A simple way to turn simulations into portfolio stories',
    category: 'Portfolio',
    author: 'Zainab Bello',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=82',
  },
  {
    title: 'What junior talent should practise before a product interview',
    category: 'Interviews',
    author: 'Tomiwa Adeyemi',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=82',
  },
  {
    title: 'Decision logs: the career asset most candidates forget',
    category: 'Guides',
    author: 'David Nwankwo',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=82',
  },
  {
    title: 'How AI feedback helps career switchers practise with confidence',
    category: 'AI Feedback',
    author: 'Amina Okafor',
    image:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=82',
  },
];

function BlogPage() {
  return (
    <MarketingPageShell headerVariant="dark" className="bg-white">
      <main>
        <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden px-5 py-20 text-center text-white">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=82"
            alt="TURNVE blog and career insights"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/72" />
          <ScrollReveal className="relative mx-auto max-w-3xl">
            <h1 className="text-4xl font-normal tracking-[-0.035em] sm:text-5xl">Blog & insights</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-7 text-white/78">
              Simple ideas on career proof, practical simulations, hiring signals, and how
              Nigerian talent can show real readiness.
            </p>
          </ScrollReveal>
        </section>

        <section className="px-5 py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-x-9 gap-y-14 md:grid-cols-2">
            {posts.map((post, index) => (
              <ScrollReveal
                key={post.title}
                as="article"
                delay={index * 0.07}
                className="group"
              >
                <a href="#" className="block overflow-hidden rounded-2xl bg-slate-100">
                  <div className="relative aspect-[1.55] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-0 right-0 rounded-tl-2xl bg-[#0b6bff] px-5 py-3 text-sm font-medium uppercase tracking-wide text-white">
                      {post.category}
                    </span>
                  </div>
                </a>
                <h2 className="mt-6 text-xl font-normal leading-tight tracking-[-0.02em] text-slate-950 sm:text-2xl">
                  {post.title}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium uppercase tracking-wide">
                  <span className="text-[#0b6bff]">Jun 12, 2026</span>
                  <span className="text-slate-400">By</span>
                  <span className="text-slate-700">{post.author}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-16 flex justify-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-medium uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#0b6bff]"
            >
              Load more
              <ArrowRight className="h-4 w-4" />
            </a>
          </ScrollReveal>
        </section>
      </main>
    </MarketingPageShell>
  );
}

export default BlogPage;
