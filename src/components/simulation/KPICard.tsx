import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPI {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    color: 'green' | 'red' | 'yellow';
  };
  status: 'critical' | 'warning' | 'good';
  goal?: string;
  progress?: number;
}

interface KPICardProps {
  kpi: KPI;
  compact?: boolean;
}

const getStatusColor = (status: KPI['status']) => {
  switch (status) {
    case 'critical':
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    case 'warning':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 'good':
      return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
  }
};

const getProgressColor = (percentage: number) => {
  if (percentage <= 30) return 'bg-red-500';
  if (percentage <= 70) return 'bg-yellow-500';
  return 'bg-emerald-500';
};

export const KPICard: React.FC<KPICardProps> = ({ kpi, compact = false }) => {
  const percentage = Math.round((kpi.value / kpi.maxValue) * 100);

  if (compact) {
    return (
      <div className="flex items-center justify-between py-1">
        <span className="text-xs text-[#a1a1aa]">{kpi.label}</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getProgressColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`text-xs font-mono ${kpi.status === 'critical' ? 'text-red-400' : kpi.status === 'warning' ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor(kpi.status)}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
          {kpi.label}
        </span>
        {kpi.trend && (
          <div className={`flex items-center gap-1 text-xs ${
            kpi.trend.color === 'green' ? 'text-emerald-400' :
            kpi.trend.color === 'red' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {kpi.trend.direction === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : kpi.trend.direction === 'down' ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {kpi.trend.value}
          </div>
        )}
      </div>
      
      <div className="text-2xl font-mono font-bold mb-2">
        {kpi.value}{kpi.maxValue === 100 ? '%' : ''}
      </div>
      
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {kpi.goal && (
        <div className="text-xs text-[#a1a1aa]">{kpi.goal}</div>
      )}
    </div>
  );
};

export default KPICard;