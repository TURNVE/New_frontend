import { Check, Star, ArrowRight, Play, Sparkles, Users, Target, Rocket, Zap, Award } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

interface SpeakerProps {
  name: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  company: string;
}

function SpeakerCard({ name, title, imageSrc, imageAlt, company }: SpeakerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-bold text-xl text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{title}</p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
          ))}
          <span className="ml-1 text-xs text-gray-500">({company})</span>
        </div>
      </div>
    </motion.div>
  );
}

function Program1Page() {
  const speakers: SpeakerProps[] = [
    {
      name: 'Anthony Mokwe',
      title: 'Senior Multimedia Designer',
      company: 'Chevron',
      imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      imageAlt: 'Anthony Mokwe',
    },
    {
      name: 'Richard Raphael',
      title: 'Lead Web Development Instructor',
      company: 'Myteacher',
      imageSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
      imageAlt: 'Richard Raphael',
    },
    {
      name: 'Temiloluwa Olukitibi',
      title: 'Senior Product Manager',
      company: 'Northstar',
      imageSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      imageAlt: 'Temiloluwa Olukitibi',
    },
    {
      name: 'Benjamin Shotala',
      title: 'Founder & Marketing Specialist',
      company: 'Inbox2Cash',
      imageSrc: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
      imageAlt: 'Benjamin Shotala',
    },
    {
      name: 'Ayodeji Okunoye',
      title: 'Director & HR Manager',
      company: 'MSI',
      imageSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
      imageAlt: 'Ayodeji Okunoye',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/turnve-logo-original.jpg"
              alt="TURNVE"
              className="h-9 w-auto max-w-[132px] object-contain"
            />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#program" className="text-gray-600 hover:text-gray-900 transition-colors">Program</a>
            <a href="#outcomes" className="text-gray-600 hover:text-gray-900 transition-colors">Outcomes</a>
            <a href="#instructors" className="text-gray-600 hover:text-gray-900 transition-colors">Instructors</a>
          </div>
          <Button asChild size="sm">
            <a href="/login">Apply Now</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">April Cohort · 5 Weeks · Live & Remote</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Experience The Job to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Land The Job</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                5-Weeks of real work experience. Build. Defend. Get Interviewed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-xl text-base">
                  <a href="/login">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl text-base">
                  <a href="#program">
                    <Play className="mr-2 h-5 w-5" />
                    Learn More
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="Student" 
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">500+ students enrolled</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                  alt="Hero" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement - Dark Section */}
      <section className="relative py-24 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants}>
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              You've Learned.<br />
              <span className="text-blue-400">But Have You Practiced?</span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4 mb-12">
            <p className="text-xl md:text-2xl font-medium text-gray-300">No real deadlines.</p>
            <p className="text-xl md:text-2xl font-medium text-gray-300">No structured feedback.</p>
            <p className="text-xl md:text-2xl font-medium text-gray-300">No interview rehearsal.</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-8 rounded-full"
          />

          <motion.p variants={itemVariants} className="text-3xl md:text-4xl font-bold">
            Turnve fixes that.
          </motion.p>
        </motion.div>
      </section>

      {/* 5-Week Simulation Section */}
      <section id="program" className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                April 2025 · Live Session
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                The 5-Week Simulation
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Operate inside a structured startup environment. Build real work under real supervision.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Product Builder Card */}
              <motion.div 
                variants={itemVariants}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Product Builder</span>
                  </div>
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Technical Track
                  </span>
                </div>
                <p className="text-gray-600 text-lg">
                  Build and deploy a live MVP with real code, real deployment, and real results.
                </p>
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                  View curriculum <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>

              {/* Product Strategist Card */}
              <motion.div 
                variants={itemVariants}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Product Strategist</span>
                  </div>
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    Product Track
                  </span>
                </div>
                <p className="text-gray-600 text-lg">
                  Write and defend a complete Product Requirement Document with real stakeholders.
                </p>
                <div className="mt-6 flex items-center gap-2 text-emerald-600 font-medium group-hover:translate-x-2 transition-transform">
                  View curriculum <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section id="outcomes" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Portfolio Ready
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                You Leave With Proof
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every artifact is portfolio-ready and defensible in interviews.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { icon: Rocket, text: 'Deployed MVP (live link)', color: 'blue' },
                { icon: Target, text: 'Portfolio-ready artifacts', color: 'indigo' },
                { icon: Users, text: 'Real project defense experience', color: 'emerald' },
                { icon: Sparkles, text: 'Complete Brand Identity System', color: 'purple' },
                { icon: Award, text: 'Structured Portfolio case study', color: 'amber' },
                { icon: Zap, text: 'Complete Product Requirement Document', color: 'rose' },
                { icon: Users, text: 'Remote positioning clarity', color: 'cyan' },
                { icon: Play, text: 'Real Interview Simulation', color: 'pink' },
              ].map((outcome, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${outcome.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <outcome.icon className={`w-6 h-6 text-${outcome.color}-600`} />
                  </div>
                  <span className="text-lg text-gray-800 font-medium">{outcome.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interview Simulation Section */}
      <section className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Week 5 · Live Session
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Real Interview Simulation
              </h2>

              <div className="space-y-4 mb-8">
                {[
                  'Behavioral questions',
                  'Portfolio walkthrough', 
                  'Direct feedback from experts',
                  'Confidence rehearsal'
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-200">{item}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-lg text-gray-400 italic mb-8">
                Practice before it counts.
              </p>

              <Button asChild size="lg" className="rounded-xl">
                <a href="/login">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop" 
                  alt="Interview Simulation" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">Get real feedback from industry experts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Instructor Profiles Section */}
      <section id="instructors" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Led By Practitioners
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Learn From The Best
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our instructors are industry leaders with years of real-world experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.name} {...speaker} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Growth Continuation Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-white/80" />
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                The Growth Doesn't Stop After 5 Weeks
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Turnve is a platform built for continuous product practice. 
                The cohort is just the beginning.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Rocket, text: 'Continue simulations' },
                { icon: Target, text: 'Improve artifacts' },
                { icon: Award, text: 'Refine your positioning' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-3 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <item.icon className="w-8 h-8" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button asChild size="lg" variant="secondary" className="rounded-xl text-base">
                <a href="/login">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <p className="text-sm text-gray-400 mb-4">
                Application-based entry · Cohort starts April
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Stop Preparing.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Start Operating.
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                The April cohort is filling up. Secure your seat before it closes.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button asChild size="lg" className="rounded-xl text-base bg-white text-gray-900 hover:bg-gray-100">
                <a href="/login">
                  Secure your spot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <p className="mt-6 text-sm text-gray-500">
                Limited spots available · Next cohort starts April 2025
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-2xl font-bold text-white">Turnve</span>
              </div>
              <p className="text-gray-400">The Product Simulation Platform.</p>
            </div>

            <nav className="flex flex-wrap gap-8">
              <a href="#program" className="text-gray-400 hover:text-white transition-colors">Program</a>
              <a href="#outcomes" className="text-gray-400 hover:text-white transition-colors">Outcomes</a>
              <a href="#instructors" className="text-gray-400 hover:text-white transition-colors">Instructors</a>
              <a href="/login" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            </nav>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500">© 2025 Turnve. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Program1Page;
