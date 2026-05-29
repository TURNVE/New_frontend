import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, Target, 
  AlertTriangle, CheckCircle, Clock, DollarSign,
  Users, Shield, BarChart3
} from 'lucide-react';
import type { MetricData } from '../../pmtools/types';
import { generateMetricsFromGameState } from '../../pmtools/types';

interface MetricsPanelProps {
  gameState?: {
    week: number;
    budget: number;
    initialBudget: number;
    progress: number;
    teamMorale: number;
    riskLevel: number;
    stakeholderTrust: number;
    metrics?: { velocity: number; quality: number; engagement: number };
  };
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ gameState }) => {
  const metrics = gameState ? generateMetricsFromGameState(gameState) : [];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 1) return 'text-emerald-400';
    if (ratio >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Key Metrics</h2>
            <p className="text-xs text-[#a1a1aa]">Real-time KPI tracking</p>
          </div>
          <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
            Week {gameState?.week || 1}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#a1a1aa]">{metric.name}</span>
              {getTrendIcon(metric.trend)}
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(metric.value, metric.target)}`}>
              {metric.value}{metric.unit}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-[#a1a1aa]">
              <Target className="w-3 h-3" />
              <span>Target: {metric.target}{metric.unit}</span>
            </div>
            {/* Mini Sparkline */}
            <div className="mt-2 h-6 flex items-end gap-1">
              {metric.history.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${
                    metric.trend === 'up' ? 'bg-emerald-500/50' :
                    metric.trend === 'down' ? 'bg-red-500/50' : 'bg-gray-500/50'
                  }`}
                  style={{ height: `${(h.value / Math.max(...metric.history.map(m => m.value))) * 100}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Detailed Breakdown</h3>
        
        <div className="space-y-3">
          {/* Velocity */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Development Velocity
              </span>
              <span className="text-sm text-emerald-400">Good</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[65%]" />
            </div>
            <div className="text-xs text-[#a1a1aa] mt-1">65% of sprint capacity used</div>
          </div>

          {/* Quality */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Code Quality
              </span>
              <span className="text-sm text-emerald-400">Excellent</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%]" />
            </div>
            <div className="text-xs text-[#a1a1aa] mt-1">85% test coverage</div>
          </div>

          {/* Team */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Team Engagement
              </span>
              <span className="text-sm text-yellow-400">Moderate</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[72%]" />
            </div>
            <div className="text-xs text-[#a1a1aa] mt-1">72% active participation</div>
          </div>

          {/* Risks */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Active Risks
              </span>
              <span className="text-sm text-yellow-400">3</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-[#a1a1aa] flex justify-between">
                <span>Budget overrun</span>
                <span className="text-yellow-400">Medium</span>
              </div>
              <div className="text-xs text-[#a1a1aa] flex justify-between">
                <span>Timeline slip</span>
                <span className="text-yellow-400">Low</span>
              </div>
              <div className="text-xs text-[#a1a1aa] flex justify-between">
                <span>Resource gap</span>
                <span className="text-yellow-400">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-xs text-[#a1a1aa] text-center">
          Last updated: Just now
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;