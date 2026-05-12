import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, Users, Award, Zap, Brain, LineChart, Target, Briefcase, Sparkles, Rocket, Workflow, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    category: 'AI-Powered Learning',
    items: [
      {
        icon: Brain,
        title: 'AI Coach',
        description: 'Get personalized feedback on your decisions. Our AI analyzes your simulation performance and provides actionable insights.',
        accent: 'teal'
      },
      {
        icon: Sparkles,
        title: 'Smart Scenarios',
        description: 'Dynamic simulations that adapt to your skill level. Each scenario presents unique challenges based on real-world cases.',
        accent: 'orange'
      },
      {
        icon: LineChart,
        title: 'Progress Analytics',
        description: 'Track your growth with detailed metrics. See how you improve across communication, leadership, and strategic thinking.',
        accent: 'coral'
      }
    ]
  },
  {
    category: 'Practical Experience',
    items: [
      {
        icon: Briefcase,
        title: 'Real Projects',
        description: 'Work on actual business problems. Build portfolio pieces that demonstrate your ability to deliver results.',
        accent: 'teal'
      },
      {
        icon: Target,
        title: 'Stakeholder Management',
        description: 'Navigate complex organizational dynamics. Practice communicating with executives, engineers, and designers.',
        accent: 'orange'
      },
      {
        icon: Workflow,
        title: 'Decision Making',
        description: 'Make high-stakes decisions with real consequences. Learn to weigh trade-offs and justify your choices.',
        accent: 'coral'
      }
    ]
  },
  {
    category: 'Career Advancement',
    items: [
      {
        icon: Award,
        title: 'Verified Portfolio',
        description: 'Every simulation produces defensible artifacts. Showcase proven experience that employers can verify.',
        accent: 'teal'
      },
      {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Work with peers on cross-functional projects. Build the soft skills that differentiate great managers.',
        accent: 'orange'
      },
      {
        icon: Rocket,
        title: 'Interview Ready',
        description: 'Walk into interviews with confidence. You have real stories and outcomes to share with hiring managers.',
        accent: 'coral'
      }
    ]
  }
];

const accentColors = {
  teal: {
    bg: 'bg-[#c3faf5]/50 dark:bg-[#187574]/30',
    border: 'hover:border-[#187574]/50',
    icon: 'bg-[#187574] dark:bg-[#c3faf5] text-[#c3faf5] dark:text-[#187574]'
  },
  orange: {
    bg: 'bg-[#ffe6cd]/50 dark:bg-[#746019]/30',
    border: 'hover:border-[#746019]/50',
    icon: 'bg-[#746019] dark:bg-[#ffe6cd] text-[#ffe6cd] dark:text-[#746019]'
  },
  coral: {
    bg: 'bg-[#ffc6c6]/50 dark:bg-[#600000]/30',
    border: 'hover:border-[#600000]/50',
    icon: 'bg-[#600000] dark:bg-[#ffc6c6] text-[#ffc6c6] dark:text-[#600000]'
  }
};

export default function FeaturesPage() {
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
                <Zap className="h-4 w-4" />
                Powerful Features
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Everything you need to<br/>
                <span className="text-primary">land your dream role</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                From AI-powered simulations to verified portfolio pieces, TURNVE gives you the practical experience employers actually value.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features by Category */}
        {features.map((category, categoryIndex) => (
          <section key={category.category} className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {category.category}
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {category.items.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`group p-8 rounded-2xl border border-border ${accentColors[feature.accent].bg} ${accentColors[feature.accent].border} hover:shadow-xl transition-all duration-300`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${accentColors[feature.accent].icon}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Comparison */}
        <section className="py-20 lg:py-32 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why TURNVE beats traditional learning
              </h2>
              <p className="text-lg text-muted-foreground">
                See how we compare to courses, certifications, and other career platforms
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl border border-border bg-card">
                <h3 className="text-lg font-bold text-muted-foreground mb-6">Traditional Courses</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">×</span>
                    </div>
                    <span>Passive video lectures</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">×</span>
                    </div>
                    <span>No real stakes or consequences</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">×</span>
                    </div>
                    <span>Generic portfolio projects</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">×</span>
                    </div>
                    <span>One-time purchase, no ongoing support</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl border border-primary bg-primary/10">
                <h3 className="text-lg font-bold text-primary mb-6">TURNVE</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span>Interactive simulations with real decisions</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span>AI feedback on every decision you make</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span>Verified portfolio with real outcomes</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span>Continuous learning and community support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-indigo-800 rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl shadow-primary/25">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to experience the difference?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who are building real experience, not just watching videos.
                </p>
                <Link
                  to="/sign-up"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary text-base font-semibold rounded-xl hover:bg-primary-foreground/90 transition-all whitespace-nowrap"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
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
