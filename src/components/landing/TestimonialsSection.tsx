import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}

function TestimonialsColumn({ testimonials, duration, className }: TestimonialsColumnProps) {
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

const testimonials: Testimonial[] = [
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

export function TestimonialsSection() {
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
