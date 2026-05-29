import { useState } from 'react';
import { 
  FolderHeart, Check, X, ExternalLink, 
  Copy, Share2, Award, FileText, Star, Plus
} from 'lucide-react';
import type { ArtifactType } from '../../artifacts/types';
import { ARTIFACT_TYPE_LABELS, ARTIFACT_TYPE_ICONS } from '../../artifacts/types';

interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  description?: string;
  week: number;
  createdAt: Date;
  updatedAt?: Date;
  status: 'draft' | 'generated' | 'exported' | 'archived';
  sessionId?: string;
  content?: unknown;
  metadata?: unknown;
  phaseId?: string;
}

interface PortfolioBuilderProps {
  artifacts: Artifact[];
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ artifacts }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const toggleArtifact = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(artifacts.map(a => a.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const generatePortfolio = () => {
    const selected = artifacts.filter(a => selectedIds.has(a.id));
    
    if (selected.length === 0) {
      alert('Please select at least one document for your portfolio');
      return;
    }

    // Generate a shareable link (mock for now)
    const mockUrl = `https://turnve.app/portfolio/${Date.now()}`;
    setGeneratedUrl(mockUrl);
  };

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
    }
  };

  const selectedArtifacts = artifacts.filter(a => selectedIds.has(a.id));

  const groupedByType = artifacts.reduce((acc, artifact) => {
    if (!acc[artifact.type]) {
      acc[artifact.type] = [];
    }
    acc[artifact.type].push(artifact);
    return acc;
  }, {} as Record<ArtifactType, Artifact[]>);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] relative">
      {/* Header - Simplified */}
      <div className="p-6 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <FolderHeart className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Builder</h2>
            <p className="text-sm text-[#a1a1aa]">
              {selectedIds.size} selected • {artifacts.length} total
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-gray-900 dark:text-white transition-colors"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-gray-900 dark:text-white transition-colors"
          >
            Deselect All
          </button>
        </div>

        {generatedUrl && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Portfolio generated!</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">{generatedUrl}</code>
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-gray-100 dark:bg-white/5 rounded text-emerald-400"
                title="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.open(generatedUrl, '_blank')}
                className="p-1.5 hover:bg-gray-100 dark:bg-white/5 rounded text-emerald-400"
                title="Open portfolio"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={generatePortfolio}
        disabled={selectedIds.size === 0}
        className="absolute bottom-6 right-6 w-14 h-14 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all hover:scale-105 z-10"
        title="Generate Portfolio"
      >
        <Award className="w-6 h-6" />
      </button>

      {/* Selected Summary */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-400">
              {selectedIds.size} document{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              {selectedArtifacts.length > 0 && (
                <>
                  <span className="text-xs text-[#a1a1aa]">Includes:</span>
                  {selectedArtifacts.slice(0, 3).map(a => (
                    <span key={a.id} className="text-xs bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-[#a1a1aa]">
                      {ARTIFACT_TYPE_ICONS[a.type]}
                    </span>
                  ))}
                  {selectedArtifacts.length > 3 && (
                    <span className="text-xs text-[#a1a1aa]">+{selectedArtifacts.length - 3} more</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Artifact Selection */}
      <div className="flex-1 overflow-y-auto p-6">
        {artifacts.length === 0 ? (
          <div className="text-center py-12">
            <FolderHeart className="w-12 h-12 text-[#a1a1aa] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Artifacts Yet</h3>
            <p className="text-sm text-[#a1a1aa]">
              Generate some documents first, then build your portfolio
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByType).map(([type, items]) => (
              <div key={type}>
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase mb-3 flex items-center gap-2">
                  <span>{ARTIFACT_TYPE_ICONS[type as ArtifactType]}</span>
                  {ARTIFACT_TYPE_LABELS[type as ArtifactType]}
                  <span className="text-xs bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-[#a1a1aa]">
                    {items.length}
                  </span>
                </h3>
                <div className="grid gap-3">
                  {items.map(artifact => (
                    <button
                      key={artifact.id}
                      onClick={() => toggleArtifact(artifact.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-4 ${
                        selectedIds.has(artifact.id)
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedIds.has(artifact.id)
                          ? 'bg-amber-500 border-amber-500'
                          : 'border-[#a1a1aa]'
                      }`}>
                        {selectedIds.has(artifact.id) && (
                          <Check className="w-4 h-4 text-gray-900 dark:text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{artifact.title}</h4>
                        <p className="text-xs text-[#a1a1aa]">Week {artifact.week} • {artifact.status}</p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        artifact.status === 'exported' ? 'bg-emerald-500/20 text-emerald-400' :
                        artifact.status === 'generated' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {artifact.status}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{artifacts.length}</div>
            <div className="text-xs text-[#a1a1aa]">Available</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-400">{selectedIds.size}</div>
            <div className="text-xs text-[#a1a1aa]">Selected</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400">{new Set(artifacts.map(a => a.type)).size}</div>
            <div className="text-xs text-[#a1a1aa]">Types</div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-white/10 max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{portfolioName}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-100 dark:bg-white/5 rounded"
              >
                <X className="w-5 h-5 text-[#a1a1aa]" />
              </button>
            </div>
            <div className="space-y-4">
              {selectedArtifacts.map(artifact => (
                <div key={artifact.id} className="p-4 bg-gray-100 dark:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{ARTIFACT_TYPE_ICONS[artifact.type]}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{artifact.title}</h4>
                  </div>
                  <p className="text-sm text-[#a1a1aa]">Generated Week {artifact.week}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-gray-100 dark:bg-white/5 hover:bg-white/10 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;