import { useState } from 'react';
import { ArrowRight, ArrowLeft, Building2, Sparkles, Code2, TrendingUp, DollarSign, Heart, Users, ShoppingCart, GraduationCap, Factory, Lock, Clock, BarChart3, X, CheckCircle2, Zap, Target, Brain, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import { usePageTheme } from '../hooks/usePageTheme';

const IndustriesPage = () => {
  usePageSetup();
  const pageTheme = usePageTheme();

  const industries = [
    {
      id: 'technology',
      name: 'Technology',
      description: 'Software development, product management, and tech innovation',
      icon: Code2,
      stats: { simulations: 24, avgDuration: '4 weeks', level: 'All Levels' }
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Digital marketing, brand strategy, and growth hacking',
      icon: TrendingUp,
      stats: { simulations: 18, avgDuration: '3 weeks', level: 'Beginner Friendly' }
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Financial analysis, investment banking, and fintech',
      icon: DollarSign,
      stats: { simulations: 15, avgDuration: '5 weeks', level: 'Intermediate' }
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Healthcare management, medical devices, and biotech',
      icon: Heart,
      stats: { simulations: 12, avgDuration: '6 weeks', level: 'Advanced' }
    },
    {
      id: 'consulting',
      name: 'Consulting',
      description: 'Strategy consulting, operations, and business advisory',
      icon: Users,
      stats: { simulations: 20, avgDuration: '4 weeks', level: 'All Levels' }
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      description: 'E-commerce, retail operations, and supply chain',
      icon: ShoppingCart,
      stats: { simulations: 16, avgDuration: '3 weeks', level: 'Beginner Friendly' }
    },
    {
      id: 'education',
      name: 'Education',
      description: 'EdTech, curriculum design, and educational management',
      icon: GraduationCap,
      stats: { simulations: 14, avgDuration: '4 weeks', level: 'All Levels' }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      description: 'Operations, quality control, and industrial engineering',
      icon: Factory,
      stats: { simulations: 10, avgDuration: '5 weeks', level: 'Intermediate' }
    }
  ];

  const assessmentQuestions = [
    {
      id: 1,
      question: "What's your primary career goal?",
      icon: Target,
      options: [
        { value: 'pm', label: 'Product Management', icon: BarChart3 },
        { value: 'marketing', label: 'Marketing Strategy', icon: TrendingUp },
        { value: 'data', label: 'Data Analytics', icon: Brain },
        { value: 'finance', label: 'Finance', icon: DollarSign },
        { value: 'unsure', label: 'Not sure yet', icon: Sparkles }
      ]
    },
    {
      id: 2,
      question: "What's your experience level?",
      icon: Brain,
      options: [
        { value: 'beginner', label: '0-2 years', sublabel: 'Beginner', icon: CheckCircle2 },
        { value: 'intermediate', label: '3-5 years', sublabel: 'Intermediate', icon: CheckCircle2 },
        { value: 'advanced', label: '5+ years', sublabel: 'Advanced', icon: CheckCircle2 }
      ]
    },
    {
      id: 3,
      question: "How much time can you commit weekly?",
      icon: Clock,
      options: [
        { value: 'low', label: '1-2 hours', sublabel: 'Casual pace', icon: Clock },
        { value: 'medium', label: '3-5 hours', sublabel: 'Steady progress', icon: Clock },
        { value: 'high', label: '6+ hours', sublabel: 'Intensive learning', icon: Zap }
      ]
    }
  ];

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const closeModal = () => {
    setShowAssessmentModal(false);
    resetAssessment();
  };

  return (
    <div className="min-h-screen bg-[#010102]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#010102]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center text-sm font-medium text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
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
          <div
            className="inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase mb-4"
            style={{ backgroundColor: pageTheme.badgeBg, borderColor: pageTheme.ring, color: pageTheme.primary }}
          >
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            Step 1 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#f7f8f8] tracking-tight mb-4">
            Choose Your Industry
          </h1>
          <p className="text-base sm:text-lg text-[#8a8f98] leading-relaxed">
            Select the industry where you want to gain practical experience.
            Each industry offers unique simulations tailored to real-world scenarios.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 mb-16">
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
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 block ${
                  isTechnology
                    ? 'bg-[#0a0a0a] border border-white/10 hover:border-white/20 transform hover:-translate-y-1'
                    : 'bg-[#0a0a0a]/60 border border-white/5 cursor-not-allowed opacity-60'
                }`}
                onMouseEnter={(e) => {
                  if (isTechnology) {
                    e.currentTarget.style.boxShadow = `0 20px 40px -10px ${pageTheme.primary}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${pageTheme.primary}20, ${pageTheme.primary}10)` }}
                />

                {/* Active/Locked State styling */}
                <div className="absolute top-5 right-5 z-10">
                  {isTechnology ? (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-white/10">
                      <ArrowRight className="w-4 h-4 text-[#f7f8f8]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <Lock className="w-3.5 h-3.5 text-[#62666d]" />
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 border"
                    style={{
                      backgroundColor: `${pageTheme.primary}15`,
                      borderColor: `${pageTheme.primary}30`,
                      color: pageTheme.primary,
                      ...(isTechnology ? {} : { opacity: 0.5 })
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-semibold text-[#f7f8f8] mb-2 group-hover:text-white transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-[#8a8f98] leading-relaxed">
                    {industry.description}
                  </p>

                  {/* Stats row */}
                  {isTechnology && (
                    <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 text-xs text-[#62666d]">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {industry.stats.simulations} sims
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {industry.stats.avgDuration}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0a0a0a] to-[#08090a] rounded-2xl p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32" style={{ backgroundColor: `${pageTheme.primary}10` }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl -ml-24 -mb-24" style={{ backgroundColor: `${pageTheme.primary}08` }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
            <div className="flex items-center gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${pageTheme.primary}25, ${pageTheme.primary}15)`,
                  borderColor: `${pageTheme.primary}30`,
                  color: pageTheme.primary
                }}
              >
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-[#f7f8f8] mb-1.5">Not sure which industry to choose?</h3>
                <p className="text-[#8a8f98] text-sm">
                  Take our quick 3-step assessment to find your perfect simulation track.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAssessmentModal(true)}
              className="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style={{ backgroundColor: pageTheme.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = pageTheme.primaryLight;
                e.currentTarget.style.boxShadow = `0 10px 25px ${pageTheme.primary}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = pageTheme.primary;
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <Brain className="w-4 h-4" />
              Take Assessment
            </button>
          </div>
        </div>
      </main>

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010102]/90 backdrop-blur-md transition-opacity">
          <div className="bg-[#0a0a0a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#08090a]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ backgroundColor: `${pageTheme.primary}15`, borderColor: `${pageTheme.primary}30`, color: pageTheme.primary }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#f7f8f8]">Career Assessment</h2>
                  <p className="text-xs text-[#62666d]">Step {currentStep + 1} of {assessmentQuestions.length}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-[#62666d] hover:text-[#f7f8f8] hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/5 h-1">
              <div
                className="h-full transition-all duration-300"
                style={{ background: `linear-gradient(90deg, ${pageTheme.gradientFrom}, ${pageTheme.gradientTo})`, width: `${((currentStep + 1) / assessmentQuestions.length) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="p-6">
              {!showResult ? (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      {(() => {
                        const IconComponent = assessmentQuestions[currentStep].icon;
                        return <IconComponent className="w-5 h-5" style={{ color: pageTheme.primary }} />;
                      })()}
                    </div>
                    <h3 className="text-base font-semibold text-[#f7f8f8]">
                      {assessmentQuestions[currentStep].question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {assessmentQuestions[currentStep].options.map((option) => {
                      const isSelected = answers[assessmentQuestions[currentStep].id] === option.value;
                      const IconComponent = option.icon;

                      return (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(assessmentQuestions[currentStep].id, option.value)}
                          className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left"
                          style={{
                            backgroundColor: isSelected ? `${pageTheme.primary}15` : '#08090a',
                            borderColor: isSelected ? `${pageTheme.primary}35` : 'rgba(255,255,255,0.05)',
                            ...(isSelected ? { boxShadow: `0 10px 20px ${pageTheme.primary}15` } : {}),
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = '#08090a';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: isSelected ? `${pageTheme.primary}25` : 'rgba(255,255,255,0.05)' }}
                          >
                            <IconComponent className="w-5 h-5" style={{ color: isSelected ? pageTheme.primary : '#62666d' }} />
                          </div>
                          <div className="flex-1">
                            <span className={`block font-medium ${isSelected ? 'text-[#f7f8f8]' : 'text-[#d0d6e0]'}`}>
                              {option.label}
                            </span>
                            {option.sublabel && (
                              <span className="text-xs text-[#62666d]">{option.sublabel}</span>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: pageTheme.primary }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Results */
                <div className="text-center py-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border"
                    style={{
                      background: `linear-gradient(135deg, ${pageTheme.primary}25, ${pageTheme.primary}15)`,
                      borderColor: `${pageTheme.primary}30`,
                      color: pageTheme.primary
                    }}
                  >
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f7f8f8] mb-2">Recommended for You</h3>
                  <p className="text-[#8a8f98] text-sm mb-6">Based on your responses, we recommend starting with:</p>

                  <div
                    className="rounded-xl p-5 border mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${pageTheme.primary}15, ${pageTheme.primary}08)`,
                      borderColor: `${pageTheme.primary}30`,
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Code2 className="w-5 h-5" style={{ color: pageTheme.primary }} />
                      <span className="text-lg font-semibold text-[#f7f8f8]">Technology Track</span>
                    </div>
                    <p className="text-sm text-[#8a8f98]">Product Management • 4 weeks • Beginner Friendly</p>
                  </div>

                  <Link
                    to="/tracks?industry=technology"
                    onClick={closeModal}
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-white font-semibold rounded-xl transition-all shadow-lg"
                    style={{ backgroundColor: pageTheme.primary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = pageTheme.primaryLight;
                      e.currentTarget.style.boxShadow = `0 10px 25px ${pageTheme.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = pageTheme.primary;
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    Start Your Journey
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Footer */}
            {!showResult && (
              <div className="px-6 py-5 bg-[#08090a] border-t border-white/5 flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentStep === 0
                      ? 'text-[#62666d] cursor-not-allowed'
                      : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/5'
                  }`}
                >
                  Back
                </button>
                <div className="flex items-center gap-2">
                  {assessmentQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{
                        backgroundColor: idx === currentStep ? pageTheme.primary : idx < currentStep ? pageTheme.primaryDark : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={!answers[assessmentQuestions[currentStep].id]}
                  className="px-5 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: answers[assessmentQuestions[currentStep].id] ? pageTheme.primary : 'rgba(255,255,255,0.05)',
                    color: answers[assessmentQuestions[currentStep].id] ? '#fff' : '#62666d',
                    cursor: answers[assessmentQuestions[currentStep].id] ? 'pointer' : 'not-allowed',
                    boxShadow: answers[assessmentQuestions[currentStep].id] ? `0 4px 12px ${pageTheme.primary}30` : 'none'
                  }}
                >
                  {currentStep === assessmentQuestions.length - 1 ? 'See Results' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustriesPage;
