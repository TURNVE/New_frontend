import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Target, 
  Shield, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Award,
  Clock,
  LineChart,
  Layers,
  Sparkles,
  TrendingUp,
  Lock,
  UsersRound,
  BrainCircuit,
  BadgeCheck
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { AnimatedGroup } from '../../components/ui/animated-group';

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
                  to="/sign-up?type=organization" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/organization/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
                >
                  Organization Login
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Built for Enterprise Scale */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-sm" />
                
                <div className="relative z-10">
                  {/* Icon with animation */}
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                  >
                    <feature.icon className={`h-7 w-7 ${feature.iconColor} group-hover:animate-pulse`} />
                  </motion.div>
                  
                  {/* Title with slide animation */}
                  <motion.h3 
                    className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300"
                    initial={false}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  {/* Description with fade animation */}
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Animated check indicator */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Learn more</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Corner decoration */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Enterprise Plan
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Custom Solutions for Large Organizations
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get a tailored program designed specifically for your industry, 
                company culture, and learning objectives.
              </p>
              
              <div className="space-y-4">
                {enterpriseFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/sign-up?type=organization" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  to="/organization/login" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
                >
                  Organization Login
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
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
                  
                  <div className="flex items-center gap-4 group">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
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
                  
                  <div className="flex items-center gap-4 group">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
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
                Start your organization account today or schedule a demo with our enterprise team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/sign-up?type=organization" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary text-base font-semibold rounded-xl hover:bg-primary-foreground/90 transition-all hover:shadow-lg whitespace-nowrap"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/organization/login" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white text-base font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all whitespace-nowrap"
                >
                  Organization Login
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
                <img src="/logo.png" alt="TURNVE" className="h-8 sm:h-10 w-auto" />
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
