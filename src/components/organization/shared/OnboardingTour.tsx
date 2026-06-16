import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/organization/utils';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Welcome to Your Dashboard',
    content: 'This is your central hub. See key metrics, recent activity, and quick actions at a glance.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation Menu',
    content: 'Access all your organization features from here. Use Cmd/Ctrl+K for quick navigation.',
    placement: 'right',
  },
  {
    target: '[data-tour="create-simulation"]',
    title: 'Create Simulations',
    content: 'Build custom simulations for your clients using our powerful wizard.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="clients"]',
    title: 'Manage Clients',
    content: 'Invite clients, track their progress, and assign simulations.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="analytics"]',
    title: 'Track Analytics',
    content: 'Monitor engagement, completion rates, and performance metrics.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="settings"]',
    title: 'Customize Settings',
    content: 'Configure your organization, manage team members, and adjust preferences.',
    placement: 'bottom',
  },
];

interface OnboardingTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Check if user has completed tour
    const hasCompleted = localStorage.getItem('org-tour-completed');
    if (!hasCompleted) {
      // Delay showing tour to allow page to render
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Calculate position
      const rect = element.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const padding = 16;

      let top = 0;
      let left = 0;

      switch (step.placement) {
        case 'bottom':
          top = rect.bottom + padding;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'top':
          top = rect.top - tooltipHeight - padding;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - padding;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + padding;
          break;
      }

      // Keep within viewport
      const maxLeft = window.innerWidth - tooltipWidth - padding;
      const maxTop = window.innerHeight - tooltipHeight - padding;
      
      left = Math.max(padding, Math.min(left, maxLeft));
      top = Math.max(padding, Math.min(top, maxTop));

      setTooltipPosition({ top, left });

      // Highlight target
      element.style.position = 'relative';
      element.style.zIndex = '60';
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.3)';
      element.style.borderRadius = '8px';
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    // Remove highlight from current
    if (targetElement) {
      targetElement.style.boxShadow = '';
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.borderRadius = '';
    }

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (targetElement) {
      targetElement.style.boxShadow = '';
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.borderRadius = '';
    }
    localStorage.setItem('org-tour-completed', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    if (targetElement) {
      targetElement.style.boxShadow = '';
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.borderRadius = '';
    }
    localStorage.setItem('org-tour-completed', 'true');
    setIsVisible(false);
    onSkip?.();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Tooltip */}
      <div
        className="fixed z-60 bg-white rounded-xl shadow-2xl border border-gray-200 w-80 p-6"
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-xl">
          <div
            className="h-full bg-blue-600 rounded-t-xl transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={handleSkip}
          aria-label="Close tour"
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">{step.title}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{step.content}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-colors',
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Welcome Modal
export function WelcomeModal({
  isOpen,
  onClose,
  onStartTour,
}: {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Your Organization!
        </h2>
        <p className="text-gray-600 mb-8">
          Let's take a quick tour to help you get started with creating simulations and managing clients.
        </p>

        <div className="space-y-3">
          <button
            onClick={onStartTour}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quick Tour
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Feature highlight component
export function FeatureHighlight({
  title,
  description,
  icon: Icon,
  isNew = false,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  isNew?: boolean;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {isNew && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Help button for triggering tour
export function HelpButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all z-40 flex items-center justify-center"
      aria-label="Start Tour"
    >
      <Sparkles className="w-5 h-5" />
    </button>
  );
}
