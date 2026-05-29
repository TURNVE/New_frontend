import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  Calendar, 
  Users, 
  Globe, 
  Briefcase, 
  Code, 
  Palette, 
  Settings,
  Star as StarIcon,
  ArrowRight
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { AnimatedGroup } from '../../components/ui/animated-group';
import WarpShaderHero from '../../components/ui/wrap-shader';
import IntegrationHero from '../../components/ui/integration-hero';


interface SpeakerProps {
  name: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  bio?: string;
}

const speakers: SpeakerProps[] = [
  {
    name: 'Anthony Mokwe',
    title: 'Senior Multimedia Designer, Chevron Nigeria Limited',
    imageSrc: '/images/speakers/anthony-mokwe.jpg',
    imageAlt: 'Anthony Mokwe',
    bio: 'Award-winning multimedia designer with 10+ years of corporate branding experience.'
  },
  {
    name: 'Richard Raphael',
    title: 'Lead Web Development Instructor at Myteacher Institute.',
    imageSrc: '/images/speakers/richard-raphael.jpg',
    imageAlt: 'Richard Raphael',
    bio: 'Full-stack developer specializing in scalable React architectures.'
  },
  {
    name: 'Temiloluwa Olukitibi',
    title: 'Senior Product Manager @ Northstar Network Limited',
    imageSrc: '/images/speakers/temiloluwa-olukitibi.jpg',
    imageAlt: 'Temiloluwa Olukitibi',
    bio: 'Expert PM and CEO focusing on high-growth product education.'
  },
  {
    name: 'Benjamin Shotala',
    title: 'Lifecycle Marketing Specialist @ Aiki',
    imageSrc: '/images/speakers/benjamin-shotala.jpg',
    imageAlt: 'Benjamin Shotala',
    bio: 'Technical marketer expert in customer lifecycle and growth ops.'
  },
  {
    name: 'Ayodeji John Okunoye',
    title: 'HR Manager @ RED FLAME',
    imageSrc: '/images/speakers/ayodeji-okunoye.jpg',
    imageAlt: 'Ayodeji John Okunoye',
    bio: 'Seasoned HR specialist and career performance coach.'
  },
  {
    name: 'Esther Emejulu',
    title: 'Senior Product Designer',
    imageSrc: '/images/speakers/esther-emejulu.jpg',
    imageAlt: 'Esther Emejulu',
    bio: 'Design leader focusing on growth and user-centric product experiences.'
  },
];

const curriculum = [
  {
    week: 1,
    title: 'Immersion & Product Discovery',
    description: 'Enter the workspace. Conduct user research, define the core problem, and map the user journey.',
    topics: ['Stakeholder Interviews', 'User Personas', 'Journey Mapping']
  },
  {
    week: 2,
    title: 'Strategy & Core Scoping',
    description: 'Transform insights into a roadmap. Define specifications and core features for the MVP.',
    topics: ['PRD Writing', 'Technical Feasibility', 'MVP Definition']
  },
  {
    week: 3,
    title: 'Design-Build Sprint',
    description: 'Iterative building. From high-fidelity mockups to initial code implementation.',
    topics: ['UI/UX Systems', 'Backend Integration', 'Frontend Sprints']
  },
  {
    week: 4,
    title: 'Refinement & Testing',
    description: 'Polish and stabilize. Conduct QA, fix bottlenecks, and prepare for deployment.',
    topics: ['Debugging', 'Performance Tuning', 'Final Review']
  },
  {
    week: 5,
    title: 'Defense & Demo Day',
    description: 'The final test. Pitch your product to senior practitioners and receive brutal feedback.',
    topics: ['Stakeholder Presentation', 'Technical Defense', 'Interview Prep']
  }
];

