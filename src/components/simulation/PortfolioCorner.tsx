import { useState } from 'react';
import { Palette, Image, BarChart3, TrendingUp, Expand, X, ChevronRight, CheckCircle, AlertCircle, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface SubmittedWork {
  id: string;
  type: 'color-palette' | 'moodboard' | 'logo' | 'social-assets' | 'meta-campaign' | 'brand-guide' | 'video-storyboard' | 'ooh-mockup' | 'ad-variants';
  title: string;
  thumbnail?: string;
  colorPreview?: string[];
  metaStats?: {
    roas?: number;
    ctr?: number;
    engagement?: number;
    impressions?: number;
    spend?: number;
  };
  submittedAt?: Date;
  // AI Evaluation results
  qualityScore?: number;
  feedback?: string;
  strengths?: string[];
  weaknesses?: string[];
  stakeholderReaction?: {
    stakeholderId: string;
    stakeholderName: string;
    reaction: 'positive' | 'neutral' | 'negative';
    message: string;
  };
}

interface PortfolioCornerProps {
  works: SubmittedWork[];
  onExpand: () => void;
  onViewWork?: (work: SubmittedWork) => void;
}

export const PortfolioCorner = ({ works, onExpand }: PortfolioCornerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedWork, setSelectedWork] = useState<SubmittedWork | null>(null);

  const getIcon = (type: SubmittedWork['type']) => {
    switch (type) {
      case 'color-palette':
        return <Palette className="w-4 h-4" />;
      case 'moodboard':
      case 'logo':
      case 'social-assets':
        return <Image className="w-4 h-4" />;
      case 'meta-campaign':
        return <BarChart3 className="w-4 h-4" />;
      case 'brand-guide':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: SubmittedWork['type']) => {
    switch (type) {
      case 'color-palette':
        return 'Colors';
      case 'moodboard':
        return 'Moodboard';
      case 'logo':
        return 'Logo';
      case 'social-assets':
        return 'Social';
      case 'meta-campaign':
        return 'Ads';
      case 'brand-guide':
        return 'Guide';
      default:
        return type;
    }
  };

  const renderThumbnail = (work: SubmittedWork) => {
    if (work.type === 'color-palette' && work.colorPreview) {
      return (
        <div className="w-12 h-12 rounded-lg flex overflow-hidden">
          {work.colorPreview.slice(0, 4).map((color, idx) => (
            <div
              key={idx}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      );
    }

    if (work.type === 'meta-campaign' && work.metaStats) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <span className="text-[10px] font-bold text-blue-400">{work.metaStats.roas?.toFixed(1)}x</span>
        </div>
      );
    }

    if (work.thumbnail) {
      return (
        <img
          src={work.thumbnail}
          alt={work.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
      );
    }

    return (
      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
        {getIcon(work.type)}
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden w-64">
          <button
            onClick={onExpand}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-violet-500 to-purple-600 text-white"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Your Work</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                {works.length}
              </span>
            </div>
            <Expand className="w-4 h-4" />
          </button>

          <div className="p-3">
            {works.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                Submit work during the simulation to see it here
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {works.slice(0, 8).map((work) => (
                  <button
                    key={work.id}
                    onClick={() => setSelectedWork(work)}
                    className="group relative"
                    title={work.title}
                  >
                    {renderThumbnail(work)}
                    {work.qualityScore !== undefined && (
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        work.qualityScore >= 80
                          ? 'bg-green-500 text-white'
                          : work.qualityScore >= 60
                          ? 'bg-blue-500 text-white'
                          : work.qualityScore >= 40
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {Math.round(work.qualityScore / 20)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-2 h-2 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedWork && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedWork(null)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-500">
                  {getIcon(selectedWork.type)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedWork.title}</h3>
                  <p className="text-xs text-gray-500">{getTypeLabel(selectedWork.type)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWork(null)}
                aria-label="Close modal"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {selectedWork.type === 'color-palette' && selectedWork.colorPreview && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Submitted Colors</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedWork.colorPreview.map((color, idx) => (
                    <div key={idx} className="space-y-1">
                      <div
                        className="h-16 rounded-lg border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs font-mono text-center text-gray-600 dark:text-gray-400">{color}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedWork.type === 'meta-campaign' && selectedWork.metaStats && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Campaign Performance</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-lg font-bold text-green-500">{selectedWork.metaStats.roas?.toFixed(1)}x</p>
                    <p className="text-xs text-gray-500">ROAS</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-lg font-bold text-blue-500">{selectedWork.metaStats.ctr?.toFixed(2)}%</p>
                    <p className="text-xs text-gray-500">CTR</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-lg font-bold text-purple-500">{selectedWork.metaStats.engagement?.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">Engagement</p>
                  </div>
                </div>
              </div>
            )}

            {selectedWork.submittedAt && (
              <p className="text-xs text-gray-400 mt-4">
                Submitted {selectedWork.submittedAt.toLocaleDateString()}
              </p>
            )}

            {/* AI Quality Feedback Section */}
            {selectedWork.qualityScore !== undefined && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">AI Evaluation</span>
                  <div className="flex items-center gap-1" role="group" aria-label={`Rating: ${Math.round(selectedWork.qualityScore! / 20)} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        aria-hidden={star > Math.round(selectedWork.qualityScore! / 20)}
                        className={`w-4 h-4 ${
                          star <= Math.round(selectedWork.qualityScore! / 20)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {selectedWork.feedback && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{selectedWork.feedback}</p>
                )}

                {selectedWork.strengths && selectedWork.strengths.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> Strengths
                    </p>
                    <ul className="space-y-1">
                      {selectedWork.strengths.map((strength, idx) => (
                        <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedWork.weaknesses && selectedWork.weaknesses.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Areas for Improvement
                    </p>
                    <ul className="space-y-1">
                      {selectedWork.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                          <ThumbsDown className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Stakeholder Reaction */}
            {selectedWork.stakeholderReaction && (
              <div className={`mt-4 p-3 rounded-lg border ${
                selectedWork.stakeholderReaction.reaction === 'positive'
                  ? 'bg-green-500/10 border-green-500/20'
                  : selectedWork.stakeholderReaction.reaction === 'negative'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-gray-500/10 border-gray-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {selectedWork.stakeholderReaction.reaction === 'positive' ? (
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                  ) : selectedWork.stakeholderReaction.reaction === 'negative' ? (
                    <ThumbsDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedWork.stakeholderReaction.stakeholderName}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedWork.stakeholderReaction.message}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioCorner;