import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer7 } from '../components/ui/footer-7';
import { Facebook, Instagram, Linkedin, Twitter, Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const blogPosts = [
  {
    title: 'How to Build a Portfolio That Gets You Hired',
    excerpt: 'Learn the key elements that make a portfolio stand out to hiring managers in tech, marketing, and management roles.',
    author: 'Sarah Chen',
    date: 'March 15, 2026',
    readTime: '8 min',
    category: 'Career Tips',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    featured: true
  },
  {
    title: 'The AI Coach: How TURNVE Personalizes Your Learning',
    excerpt: 'Deep dive into the technology behind our adaptive learning system and how it helps you improve faster.',
    author: 'Michael A.',
    date: 'March 10, 2026',
    readTime: '12 min',
    category: 'Product',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'
  },
  {
    title: 'From Bootcamp to Product Manager: A User\'s Journey',
    excerpt: 'Meet Priya, who transitioned from marketing to PM using TURNVE simulations and landed her dream role.',
    author: 'David O.',
    date: 'March 5, 2026',
    readTime: '6 min',
    category: 'Success Stories',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80'
  },
  {
    title: '5 Decision-Making Frameworks Every PM Should Know',
    excerpt: 'Practical frameworks used by top PMs at Meta, Google, and Amazon to make high-stakes decisions.',
    author: 'Priya S.',
    date: 'February 28, 2026',
    readTime: '10 min',
    category: 'Skills',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
  },
  {
    title: 'Stakeholder Management: Lessons from Real Simulations',
    excerpt: 'What our users learned from handling difficult stakeholders in our management simulations.',
    author: 'Sarah Chen',
    date: 'February 20, 2026',
    readTime: '7 min',
    category: 'Career Tips',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'
  },
  {
    title: 'Why Traditional Certifications Are Failing Job Seekers',
    excerpt: 'The data behind why certificates don\'t correlate with job success and what actually works.',
    author: 'David O.',
    date: 'February 15, 2026',
    readTime: '9 min',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
  },
  {
    title: 'How We Built the TURNVE Simulation Engine',
    excerpt: 'Technical breakdown of our simulation architecture and how we create realistic business scenarios.',
    author: 'Michael A.',
    date: 'February 10, 2026',
    readTime: '15 min',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
  },
  {
    title: 'Interview Prep: What Hiring Managers Actually Look For',
    excerpt: 'Insights from our network of hiring managers about what makes candidates stand out.',
    author: 'Priya S.',
    date: 'February 5, 2026',
    readTime: '11 min',
    category: 'Career Tips',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80'
  }
];

const categories = ['All', 'Career Tips', 'Success Stories', 'Skills', 'Product', 'Industry', 'Engineering'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                TURNVE Blog
              </h1>
              <p className="text-lg text-muted-foreground">
                Career insights, product updates, and success stories from our community
              </p>
            </motion.div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <section className="py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-8 items-center p-8 rounded-3xl border border-border bg-card"
              >
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      Featured
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.filter(post => !post.featured || selectedCategory !== 'All' || searchQuery).map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="rounded-t-2xl overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-8 sm:p-12 rounded-3xl border border-border bg-card"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Get the latest career tips, product updates, and success stories delivered to your inbox weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </div>
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