function SpeakerCard({ name, title, imageSrc, imageAlt, bio }: SpeakerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      viewport={{ once: true }}
      className="relative aspect-[2/3] group rounded-[32px] overflow-hidden cursor-pointer bg-gray-900"
    >
      <img 
        src={imageSrc} 
        alt={imageAlt} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content - Hidden by default, slides up on hover */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-2xl text-white tracking-tight">
              {name}
            </h3>
            <p className="text-sm text-blue-400 font-bold uppercase tracking-wider">
              {title}
            </p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {bio}
          </p>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Program1Page() {
  const [activeWeek, setActiveWeek] = useState(0);

  const scrollToApply = () => {
    document.getElementById('apply-cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-inter selection:bg-blue-100 selection:text-blue-900">
      <Header />

      {/* Hero Section - Refactored for tighter text and overflowing image */}
      <section className="relative px-6 pt-32 pb-0 overflow-visible">
        <div className="absolute top-0 right-0 -z-10 w-[60%] h-[120%] bg-blue-50/30 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedGroup preset="slide">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-6">
              <Calendar className="w-3 h-3" />
              <span>Next Cohort: April 2025</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-gray-950 mb-4 leading-[0.95]">
              Experience the job.<br />
              <span className="text-gray-300">Land the job.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
              Turn your knowledge into demonstrable management experience through 
              <span className="text-gray-950 font-medium"> 5 weeks of intensive startup-style simulation.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToApply}
                className="px-6 py-3 bg-gray-950 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2 group text-sm"
              >
                Apply for April 2025
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Remote</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Limited Seats</span>
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      {/* Integration Hero - Learn how big organizations work */}
      <IntegrationHero />


      {/* Problem - Full-width "system" size section */}
      <section className="bg-gray-950 py-32 text-white relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Traditional courses give you theory. <br />
                <span className="text-gray-600">But employers hire performance.</span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed max-w-xl">
                Without real deadlines, structured feedback, or defensive project briefings, your portfolio is just a set of tutorials.
              </p>
            </div>
            
            <div className="lg:pl-12 lg:border-l border-gray-800">
              <blockquote className="space-y-6">
                <p className="text-2xl md:text-3xl font-medium text-gray-200 leading-snug italic">
                  "Turnve creates a high-stakes environment where you operate under senior supervision before you step into the interview room."
                </p>
                <footer className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <StarIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold tracking-tight">Practical Experience First</div>
                    <div className="text-gray-500 text-sm uppercase tracking-wider font-bold">The Turnve Philosophy</div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>


      {/* The 5-Week Journey - Redesigned Timeline */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold text-gray-950 mb-4 tracking-tight">Live Online Practical Bootcamp</h2>
            <p className="text-xl text-gray-500">Operate inside a structured startup lifecycle.</p>
          </div>


          <div className="grid lg:grid-cols-[300px_1fr] gap-16">
            <div className="space-y-2">
              {curriculum.map((item, index) => (
                <button
                  key={item.week}
                  onClick={() => setActiveWeek(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
                    activeWeek === index 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    activeWeek === index ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200'
                  }`}>
                    {item.week}
                  </span>
                  <span className="font-bold text-sm uppercase tracking-wider">Week {item.week}</span>
                </button>
              ))}
            </div>

            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWeek}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gray-50 p-8 md:p-12 rounded-[32px] border border-gray-100"
                >
                  <h3 className="text-3xl font-bold text-gray-950 mb-6">{curriculum[activeWeek].title}</h3>
                  <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                    {curriculum[activeWeek].description}
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {curriculum[activeWeek].topics.map((topic) => (
                      <div key={topic} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-semibold text-gray-900">{topic}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Selection (Integrated) */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-950 mb-4">Choose Your Domain</h2>
              <p className="text-xl text-gray-500">Pick the specialization that aligns with your career goals.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">All live</span>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">Remote</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TrackCard 
              icon={<Briefcase className="w-5 h-5" />}
              title="Business"
              role="Product Management"
              color="bg-blue-50 text-blue-600"
            />
            <TrackCard 
              icon={<Code className="w-5 h-5" />}
              title="Technical"
              role="Software Engineering"
              color="bg-violet-50 text-violet-600"
            />
            <TrackCard 
              icon={<Palette className="w-5 h-5" />}
              title="Creative"
              role="UI/UX & Brand Design"
              color="bg-rose-50 text-rose-600"
            />
            <TrackCard 
              icon={<Settings className="w-5 h-5" />}
              title="Operations"
              role="Project Management"
              color="bg-amber-50 text-primary"
            />
          </div>
        </div>
      </section>

      {/* Proof Section - Grid without heavy cards */}
      <section className="py-32 text-center bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-950 mb-6">Leave with Proof</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-20">
            Every simulation produces defensible artifacts that prove your ability to operate.
          </p>

          <div className="grid md:grid-cols-3 gap-12 text-left">
            <ProofItem 
              image="https://images.unsplash.com/photo-1531403001835-42875b2efb1c?w=800&q=80"
              title="Live Deliverables" 
              desc="A deployed project or PRD that you can show during interviews." 
            />
            <ProofItem 
              image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
              title="Defensive Logic" 
              desc="Ability to justify cross-functional trade-offs to stakeholders." 
            />
            <ProofItem 
              image="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80"
              title="Interview Clarity" 
              desc="A structured narrative for your 5-week work experience." 
            />
          </div>

        </div>
      </section>

      {/* Instructors */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-950 mb-4">Led by Practitioners</h2>
            <p className="text-xl text-gray-500">Learn from professionals who operate at top-tier companies daily.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker.name} {...speaker} />
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA - Enhanced with Warp Shader - Constrained Width */}
      <section id="apply-cta" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <WarpShaderHero
            height="h-[500px]"
            titleClassName="text-4xl md:text-6xl"
            title={
              <span>
                Stop Preparing.<br />Start Operating.
              </span>
            }
            subtitle="Cohort starts April 2025. Applications are reviewed on a rolling basis. Limited slots per track to ensure 1:1 interaction."
            ctaText="Secure Your Spot"
            onCtaClick={() => console.log('apply')}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-gray-50/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-950 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-500">Everything you need to know about the bootcamp.</p>
          </div>

          <div className="space-y-6">
            <FAQItem 
              question="Who is this bootcamp for?" 
              answer="Turnve is designed for entry-level and transitioning professionals (PMs, Engineers, Designers) who have theoretical knowledge but lack practical, high-stakes project experience." 
            />
            <FAQItem 
              question="What is the time commitment?" 
              answer="The bootcamp runs for 5 weeks. You should expect to spend 10-15 hours per week on live sessions, collaborative sprints, and independent work." 
            />
            <FAQItem 
              question="Do I need any prior experience?" 
              answer="Yes, you should have a basic understanding of your chosen domain (e.g., you've taken an intro course or have the basic skills). This is a simulation of the 'job', not an intro course." 
            />
            <FAQItem 
              question="What happens after the bootcamp?" 
              answer="You'll leave with a high-fidelity portfolio piece, a certificate of completion, and the confidence to defend your work in interviews with professional-grade artifacts." 
            />
          </div>
        </div>
      </section>


      {/* Minimal Footer */}


      <footer className="py-20 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-2xl font-bold text-gray-950 tracking-tighter">Turnve</span>
              <p className="font-medium text-gray-400 text-sm">The Practical Career Platform.</p>
            </div>
            
            <nav className="flex flex-wrap gap-8 text-sm font-semibold text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Program</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Outcomes</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Enterprise</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Safety</a>
            </nav>

            <div className="text-sm text-gray-400">
              &copy; 2025 Turnve Education
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TrackCard({ icon, title, role, color }: { icon: React.ReactNode, title: string, role: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-white border border-gray-100 rounded-3xl transition-all duration-300 hover:border-gray-200"
    >
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-xl font-bold text-gray-900 mb-6 leading-tight">{role}</p>
      
      <div className="flex items-center text-xs font-bold text-blue-600 gap-1 group cursor-pointer">
        Track Overview <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}

function ProofItem({ title, desc, image }: { title: string, desc: string, image: string }) {
  return (
    <div className="space-y-6 group">
      <div className="aspect-video w-full bg-gray-50 rounded-[32px] overflow-hidden border border-gray-100 group-hover:border-blue-100 transition-colors shadow-sm">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-950">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-base">{desc}</p>
      </div>
    </div>
  );
}


function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-3xl bg-white overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center group"
      >
        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{question}</span>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-90 text-blue-500' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 text-gray-500 leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Program1Page;


