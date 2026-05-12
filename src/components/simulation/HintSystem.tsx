/**
 * HintSystem — Contextual guidance for tasks
 * Shows "what this is", "what that is not", and helpful tips
 */

import { useState } from 'react';
import { 
    Lightbulb, 
    X, 
    ChevronDown, 
    ChevronUp,
    Info,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface HintConfig {
    whatThisIs: string;
    whatThatIs?: string;
    hint: string;
    tips?: string[];
}

interface HintSystemProps {
    hint: HintConfig;
    taskId?: string;
    primaryColor?: string;
    compact?: boolean;
}

export function HintSystem({ hint, taskId, primaryColor = '#8b5cf6', compact = false }: HintSystemProps) {
    const [isExpanded, setIsExpanded] = useState(!compact);
    const [showTipIndex, setShowTipIndex] = useState<number | null>(0);

    if (compact) {
        return (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 w-full"
                >
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {isExpanded ? 'Hide Hint' : 'Show Hint'}
                    </span>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-amber-500 ml-auto" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-amber-500 ml-auto" />
                    )}
                </button>
                
                {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-amber-500/20">
                        <p className="text-xs text-gray-600 dark:text-gray-400">{hint.hint}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-amber-500/5 to-blue-500/5 border border-amber-500/20 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-amber-500/10 border-b border-amber-500/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                            Guidance
                        </h4>
                        <p className="text-xs text-amber-500/70">
                            Helpful context for this task
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* What This Is */}
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            What This Is
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {hint.whatThisIs}
                        </p>
                    </div>
                </div>

                {/* What That Is Not */}
                {hint.whatThatIs && (
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                What That Is NOT
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {hint.whatThatIs}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Hint */}
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Info className="w-3 h-3 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Hint
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {hint.hint}
                        </p>
                    </div>
                </div>

                {/* Tips */}
                {hint.tips && hint.tips.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            Quick Tips
                        </p>
                        <div className="space-y-2">
                            {hint.tips.map((tip, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <div 
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {tip}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HintSystem;