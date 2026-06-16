import { Users, Award, Zap } from 'lucide-react';
import { ScrollReveal } from '../ui/scroll-reveal';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-8 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            Why Choose TURNVE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-gray-600">
            Practical career platform for entry-level and transitioning professionals
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          <ScrollReveal delay={0.02}>
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Team Collaboration"
              description="Work seamlessly with your team on projects and simulations"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="Skill Development"
              description="Build practical management experience through real-world scenarios"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.18}>
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="AI-Powered Insights"
              description="Get personalized feedback and recommendations"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
