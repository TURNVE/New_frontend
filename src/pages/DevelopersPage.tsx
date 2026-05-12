import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, Code, BookOpen, Terminal, Layers, Zap, ArrowRight, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/simulations',
    description: 'List all available simulations',
    auth: 'Required'
  },
  {
    method: 'POST',
    path: '/api/v1/simulations/:id/start',
    description: 'Start a new simulation session',
    auth: 'Required'
  },
  {
    method: 'GET',
    path: '/api/v1/sessions/:id/state',
    description: 'Get current simulation state',
    auth: 'Required'
  },
  {
    method: 'POST',
    path: '/api/v1/sessions/:id/decision',
    description: 'Submit a decision in simulation',
    auth: 'Required'
  },
  {
    method: 'GET',
    path: '/api/v1/portfolio',
    description: 'Get user portfolio artifacts',
    auth: 'Required'
  }
];

const codeExamples = [
  {
    title: 'Start a Simulation',
    language: 'javascript',
    code: `const response = await fetch('https://api.turnve.com/v1/simulations/pm-01/start', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    track: 'business',
    difficulty: 'intermediate'
  })
});

const session = await response.json();
console.log('Session started:', session.id);`
  },
  {
    title: 'Submit a Decision',
    language: 'javascript',
    code: `const decision = await fetch('https://api.turnve.com/v1/sessions/\${sessionId}/decision', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'prioritize_feature',
    payload: {
      featureId: 'feat-001',
      priority: 'high',
      rationale: 'Critical for MVP launch'
    }
  })
});

const result = await decision.json();
// AI feedback included in response`
  },
  {
    title: 'Get Portfolio Artifacts',
    language: 'javascript',
    code: `const portfolio = await fetch('https://api.turnve.com/v1/portfolio', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const artifacts = await portfolio.json();
// Returns all completed simulation artifacts
// PRDs, decision logs, stakeholder communications, etc.`
  }
];

const integrations = [
  { name: 'Slack', description: 'Post simulation updates to Slack channels', icon: '💬' },
  { name: 'Notion', description: 'Sync portfolio artifacts to Notion pages', icon: '📝' },
  { name: 'GitHub', description: 'Link simulation projects to repositories', icon: '🐙' },
  { name: 'Zapier', description: 'Automate workflows with 5000+ apps', icon: '⚡' }
];

export default function DevelopersPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (index: number) => {
    navigator.clipboard.writeText(codeExamples[index].code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
                <Terminal className="h-4 w-4" />
                Developer API
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Build on the<br/>
                <span className="text-primary">TURNVE Platform</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Integrate simulations, AI coaching, and portfolio building into your own applications. Full REST API access for developers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a
                  href="#api-reference"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
                >
                  View API Docs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="#quick-start"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-xl hover:bg-secondary/80 transition-all whitespace-nowrap"
                >
                  <Code className="mr-2 h-5 w-5" />
                  Quick Start
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: 'REST API', description: 'Full HTTP API with JSON responses. Start simulations, submit decisions, and retrieve artifacts.' },
                { icon: Layers, title: 'Webhooks', description: 'Real-time events for simulation state changes, AI feedback, and milestone completions.' },
                { icon: BookOpen, title: 'SDKs', description: 'Official SDKs for JavaScript, Python, and more. Type-safe interfaces for rapid development.' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Quick Start
              </h2>
              <p className="text-lg text-muted-foreground">
                Get started in minutes with our API
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {codeExamples.map((example, index) => (
                <motion.div
                  key={example.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-foreground">{example.title}</span>
                    </div>
                    <button
                      onClick={() => copyCode(index)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-background text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {copiedIndex === index ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedIndex === index ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-4 text-sm text-muted-foreground overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                API Reference
              </h2>
              <p className="text-lg text-muted-foreground">
                Core endpoints for simulation management
              </p>
            </motion.div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.path}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-start gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${endpoint.method === 'GET' ? 'bg-[#c3faf5] dark:bg-[#187574] text-[#187574] dark:text-[#c3faf5]' : 'bg-[#ffc6c6] dark:bg-[#600000] text-[#600000] dark:text-[#ffc6c6]'}`}>
                      {endpoint.method}
                    </span>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                      <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                      <span className="text-xs text-muted-foreground mt-2 inline-block">
                        Auth: {endpoint.auth}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                View Full API Documentation
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Integrations
              </h2>
              <p className="text-lg text-muted-foreground">
                Connect TURNVE to your existing workflow
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="text-4xl mb-4">{integration.icon}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Get API Key */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-8 sm:p-12 rounded-3xl border border-primary bg-primary/5 text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Get Your API Key
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Sign up for a developer account and get instant access to the TURNVE API. Free tier includes 100 API calls per month.
              </p>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                Create Developer Account
                <ArrowRight className="ml-2 h-5 w-5" />
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
