import { useState } from 'react';
import { 
  FileText, Download, Eye, Clock, ChevronRight,
  Trash2, Plus, Filter, Search, Award, FileCheck,
  Calendar, Users, AlertTriangle, TrendingUp
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

interface DocumentsPanelProps {
  artifacts: Artifact[];
  onGenerateArtifact: (type: ArtifactType) => void;
  onViewArtifact: (artifact: Artifact) => void;
  onExportArtifact: (artifact: Artifact, format: 'pdf' | 'docx') => void;
  onDeleteArtifact: (artifact: Artifact) => void;
  currentWeek: number;
}

export const DocumentsPanel: React.FC<DocumentsPanelProps> = ({
  artifacts,
  onGenerateArtifact,
  onViewArtifact,
  onExportArtifact,
  onDeleteArtifact,
  currentWeek,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ArtifactType | 'all'>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const artifactTypes: ArtifactType[] = [
    'prd',
    'roadmap', 
    'stakeholder_update',
    'retrospective',
    'risk_assessment',
    'decision_log',
    'project_charter',
  ];

  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = artifact.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || artifact.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'generated': return 'bg-blue-500/20 text-blue-400';
      case 'exported': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Documents & Artifacts</h2>
            <p className="text-sm text-[#a1a1aa]">
              Generate and download PM documents for your portfolio
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Document
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#a1a1aa]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ArtifactType | 'all')}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {artifactTypes.map(type => (
                <option key={type} value={type}>
                  {ARTIFACT_TYPE_ICONS[type]} {ARTIFACT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#a1a1aa] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-white mb-2">No Documents Yet</h3>
            <p className="text-sm text-[#a1a1aa] mb-4">
              Generate your first PM document to start building your portfolio
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate Document
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredArtifacts.map(artifact => (
              <div
                key={artifact.id}
                className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                      {ARTIFACT_TYPE_ICONS[artifact.type]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{artifact.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#a1a1aa]">
                          {ARTIFACT_TYPE_LABELS[artifact.type]}
                        </span>
                        <span className="text-xs text-[#a1a1aa]">•</span>
                        <span className="text-xs text-[#a1a1aa] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Week {artifact.week}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(artifact.status)}`}>
                          {artifact.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewArtifact(artifact)}
                      className="p-2 hover:bg-white/5 rounded-lg text-[#a1a1aa] hover:text-white transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExportArtifact(artifact, 'pdf')}
                      className="p-2 hover:bg-white/5 rounded-lg text-[#a1a1aa] hover:text-white transition-colors"
                      title="Export PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteArtifact(artifact)}
                      className="p-2 hover:bg-white/5 rounded-lg text-[#a1a1aa] hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{artifacts.length}</div>
            <div className="text-xs text-[#a1a1aa]">Total Documents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {artifacts.filter(a => a.status === 'exported').length}
            </div>
            <div className="text-xs text-[#a1a1aa]">Exported</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {artifacts.filter(a => a.status === 'generated').length}
            </div>
            <div className="text-xs text-[#a1a1aa]">Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">
              {new Set(artifacts.map(a => a.type)).size}
            </div>
            <div className="text-xs text-[#a1a1aa]">Document Types</div>
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-xl border border-white/10 max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold text-white mb-2">Generate New Document</h3>
            <p className="text-sm text-[#a1a1aa] mb-6">
              Choose a document type to generate based on your current simulation state
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {artifactTypes.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    onGenerateArtifact(type);
                    setShowGenerateModal(false);
                  }}
                  className="text-left p-4 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{ARTIFACT_TYPE_ICONS[type]}</span>
                    <span className="font-semibold text-white">{ARTIFACT_TYPE_LABELS[type]}</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa]">
                    {type === 'prd' && 'Product requirements with user stories and acceptance criteria'}
                    {type === 'roadmap' && 'Visual timeline of phases and milestones'}
                    {type === 'stakeholder_update' && 'Weekly status report for executives'}
                    {type === 'retrospective' && 'Team reflection and action items'}
                    {type === 'risk_assessment' && 'Risk matrix with mitigation strategies'}
                    {type === 'decision_log' && 'Record of all decisions made'}
                    {type === 'project_charter' && 'Project scope and objectives'}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowGenerateModal(false)}
              className="w-full py-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPanel;