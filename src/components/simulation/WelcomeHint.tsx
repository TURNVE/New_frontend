import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, X } from 'lucide-react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface WelcomeHintStep {
  title: string;
  description: string;
  highlight: string;
}

interface WelcomeHintProps {
  steps: WelcomeHintStep[];
  onComplete?: () => void;
  onDismiss?: () => void;
}

export function WelcomeHint({ steps, onComplete, onDismiss }: WelcomeHintProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = steps[currentStep];

  const { displayedText: titleText } = useTypingEffect(
    step?.title ?? '',
    { speed: 35, delay: 100, enabled: isVisible }
  );

  const { displayedText: highlightText } = useTypingEffect(
    step?.highlight ?? '',
    { speed: 25, delay: 200, enabled: isVisible }
  );

  if (!isVisible || !step) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white min-h-[1.25rem]">{titleText}</h3>
            </div>
            <button onClick={() => { setIsVisible(false); onDismiss?.(); }} className="p-1 text-slate-400 hover:text-white rounded" aria-label="Dismiss hint">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-slate-300 mb-4">{step.description}</p>

          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-200 min-h-[1.25rem]">{highlightText}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-slate-700/50 border-t border-slate-700">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-blue-500' : 'bg-slate-600'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-1.5 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeHint;
