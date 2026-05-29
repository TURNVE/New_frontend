import { useState, useEffect } from 'react';
import {
  X, FileCode, FileText, Send, AlertCircle,
  CheckCircle, ChevronDown, Info, Sparkles,
  Lightbulb, AlertTriangle, Clock
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ArtifactSection {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'code' | 'rating' | 'list';
  placeholder?: string;
  required: boolean;
}

interface ArtifactDefinition {
  id: string;
  name: string;
  description: string;
  phaseDue: number;
  required: boolean;
  canRevise: boolean;
  sections: ArtifactSection[];
}

interface InstantEvaluationIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
}

interface ArtifactSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifact: ArtifactDefinition;
  phase: number;
  onSubmit: (submission: {
    artifactTypeId: string;
    structured: Record<string, unknown>;
    rawContent: string;
  }) => void;
  existingSubmission?: {
    structured: Record<string, unknown>;
    rawContent: string;
  };
}

export const ArtifactSubmissionModal: React.FC<ArtifactSubmissionModalProps> = ({
  isOpen,
  onClose,
  artifact,
  phase,
  onSubmit,
  existingSubmission,
}) => {
  const [structuredData, setStructuredData] = useState<Record<string, unknown>>({});
  const [rawContent, setRawContent] = useState('');
  const [instantFeedback, setInstantFeedback] = useState<InstantEvaluationIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingSubmission) {
      setStructuredData(existingSubmission.structured);
      setRawContent(existingSubmission.rawContent);
    } else {
      setStructuredData({});
      setRawContent('');
    }
    setInstantFeedback([]);
  }, [existingSubmission, artifact.id]);

  const runInstantValidation = () => {
    const issues: InstantEvaluationIssue[] = [];
    
    artifact.sections.forEach(section => {
      if (section.required) {
        if (section.type === 'text' || section.type === 'list') {
          const value = structuredData[section.id];
          if (!value || (typeof value === 'string' && value.length < 10)) {
            issues.push({
              type: 'missing',
              severity: 'error',
              message: `${section.name} is required`,
              field: section.id,
            });
          }
        }
        if (section.type === 'code') {
          if (!rawContent || rawContent.length < 20) {
            issues.push({
              type: 'missing',
              severity: 'error',
              message: 'Code snippet is required',
              field: 'rawContent',
            });
          }
        }
      }
    });

    if (rawContent) {
      const vagueWords = ['hopefully', 'maybe', 'might', 'probably', 'should work'];
      const foundVague = vagueWords.filter(w => rawContent.toLowerCase().includes(w));
      if (foundVague.length > 0) {
        issues.push({
          type: 'format',
          severity: 'warning',
          message: `Avoid vague language: ${foundVague.join(', ')}`,
        });
      }
    }

    setInstantFeedback(issues);
    return issues.filter(i => i.severity === 'error').length === 0;
  };

  const handleSubmit = () => {
    if (!runInstantValidation()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        artifactTypeId: artifact.id,
        structured: structuredData,
        rawContent,
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const updateStructuredField = (fieldId: string, value: unknown) => {
    setStructuredData(prev => ({ ...prev, [fieldId]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <div>
            <h2 className="text-xl font-bold text-white">{artifact.name}</h2>
            <p className="text-blue-100 text-sm">Phase {phase}: Submit your work</p>
          </div>
          <div className="flex items-center gap-2">
            {artifact.required && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-200 border-red-400/30">
                Required
              </Badge>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
          <p className="text-sm text-blue-800 dark:text-blue-200">{artifact.description}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {artifact.sections.filter(s => s.type !== 'code').map(section => (
            <div key={section.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {section.name}
                {section.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">{section.description}</p>
              {section.type === 'text' && (
                <textarea
                  value={(structuredData[section.id] as string) || ''}
                  onChange={(e) => updateStructuredField(section.id, e.target.value)}
                  placeholder={section.placeholder}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              )}
              {section.type === 'list' && (
                <textarea
                  value={(structuredData[section.id] as string) || ''}
                  onChange={(e) => updateStructuredField(section.id, e.target.value)}
                  placeholder={section.placeholder}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-mono"
                />
              )}
              {section.type === 'rating' && (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={(structuredData[section.id] as number) || 0.5}
                    onChange={(e) => updateStructuredField(section.id, parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-300 w-12">
                    {((structuredData[section.id] as number) || 0.5).toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          ))}

          {artifact.sections.some(s => s.type === 'code') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Code Snippet <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Paste SQL, TypeScript, YAML, or other code</p>
                </div>
                <select
                  value={(structuredData.language as string) || 'typescript'}
                  onChange={(e) => updateStructuredField('language', e.target.value)}
                  className="bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
                >
                  <option value="sql">SQL</option>
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Paste your code here..."
                rows={12}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm font-mono text-green-400 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                spellCheck={false}
              />
            </div>
          )}

          {instantFeedback.length > 0 && (
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Quick Check</span>
              </div>
              <ul className="space-y-1">
                {instantFeedback.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {issue.severity === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={issue.severity === 'error' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}>
                      {issue.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/5">
          <button onClick={runInstantValidation} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />Run Check
          </button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="border-gray-300">Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Submit Artifact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactSubmissionModal;