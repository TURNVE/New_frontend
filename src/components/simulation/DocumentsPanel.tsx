import { useState, type ComponentType } from 'react';
import {
  AlertTriangle,
  Archive,
  BadgeCheck,
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  FolderOpen,
  LockKeyhole,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { ArtifactType } from '../../artifacts/types';
import { ARTIFACT_TYPE_LABELS, ARTIFACT_TYPE_ICONS } from '../../artifacts/types';
import type { ActionReviewResult, WeeklyActionItem } from '../../shared/simulation/types';

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

type SimulationDocumentMode = 'default' | 'product_management';
type PmDocumentStatus = 'locked' | 'ready' | 'draft' | 'submitted' | 'needs_revision' | 'completed' | 'exported';
type PmDocumentFilter = 'all' | PmDocumentStatus;

interface ArtifactMetadata {
  actionId?: string;
  moduleTitle?: string;
  moduleWeek?: number;
  deliverable?: string;
  sourceMaterials?: { title: string; source: string }[];
  review?: ActionReviewResult;
}

interface DocumentsPanelProps {
  artifacts: Artifact[];
  onGenerateArtifact: (type: ArtifactType) => void;
  onViewArtifact: (artifact: Artifact) => void;
  onExportArtifact: (artifact: Artifact, format: 'pdf' | 'docx') => void;
  onDeleteArtifact: (artifact: Artifact) => void;
  currentWeek: number;
  simulationMode?: SimulationDocumentMode;
  weeklyActions?: WeeklyActionItem[];
  completedActionIds?: string[];
  primaryColor?: string;
  onOpenAction?: (item: WeeklyActionItem) => void;
  onExportCaseStudy?: () => void;
}

const pmStatusMeta: Record<PmDocumentStatus, { label: string; className: string; icon: ComponentType<{ className?: string }> }> = {
  locked: { label: 'Locked', className: 'bg-slate-500/10 text-slate-500 dark:text-slate-400', icon: LockKeyhole },
  ready: { label: 'Ready to create', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-300', icon: Circle },
  draft: { label: 'Draft', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', icon: FileText },
  submitted: { label: 'Submitted', className: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300', icon: Archive },
  needs_revision: { label: 'Needs revision', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', icon: AlertTriangle },
  completed: { label: 'Completed', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', icon: CheckCircle },
  exported: { label: 'Exported', className: 'bg-purple-500/10 text-purple-700 dark:text-purple-300', icon: BadgeCheck },
};

const pmFilterOptions: { id: PmDocumentFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Ready' },
  { id: 'needs_revision', label: 'Needs revision' },
  { id: 'completed', label: 'Completed' },
  { id: 'exported', label: 'Exported' },
  { id: 'locked', label: 'Locked' },
];

const artifactTypes: ArtifactType[] = [
  'prd',
  'roadmap',
  'stakeholder_update',
  'retrospective',
  'risk_assessment',
  'decision_log',
  'project_charter',
];

function getArtifactMetadata(artifact?: Artifact): ArtifactMetadata {
  if (!artifact?.metadata || typeof artifact.metadata !== 'object') return {};
  return artifact.metadata as ArtifactMetadata;
}

function getReview(artifact?: Artifact): ActionReviewResult | undefined {
  return getArtifactMetadata(artifact).review;
}

function getDeliverableLabel(action: WeeklyActionItem) {
  if (action.artifactType === 'prd') {
    return action.title.toLowerCase().includes('stories') ? 'User stories + acceptance criteria' : 'Mini PRD';
  }
  if (action.artifactType === 'roadmap') {
    return action.title.toLowerCase().includes('feature') ? 'Feature idea list' : 'Impact vs Effort matrix';
  }
  if (action.artifactType === 'stakeholder_update') return 'Stakeholder update';
  if (action.artifactType === 'user_research') return 'Top user pain points';
  if (action.artifactType === 'metrics_report') return 'Problem-impact map';
  if (action.artifactType === 'decision_log') return 'Product problem statement';
  if (action.artifactType === 'project_charter') {
    return action.week <= 1 ? 'Product problem summary' : 'Portfolio case study';
  }
  return action.outputTemplate?.[0]?.label ?? action.prdTitle ?? 'PM work document';
}

function getStatusColor(status: string) {
  switch (status) {
    case 'draft': return 'bg-gray-500/20 text-gray-400';
    case 'generated': return 'bg-blue-500/20 text-blue-400';
    case 'exported': return 'bg-emerald-500/20 text-emerald-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
}

export const DocumentsPanel: React.FC<DocumentsPanelProps> = ({
  artifacts,
  onGenerateArtifact,
  onViewArtifact,
  onExportArtifact,
  onDeleteArtifact,
  currentWeek,
  simulationMode = 'default',
  weeklyActions = [],
  completedActionIds = [],
  primaryColor = '#6366f1',
  onOpenAction,
  onExportCaseStudy,
}) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [pmFilter, setPmFilter] = useState<PmDocumentFilter>('all');
  const completedActionSet = new Set(completedActionIds);

  const findArtifactForAction = (action: WeeklyActionItem) => artifacts.find((artifact) => {
    const metadata = getArtifactMetadata(artifact);
    if (metadata.actionId === action.id) return true;
    if (artifact.week === action.week && action.artifactType && artifact.type === action.artifactType) return true;
    return artifact.week === action.week && artifact.title === (action.prdTitle ?? action.title);
  });

  const getPmStatus = (action: WeeklyActionItem, artifact?: Artifact): PmDocumentStatus => {
    const review = getReview(artifact);
    if (artifact?.status === 'exported') return 'exported';
    if (artifact?.status === 'draft') return 'draft';
    if (review?.requiresRevision) return 'needs_revision';
    if (artifact) return 'completed';
    if (completedActionSet.has(action.id)) return 'submitted';
    if (action.week <= currentWeek) return 'ready';
    return 'locked';
  };

  const pmDocumentRoadmap = weeklyActions
    .slice()
    .sort((a, b) => a.week - b.week)
    .map((action) => {
      const artifact = findArtifactForAction(action);
      const metadata = getArtifactMetadata(artifact);
      return {
        action,
        artifact,
        review: getReview(artifact),
        status: getPmStatus(action, artifact),
        deliverable: metadata.deliverable ?? getDeliverableLabel(action),
        sources: metadata.sourceMaterials ?? action.workplaceMaterials?.map((material) => ({
          title: material.title,
          source: material.source,
        })) ?? [],
        scoreTotal: action.scoringRubric?.reduce((sum, criterion) => sum + criterion.points, 0) ?? 0,
      };
    });

  const filteredPmDocuments = pmDocumentRoadmap.filter((item) => pmFilter === 'all' || item.status === pmFilter);
  const completedPmDocuments = pmDocumentRoadmap.filter((item) => ['completed', 'exported'].includes(item.status)).length;
  const readyPmDocuments = pmDocumentRoadmap.filter((item) => item.status === 'ready' || item.status === 'needs_revision').length;
  const finalCaseStudy = pmDocumentRoadmap.find((item) => item.action.artifactType === 'project_charter' && item.action.week > 1);

  if (simulationMode === 'product_management') {
    return (
      <div className="h-full flex flex-col bg-slate-50 text-slate-950 dark:bg-[#071927] dark:text-white">
        <div className="border-b border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-white/10 dark:bg-[#0b2033]/90 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white" style={{ backgroundColor: primaryColor }}>
                <FolderOpen className="h-3.5 w-3.5" />
                PM Work Documents
              </div>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Build the portfolio artifacts from each module
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                Every module creates one realistic PM document: research notes, a problem map, prioritization, a mini PRD, user stories, stakeholder update, and the final Portfolio case study.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <button
                onClick={onExportCaseStudy}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: primaryColor, boxShadow: `0 12px 30px ${primaryColor}35` }}
                disabled={!onExportCaseStudy}
              >
                <Download className="h-4 w-4" />
                Export Case Study
              </button>
              <button
                onClick={() => {
                  const currentAction = pmDocumentRoadmap.find((item) => item.status === 'ready' || item.status === 'needs_revision')?.action;
                  if (currentAction) onOpenAction?.(currentAction);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                disabled={!onOpenAction || readyPmDocuments === 0}
              >
                <Sparkles className="h-4 w-4" />
                Open next work item
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Expected docs', value: pmDocumentRoadmap.length },
              { label: 'Created', value: artifacts.length },
              { label: 'Completed', value: completedPmDocuments },
              { label: 'Current module', value: currentWeek },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="text-2xl font-black text-slate-950 dark:text-white">{stat.value}</div>
                <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
                <BookOpen className="h-5 w-5" style={{ color: primaryColor }} />
                Artifact roadmap
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Open a module, submit the template, receive PM review, then export the document.
              </p>
            </div>

            <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.04]">
              <Filter className="ml-2 h-4 w-4 flex-none text-slate-400" />
              {pmFilterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setPmFilter(option.id)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-black transition ${
                    pmFilter === option.id
                      ? 'text-white'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                  style={pmFilter === option.id ? { backgroundColor: primaryColor } : undefined}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4">
              {filteredPmDocuments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
                  <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                  <h4 className="text-lg font-black text-slate-950 dark:text-white">No documents match this filter</h4>
                  <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Choose another status to see the rest of the PM workspace.</p>
                </div>
              ) : (
                filteredPmDocuments.map((item) => {
                  const StatusIcon = pmStatusMeta[item.status].icon;
                  const canOpenModule = item.status !== 'locked' && Boolean(onOpenAction);
                  return (
                    <article
                      key={item.action.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] sm:p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:bg-white/10 dark:text-slate-300">
                              Module {item.action.week} of {weeklyActions.length || 10}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${pmStatusMeta[item.status].className}`}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {pmStatusMeta[item.status].label}
                            </span>
                          </div>
                          <h4 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{item.deliverable}</h4>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{item.action.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.action.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          {item.artifact && (
                            <>
                              <button
                                onClick={() => onViewArtifact(item.artifact as Artifact)}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                              <button
                                onClick={() => onExportArtifact(item.artifact as Artifact, 'pdf')}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                              >
                                <Download className="h-4 w-4" />
                                Export
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => onOpenAction?.(item.action)}
                            disabled={!canOpenModule}
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-60"
                            style={!canOpenModule ? undefined : { backgroundColor: primaryColor }}
                          >
                            {item.status === 'locked' ? 'Locked' : item.artifact ? 'Open module' : item.status === 'needs_revision' ? 'Revise document' : 'Create document'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/10">
                          <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Score</div>
                          <div className="mt-1 text-sm font-black text-slate-950 dark:text-white">
                            {item.review ? `${item.review.score}/${item.review.maxScore}` : item.scoreTotal ? `${item.scoreTotal} pts rubric` : 'Not reviewed yet'}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/10 md:col-span-2">
                          <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">PM review</div>
                          <div className="mt-1 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                            {item.review?.stakeholderReaction ?? 'Submit this module to unlock feedback from the product reviewer.'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.sources.length > 0 ? item.sources.slice(0, 4).map((source) => (
                          <span key={`${item.action.id}-${source.title}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            <FileText className="h-3 w-3" />
                            {source.title}
                          </span>
                        )) : (
                          <span className="text-xs font-bold text-slate-400">No source materials attached yet.</span>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <h4 className="text-base font-black text-slate-950 dark:text-white">How this page works</h4>
                <div className="mt-4 space-y-3">
                  {[
                    'Open a ready module and complete the editable PM template.',
                    'TURNVE saves the output here as a work document.',
                    'Review the score, feedback, and source materials before exporting.',
                  ].map((step, index) => (
                    <div key={step} className="flex gap-3">
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: primaryColor }}>
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <h4 className="text-base font-black text-slate-950 dark:text-white">Final proof of work</h4>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                  The last module packages your work into a Portfolio case study. Export it when the case study document has been completed.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/10">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Final module
                  </div>
                  <div className="mt-1 text-sm font-black text-slate-950 dark:text-white">
                    {finalCaseStudy?.action.title ?? 'Portfolio case study summary'}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] relative">
      <div className="p-6 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Documents & Artifacts</h2>
        <p className="text-sm text-[#a1a1aa]">
          {artifacts.length} documents - Week {currentWeek}
        </p>
      </div>

      <button
        onClick={() => setShowGenerateModal(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105 z-10"
        title="Generate Document"
        aria-label="Generate document"
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="flex-1 overflow-y-auto p-6">
        {artifacts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#a1a1aa] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Documents Yet</h3>
            <p className="text-sm text-[#a1a1aa] mb-4">
              Tap the + button to generate your first document
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {artifacts.map(artifact => (
              <div
                key={artifact.id}
                className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gray-200 dark:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                      {ARTIFACT_TYPE_ICONS[artifact.type]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{artifact.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#a1a1aa]">
                          {ARTIFACT_TYPE_LABELS[artifact.type]}
                        </span>
                        <span className="text-xs text-[#a1a1aa]">-</span>
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
                      className="p-2 hover:bg-gray-100 dark:bg-white/5 rounded-lg text-[#a1a1aa] hover:text-gray-900 dark:text-white transition-colors"
                      title="View"
                      aria-label={`View ${artifact.title}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExportArtifact(artifact, 'pdf')}
                      className="p-2 hover:bg-gray-100 dark:bg-white/5 rounded-lg text-[#a1a1aa] hover:text-gray-900 dark:text-white transition-colors"
                      title="Export PDF"
                      aria-label={`Export ${artifact.title}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteArtifact(artifact)}
                      className="p-2 hover:bg-gray-100 dark:bg-white/5 rounded-lg text-[#a1a1aa] hover:text-red-400 transition-colors"
                      title="Delete"
                      aria-label={`Delete ${artifact.title}`}
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

      <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{artifacts.length}</div>
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

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-white/10 max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Generate New Document</h3>
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
                  className="text-left p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{ARTIFACT_TYPE_ICONS[type]}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{ARTIFACT_TYPE_LABELS[type]}</span>
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
              className="w-full py-2 text-sm text-[#a1a1aa] hover:text-gray-900 dark:text-white transition-colors"
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
