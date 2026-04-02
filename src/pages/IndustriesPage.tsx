import { ArrowRight, ArrowLeft, Building2, Sparkles, Code2, TrendingUp, DollarSign, Heart, Users, ShoppingCart, GraduationCap, Factory, Lock, Clock, BarChart3 } from 'lucide-react';
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
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
    iconBgColor: 'bg-violet-100',
    iconColor: 'text-violet-600',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation Header - Mobile optimized */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="TURNVE" className="h-7 sm:h-8 w-auto" />
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        {/* Header Section - Compact on mobile */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
            Step 1 of 3
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Industry
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Select the industry where you want to gain practical experience. 
            Each industry offers unique simulations tailored to real-world scenarios.
          </p>
        </div>

        {/* Industry Grid - Mobile: 1 col, Small: 2 col, Large: 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-10">
          {industries.map((industry) => {
            const isTechnology = industry.id === 'technology';
            const IconComponent = industry.icon;
            
            return (
              <Link
                key={industry.id}
                to={isTechnology ? `/tracks?industry=${industry.id}` : '#'}
                onClick={(e) => {
                  if (!isTechnology) {
                    e.preventDefault();
                  }
                }}
                className={`group relative rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border-2 transition-all duration-300 ${
                  isTechnology
                    ? `${industry.borderColor} shadow-md sm:shadow-lg hover:shadow-xl bg-gradient-to-br ${industry.color} text-white`
                    : 'border-gray-200 bg-gray-50/80 cursor-not-allowed opacity-70 hover:opacity-80'
                }`}
              >
                {/* Locked Indicator - Smaller on mobile */}
                {!isTechnology && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <div className={`${industry.iconBgColor} rounded-lg p-1 sm:p-1.5`}>
                      <Lock className={`w-3 h-3 sm:w-4 sm:h-4 ${industry.iconColor}`} />
                    </div>
                  </div>
                )}

                {/* Icon Container - Smaller on mobile */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${
                  isTechnology ? 'bg-white/20' : industry.iconBgColor
                }`}>
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${isTechnology ? 'text-white' : industry.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className={`text-sm sm:text-base font-bold mb-1 ${isTechnology ? 'text-white' : 'text-gray-900'}`}>
                  {industry.name}
                </h3>
                <p className={`text-xs sm:text-sm leading-snug mb-3 ${isTechnology ? 'text-white/80' : 'text-gray-600'}`}>
                  {industry.description}
                </p>

                {/* Stats Grid - Always visible, more compact on mobile */}
                <div className={`grid grid-cols-3 gap-1 sm:gap-2 pt-2 sm:pt-3 border-t ${isTechnology ? 'border-white/20' : 'border-gray-200'}`}>
                  <div className="text-center">
                    <div className={`flex items-center justify-center mb-0.5 ${isTechnology ? 'text-white/70' : 'text-gray-500'}`}>
                      <BarChart3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <p className={`text-[10px] sm:text-xs font-semibold ${isTechnology ? 'text-white' : 'text-gray-900'}`}>
                      {industry.stats.simulations}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`flex items-center justify-center mb-0.5 ${isTechnology ? 'text-white/70' : 'text-gray-500'}`}>
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <p className={`text-[10px] sm:text-xs font-semibold ${isTechnology ? 'text-white' : 'text-gray-900'}`}>
                      {industry.stats.avgDuration.split(' ')[0]}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`flex items-center justify-center mb-0.5 ${isTechnology ? 'text-white/70' : 'text-gray-500'}`}>
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <p className={`text-[10px] sm:text-xs font-semibold ${isTechnology ? 'text-white' : industry.textColor}`}>
                      {industry.stats.level.split(' ')[0]}
                    </p>
                  </div>
                </div>

                {/* Continue button for active card - Only on mobile */}
                {isTechnology && (
                  <div className="mt-3 sm:hidden">
                    <div className="flex items-center justify-center text-xs font-semibold bg-white/20 rounded-lg py-2">
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                )}

                {/* Desktop hover arrow */}
                {isTechnology && (
                  <div className="hidden sm:block absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Help Section - Compact on mobile */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-100">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">Not sure which industry to choose?</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Take our quick career assessment to discover the best fit for your skills and goals.
              </p>
            </div>
            <button className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-blue-600 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors whitespace-nowrap mt-2 sm:mt-0">
              Take Assessment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IndustriesPage;
