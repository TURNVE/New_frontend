import { Footer7 } from './components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight, Users, Award, Zap, Sparkles, CheckCircle2, PlayCircle, Briefcase, Target, Globe, Rocket, Star, HelpCircle, Mail, Building2, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedGroup } from './components/ui/animated-group';
import { Header } from './components/layout/Header';
import { Link } from 'react-router-dom';

function CompanySection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Building2 className="h-3 w-3 mr-1" />
              Company Simulation Studio
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Build Custom Simulations for Your Users
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
              Give your company a dedicated dashboard for creating scenario-based simulations, publishing live links, and tracking how users perform across each experience.
            </p>
            
            <div className="space-y-3 mb-8">
              {[
                'Create simulations from scratch',
                'Publish shareable links for your users',
                'Track learner starts, completions, and scores',
                'Manage company branding and scenario details'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
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
          
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground">Team Members</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <Award className="h-6 w-6 text-emerald-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">95%</p>
                  <p className="text-xs text-muted-foreground">Skill Improvement</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <Zap className="h-6 w-6 text-amber-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">3x</p>
                  <p className="text-xs text-muted-foreground">Faster Onboarding</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <Star className="h-6 w-6 text-rose-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">4.9</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function App() {
  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.init({
        duration: 600,
        easing: 'ease-out',
        once: true,
        offset: 50,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Hero />
        
        {/* How It Works Section */}
        <HowItWorks />

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
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* Set 1 - Original cards */}
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
              <CompactFeatureCard
                icon={<Target className="w-5 h-5" />}
                title="Goal Tracking"
                description="Monitor your progress daily"
                accent="coral"
              />
              <CompactFeatureCard
                icon={<Briefcase className="w-5 h-5" />}
                title="Portfolio Builder"
                description="Showcase your achievements"
                accent="teal"
              />
              <CompactFeatureCard
                icon={<Globe className="w-5 h-5" />}
                title="Global Network"
                description="Connect with professionals"
                accent="orange"
              />
              <CompactFeatureCard
                icon={<Rocket className="w-5 h-5" />}
                title="Career Launch"
                description="Fast-track your promotion"
                accent="coral"
              />
              <CompactFeatureCard
                icon={<PlayCircle className="w-5 h-5" />}
                title="Live Simulations"
                description="Practice real scenarios"
                accent="teal"
              />
              
              {/* Set 2 - Duplicate for seamless loop */}
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
              <CompactFeatureCard
                icon={<Target className="w-5 h-5" />}
                title="Goal Tracking"
                description="Monitor your progress daily"
                accent="coral"
              />
              <CompactFeatureCard
                icon={<Briefcase className="w-5 h-5" />}
                title="Portfolio Builder"
                description="Showcase your achievements"
                accent="teal"
              />
              <CompactFeatureCard
                icon={<Globe className="w-5 h-5" />}
                title="Global Network"
                description="Connect with professionals"
                accent="orange"
              />
              <CompactFeatureCard
                icon={<Rocket className="w-5 h-5" />}
                title="Career Launch"
                description="Fast-track your promotion"
                accent="coral"
              />
              <CompactFeatureCard
                icon={<PlayCircle className="w-5 h-5" />}
                title="Live Simulations"
                description="Practice real scenarios"
                accent="teal"
              />
            </motion.div>
          </div>
        </section>

        {/* Company/Organization Section */}
        <CompanySection />

        {/* FAQ Section */}
        <FAQSection />

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
                  Ready to gain real-world experience?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Start Program 2 and build portfolio proof through practical simulations designed for early-career, junior, and career-switching talent.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/sign-up" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary text-base font-semibold rounded-xl hover:bg-primary-foreground/90 transition-all hover:shadow-lg whitespace-nowrap"
                  >
                    Start a Simulation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
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
              { name: "Features", href: "/features" },
              { name: "Programs", href: "/programs" },
              { name: "Pricing", href: "/pricing" },
              { name: "PM Simulator", href: "/simulations" },
            ],
          },
          {
            title: "Company",
            links: [
              { name: "About Us", href: "/about" },
              { name: "Organizations", href: "/company/start" },
              { name: "Blog", href: "/blog" },
              { name: "Contact", href: "/contact" },
            ],
          },
          {
            title: "Resources",
            links: [
              { name: "FAQ", href: "/faq" },
              { name: "Developers", href: "/developers" },
              { name: "Simulations", href: "/simulations" },
              { name: "Dashboard", href: "/dashboard" },
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
          { name: "Privacy & Terms", href: "/privacy" },
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
              Built for early-career, junior, and switching talent
            </div>
            <h1 className="mt-8 max-w-3xl text-balance text-5xl font-bold md:text-6xl lg:mt-16 text-foreground mx-auto tracking-tight">
              Gain Real-World Experience<br/>
              <span className="text-primary">Before You Get Hired.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground mx-auto">
              Program 2 helps early-career talent, junior professionals, and career switchers practice workplace decisions, receive AI feedback, and build portfolio proof employers can inspect.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {['Early-career talent', 'Junior-level talent', 'Career switchers'].map((audience) => (
                <span
                  key={audience}
                  className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-foreground"
                >
                  {audience}
                </span>
              ))}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/sign-up" 
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                Start Program 2
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Request Organization Demo
              </a>
            </div>
          </AnimatedGroup>
        </div>
        <AnimatedGroup preset="slide">
          {/* Hero image removed */}
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
      lightBg: "bg-blue-50 dark:bg-blue-500/5",
      borderColor: "border-blue-200 dark:border-blue-500/20",
      iconBg: "bg-blue-100 dark:bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
      aos: "fade-up"
    },
    {
      number: "02",
      title: "Run Simulations",
      description: "Experience realistic scenarios and solve real business problems.",
      icon: PlayCircle,
      lightBg: "bg-teal-50 dark:bg-teal-500/5",
      borderColor: "border-teal-200 dark:border-teal-500/20",
      iconBg: "bg-teal-100 dark:bg-teal-500/15",
      iconColor: "text-teal-600 dark:text-teal-400",
      aos: "fade-up"
    },
    {
      number: "03",
      title: "Get AI Feedback",
      description: "Receive instant feedback to improve your management skills.",
      icon: Zap,
      lightBg: "bg-amber-50 dark:bg-amber-500/5",
      borderColor: "border-amber-200 dark:border-amber-500/20",
      iconBg: "bg-amber-100 dark:bg-amber-500/15",
      iconColor: "text-amber-600 dark:text-amber-400",
      aos: "fade-up"
    },
    {
      number: "04",
      title: "Build Portfolio",
      description: "Showcase proven experience to employers with real outcomes.",
      icon: Briefcase,
      lightBg: "bg-rose-50 dark:bg-rose-500/5",
      borderColor: "border-rose-200 dark:border-rose-500/20",
      iconBg: "bg-rose-100 dark:bg-rose-500/15",
      iconColor: "text-rose-600 dark:text-rose-400",
      aos: "fade-up"
    },
    {
      number: "05",
      title: "Land Your Role",
      description: "Walk into interviews with confidence and demonstrable experience.",
      icon: Rocket,
      lightBg: "bg-violet-50 dark:bg-violet-500/5",
      borderColor: "border-violet-200 dark:border-violet-500/20",
      iconBg: "bg-violet-100 dark:bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
      aos: "fade-up"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Build experience in 5 steps
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Turn knowledge into real-world practice, feedback, and portfolio proof.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8, transition: { duration: 0.3, type: "spring", stiffness: 300 } }}
              data-aos={step.aos}
              data-aos-delay={index * 100}
              data-aos-duration="600"
              className="relative group"
            >
              {/* Card with light background */}
              <div className={`relative ${step.lightBg} rounded-2xl sm:rounded-3xl border-2 ${step.borderColor} p-5 sm:p-6 lg:p-7 hover:shadow-xl transition-all duration-300 h-full min-h-[200px] sm:min-h-[220px] lg:min-h-[260px] flex flex-col overflow-hidden`}>
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
                
                {/* Step Number Badge */}
                <div className="relative z-10 mb-4 flex">
                  <div className={`inline-flex h-7 min-w-[76px] items-center justify-center rounded-full ${step.iconBg} border ${step.borderColor} px-3 text-xs font-bold uppercase tracking-wide ${step.iconColor}`}>
                    Step {step.number}
                  </div>
                </div>
                
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${step.iconBg} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 z-10`}>
                  <step.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${step.iconColor}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-foreground mb-2 sm:mb-3 leading-tight z-10">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-grow z-10">
                  {step.description}
                </p>
              </div>
              
              {/* Connector arrows (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 z-10">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-6 h-6 rounded-full ${step.iconBg} border ${step.borderColor} flex items-center justify-center`}
                  >
                    <ArrowRight className={`h-3 w-3 ${step.iconColor}`} />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            to="/start-simulation"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
          >
            Start Program 2
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "How does TURNVE's AI-powered simulation work?",
      answer: "Our AI creates realistic workplace scenarios based on real industry challenges. You'll make decisions, manage projects, and interact with virtual stakeholders. The AI provides instant feedback on your choices and tracks your progress over time."
    },
    {
      question: "Do I need prior management experience to join?",
      answer: "Not at all! TURNVE is designed for entry-level professionals and career transitioners. Our simulations adapt to your skill level, starting with foundational scenarios and progressively increasing complexity as you grow."
    },
    {
      question: "How long do I have access to the simulations?",
      answer: "You get unlimited access to all simulations during your active subscription. You can revisit scenarios anytime to practice, compare decisions, and refine your skills. Plus, new simulations are added monthly."
    },
    {
      question: "Will this help me get a job?",
      answer: "Yes! 92% of our graduates land jobs within 6 months. You'll build a portfolio of completed projects, earn certificates, and gain demonstrable experience you can discuss in interviews. Many hiring managers specifically value practical simulation experience."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Everything you need to know about transforming your career with TURNVE
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground pr-4">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              <motion.div
                initial={false}
                animate={{ 
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[68px] sm:pl-[80px]">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/faq"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
          >
            View All FAQs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
          >
            <Mail className="mr-2 h-5 w-5" />
            Contact Us
          </Link>
        </motion.div>
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

export default App;
