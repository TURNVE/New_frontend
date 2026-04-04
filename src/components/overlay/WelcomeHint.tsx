import { useState } from 'react';
import {
  Lightbulb, Mail, Target, Clock, ChevronRight, X,
  MessageSquare, Building2, FileText, Trophy, Zap, Bell,
  LayoutList
} from 'lucide-react';
import { enableSounds } from '../../utils/sounds';

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
  const [isSkipped, setIsSkipped] = useState(false);

  const archetypeLabel = archetype.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const steps = [
    {
      icon: Trophy,
      title: `Welcome to ${companyName}! 🎯`,
      content: `You've joined the team as a Senior Product Manager. Your decisions will shape the outcome of this ${archetypeLabel} simulation.`,
      highlight: challengeTitle,
    },
    {
      icon: Target,
      title: 'Your Mission',
      content: 'Navigate the weekly challenges. Balance budget, team morale, stakeholder satisfaction, and project risk.',
      highlight: 'Watch out: Critical risks or zero budget will end the simulation early.',
    },
    {
      icon: Zap,
      title: 'Strategic Actions ⚡',
      content: 'Each week brings new actions. These aren\'t just choices—you might need to draft decision memos, submit PRDs, or approve engineering plans.',
      highlight: 'Click any action to open the interactive workspace!',
    },
    {
      icon: LayoutList,
      title: 'The Activity Backlog 📂',
      content: 'The Backlog is your central hub. It tracks every signal, event, and overdue action. Check it often to stay on top of the project.',
      highlight: 'A notification badge will appear when items require your urgent attention.',
    },
    {
      icon: Bell,
      title: 'Communications Hub 🔔',
      content: 'Stakeholders will reach out via the Notification Center. Read emails and messages to gather insights before making big decisions.',
      highlight: 'Pro Tip: Team members provide technical and market context in their messages!',
    },
  ];

  const currentStep = steps[step];
  const Progress = () => (
    <div className="flex gap-1 mb-4">
      {steps.map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-500' : 'bg-white/20'
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-white/10 rounded-2xl max-w-lg w-full p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-5 h-5 text-[#a1a1aa]" />
        </button>

        <Progress />

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <currentStep.icon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentStep.title}</h2>
            <p className="text-xs text-[#a1a1aa]">Step {step + 1} of {steps.length}</p>
          </div>
        </div>

        <p className="text-[#a1a1aa] mb-4 leading-relaxed">
          {currentStep.content}
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-6">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-200">{currentStep.highlight}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-sm text-[#a1a1aa] hover:text-white transition-colors"
          >
            Skip tutorial
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handleClose()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHint;