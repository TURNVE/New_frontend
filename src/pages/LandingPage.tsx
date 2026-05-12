import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePageSetup } from '../hooks/usePageSetup';
import IntegrationsSection from '../components/ui/integrations-section';
import { Hero } from '../components/ui/animated-hero';
import Testimonials from '../components/ui/testimonials-columns';
import { ArrowRight, Users, Award, Zap, CheckCircle2, Star, Globe, Mail, Phone, Menu, X } from 'lucide-react';

const LandingPage = () => {
  // Page setup with scroll-to-top, viewport fix, and device detection
  usePageSetup();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const features = [
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team on projects and simulations'
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Skill Development',
      description: 'Build practical management experience through real-world scenarios'
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'AI-Powered Insights',
      description: 'Get personalized feedback and recommendations'
    }
  ];

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#pricing', label: 'Pricing' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background shadow-lg shadow-black/20' : 'bg-background'
      } border-b border-border`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src="/logo.png" 
                alt="TURNVE" 
                className="h-8 sm:h-10 w-auto transform group-hover:scale-105 transition-transform" 
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#5e6ad2] text-white text-sm font-semibold rounded-[6px] hover:bg-[#828fff] transition-all whitespace-nowrap"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[6px] text-text-secondary hover:bg-surface tap-target"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden fixed inset-x-0 top-14 bg-panel border-b border-border shadow-lg shadow-black/20 transition-all duration-300 ${
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-foreground hover:bg-surface rounded-[6px] transition-colors tap-target"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-border mt-2 space-y-2">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-foreground hover:bg-surface rounded-[6px] transition-colors tap-target"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 bg-[#5e6ad2] text-white text-base font-semibold rounded-[6px] hover:bg-[#828fff] transition-colors tap-target"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-14 sm:pt-16">
        <Hero />
      </div>

      {/* Integrations Section - Moved below hero */}
      <IntegrationsSection />

      {/* Organization/Enterprise Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-surface to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(94,106,210,0.1)] border border-[rgba(94,106,210,0.2)] text-[#7170ff] text-xs font-semibold uppercase tracking-wider mb-4">
                For Organizations
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Empower Your Team with Practical Skills
              </h2>
              <p className="text-base sm:text-lg text-text-secondary mb-6 leading-relaxed">
                Upskill your workforce with AI-powered simulations designed for teams. 
                Create custom scenarios, track progress, and accelerate your employees' 
                career growth with real-world experience.
              </p>
              
              <div className="space-y-3 mb-8">
                {[
                  'Custom simulations for your industry',
                  'Team dashboards and analytics',
                  'Dedicated success manager',
                  'Volume pricing discounts'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0" />
                    <span className="text-sm sm:text-base text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/organization" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#5e6ad2] text-white text-sm font-semibold rounded-[6px] hover:bg-[#828fff] transition-all whitespace-nowrap tap-target"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-foreground text-sm font-semibold rounded-[6px] border border-border hover:bg-surface transition-all whitespace-nowrap tap-target"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative">
              <div className="relative rounded-[12px] bg-[rgba(94,106,210,0.05)] border border-border p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-[8px] bg-panel border border-border">
                    <Users className="h-6 w-6 text-[#7170ff] mb-2" />
                    <p className="text-lg font-bold text-foreground">500+</p>
                    <p className="text-xs text-text-tertiary">Team Members</p>
                  </div>
                  <div className="p-4 rounded-[8px] bg-panel border border-border">
                    <Award className="h-6 w-6 text-[#10b981] mb-2" />
                    <p className="text-lg font-bold text-foreground">95%</p>
                    <p className="text-xs text-text-tertiary">Skill Improvement</p>
                  </div>
                  <div className="p-4 rounded-[8px] bg-panel border border-border">
                    <Zap className="h-6 w-6 text-[#f59e0b] mb-2" />
                    <p className="text-lg font-bold text-foreground">3x</p>
                    <p className="text-xs text-text-tertiary">Faster Onboarding</p>
                  </div>
                  <div className="p-4 rounded-[8px] bg-panel border border-border">
                    <Star className="h-6 w-6 text-[#ec4899] mb-2" />
                    <p className="text-lg font-bold text-foreground">4.9</p>
                    <p className="text-xs text-text-tertiary">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-background to-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(94,106,210,0.1)] border border-[rgba(94,106,210,0.2)] text-[#7170ff] text-xs font-semibold uppercase tracking-wider mb-4">
              Why Choose TURNVE
            </div>
            <h2 className="heading-responsive-2 text-foreground mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-responsive-lg text-text-secondary">
              Practical career platform for entry-level and transitioning professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 sm:p-8 rounded-[12px] bg-[rgba(255,255,255,0.02)] border border-border hover:border-[rgba(113,112,255,0.3)] hover:shadow-lg hover:shadow-[rgba(113,112,255,0.1)] transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[8px] bg-[rgba(94,106,210,0.1)] flex items-center justify-center text-[#7170ff] mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-16 sm:py-20 lg:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#5e6ad2] via-[#5e6ad2] to-[#7170ff] rounded-[12px] sm:rounded-[22px] px-6 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20 text-center shadow-2xl shadow-[rgba(94,106,210,0.3)]">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to transform your career?
              </h2>
              <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have accelerated their careers with TURNVE. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[#5e6ad2] text-base font-semibold rounded-[6px] hover:bg-white/90 transition-all whitespace-nowrap tap-target"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/start-simulation" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent text-white text-base font-semibold rounded-[6px] border-2 border-white/30 hover:bg-white/10 transition-all whitespace-nowrap tap-target"
                >
                  Explore Industries
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/70">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#010102] text-white py-12 sm:py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
            {/* Company Info */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="TURNVE" className="h-8 sm:h-10 w-auto" />
              </div>
              <p className="text-text-tertiary text-sm leading-relaxed mb-4">
                Empowering professionals to gain real-world experience through AI-powered simulations.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[#5e6ad2] transition-colors tap-target">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[#5e6ad2] transition-colors tap-target">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[#5e6ad2] transition-colors tap-target">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </div>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Product</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-text-tertiary">
                <li><Link to="/start-simulation" className="hover:text-foreground transition-colors">Industries</Link></li>
                <li><Link to="/start-simulation" className="hover:text-foreground transition-colors">Tracks</Link></li>
                <li><Link to="/simulations" className="hover:text-foreground transition-colors">Simulations</Link></li>
                <li><Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link></li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Company</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-text-tertiary">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-text-tertiary">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-text-quaternary text-xs sm:text-sm text-center sm:text-left">
              © 2026 TURNVE. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-text-tertiary">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#10b981] fill-current" />
                <span>4.9/5 User Rating</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>50K+ Active Users</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
