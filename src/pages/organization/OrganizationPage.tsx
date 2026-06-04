import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Target, 
  Shield, 
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Award,
  Clock,
  LineChart,
  Layers,
  UsersRound,
  BrainCircuit,
  BadgeCheck
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { TurnveLogo } from '../../components/brand/TurnveLogo';

const features = [
  {
    icon: Target,
    title: 'Custom Simulations',
    description: 'Tailored scenarios matching your industry and company challenges',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track team progress, skill gaps, and learning outcomes',
    color: 'from-emerald-500/20 to-green-500/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SSO, SAML, and advanced security controls for your organization',
    color: 'from-violet-500/20 to-purple-500/20',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500'
  },
  {
    icon: UsersRound,
    title: 'Team Management',
    description: 'Organize learners into groups, assign mentors, and manage access',
    color: 'from-primary/20 to-orange-500/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    icon: BadgeCheck,
    title: 'Certified Learning',
    description: 'Industry-recognized certificates for completed programs',
    color: 'from-rose-500/20 to-pink-500/20',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500'
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Insights',
    description: 'Personalized recommendations based on team performance data',
    color: 'from-cyan-500/20 to-teal-500/20',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500'
  }
];

const stats = [
  { value: '95%', label: 'Skill Improvement', icon: LineChart },
  { value: '3x', label: 'Faster Onboarding', icon: Clock },
  { value: '500+', label: 'Teams Trained', icon: Building2 },
  { value: '4.9/5', label: 'Satisfaction', icon: Award }
];

const enterpriseFeatures = [
  'Custom simulation development',
  'Dedicated success manager',
  'SSO & SAML integration',
  'API access & integrations',
  'Advanced analytics & reporting',
  'White-label options',
  'Volume pricing discounts',
  'Priority support'
];

const featureCardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface FeatureCardProps {
  feature: (typeof features)[number];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.article
      custom={index}
      variants={featureCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/35 sm:min-h-[240px] sm:p-6"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex h-full flex-col">
        <motion.div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} sm:h-14 sm:w-14`}
          whileHover={{ rotate: -4, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
        >
          <feature.icon className={`h-6 w-6 ${feature.iconColor} sm:h-7 sm:w-7`} />
        </motion.div>
        <h3 className="text-lg font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
          {feature.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/85 sm:text-base">
          {feature.description}
        </p>
        <div className="mt-auto flex translate-y-2 items-center gap-2 pt-5 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <CheckCircle2 className="h-4 w-4" />
          <span>Included</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function OrganizationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
        
        <div className="mx-auto max-w-5xl px-6">
          <div className="sm:mx-auto text-center relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                Enterprise Solutions
              </div>
              <h1 className="mt-8 max-w-3xl text-balance text-4xl font-bold md:text-5xl lg:text-6xl text-foreground mx-auto tracking-tight">
                Transform Your Workforce with
                <span className="text-primary"> Practical Skills</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground mx-auto">
                Empower your team with AI-powered simulations that mirror real workplace scenarios. 
                Accelerate skill development and drive measurable business outcomes.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
                >
                  Request a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
                >
                  Talk to Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 items-stretch gap-2 sm:gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-border/60 bg-card/40 px-2 py-3 text-center sm:px-4 sm:py-5"
              >
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                  <stat.icon className="h-4 w-4 text-primary sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <div className="text-xl font-bold leading-none text-foreground sm:text-2xl lg:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 max-w-full text-[10px] font-medium leading-tight text-muted-foreground sm:text-xs lg:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Built for Enterprise Scale */}
      <section id="features" className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Built for Enterprise Scale
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Everything you need to upskill your workforce at scale
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-card/60">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 lg:p-10"
            >
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Enterprise Plan
              </div>
              <h2 className="max-w-xl text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Custom Solutions for Large Organizations
              </h2>
              <p className="max-w-xl text-base sm:text-lg text-muted-foreground mb-8">
                Get a tailored program designed specifically for your industry, 
                company culture, and learning objectives.
              </p>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {enterpriseFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/35 p-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm leading-5 text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
                >
                  Request a Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
                >
                  Talk to Sales
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative border-t border-border bg-background/45 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">Delivery model</p>
                  <h3 className="mt-2 text-2xl font-bold text-foreground">Launch with a guided rollout</h3>
                </div>
                <div className="hidden rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary sm:block">
                  5 weeks
                </div>
              </div>

              <div className="grid gap-4">
                  <div className="group rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Layers className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Custom Content</h3>
                      <p className="text-sm text-muted-foreground">Simulations tailored to your industry</p>
                    </div>
                    </div>
                  </div>
                  
                  <div className="group rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Users className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Dedicated Support</h3>
                      <p className="text-sm text-muted-foreground">Success manager assigned to your account</p>
                    </div>
                    </div>
                  </div>
                  
                  <div className="group rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Advanced Analytics</h3>
                      <p className="text-sm text-muted-foreground">Detailed reporting on team progress</p>
                    </div>
                    </div>
                  </div>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-indigo-800 rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl shadow-primary/25">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Ready to transform your team?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Request a demo or talk to sales to plan an organization rollout with our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary text-base font-semibold rounded-xl hover:bg-primary-foreground/90 transition-all hover:shadow-lg whitespace-nowrap"
                >
                  Request a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white text-base font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all whitespace-nowrap"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#010102] text-white py-12 sm:py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <TurnveLogo className="h-8 w-auto max-w-[132px] sm:h-10" />
              </div>
              <p className="text-text-tertiary text-sm leading-relaxed mb-4">
                Empowering organizations to build practical skills through AI-powered simulations.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[#5e6ad2] transition-colors">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[#5e6ad2] transition-colors">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[#5e6ad2] transition-colors">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Product</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-text-tertiary">
                <li><Link to="/start-simulation" className="hover:text-foreground transition-colors">Industries</Link></li>
                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Company</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-text-tertiary">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-text-tertiary">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-text-quaternary text-xs sm:text-sm text-center sm:text-left">
              © 2026 TURNVE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
