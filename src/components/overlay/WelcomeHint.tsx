import { useState } from 'react';
import {
  Lightbulb, Target, Clock, ChevronRight, X,
  Trophy, Zap, Bell,
  LayoutList, CheckCircle
} from 'lucide-react';
import { enableSounds } from '../../utils/sounds';
import { TypingText } from '../ui/TypingText';

interface WelcomeHintProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  challengeTitle: string;
  archetype: string;
}

export const WelcomeHint: React.FC<WelcomeHintProps> = ({ isOpen, onClose, companyName, challengeTitle, archetype }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    enableSounds();
    onClose();
  };

  const [step, setStep] = useState(0);

  const archetypeLabel = archetype.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const steps = [
    {
      icon: Trophy,
      title: `Welcome to ${companyName}`,
      content: `You're stepping into a real-world management simulation. Your role: make strategic decisions that balance budget, team morale, stakeholder satisfaction, and project risk.`,
      highlight: `Challenge: ${challengeTitle}`,
    },
    {
      icon: Zap,
      title: 'How It Works',
      content: 'Each week, you\'ll receive tasks to complete. Some are decisions, some require writing, others are checklists. Complete them before advancing to the next week.',
      highlight: 'You control the pace — advance weeks only when you\'re ready.',
    },
    {
      icon: LayoutList,
      title: 'Your Task Board',
      content: 'The Backlog tab shows your tasks for the current week. Focus on "To Do" items first. "Signals" are FYI messages — read them for context but they don\'t require action.',
      highlight: 'Red badges = urgent. Check the Backlog often for new tasks.',
    },
    {
      icon: Target,
      title: 'Making Decisions',
      content: 'When you open a task, you\'ll get clear guidance on what\'s expected. For choices, consider trade-offs. For documents, be specific and actionable.',
      highlight: 'Every decision affects your KPIs. Watch Budget, Risk, Morale, and Stakeholder satisfaction.',
    },
    {
      icon: Bell,
      title: 'Staying Informed',
      content: 'Stakeholders will send you messages and call meetings. Read communications carefully — they contain important context for your decisions.',
      highlight: 'Pro Tip: Good managers read all signals before making big decisions.',
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[20px] max-w-lg w-full p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i === step ? 'bg-blue-500' : i < step ? 'bg-blue-500/30' : 'bg-gray-200 dark:bg-gray-700'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <currentStep.icon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <TypingText
              as="h2"
              text={currentStep.title}
              speed={25}
              delay={300}
              className="text-xl font-bold text-gray-900 dark:text-white"
              key={`title-${step}`}
            />
            <p className="text-xs text-gray-500">Step {step + 1} of {steps.length}</p>
          </div>
        </div>

        <TypingText
          text={currentStep.content}
          speed={20}
          delay={600}
          as="p"
          className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed"
          key={`content-${step}`}
        />

        <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mb-6">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <TypingText text={currentStep.highlight} speed={20} key={`tip-${step}`} className="text-sm text-blue-700 dark:text-blue-300" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Skip
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handleClose()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              {step < steps.length - 1 ? 'Next' : 'Start Simulation'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHint;