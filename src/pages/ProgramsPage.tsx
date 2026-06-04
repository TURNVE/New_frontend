import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, Rocket, Calendar, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const programs = [
  {
    id: 'program-2',
    title: 'Program 2: Self-Paced Simulation',
    subtitle: 'On-Demand Learning',
    description: 'Access our full library of simulations at your own pace. Perfect for professionals who need flexibility but still want real practical experience.',
    duration: 'Flexible',
    format: 'Self-Paced',
    cohort: 'Start Anytime',
    features: [
      '200+ simulation scenarios',
      'AI coaching on every decision',
      'Portfolio builder tools',
      'Community forum access',
      'Progress analytics dashboard'
    ],
    tracks: [
      { name: 'All Industries', icon: Award, color: 'bg-primary/10 text-primary' }
    ],
    cta: 'Start Learning',
    link: '/sign-up',
    featured: false
  }
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Rocket className="h-4 w-4" />
                Our Programs
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Start with flexible<br/>
                <span className="text-primary">career simulations</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Learn at your own pace with practical workplace simulations, AI coaching, and portfolio-building tools.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {programs.map((program) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${program.featured ? '' : 'lg:grid-cols-1 lg:max-w-4xl lg:mx-auto'}`}
                >
                  {/* Content */}
                  <div className={`${program.featured ? '' : 'text-center'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {program.subtitle}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                      {program.title}
                    </h2>

                    <p className="text-lg text-muted-foreground mb-6">
                      {program.description}
                    </p>

                    {/* Meta */}
                    <div className={`flex items-center gap-6 mb-8 text-sm text-muted-foreground ${program.featured ? '' : 'justify-center'}`}>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {program.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {program.format}
                      </span>
                      <span className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        {program.cohort}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className={`space-y-3 mb-8 ${program.featured ? '' : 'flex flex-wrap justify-center gap-3'}`}>
                      {program.features.map((feature) => (
                        <li key={feature} className={`${program.featured ? 'flex items-center gap-2 text-foreground' : 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs'}`}>
                          <CheckCircle2 className={`${program.featured ? 'h-5 w-5 text-primary' : 'h-3 w-3 text-primary'}`} />
                          <span className={program.featured ? '' : 'text-xs'}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tracks */}
                    {/* CTA */}
                    <Link
                      to={program.link}
                      className={`inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap ${program.featured ? '' : 'mx-auto'}`}
                    >
                      {program.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Which program is right for you?
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                { q: 'I\'m new to management simulations', a: 'Start with Program 2 to explore simulations at your own speed and build confidence through guided workplace practice.' },
                { q: 'I have limited time availability', a: 'Program 2 offers complete flexibility. Learn whenever you have time, with AI coaching available 24/7.' },
                { q: 'What do I get when I complete simulations?', a: 'You build portfolio-ready artifacts, progress records, and practical examples you can use to explain your experience.' }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border border-border bg-card"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer7
        logo={{ url: "/", src: "/logo.png", alt: "TURNVE logo", title: "TURNVE" }}
        sections={[
          { title: "Product", links: [{ name: "Features", href: "/features" }, { name: "Programs", href: "/programs" }, { name: "Pricing", href: "/pricing" }] },
          { title: "Company", links: [{ name: "About", href: "/about" }, { name: "Blog", href: "/blog" }, { name: "Careers", href: "#" }] },
          { title: "Resources", links: [{ name: "Developers", href: "/developers" }, { name: "Help Center", href: "#" }, { name: "Contact", href: "#" }] },
        ]}
        description="AI-powered practical career platform helping professionals gain management experience."
        socialLinks={[
          { icon: <Instagram className="size-5" />, href: "#", label: "Instagram" },
          { icon: <Facebook className="size-5" />, href: "#", label: "Facebook" },
          { icon: <Twitter className="size-5" />, href: "#", label: "Twitter" },
          { icon: <Linkedin className="size-5" />, href: "#", label: "LinkedIn" },
        ]}
        copyright="© 2026 TURNVE. All rights reserved."
        legalLinks={[{ name: "Terms", href: "#" }, { name: "Privacy", href: "#" }]}
      />
    </div>
  );
}
