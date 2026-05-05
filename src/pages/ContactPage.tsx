import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get a response within 24 hours',
    value: 'support@turnve.com',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Available during business hours',
    value: 'Start a conversation',
    color: 'bg-[#c3faf5]/50 text-[#187574]'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 8am to 6pm EST',
    value: '+1 (555) 123-4567',
    color: 'bg-[#ffe6cd]/50 text-[#746019]'
  }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                  <HelpCircle className="h-4 w-4" />
                  We're Here to Help
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Contact Us
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center mb-4`}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                  <p className="text-sm font-medium text-foreground">{method.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 sm:py-16 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-2xl border border-border p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="partnership">Partnership</option>
                        <option value="careers">Careers</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* FAQ CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 sm:p-8 text-white">
                  <h3 className="text-xl font-bold mb-3">Frequently Asked Questions</h3>
                  <p className="text-white/80 mb-6">
                    Find quick answers to common questions about TURNVE, our simulations, pricing, and more.
                  </p>
                  <Link
                    to="/faq"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all"
                  >
                    View FAQs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="text-foreground">8:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-foreground">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-foreground">Closed</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Our Location</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    123 Innovation Drive<br />
                    San Francisco, CA 94102<br />
                    United States
                  </p>
                </div>
              </motion.div>
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
              { name: "Help Center", href: "/faq" },
              { name: "Documentation", href: "#" },
              { name: "Contact", href: "/contact" },
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
};

export default ContactPage;
