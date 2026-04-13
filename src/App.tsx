import { Footer7 } from './components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight, Users, Award, Zap, Sparkles, CheckCircle2, PlayCircle, Briefcase, Target, Calendar, Globe, Rocket, LineChart } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedGroup } from './components/ui/animated-group';
import { Header } from './components/layout/Header';
import { Link } from 'react-router-dom';

function ProgramPreview() {
  return (
    <section id="program" className="py-20 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Calendar className="h-3 w-3 mr-1" />
              Next Cohort: April 2026
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              5-Week Practical Bootcamp
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Experience the job before you land it. Operate inside a structured startup lifecycle 
              with real deadlines, stakeholder feedback, and senior mentorship.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Live online sessions with industry practitioners',
                'Hands-on projects with real deliverables',
                'AI-powered feedback and coaching',
                'Portfolio pieces you can defend in interviews'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/bootcamp"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">5</div>
                  <div className="text-sm text-muted-foreground">Weeks</div>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">4</div>
                  <div className="text-sm text-muted-foreground">Tracks</div>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">1:1</div>
                  <div className="text-sm text-muted-foreground">Mentorship</div>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Remote</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Hero />
        
        {/* How It Works Section */}
        <HowItWorks />

        {/* Integrations Section */}
        <IntegrationsSection />

        {/* Features Section - Horizontal Marquee */}
        <section id="features" className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                Why Choose TURNVE
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Everything you need to succeed
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Practical career platform for professionals
              </p>
            </div>
          </div>
          
          {/* Marquee Container */}
          <div className="relative">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling Track */}
            <motion.div 
              className="flex gap-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {/* Double the cards for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  <CompactFeatureCard
                    icon={<Users className="w-5 h-5" />}
                    title="Team Collaboration"
                    description="Work with your team on projects"
                    accent="coral"
                  />
                  <CompactFeatureCard
                    icon={<Award className="w-5 h-5" />}
                    title="Skill Development"
                    description="Build management experience"
                    accent="teal"
                  />
                  <CompactFeatureCard
                    icon={<Zap className="w-5 h-5" />}
                    title="AI-Powered Insights"
                    description="Get personalized feedback"
                    accent="orange"
                  />
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Program 1 Section */}
        <ProgramPreview />

        {/* Stats Section */}
        <StatsSection />

        {/* Testimonials Section */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-indigo-800 rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl shadow-primary/25">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to transform your career?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who have accelerated their careers with TURNVE. Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/sign-up" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary text-base font-semibold rounded-xl hover:bg-primary-foreground/90 transition-all hover:shadow-lg whitespace-nowrap"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
                
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer7
        logo={{
          url: "/",
          src: "/logo.png",
          alt: "TURNVE logo",
          title: "TURNVE",
        }}
        sections={[
          {
            title: "Product",
            links: [
              { name: "Overview", href: "#" },
              { name: "Pricing", href: "#" },
              { name: "Features", href: "#" },
              { name: "PM Simulator", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { name: "About Us", href: "#" },
              { name: "Team", href: "#" },
              { name: "Blog", href: "#" },
              { name: "Careers", href: "#" },
            ],
          },
          {
            title: "Resources",
            links: [
              { name: "Help Center", href: "#" },
              { name: "Documentation", href: "#" },
              { name: "API", href: "#" },
              { name: "Contact", href: "#" },
            ],
          },
        ]}
        description="AI-powered practical career platform helping professionals gain management experience, build portfolios, and land managerial roles."
        socialLinks={[
          { icon: <Instagram className="size-5" />, href: "#", label: "Instagram" },
          { icon: <Facebook className="size-5" />, href: "#", label: "Facebook" },
          { icon: <Twitter className="size-5" />, href: "#", label: "Twitter" },
          { icon: <Linkedin className="size-5" />, href: "#", label: "LinkedIn" },
        ]}
        copyright="© 2026 TURNVE. All rights reserved."
        legalLinks={[
          { name: "Terms and Conditions", href: "#" },
          { name: "Privacy Policy", href: "#" },
        ]}
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
      
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#ffc6c6]/30 dark:bg-[#600000]/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-[#c3faf5]/30 dark:bg-[#187574]/20 rounded-full blur-3xl animate-blob animation-delay-200"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-[#ffe6cd]/30 dark:bg-[#746019]/20 rounded-full blur-3xl animate-blob animation-delay-400"></div>
      
      <div className="mx-auto max-w-5xl px-6">
        <div className="sm:mx-auto text-center relative z-20">
          <AnimatedGroup preset="fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Career Platform
            </div>
            <h1 className="mt-8 max-w-3xl text-balance text-5xl font-bold md:text-6xl lg:mt-16 text-foreground mx-auto tracking-tight">
              Theory Gets You Noticed.<br/>
              <span className="text-primary">Practice Gets You Hired.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground mx-auto">
              Turn your career knowledge into demonstrable management experience with AI-guided simulations and real projects.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/sign-up" 
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                See How It Works
              </a>
            </div>
          </AnimatedGroup>
        </div>
        <AnimatedGroup preset="slide">
          <div className="relative mx-auto mt-8 px-2 sm:mt-12 md:mt-20 z-20">
            <div aria-hidden className="bg-gradient-to-b from-transparent via-background/50 to-background absolute inset-0 z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl transition-all duration-700">
              <img
                className="w-full h-auto relative object-contain"
                src="/images/hero-briefing.png"
                alt="TURNVE Simulation Briefing Preview"
              />
            </div>
          </div>
        </AnimatedGroup>
        
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-secondary/30 to-transparent -z-10 pointer-events-none" />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose Your Path",
      description: "Select your industry and role across Tech, Marketing, Finance, and more.",
      icon: Target,
      color: "text-primary"
    },
    {
      number: "02",
      title: "Run Simulations",
      description: "Experience realistic scenarios and solve real business problems.",
      icon: PlayCircle,
      color: "text-[#187574]"
    },
    {
      number: "03",
      title: "Get AI Feedback",
      description: "Receive instant feedback to improve your management skills.",
      icon: Zap,
      color: "text-[#746019]"
    },
    {
      number: "04",
      title: "Build Portfolio",
      description: "Showcase proven experience to employers with real outcomes.",
      icon: Briefcase,
      color: "text-[#600000]"
    },
    {
      number: "05",
      title: "Land Your Role",
      description: "Walk into interviews with confidence and demonstrable experience.",
      icon: Rocket,
      color: "text-primary"
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            How It Works
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            From zero to hired in 5 steps
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Transform knowledge into skills employers value
          </p>
        </div>

        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden xl:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-card rounded-[20px] border border-border p-3 sm:p-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Top row: Number + Icon - Icon hidden on mobile */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg sm:text-xl font-bold ${step.color}`}>{step.number}</span>
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:scale-105 transition-transform hidden sm:flex`}>
                      <step.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${step.color}`} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1 leading-tight">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug line-clamp-3">{step.description}</p>
                </div>
                
                {/* Arrow connector - mobile/tablet only */}
                {index < steps.length - 1 && (
                  <>
                    {/* Mobile: horizontal arrow between columns */}
                    <div className="hidden sm:flex lg:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-4 w-4 text-primary/30" />
                    </div>
                    {/* Mobile 2-col: arrow after odd items */}
                    {(index === 1) && (
                      <div className="flex sm:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                        <ArrowRight className="h-4 w-4 text-primary/30 rotate-90" />
                      </div>
                    )}
                    {(index === 0 || index === 2) && (
                      <div className="flex sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                        <ArrowRight className="h-4 w-4 text-primary/30" />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            to="/industries"
            className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 bg-primary text-primary-foreground text-sm sm:text-base font-semibold rounded-lg hover:opacity-90 transition-all shadow-md shadow-primary/20 whitespace-nowrap"
          >
            Start Your Journey
            <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "200+", label: "Simulations", icon: PlayCircle },
    { value: "92%", label: "Job Success Rate", icon: LineChart },
    { value: "4.9★", label: "User Rating", icon: Award },
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



function IntegrationsSection() {
  const integrations = [
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "LinkedIn", url: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
    { name: "Slack", url: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png" },
    { name: "Microsoft", url: "https://cdn-icons-png.flaticon.com/512/174/174872.png" },
    { name: "Facebook", url: "https://cdn-icons-png.flaticon.com/512/733/733547.png" },
    { name: "Stripe", url: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png" },
    { name: "Dropbox", url: "https://cdn-icons-png.flaticon.com/512/888/888853.png" },
    { name: "Jira", url: "https://cdn-icons-png.flaticon.com/512/906/906324.png" },
    { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Square", url: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png" },
    { name: "Shopify", url: "https://cdn-icons-png.flaticon.com/512/732/732218.png" },
    { name: "Zapier", url: "https://cdn-icons-png.flaticon.com/512/5968/5968755.png" },
    { name: "Google Drive", url: "https://cdn-icons-png.flaticon.com/512/5968/5968520.png" },
    { name: "YouTube", url: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
    { name: "Airtable", url: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png" },
    { name: "Discord", url: "https://cdn-icons-png.flaticon.com/512/2111/2111370.png" },
  ];

  return (
    <section className="max-w-7xl mx-auto my-16 px-6">
      <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-white/5">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">Learn from top organizations</h2>
            <p className="text-muted-foreground mb-5 text-sm sm:text-base leading-relaxed">
              Turnve provides AI-powered simulations that mirror real-world scenarios used by top companies. 
              Gain practical experience in project management, team collaboration, and strategic decision-making.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all whitespace-nowrap text-sm">Start Learning</a>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
            {integrations.map((integration, idx) => (
              <div key={idx} className="w-12 h-12 sm:w-14 sm:h-14 p-2.5 bg-white dark:bg-white/90 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300">
                <img src={integration.url} alt={integration.name} className="w-full h-full object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompactFeatureCard({ icon, title, description, accent }: { icon: React.ReactNode; title: string; description: string; accent?: 'coral' | 'teal' | 'orange' }) {
  const accentColors = {
    coral: 'bg-[#ffc6c6]/30 dark:bg-[#600000]/20 border-[#ffc6c6]/50 dark:border-[#600000]/30',
    teal: 'bg-[#c3faf5]/30 dark:bg-[#187574]/20 border-[#c3faf5]/50 dark:border-[#187574]/30',
    orange: 'bg-[#ffe6cd]/30 dark:bg-[#746019]/20 border-[#ffe6cd]/50 dark:border-[#746019]/30',
  };
  
  const iconColors = {
    coral: 'bg-[#ffc6c6] dark:bg-[#600000] text-[#600000] dark:text-[#ffc6c6]',
    teal: 'bg-[#c3faf5] dark:bg-[#187574] text-[#187574] dark:text-[#c3faf5]',
    orange: 'bg-[#ffe6cd] dark:bg-[#746019] text-[#746019] dark:text-[#ffe6cd]',
  };

  return (
    <div className={`group shrink-0 w-[280px] sm:w-[320px] p-4 sm:p-5 rounded-xl border hover:border-primary/50 hover:shadow-lg transition-all duration-300 ${accent ? accentColors[accent] : 'bg-card border-border hover:shadow-primary/25'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${accent ? iconColors[accent] : 'bg-primary/10 text-primary'}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground leading-snug">{description}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, accent }: { icon: React.ReactNode; title: string; description: string; accent?: 'coral' | 'teal' | 'orange' }) {
  const accentColors = {
    coral: 'bg-[#ffc6c6]/50 dark:bg-[#600000]/30 border-[#ffc6c6] dark:border-[#600000]/50 hover:shadow-[#ffc6c6]/25 dark:hover:shadow-[#600000]/25',
    teal: 'bg-[#c3faf5]/50 dark:bg-[#187574]/30 border-[#c3faf5] dark:border-[#187574]/50 hover:shadow-[#c3faf5]/25 dark:hover:shadow-[#187574]/25',
    orange: 'bg-[#ffe6cd]/50 dark:bg-[#746019]/30 border-[#ffe6cd] dark:border-[#746019]/50 hover:shadow-[#ffe6cd]/25 dark:hover:shadow-[#746019]/25',
  };
  
  const iconColors = {
    coral: 'bg-[#ffc6c6] dark:bg-[#600000] text-[#600000] dark:text-[#ffc6c6]',
    teal: 'bg-[#c3faf5] dark:bg-[#187574] text-[#187574] dark:text-[#c3faf5]',
    orange: 'bg-[#ffe6cd] dark:bg-[#746019] text-[#746019] dark:text-[#ffe6cd]',
  };

  return (
    <div className={`group p-8 rounded-2xl border hover:border-primary/50 hover:shadow-xl transition-all duration-300 ${accent ? accentColors[accent] : 'bg-card border-border hover:shadow-primary/25'}`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${accent ? iconColors[accent] : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    { text: "Turnve transformed my career. The AI simulations gave me real-world experience that helped me land my first PM role.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", name: "Sarah Chen", role: "Product Manager @ TechCorp" },
    { text: "The hands-on projects are incredibly realistic. I learned more in 4 weeks than months of online courses.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", name: "Marcus Johnson", role: "UX Designer @ StartupXYZ" },
    { text: "Best investment in my career. The portfolio I built through Turnve was the key differentiator.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", name: "Emily Rodriguez", role: "Marketing Lead @ BrandCo" },
    { text: "As a career transitioner, Turnve gave me the confidence and practical skills I needed.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", name: "David Park", role: "Data Analyst @ FinTech Inc" },
    { text: "The simulations mirror real workplace scenarios. I walked into my new role feeling prepared.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", name: "Priya Sharma", role: "Project Coordinator @ GlobalCorp" },
    { text: "Turnve's AI coach helped me identify my strengths and accelerate my growth.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", name: "James Wilson", role: "Business Analyst @ Consulting" },
    { text: "I went from zero experience to landing my dream job in 3 months.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", name: "Aisha Mohammed", role: "Operations Manager @ Logistics Co" },
    { text: "The team collaboration features helped me build my network. I met my co-founder here!", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", name: "Alex Thompson", role: "Co-Founder @ NewVenture" },
    { text: "Practical, relevant, and career-changing. Better than any certification.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", name: "Lisa Chang", role: "Strategy Consultant" },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">Testimonials</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-foreground">What our users say</h2>
          <p className="text-center mt-4 text-lg text-muted-foreground">See what our customers have to say about their Turnve experience.</p>
        </motion.div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}

function TestimonialsColumn({ testimonials, duration, className }: { testimonials: any[]; duration?: number; className?: string }) {
  return (
    <div className={className}>
      <motion.div animate={{ translateY: "-50%" }} transition={{ duration: duration || 10, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="flex flex-col gap-6 pb-6">
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div className="p-6 rounded-2xl border border-border bg-card shadow-lg max-w-xs w-full" key={i}>
                <div className="text-muted-foreground leading-relaxed">{text}</div>
                <div className="flex items-center gap-3 mt-5">
                  <img width={40} height={40} src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <div className="font-semibold text-foreground tracking-tight text-sm">{name}</div>
                    <div className="text-muted-foreground text-sm tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
}

export default App;