import React from 'react';
import { Clock, TrendingUp, TrendingDown, Minus, AlertTriangle, Bell, ChevronRight, CheckCircle, XCircle, Users, Target, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface MetricCardProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
}

export function MetricCard({ label, value, target, unit, trend = 'stable' }: MetricCardProps) {
  const percentage = target > 0 ? (value / target) * 100 : 0;
  const status = percentage >= 90 ? 'good' : percentage >= 70 ? 'warning' : 'critical';
  
  const trendIcon = trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-slate-400 text-sm">{label}</span>
          <span className={`${trendColor} flex items-center gap-1`}>{trendIcon}</span>
        </div>
        <div className="text-2xl font-bold text-white">
          {value.toLocaleString()}{unit}
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Target: {target.toLocaleString()}{unit}</span>
            <span>{percentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TimerDisplayProps {
  week: number;
  totalWeeks: number;
  isHardDeadline?: boolean;
}

export function TimerDisplay({ week, totalWeeks, isHardDeadline = false }: TimerDisplayProps) {
  const weeksRemaining = totalWeeks - week;
  const isUrgent = weeksRemaining <= 2;
  
  return (
    <Card className={`${isUrgent ? 'bg-red-900/30 border-red-700' : 'bg-slate-800 border-slate-700'} border`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${isUrgent ? 'bg-red-500/20' : 'bg-slate-700'}`}>
          <Clock className={`w-6 h-6 ${isUrgent ? 'text-red-400' : 'text-slate-400'}`} />
        </div>
        <div>
          <div className="text-sm text-slate-400">Week {week} of {totalWeeks}</div>
          <div className={`text-lg font-bold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
            {weeksRemaining} weeks remaining
          </div>
          {isHardDeadline && (
            <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Hard deadline</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface PhasePanelProps {
  phaseNumber: number;
  phaseName: string;
  objectives: string[];
  embeddedTension: string;
  progress: number;
}

export function PhasePanel({ phaseNumber, phaseName, objectives, embeddedTension, progress }: PhasePanelProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Phase {phaseNumber}</span>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            Active
          </span>
        </div>
        <CardTitle className="text-xl text-white">{phaseName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Objectives</h4>
          <ul className="space-y-2">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
            <div>
              <div className="text-xs text-amber-400 font-medium">TENSION</div>
              <div className="text-sm text-amber-200/80">{embeddedTension}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActionCardProps {
  id: string;
  name: string;
  description: string;
  choices: Array<{
    id: string;
    label: string;
    description: string;
    risk: number;
    timeCost: number;
  }>;
  onSelect: (actionId: string, choiceId: string) => void;
}

export function ActionCard({ id, name, description, choices, onSelect }: ActionCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg text-white">{name}</CardTitle>
        <p className="text-sm text-slate-400">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onSelect(id, choice.id)}
            className="w-full p-3 text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 rounded-lg transition-all group"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-white group-hover:text-blue-400">
                {choice.label}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded ${
                  choice.risk <= 3 ? 'bg-green-500/20 text-green-400' :
                  choice.risk <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  Risk: {choice.risk}/10
                </span>
                <span className="text-slate-500">
                  {choice.timeCost}w
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400">{choice.description}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

interface StakeholderCardProps {
  id: string;
  name: string;
  role: string;
  trust: number;
  influence: number;
  onMessage?: () => void;
}

export function StakeholderCard({ id, name, role, trust, influence, onMessage }: StakeholderCardProps) {
  const trustColor = trust >= 70 ? 'text-green-400' : trust >= 40 ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-medium text-white">{name}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
        <Users className="w-5 h-5 text-slate-500" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Trust:</span>
          <span className={`font-bold ${trustColor}`}>{trust}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400">Influence:</span>
          <span className="text-xs text-white">{influence}/10</span>
        </div>
      </div>
      {onMessage && (
        <button
          onClick={onMessage}
          className="mt-2 w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Message
        </button>
      )}
    </div>
  );
}

interface ArtifactCardProps {
  id: string;
  name: string;
  qualityScore?: number;
  isRequired: boolean;
}

export function ArtifactCard({ id, name, qualityScore, isRequired }: ArtifactCardProps) {
  return (
    <div className={`p-3 rounded-lg border ${
      qualityScore !== undefined 
        ? qualityScore >= 75 
          ? 'bg-green-500/10 border-green-500/30' 
          : qualityScore >= 50 
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-red-500/10 border-red-500/30'
        : isRequired 
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-slate-700/50 border-slate-600'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {qualityScore !== undefined ? (
            qualityScore >= 75 ? 
              <CheckCircle className="w-4 h-4 text-green-400" /> :
              qualityScore >= 50 ?
                <Minus className="w-4 h-4 text-yellow-400" /> :
                <XCircle className="w-4 h-4 text-red-400" />
          ) : isRequired ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <div className="w-4 h-4" />
          )}
          <span className="text-sm text-white">{name}</span>
        </div>
        {qualityScore !== undefined && (
          <span className="text-sm font-medium">{qualityScore}%</span>
        )}
      </div>
    </div>
  );
}

interface ProgressDashboardProps {
  progress: number;
  quality: number;
  decisions: number;
  artifacts: number;
}

export function ProgressDashboard({ progress, quality, decisions, artifacts }: ProgressDashboardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Overall</span>
            <span className="text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Quality</span>
            <span className="text-white">{quality}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                quality >= 75 ? 'bg-green-500' : quality >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${quality}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{decisions}</div>
            <div className="text-xs text-slate-400">Decisions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{artifacts}</div>
            <div className="text-xs text-slate-400">Artifacts</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default {
  MetricCard,
  TimerDisplay,
  PhasePanel,
  ActionCard,
  StakeholderCard,
  ArtifactCard,
  ProgressDashboard,
};