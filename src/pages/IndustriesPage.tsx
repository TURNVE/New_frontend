import { useState } from 'react';
import { ArrowRight, ArrowLeft, Building2, Sparkles, Code2, TrendingUp, DollarSign, Heart, Users, ShoppingCart, GraduationCap, Factory, Lock, Clock, BarChart3, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';

// Industry data with Lucide icons and colors
const industries = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Software development, product management, and tech innovation',
    icon: Code2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    stats: { simulations: 24, avgDuration: '4 weeks', level: 'All Levels' }
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Digital marketing, brand strategy, and growth hacking',
    icon: TrendingUp,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    iconBgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    stats: { simulations: 18, avgDuration: '3 weeks', level: 'Beginner Friendly' }
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial analysis, investment banking, and fintech',
    icon: DollarSign,
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    iconBgColor: 'bg-sky-100',
    iconColor: 'text-sky-600',
    stats: { simulations: 15, avgDuration: '5 weeks', level: 'Intermediate' }
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Healthcare management, medical devices, and biotech',
    icon: Heart,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    iconBgColor: 'bg-rose-100',
    iconColor: 'text-rose-600',
    stats: { simulations: 12, avgDuration: '6 weeks', level: 'Advanced' }
  },
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'Strategy consulting, operations, and business advisory',
    icon: Users,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    iconBgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
    stats: { simulations: 20, avgDuration: '4 weeks', level: 'All Levels' }
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    description: 'E-commerce, retail operations, and supply chain',
    icon: ShoppingCart,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    iconBgColor: 'bg-teal-100',
    iconColor: 'text-teal-600',
    stats: { simulations: 16, avgDuration: '3 weeks', level: 'Beginner Friendly' }
  },
  {
    id: 'education',
    name: 'Education',
    description: 'EdTech, curriculum design, and educational management',
    icon: GraduationCap,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    iconBgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    stats: { simulations: 14, avgDuration: '4 weeks', level: 'All Levels' }
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Operations, quality control, and industrial engineering',
    icon: Factory,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
    iconBgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
    stats: { simulations: 10, avgDuration: '5 weeks', level: 'Intermediate' }
  }
];

const IndustriesPage = () => {
  usePageSetup();
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-sm mb-4">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            Step 1 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-920 tracking-tight mb-4">
            Choose Your Industry
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-medium">
            Select the industry where you want to gain practical experience.
            Each industry offers unique simulations tailored to real-world scenarios.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {industries.map((industry) => {
            const isTechnology = industry.id === 'technology';
            const IconComponent = industry.icon;

            return (
              <Link
                key={industry.id}
                to={isTechnology ? `/tracks?industry=${industry.id}` : '#'}
                onClick={(e) => {
                  if (!isTechnology) e.preventDefault();
                }}
                className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 block ${isTechnology
                    ? 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1'
                    : 'bg-white/60 shadow-sm border border-gray-100/80 cursor-not-allowed opacity-75'
                  }`}
              >
                {/* Active/Locked State styling */}
                <div className="absolute top-5 right-5">
                  {isTechnology ? (
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 ${isTechnology ? 'group-hover:scale-110 shadow-sm' : ''} ${industry.iconBgColor}`}>
                  <IconComponent className={`w-7 h-7 ${industry.iconColor}`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {industry.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 min-h-[44px]">
                  {industry.description}
                </p>

                <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100/80">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-400 mb-1 flex items-center gap-1">Sims</p>
                    <p className="text-sm font-bold text-gray-800">{industry.stats.simulations}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-400 mb-1 flex items-center gap-1">Time</p>
                    <p className="text-sm font-bold text-gray-800">{industry.stats.avgDuration.split(' ')[0]}w</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-400 mb-1 flex items-center gap-1">Level</p>
                    <p className={`text-sm font-bold truncate ${industry.textColor}`}>{industry.stats.level.split(' ')[0]}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm flex-shrink-0">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">Not sure which industry to choose?</h3>
              <p className="text-gray-500 text-sm font-medium">
                Take our quick assessment to find the perfect simulation track.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAssessmentModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Take Assessment
          </button>
        </div>
      </main>

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Career Assessment</h2>
              </div>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">What's your primary career goal?</label>
                <select className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 border outline-none text-sm text-gray-700 shadow-sm">
                  <option>Product Management</option>
                  <option>Marketing Strategy</option>
                  <option>Data Analytics</option>
                  <option>Finance</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Years of experience</label>
                <select className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 border outline-none text-sm text-gray-700 shadow-sm">
                  <option>0-2 years (Beginner)</option>
                  <option>3-5 years (Intermediate)</option>
                  <option>5+ years (Advanced)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">How much time do you have weekly?</label>
                <select className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 border outline-none text-sm text-gray-700 shadow-sm">
                  <option>1-2 hours</option>
                  <option>3-5 hours</option>
                  <option>6+ hours</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg rounded-xl transition-all w-full sm:w-auto"
              >
                Find My Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustriesPage;
