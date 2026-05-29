import { useEffect, useMemo, useState } from 'react';
import {
  Lightbulb, Target, ChevronRight, X,
  Trophy, Zap, Bell,
  LayoutList, Mail, MonitorPlay, PartyPopper,
  Volume2, VolumeX
} from 'lucide-react';
import { enableSounds } from '../../utils/sounds';
import { TypingText } from '../ui/TypingText';

const VOICEOVER_MUTED_KEY = 'turnve_voiceover_muted';

interface WelcomeHintProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  challengeTitle?: string;
  archetype?: string;
}

export const WelcomeHint: React.FC<WelcomeHintProps> = ({ isOpen, onClose, companyName, challengeTitle, archetype }) => {
  const [step, setStep] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(VOICEOVER_MUTED_KEY) === 'true';
  });

  useEffect(() => {
    setVoiceSupported(
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window
    );
  }, []);

  const stopVoiceover = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleClose = () => {
    stopVoiceover();
    enableSounds();
    onClose();
  };

  const toggleVoiceMute = () => {
    setIsVoiceMuted((muted) => {
      const nextMuted = !muted;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(VOICEOVER_MUTED_KEY, String(nextMuted));
      }
      if (nextMuted) stopVoiceover();
      return nextMuted;
    });
  };

  const safeCompanyName = companyName || 'FlowDesk';
  const safeChallengeTitle = challengeTitle || 'First Simulation';
  const safeArchetype = archetype || 'project_manager';
  const archetypeLabel = safeArchetype.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const isInternWelcome = safeCompanyName === 'TechCorp';

  const genericSteps = [
    {
      icon: Trophy,
      title: `Welcome to ${safeCompanyName}`,
      content: `You're stepping into a real-world management simulation as a ${archetypeLabel}. Your role: make strategic decisions that balance budget, team morale, stakeholder satisfaction, and project risk.`,
      highlight: `Challenge: ${safeChallengeTitle}`,
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

  const internSteps = [
    {
      icon: Trophy,
      title: 'You are stepping into TechCorp',
      content: 'Welcome. You are first employed as an intern at TechCorp. Sarah from Product is waiting for you, and this onboarding works like a mission room: open the objects, join live moments, and unlock tasks one action at a time.',
      highlight: 'First quest: open your offer letter and accept the internship.',
    },
    {
      icon: Mail,
      title: 'Start with the letter',
      content: 'Your offer letter is now an interactive object. Open it, read the details, and confirm before the next mission appears.',
      highlight: 'Look for mailbox-style cards and animated mission prompts.',
    },
    {
      icon: MonitorPlay,
      title: 'Meet people in rooms',
      content: 'Calls now open as small TechCorp meeting environments with participants, agenda cards, and a clear completion moment.',
      highlight: 'When a call appears, join it like a live scene.',
    },
    {
      icon: PartyPopper,
      title: 'Unlock the week',
      content: 'Week 1 no longer throws every task at you. The next task appears after you act, so onboarding feels like a guided game path.',
      highlight: 'Complete the visible action, then watch the next action unlock.',
    },
  ];

  const steps = isInternWelcome ? internSteps : genericSteps;

  const currentStep = steps[step];
  const voiceoverText = useMemo(
    () => `${currentStep.title}. Step ${step + 1} of ${steps.length}. ${currentStep.content} ${currentStep.highlight}`,
    [currentStep, step, steps.length]
  );
  const titleClass = isInternWelcome ? 'text-xl font-bold text-slate-950 dark:text-white' : 'text-xl font-bold text-gray-900 dark:text-white';
  const bodyClass = isInternWelcome ? 'text-slate-700 mb-5 leading-relaxed font-medium dark:text-slate-300' : 'text-gray-600 dark:text-gray-300 mb-5 leading-relaxed';
  const tipClass = isInternWelcome ? 'text-sm font-bold text-sky-700 dark:text-sky-200' : 'text-sm text-blue-700 dark:text-blue-300';
  const secondaryButtonClass = isInternWelcome
    ? 'text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors dark:text-slate-300 dark:hover:text-white'
    : 'text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors';

  useEffect(() => {
    if (!isOpen || isVoiceMuted || !voiceSupported) return undefined;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(voiceoverText);
    utterance.rate = isInternWelcome ? 0.94 : 0.98;
    utterance.pitch = isInternWelcome ? 1.05 : 1;
    utterance.volume = 0.9;

    const voices = synth.getVoices();
    const preferredVoice =
      voices.find((voice) => /aria|jenny|zira|samantha|natural|female/i.test(`${voice.name} ${voice.voiceURI}`)) ||
      voices.find((voice) => voice.lang?.toLowerCase().startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    const timer = window.setTimeout(() => synth.speak(utterance), 350);

    return () => {
      window.clearTimeout(timer);
      synth.cancel();
    };
  }, [isOpen, isVoiceMuted, voiceSupported, voiceoverText, isInternWelcome]);

  useEffect(() => () => stopVoiceover(), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isInternWelcome ? 'bg-gradient-to-br from-white via-orange-50 to-sky-50 border-white/80 max-w-3xl rounded-[28px] dark:from-[#111318] dark:via-[#0f1011] dark:to-[#101827] dark:border-white/10' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-w-lg rounded-[20px]'} border w-full p-6 relative overflow-hidden shadow-2xl`}>
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${isInternWelcome ? 'bg-fuchsia-300/40 dark:bg-fuchsia-500/10' : 'bg-blue-500/10'}`} />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close onboarding"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-slate-300" />
        </button>

        {voiceSupported && (
          <button
            onClick={toggleVoiceMute}
            className="absolute top-4 right-12 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isVoiceMuted ? 'Turn voiceover on' : 'Mute voiceover'}
            title={isVoiceMuted ? 'Turn voiceover on' : 'Mute voiceover'}
          >
            {isVoiceMuted ? (
              <VolumeX className="w-5 h-5 text-gray-500 dark:text-slate-300" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-500 dark:text-slate-300" />
            )}
          </button>
        )}

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i === step ? 'bg-blue-500' : i < step ? 'bg-blue-500/30' : 'bg-gray-200 dark:bg-gray-700'}`}
            />
          ))}
        </div>

        <div className={isInternWelcome ? 'grid gap-5 md:grid-cols-[1fr_220px] md:items-end' : ''}>
          <div>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isInternWelcome ? 'bg-violet-100 text-violet-600 shadow-lg dark:bg-violet-400/15 dark:text-violet-200' : 'bg-blue-500/10 text-blue-500'}`}>
            <currentStep.icon className="w-6 h-6" />
          </div>
          <div>
            <TypingText
              as="h2"
              text={currentStep.title}
              speed={25}
              delay={300}
              className={titleClass}
              key={`title-${step}`}
            />
            <p className={isInternWelcome ? 'text-xs font-bold text-slate-500 dark:text-slate-400' : 'text-xs text-gray-500'}>Step {step + 1} of {steps.length}</p>
          </div>
        </div>

        <TypingText
          text={currentStep.content}
          speed={20}
          delay={600}
          as="p"
          className={bodyClass}
          key={`content-${step}`}
        />

        <div className={`${isInternWelcome ? 'bg-sky-50 border-sky-200 dark:bg-sky-400/10 dark:border-sky-300/20' : 'bg-blue-50 dark:bg-blue-500/5 border-blue-500/20'} border rounded-lg p-3 mb-6`}>
          <div className="flex items-start gap-2">
            <Lightbulb className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isInternWelcome ? 'text-sky-600 dark:text-sky-200' : 'text-blue-500'}`} />
            <TypingText text={currentStep.highlight} speed={20} key={`tip-${step}`} className={tipClass} />
          </div>
        </div>
          </div>

          {isInternWelcome && (
            <div className="relative hidden min-h-[250px] md:block">
              <div className="absolute inset-x-5 bottom-0 h-24 rounded-full bg-violet-300/25 blur-2xl" />
              <img
                src={step === 0 ? '/images/intern-welcome-guide.svg' : '/images/intern-mentor.png'}
                alt={step === 0 ? 'Intern welcome guide' : 'Product mentor'}
                className="relative z-10 mx-auto max-h-[270px] w-full object-contain drop-shadow-2xl"
              />
              <div className="absolute left-0 top-8 z-20 rounded-3xl rounded-bl-md bg-white p-3 text-xs font-black text-slate-700 shadow-xl dark:bg-[#15171d] dark:text-slate-100 dark:ring-1 dark:ring-white/10">
                Welcome aboard!
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className={secondaryButtonClass}
          >
            Skip
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => {
                  stopVoiceover();
                  setStep(s => s - 1);
                }}
                className={`px-4 py-2 ${secondaryButtonClass}`}
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                stopVoiceover();
                step < steps.length - 1 ? setStep(s => s + 1) : handleClose();
              }}
              className={`${isInternWelcome ? 'bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200' : 'bg-blue-500 hover:bg-blue-600'} text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2`}
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
