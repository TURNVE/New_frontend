import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Building2, Users, Zap, BarChart3, Shield, ArrowRight,
  Menu, X, Check, ChevronDown, ChevronUp, Play,
  Target, Award, TrendingUp, Clock, DollarSign, Sparkles,
  CheckCircle2, Briefcase, Layers, Eye, Star, Heart,
  Rocket, ArrowUpRight, LogIn
} from 'lucide-react';
import { Header as MarketingHeader } from '../../components/layout/Header';
import { PublicFooter } from '../../components/layout/PublicFooter';

const BRAND = '#5e6ad2';
const BRAND_LIGHT = '#7170ff';
const BRAND_HOVER = '#828fff';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

// Use inline props instead of variants to avoid framer-motion v12 strict typing

function AnimationContainer({ children, className, isInView }: { children: React.ReactNode; className?: string; isInView: boolean }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

function AnimatedSection({ children, className, isInView, delay = 0, custom = 0 }: { children: React.ReactNode; className?: string; isInView: boolean; delay?: number; custom?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay + custom * 0.1 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedScale({ children, className, isInView, custom = 0 }: { children: React.ReactNode; className?: string; isInView: boolean; custom?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: custom * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedFade({ children, className, isInView, custom = 0 }: { children: React.ReactNode; className?: string; isInView: boolean; custom?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: custom * 0.12 }}
    >
      {children}
    </motion.div>
  );
}

function OrganizationPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenu]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <MarketingHeader />

      <main className="pt-20">
        <HeroSection />
        <LogosSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsBentoSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      <PublicFooter />
    </div>
  );
}

/* ─── HEADER ─── */
function Header({ scrolled, mobileMenu, setMobileMenu }: { scrolled: boolean; mobileMenu: boolean; setMobileMenu: (v: boolean) => void }) {
  return (
    <header>
      <nav className={`fixed z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-xl flex items-center justify-center shadow-lg shadow-[#5e6ad2]/25">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:block">TURNVE</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'FAQ', href: '#faq' },
              ].map(item => (
                <a key={item.label} href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/sign-in" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-[#5e6ad2] hover:bg-[#4f5bc4] transition-all duration-200 shadow-lg shadow-[#5e6ad2]/25 hover:shadow-xl hover:shadow-[#5e6ad2]/30"
              >
                Get Started
              </Link>
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2" aria-label="Toggle menu">
              <motion.div animate={mobileMenu ? 'open' : 'closed'}>
                {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-6 py-6 space-y-4">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'FAQ', href: '#faq' },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className="block text-base font-medium text-gray-700 hover:text-gray-900 py-2"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 flex flex-col gap-3 border-t border-gray-100">
                  <Link to="/sign-in" onClick={() => setMobileMenu(false)} className="text-center text-sm font-medium text-gray-700 py-2.5 border border-gray-200 rounded-xl">
                    Sign In
                  </Link>
                  <Link to="/sign-up" onClick={() => setMobileMenu(false)} className="text-center text-sm font-semibold text-white py-2.5 rounded-xl bg-[#5e6ad2]">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

/* ─── HERO ─── */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-[#5e6ad2]/20 to-[#7170ff]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 40, -20, 0],
            scale: [1, 1.05, 1.15, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#7170ff]/15 to-[#5e6ad2]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
          style={{
            background: 'conic-gradient(from 0deg, #5e6ad2, #7170ff, transparent, #5e6ad2)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#5e6ad2]" />
            <span className="text-sm font-semibold text-[#5e6ad2]">Built for Organizations</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
          >
            Train your teams with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5e6ad2] to-[#7170ff]">
              real-world simulations
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create custom management simulations, track team performance, and build the next generation of leaders — all within one platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/sign-up"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#5e6ad2] text-white font-semibold rounded-2xl hover:bg-[#4f5bc4] transition-all duration-300 shadow-xl shadow-[#5e6ad2]/25 hover:shadow-2xl hover:shadow-[#5e6ad2]/30 hover:-translate-y-0.5"
            >
              Create Your Organization
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 px-8 py-4 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              <Play className="w-4 h-4 text-[#5e6ad2]" />
              Watch Demo
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-600">4.9/5 from 500+ reviews</span>
            </div>
            <p className="text-sm text-gray-500">Trusted by 200+ organizations worldwide</p>
          </motion.div>
        </div>

        {/* Hero visual - Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-16 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-900/10">
            <div className="bg-gradient-to-b from-gray-50 to-white p-1">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100 rounded-t-xl">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-100 rounded-lg px-4 py-1 text-xs text-gray-400">
                    app.turnve.com/organization
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-b-xl bg-gradient-to-br from-[#0f1011] via-[#191a1b] to-[#08090a] p-8">
                {/* Mock dashboard content */}
                <div className="flex gap-4 mb-6">
                  <div className="w-48 bg-[#111418] border border-[#23252a] rounded-xl p-4">
                    <div className="text-xs text-[#8a8f98] mb-3">Quick Stats</div>
                    <div className="space-y-3">
                      {[
                        { label: 'Active Sims', value: '12', color: '#7170ff' },
                        { label: 'Team Members', value: '48', color: '#22c55e' },
                        { label: 'Avg Score', value: '87%', color: '#f59e0b' },
                      ].map(stat => (
                        <div key={stat.label} className="flex items-center justify-between">
                          <span className="text-xs text-[#d0d6e0]">{stat.label}</span>
                          <span className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-[#111418] border border-[#23252a] rounded-xl p-4">
                      <div className="text-xs text-[#8a8f98] mb-2">Team Performance</div>
                      <div className="flex items-end gap-1.5 h-16">
                        {[60, 45, 75, 50, 85, 65, 90, 70, 80, 55, 72, 95].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 0.8, delay: 0.8 + i * 0.08, ease: 'easeOut' }}
                            className="flex-1 bg-gradient-to-t from-[#5e6ad2] to-[#7170ff] rounded-sm opacity-80"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#111418] border border-[#23252a] rounded-xl p-3">
                        <div className="text-xs text-[#8a8f98] mb-1">Simulations Created</div>
                        <div className="text-lg font-bold text-white">24</div>
                      </div>
                      <div className="bg-[#111418] border border-[#23252a] rounded-xl p-3">
                        <div className="text-xs text-[#8a8f98] mb-1">Completion Rate</div>
                        <div className="text-lg font-bold text-emerald-400">94%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect behind dashboard */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#5e6ad2]/20 via-[#7170ff]/10 to-[#5e6ad2]/20 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── LOGOS ─── */
function LogosSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const logos = ['Acme Corp', 'TechFlow', 'DataBridge', 'CloudSync', 'NexGen', 'VantaAI', 'Stripe', 'Vercel'];

  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  return (
    <section className="py-16 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-gray-500 mb-8 uppercase tracking-wider"
        >
          Trusted by innovative teams worldwide
        </motion.p>
        <motion.div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center"
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {logos.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 40 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex items-center justify-center px-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm"
            >
              <span className="text-sm font-bold text-gray-400">{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PROBLEM ─── */
function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const painPoints = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Training takes too long',
      desc: 'Traditional programs require months before showing real results.',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Expensive to scale',
      desc: 'Workshops and bootcamps cost thousands per team member.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'No measurable outcomes',
      desc: 'Hard to track progress or prove ROI on training investments.',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Theory over practice',
      desc: 'Most training lacks real-world scenarios and hands-on experience.',
    },
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0 * 0.12 }} className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold uppercase tracking-wider mb-4">
            The Problem
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1 * 0.12 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Traditional training doesn&apos;t work
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 2 * 0.12 }} className="text-lg text-gray-600">
            Your teams deserve better than outdated training methods. Here&apos;s what&apos;s holding organizations back.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 mb-4">
                {point.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{point.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Layers className="w-7 h-7" />,
      title: 'Simulation Builder',
      desc: 'Create custom management simulations with our visual editor. Define scenarios, stakeholders, and evaluation criteria.',
      color: '#5e6ad2',
      gradient: 'from-[#5e6ad2]/10 to-[#7170ff]/5',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Team Management',
      desc: 'Organize teams, assign roles, and manage access. Track who completed what and how they performed.',
      color: '#22c55e',
      gradient: 'from-emerald-500/10 to-green-500/5',
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Performance Analytics',
      desc: 'Deep insights into team performance. Identify strengths, gaps, and areas for improvement with data-driven reports.',
      color: '#f59e0b',
      gradient: 'from-amber-500/10 to-orange-500/5',
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: 'Skill Assessment',
      desc: 'Automated skill scoring across leadership, decision-making, and strategic thinking. Benchmark against industry standards.',
      color: '#ec4899',
      gradient: 'from-pink-500/10 to-rose-500/5',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'AI-Powered Feedback',
      desc: 'Personalized AI feedback for every team member. Help them understand their decisions and improve faster.',
      color: '#8b5cf6',
      gradient: 'from-violet-500/10 to-purple-500/5',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Enterprise Security',
      desc: 'SOC 2 compliant with SSO, role-based access, and data encryption. Your team data stays safe and private.',
      color: '#06b6d4',
      gradient: 'from-cyan-500/10 to-blue-500/5',
    },
  ];

  return (
    <section id="features" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0 * 0.12 }} className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 text-[#5e6ad2] text-xs font-semibold uppercase tracking-wider mb-4">
            Features
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1 * 0.12 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything your organization needs
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 2 * 0.12 }} className="text-lg text-gray-600">
            Build, manage, and scale your training programs with powerful tools designed for modern teams.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      step: '01',
      title: 'Create Your Organization',
      desc: 'Sign up and set up your organization profile. Invite team members and configure roles.',
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      step: '02',
      title: 'Build Simulations',
      desc: 'Use our visual builder to create realistic management scenarios. Customize every detail.',
      icon: <Layers className="w-6 h-6" />,
    },
    {
      step: '03',
      title: 'Assign & Launch',
      desc: 'Assign simulations to teams or individuals. Set deadlines and track progress in real-time.',
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      step: '04',
      title: 'Measure & Improve',
      desc: 'Review performance data, identify skill gaps, and iterate on your training programs.',
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0 * 0.12 }} className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-4">
            How It Works
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1 * 0.12 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Up and running in minutes
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 2 * 0.12 }} className="text-lg text-gray-600">
            Four simple steps to transform how your organization trains and develops talent.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#5e6ad2]/20 via-[#7170ff]/30 to-[#5e6ad2]/20" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-[#5e6ad2]/25 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-[#5e6ad2] uppercase tracking-wider mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STATS BENTO ─── */
function StatsBentoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '200+', label: 'Organizations', sub: 'across 30+ industries' },
    { value: '50K+', label: 'Team Members', sub: 'trained on the platform' },
    { value: '94%', label: 'Completion Rate', sub: 'vs 35% industry average' },
    { value: '3.2x', label: 'Faster Onboarding', sub: 'compared to traditional methods' },
    { value: '87%', label: 'Skill Improvement', sub: 'after first simulation cycle' },
    { value: '4.9/5', label: 'User Rating', sub: 'from 500+ verified reviews' },
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0 * 0.12 }} className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Proven Results
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1 * 0.12 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Numbers that speak for themselves
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 2 * 0.12 }} className="text-lg text-gray-600">
            Organizations using TURNVE see measurable improvements in team performance and readiness.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const isLarge = i === 0 || i === 3;
            return (
              <motion.div
                key={i}
                className={`bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isLarge ? 'lg:col-span-1' : ''}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5e6ad2] to-[#7170ff] mb-1">
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-gray-900 mb-0.5">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.sub}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─── */
function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const plans = [
    {
      name: 'Starter',
      price: '$499',
      period: '/month',
      desc: 'For small teams getting started with simulation-based training.',
      features: [
        'Up to 25 team members',
        '3 active simulations',
        'Basic analytics dashboard',
        'Email support',
        'Standard simulation templates',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$999',
      period: '/month',
      desc: 'For growing organizations that need advanced features and support.',
      features: [
        'Up to 100 team members',
        'Unlimited simulations',
        'Advanced analytics & reports',
        'Priority support',
        'Custom simulation builder',
        'API access',
        'SSO integration',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large organizations with complex training needs.',
      features: [
        'Unlimited team members',
        'Unlimited simulations',
        'Custom analytics & BI',
        'Dedicated account manager',
        'White-label options',
        'On-premise deployment',
        'Custom integrations',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" ref={ref} className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0 * 0.12 }} className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Pricing
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1 * 0.12 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 2 * 0.12 }} className="text-lg text-gray-600">
            Start with a 14-day free trial. No credit card required.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? 'bg-[#5e6ad2] border-[#5e6ad2] shadow-2xl shadow-[#5e6ad2]/25 text-white scale-105'
                  : 'bg-white border-gray-200 shadow-sm hover:shadow-lg'
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-white text-[#5e6ad2] text-xs font-bold rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-white/80' : 'text-gray-500'}`}>
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>{plan.period}</span>}
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                {plan.desc}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-[#5e6ad2]'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-gray-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.name === 'Enterprise' ? '/contact' : '/sign-up'}
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-white text-[#5e6ad2] hover:bg-gray-100 shadow-lg'
                    : 'bg-[#5e6ad2] text-white hover:bg-[#4f5bc4] shadow-lg shadow-[#5e6ad2]/20'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─── */
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      quote: 'TURNVE transformed how we train new managers. Our team went from theory to practice in weeks instead of months.',
      name: 'Sarah Chen',
      role: 'VP of People, TechFlow',
      avatar: 'SC',
    },
    {
      quote: 'The simulation builder is incredibly powerful. We created 12 custom scenarios for different roles in just one week.',
      name: 'Marcus Johnson',
      role: 'Head of L&D, DataBridge',
      avatar: 'MJ',
    },
    {
      quote: 'We saw a 40% improvement in decision-making scores after the first simulation cycle. The analytics are game-changing.',
      name: 'Emily Rodriguez',
      role: 'CTO, NexGen Solutions',
      avatar: 'ER',
    },
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0 * 0.12 }} className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Testimonials
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1 * 0.12 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by organizations everywhere
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 2 * 0.12 }} className="text-lg text-gray-600">
            Hear from leaders who have transformed their training programs with TURNVE.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How long does it take to set up?',
      a: 'Most organizations are fully set up within 24 hours. Our onboarding team will help you configure your organization, import team members, and create your first simulation.',
    },
    {
      q: 'Can I customize simulations for my industry?',
      a: 'Absolutely. Our visual simulation builder lets you create fully customized scenarios tailored to your industry, role, and specific training objectives. You control every detail.',
    },
    {
      q: 'How many team members can I add?',
      a: 'Starter plans support up to 25 members, Professional up to 100, and Enterprise is unlimited. You can upgrade or downgrade at any time.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes! Every plan comes with a 14-day free trial. No credit card required. You get full access to all features during the trial period.',
    },
    {
      q: 'Can I integrate with our existing HR systems?',
      a: 'Professional and Enterprise plans include API access and pre-built integrations with popular HR systems like Workday, BambooHR, and SAP SuccessFactors.',
    },
    {
      q: 'What kind of support do you offer?',
      a: 'All plans include email support. Professional plans get priority support with 4-hour response times. Enterprise plans include a dedicated account manager and custom SLAs.',
    },
  ];

  return (
    <section id="faq" ref={ref} className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0 * 0.12 }} className="inline-flex items-center px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold uppercase tracking-wider mb-4">
            FAQ
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1 * 0.12 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 2 * 0.12 }} className="text-lg text-gray-600">
            Everything you need to know about TURNVE for organizations.
          </motion.p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-base font-semibold text-gray-900 pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-[#5e6ad2] via-[#6366d3] to-[#7170ff] rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to transform your team?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Join 200+ organizations already using TURNVE to build the next generation of leaders. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/sign-up"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-[#5e6ad2] font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  Talk to Sales
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="text-lg font-bold">TURNVE</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              AI-powered practical career platform helping professionals and organizations build management experience.
            </p>
          </div>

          {[
            {
              title: 'Product',
              links: [
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Simulations', href: '/simulations' },
                { label: 'Portfolio', href: '/portfolio' },
              ],
            },
            {
              title: 'Organization',
              links: [
                { label: 'Organization Page', href: '/organization' },
                { label: 'Team Training', href: '#' },
                { label: 'Enterprise', href: '#' },
                { label: 'Contact', href: '/contact' },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Cookie Policy', href: '#' },
                { label: 'GDPR', href: '#' },
              ],
            },
          ].map((section, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 TURNVE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              { label: 'Twitter', href: '#' },
              { label: 'LinkedIn', href: '#' },
              { label: 'GitHub', href: '#' },
            ].map((social, i) => (
              <a key={i} href={social.href} className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default OrganizationPage;
