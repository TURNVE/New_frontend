import { Footer7 } from './components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight, Users, Award, Zap } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedGroup } from './components/ui/animated-group';
import { Header } from './components/layout/Header';
import { Link } from 'react-router-dom';
import WarpShaderHero from './components/ui/wrap-shader';


function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <Hero />
        
        {/* Integrations Section */}
        <IntegrationsSection />

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
                Why Choose TURNVE
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-gray-600">
                Practical career platform for entry-level and transitioning professionals
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Team Collaboration"
                description="Work seamlessly with your team on projects and simulations"
              />
              <FeatureCard
                icon={<Award className="w-6 h-6" />}
                title="Skill Development"
                description="Build practical management experience through real-world scenarios"
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="AI-Powered Insights"
                description="Get personalized feedback and recommendations"
              />
            </div>
          </div>
        </section>

        {/* New Program 1 Section */}
        <ProgramPreview />

        {/* Testimonials Section */}

        <section id="testimonials">
          <Testimonials />
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to transform your career?
                </h2>
                <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who have accelerated their careers with TURNVE. Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="#" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-base font-semibold rounded-xl hover:bg-blue-50 transition-all hover:shadow-lg whitespace-nowrap"
                  >
                    Get Started Free
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
    <section className="relative pt-24 pb-16">
      <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></div>
      <div className="mx-auto max-w-5xl px-6">        <div className="sm:mx-auto text-center relative z-20">
          <AnimatedGroup preset="fade">
            <h1 className="mt-8 max-w-3xl text-balance text-5xl font-bold md:text-6xl lg:mt-16 text-gray-900 mx-auto">
              Theory Gets You Noticed. Practice Gets You Hired.
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-600 mx-auto">
              Turn your career knowledge into demonstrable management experience with AI-guided simulations and real projects.
            </p>
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-900/10 rounded-[14px] border p-0.5">
                <a 
                  href="/sign-up" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white text-base font-semibold rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg whitespace-nowrap"
                >
                  Get Started
                </a>
              </div>
            </div>
          </AnimatedGroup>
        </div>
        <AnimatedGroup preset="slide">
          <div className="relative mx-auto mt-8 px-2 sm:mt-12 md:mt-20 z-20">
            <div aria-hidden className="bg-gradient-to-b from-transparent via-white/50 to-white absolute inset-0 z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl transition-all duration-700">
              <img
                className="w-full h-auto relative object-contain"
                src="/images/hero-briefing.png"
                alt="TURNVE Simulation Briefing Preview"
              />
            </div>
          </div>
        </AnimatedGroup>
        
        {/* Aesthetic Gradient Cut */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-50 to-transparent -z-10 pointer-events-none" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[140%] h-[500px] bg-blue-50/40 rounded-[100%] blur-3xl -z-20 pointer-events-none" />
      </div>
    </section>

  );
}

function ProgramPreview() {
  return (
    <section className="relative">
      <WarpShaderHero
        title={
          <span className="text-3xl md:text-4xl leading-tight block">
            Live Online Practical Bootcamp
          </span>
        }

        subtitle="Join our most intensive experience. Operate inside a structured startup lifecycle and prepare for high-stakes interviews."
        ctaText="Explore Program 1"
        onCtaClick={() => window.location.href = '/bootcamp'}
      />

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
    <section className="max-w-7xl mx-auto my-20 px-6">
      <div className="border border-gray-100 p-8 md:p-12 rounded-3xl bg-white">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Learn from top organizations</h2>
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              Turnve provides AI-powered simulations that mirror real-world scenarios used by top companies. 
              Gain practical experience in project management, team collaboration, and strategic decision-making.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all whitespace-nowrap">Start Learning</a>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {integrations.map((integration, idx) => (
              <div key={idx} className="w-14 h-14 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300">
                <img src={integration.url} alt={integration.name} className="w-full h-full object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
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
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">Testimonials</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-gray-900">What our users say</h2>
          <p className="text-center mt-4 text-lg text-gray-600">See what our customers have to say about their Turnve experience.</p>
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
              <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-blue-100/50 max-w-xs w-full" key={i}>
                <div className="text-gray-700 leading-relaxed">{text}</div>
                <div className="flex items-center gap-3 mt-5">
                  <img width={40} height={40} src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <div className="font-semibold text-gray-900 tracking-tight text-sm">{name}</div>
                    <div className="text-gray-500 text-sm tracking-tight">{role}</div>
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
