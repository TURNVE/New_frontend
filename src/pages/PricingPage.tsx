import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, CheckCircle2, Sparkles, Users, Zap, ArrowRight, CreditCard, Award, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Explorer',
    price: 'Free',
    period: 'Forever',
    description: 'Perfect for getting started and exploring simulations',
    features: [
      '3 free simulations per month',
      'Basic AI feedback',
      'Community access',
      'Limited portfolio storage',
      'Email support'
    ],
    cta: 'Get Started Free',
    ctaLink: '/sign-up',
    popular: false
  },
  {
    name: 'Accelerator',
    price: '$29',
    period: '/month',
    description: 'For serious learners ready to accelerate their career',
    features: [
      'Unlimited simulations',
      'Advanced AI coaching',
      'Full portfolio builder',
      'Priority support',
      'Weekly live sessions',
      'Certificate of completion',
      '1:1 mentorship sessions'
    ],
    cta: 'Start 14-Day Trial',
    ctaLink: '/sign-up',
    popular: true
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For teams and professionals seeking maximum results',
    features: [
      'Everything in Accelerator',
      'Custom simulation scenarios',
      'Team collaboration tools',
      'Admin dashboard',
      'Analytics & reporting',
      'Dedicated success manager',
      'Interview preparation coaching',
      'Priority feature requests'
    ],
    cta: 'Contact Sales',
    ctaLink: '#contact',
    popular: false
  }
];

export default function PricingPage() {
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
                <CreditCard className="h-4 w-4" />
                Simple Pricing
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Invest in your career,<br/>
                <span className="text-primary">not just courses</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your goals. All plans include access to our AI-powered simulations and portfolio builder.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border bg-card'} transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.ctaLink}
                    className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25' : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'}`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffe6cd]/50 dark:bg-[#746019]/30 border border-[#ffe6cd] dark:border-[#746019]/50 text-[#746019] dark:text-[#ffe6cd] text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                For Teams
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Enterprise & Teams
              </h2>
              <p className="text-lg text-muted-foreground">
                Custom solutions for organizations looking to upskill their workforce
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Custom Simulations</h3>
                    <p className="text-sm text-muted-foreground">Tailored to your industry</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  We'll create simulations specific to your company's challenges, industry, and team structure.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#c3faf5]/50 dark:bg-[#187574]/30 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-[#187574] dark:text-[#c3faf5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Onboarding & Training</h3>
                    <p className="text-sm text-muted-foreground">Full implementation support</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Dedicated success manager, training sessions, and ongoing support for your team.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                Contact for Enterprise Pricing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
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
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
                { q: 'Is there a free trial?', a: 'The Explorer plan is free forever with limited features. Accelerator includes a 14-day free trial with full access.' },
                { q: 'What happens to my portfolio if I downgrade?', a: 'Your portfolio remains intact. You can still view and share existing work, but new simulations will be limited.' },
                { q: 'Do you offer refunds?', a: 'We offer a full refund within the first 14 days if you\'re not satisfied with your Accelerator subscription.' },
                { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription anytime. No cancellation fees or hidden charges.' }
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
