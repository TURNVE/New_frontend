import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, Rocket, Calendar, Users, Award, ArrowRight, Briefcase, Code, Palette, Settings, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const programs = [
  {
    id: 'program-1',
    title: 'Program 1: Practical Bootcamp',
    subtitle: 'Live Online Intensive',
    description: '5-week immersive simulation where you operate inside a structured startup lifecycle. Make real decisions, handle stakeholders, and build defensible portfolio pieces.',
    duration: '5 Weeks',
    format: 'Live + Remote',
    cohort: 'April 2025',
    features: [
      'Real startup simulation',
      '1:1 mentorship sessions',
      'Weekly live workshops',
      'AI-powered feedback',
      'Certificate on completion'
    ],
    tracks: [
      { name: 'Business', icon: Briefcase, color: 'bg-primary/10 text-primary' },
      { name: 'Technical', icon: Code, color: 'bg-[#c3faf5]/50 dark:bg-[#187574]/30 text-[#187574]' },
      { name: 'Creative', icon: Palette, color: 'bg-[#ffc6c6]/50 dark:bg-[#600000]/30 text-[#600000]' },
      { name: 'Operations', icon: Settings, color: 'bg-[#ffe6cd]/50 dark:bg-[#746019]/30 text-[#746019]' }
    ],
    cta: 'Explore Program 1',
    link: '/bootcamp',
    featured: true
  },
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
  },
  {
    id: 'program-3',
    title: 'Program 3: Career Accelerator',
    subtitle: 'Intensive 12-Week Program',
    description: 'Comprehensive program combining simulations, interview prep, and career coaching. Designed for professionals making major career transitions.',
    duration: '12 Weeks',
    format: 'Hybrid',
    cohort: 'June 2025',
    features: [
      'Full simulation library access',
      'Weekly group coaching',
      'Mock interview sessions',
      'Resume & portfolio review',
      'Job placement support'
    ],
    tracks: [
      { name: 'Transition Track', icon: Rocket, color: 'bg-primary/10 text-primary' }
    ],
    cta: 'Coming Soon',
    link: '#',
    featured: false,
    comingSoon: true
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
                Choose your path to<br/>
                <span className="text-primary">career success</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you need intensive live training or flexible self-paced learning, we have a program that fits your goals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {programs.map((program, index) => (
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
                      {program.comingSoon && (
                        <span className="px-3 py-1 rounded-full bg-[#ffe6cd]/50 dark:bg-[#746019]/30 text-[#746019] dark:text-[#ffe6cd] text-xs font-semibold">
                          Coming Soon
                        </span>
                      )}
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
                    {program.featured && (
                      <div className="mb-8">
                        <p className="text-sm font-semibold text-muted-foreground mb-3">Available Tracks:</p>
                        <div className="flex flex-wrap gap-2">
                          {program.tracks.map((track) => (
                            <div key={track.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${track.color}`}>
                              <track.icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{track.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      to={program.link}
                      className={`inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap ${program.featured ? '' : 'mx-auto'}`}
                    >
                      {program.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>

                  {/* Visual - Only for featured */}
                  {program.featured && (
                    <div className="relative">
                      <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-xl">
                        <img
                          src="/images/hero-briefing.png"
                          alt={program.title}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      </div>

                      {/* Decorative */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#ffc6c6]/30 dark:bg-[#600000]/20 rounded-full blur-2xl" />
                      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#c3faf5]/30 dark:bg-[#187574]/20 rounded-full blur-2xl" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compare */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Compare Programs
              </h2>
              <p className="text-lg text-muted-foreground">
                Find the right program based on your schedule, goals, and learning style
              </p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left font-semibold text-foreground">Feature</th>
                    <th className="p-4 text-center font-semibold text-primary">Program 1</th>
                    <th className="p-4 text-center font-semibold text-foreground">Program 2</th>
                    <th className="p-4 text-center font-semibold text-muted-foreground">Program 3</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Duration', '5 Weeks', 'Flexible', '12 Weeks'],
                    ['Live Sessions', 'Weekly', 'Optional', 'Bi-weekly'],
                    ['Mentorship', '1:1 Included', 'Community', 'Group + 1:1'],
                    ['Simulations', 'Focused Track', 'Full Library', 'Full Library'],
                    ['Interview Prep', 'Included', 'Self-study', 'Intensive'],
                    ['Certificate', '✓', '✓', '✓'],
                    ['Job Support', '-', '-', 'Included']
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="p-4 text-muted-foreground">{row[0]}</td>
                      <td className="p-4 text-center text-primary font-medium">{row[1]}</td>
                      <td className="p-4 text-center text-foreground">{row[2]}</td>
                      <td className="p-4 text-center text-muted-foreground">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                { q: 'I\'m new to management simulations', a: 'Start with Program 2 (Self-Paced) to explore simulations at your own speed. Upgrade to Program 1 when you\'re ready for intensive live training.' },
                { q: 'I need to make a career transition quickly', a: 'Program 3 (Career Accelerator) is designed for major transitions. It combines simulations, interview prep, and job placement support.' },
                { q: 'I have limited time availability', a: 'Program 2 offers complete flexibility. Learn whenever you have time, with AI coaching available 24/7.' },
                { q: 'I want live interaction with mentors', a: 'Program 1 includes weekly live workshops and 1:1 mentorship sessions. Perfect if you learn better with real-time guidance.' }
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
