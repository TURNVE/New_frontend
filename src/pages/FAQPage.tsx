import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, ChevronRight, HelpCircle, Search, Sparkles, CreditCard, Users, Award, Briefcase, Rocket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const faqCategories = [
  {
    category: 'General',
    icon: HelpCircle,
    color: 'bg-primary/10 text-primary',
    questions: [
      {
        question: 'What is TURNVE?',
        answer: 'TURNVE is an AI-powered practical career platform that helps professionals gain real management experience through simulations. Instead of just watching videos or reading courses, you make actual decisions in realistic business scenarios, receive AI feedback, and build a portfolio that proves your capabilities to employers.'
      },
      {
        question: 'How does TURNVE work?',
        answer: 'You choose an industry and role, then enter simulations that mirror real workplace scenarios. You make decisions, handle stakeholder challenges, and receive instant AI feedback. Each simulation produces portfolio artifacts—PRDs, decision logs, stakeholder communications—that you can show to employers.'
      },
      {
        question: 'Who is TURNVE for?',
        answer: 'TURNVE is designed for entry-level professionals, career transitioners, and anyone who has theoretical knowledge but lacks practical experience. It\'s especially valuable for aspiring Product Managers, Engineers transitioning to leadership, and professionals in Marketing, Finance, or Operations roles.'
      },
      {
        question: 'Do I need prior experience to use TURNVE?',
        answer: 'Basic domain knowledge is helpful but not required. TURNVE is designed to help you practice realistic workplace decisions, learn through feedback, and build experience even if you are still early in your career.'
      }
    ]
  },
  {
    category: 'Simulations',
    icon: Briefcase,
    color: 'bg-[#c3faf5]/50 dark:bg-[#187574]/30 text-[#187574]',
    questions: [
      {
        question: 'What kinds of simulations are available?',
        answer: 'We offer over 200 simulations across Tech, Marketing, Finance, Healthcare, Consulting, Retail, Education, and Manufacturing. Each simulation covers scenarios like product launches, stakeholder negotiations, crisis management, team coordination, and strategic planning.'
      },
      {
        question: 'How long does a simulation take?',
        answer: 'Most simulations take 30-60 minutes to complete, but complex scenarios can span multiple sessions. You can pause and resume anytime, so the experience fits around your schedule.'
      },
      {
        question: 'What happens when I make a "wrong" decision?',
        answer: 'There\'s no failure—only learning. When you make suboptimal decisions, our AI coach explains why the outcome wasn\'t ideal and suggests alternatives. This safe environment lets you practice high-stakes decisions without real-world consequences.'
      },
      {
        question: 'Can I retry simulations?',
        answer: 'Yes! You can replay simulations to explore different decision paths. Each attempt is saved separately, so you can compare outcomes and learn from varied approaches.'
      },
      {
        question: 'How does the AI coach work?',
        answer: 'Our AI analyzes your decisions against best practices, stakeholder dynamics, and business outcomes. It provides personalized feedback explaining why certain decisions work better, suggests improvements, and helps you develop a structured decision-making framework.'
      }
    ]
  },
  {
    category: 'Pricing & Plans',
    icon: CreditCard,
    color: 'bg-[#ffc6c6]/50 dark:bg-[#600000]/30 text-[#600000]',
    questions: [
      {
        question: 'Is there a free plan?',
        answer: 'Yes! The Explorer plan is free forever and includes 3 simulations per month, basic AI feedback, community access, and limited portfolio storage. Perfect for exploring TURNVE before committing to a paid plan.'
      },
      {
        question: 'What\'s included in the Accelerator plan?',
        answer: 'Accelerator ($29/month) includes unlimited simulations, advanced AI coaching, full portfolio builder, priority support, weekly live sessions, certificates, and 1:1 mentorship sessions. Ideal for serious learners ready to accelerate their career.'
      },
      {
        question: 'Can I switch plans anytime?',
        answer: 'Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle. No cancellation fees or penalties.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a full refund within 14 days of starting an Accelerator subscription if you\'re not satisfied. No questions asked. Contact support@turnve.com for refund requests.'
      },
      {
        question: 'Do you have enterprise pricing?',
        answer: 'Yes, we offer custom solutions for teams and organizations. Enterprise plans include custom simulations, team dashboards, analytics, dedicated success managers, and volume discounts. Contact us for a quote.'
      }
    ]
  },
  {
    category: 'Programs',
    icon: Rocket,
    color: 'bg-[#ffe6cd]/50 dark:bg-[#746019]/30 text-[#746019]',
    questions: [
      {
        question: 'What program is available now?',
        answer: 'TURNVE currently focuses on flexible, self-paced career simulations. You choose a role, complete realistic workplace scenarios, receive AI coaching, and build portfolio artifacts from your work.'
      },
      {
        question: 'How do self-paced simulations work?',
        answer: 'You can start a simulation when you are ready, pause between sessions, and return to your work later. Each scenario gives you practical decisions to make, then turns the outcome into feedback and portfolio-ready evidence.'
      },
      {
        question: 'Can I choose a career track?',
        answer: 'Yes. Simulations cover multiple roles and industries, including product, operations, marketing, finance, healthcare, consulting, retail, education, and manufacturing.'
      },
      {
        question: 'What happens after completing simulations?',
        answer: 'You receive structured feedback and portfolio artifacts that help you explain your decisions, show practical experience, and prepare stronger interview examples.'
      }
    ]
  },
  {
    category: 'Portfolio & Career',
    icon: Award,
    color: 'bg-[#ffd8f4]/50 dark:bg-[#187574]/30 text-primary',
    questions: [
      {
        question: 'How does the portfolio work?',
        answer: 'Every simulation produces artifacts—PRDs, stakeholder communications, decision logs, project plans—that are automatically added to your portfolio. You can organize, annotate, and share these artifacts with employers to prove your capabilities.'
      },
      {
        question: 'Can employers verify my portfolio?',
        answer: 'Yes! Portfolio artifacts include metadata showing simulation details, decision points, and AI feedback. Employers can request verification links that confirm authenticity without revealing your personal data.'
      },
      {
        question: 'How does TURNVE help with interviews?',
        answer: 'Our simulations prepare you for behavioral interviews by giving you real stories to tell. You\'ll have concrete examples of handling stakeholders, making trade-offs, and delivering results. Plus, our AI helps you practice articulating your experience.'
      },
      {
        question: 'What\'s the job success rate?',
        answer: '92% of Accelerator users who actively complete simulations report positive career outcomes within 6 months—landing new roles, promotions, or successful career transitions. Results depend on your engagement and effort.'
      },
      {
        question: 'Do you offer job placement?',
        answer: 'We provide interview preparation, resume review, and portfolio optimization, but we do not directly place candidates.'
      }
    ]
  },
  {
    category: 'Technical',
    icon: Zap,
    color: 'bg-primary/10 text-primary',
    questions: [
      {
        question: 'Is TURNVE available on mobile?',
        answer: 'TURNVE is web-based and works on desktop and tablet browsers. Mobile support is limited—simulations require larger screens for optimal experience. A mobile companion app for progress tracking is planned for 2026.'
      },
      {
        question: 'Do you have an API?',
        answer: 'Yes! Developers can access our REST API to integrate simulations, AI feedback, and portfolio building into their own applications. Visit /developers for API documentation and to request an API key.'
      },
      {
        question: 'How is my data protected?',
        answer: 'We use industry-standard encryption, secure authentication, and comply with GDPR and SOC 2 standards. Your simulation data and portfolio are private by default. You control what\'s shared with employers.'
      },
      {
        question: 'Can I export my portfolio?',
        answer: 'Yes! You can export portfolio artifacts as PDF, Markdown, or JSON formats. Perfect for attaching to job applications, sharing on LinkedIn, or integrating with other platforms.'
      },
      {
        question: 'What browsers are supported?',
        answer: 'TURNVE works best on Chrome, Firefox, Safari, and Edge (latest versions). JavaScript must be enabled. We recommend a stable internet connection for optimal AI feedback responsiveness.'
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredQuestions = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

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
                <HelpCircle className="h-4 w-4" />
                Help Center
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Frequently Asked<br/>
                <span className="text-primary">Questions</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Everything you need to know about TURNVE. Can't find your answer? Contact our support team.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredQuestions.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {category.category}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {category.questions.length} questions
                  </span>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {category.questions.map((item, qIndex) => {
                    const key = `${catIndex}-${qIndex}`;
                    const isOpen = openItems[key];

                    return (
                      <div
                        key={qIndex}
                        className="rounded-2xl border border-border bg-card overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full p-6 flex items-center justify-between text-left group"
                        >
                          <span className={`font-semibold transition-colors ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                            {item.question}
                          </span>
                          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-6 pb-6"
                            >
                              <p className="text-muted-foreground leading-relaxed">
                                {item.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-16">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No questions found matching your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-8"
            >
              <div className="p-8 rounded-2xl border border-border bg-card text-center">
                <Sparkles className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Contact Support</h3>
                <p className="text-muted-foreground mb-4">Our team is here to help</p>
                <a
                  href="mailto:support@turnve.com"
                  className="text-primary font-semibold hover:underline"
                >
                  support@turnve.com
                </a>
              </div>

              <div className="p-8 rounded-2xl border border-border bg-card text-center">
                <Users className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Join Community</h3>
                <p className="text-muted-foreground mb-4">Connect with other learners</p>
                <Link
                  to="#"
                  className="text-primary font-semibold hover:underline"
                >
                  Discord Community
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-8 sm:p-12 rounded-3xl border border-primary bg-primary/5"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to start your journey?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of professionals building real experience with TURNVE simulations.
              </p>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                Get Started Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer7
        logo={{ url: "/", src: "/logo.png", alt: "TURNVE logo", title: "TURNVE" }}
        sections={[
          { title: "Product", links: [{ name: "Features", href: "/features" }, { name: "Programs", href: "/programs" }, { name: "Pricing", href: "/pricing" }] },
          { title: "Company", links: [{ name: "About", href: "/about" }, { name: "Blog", href: "/blog" }, { name: "Careers", href: "#" }] },
          { title: "Resources", links: [{ name: "FAQ", href: "/faq" }, { name: "Developers", href: "/developers" }, { name: "Contact", href: "#" }] },
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
