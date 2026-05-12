/**
 * KPIDashboard - Real-time KPI cards showing simulation metrics
 */

import { TrendingUp, TrendingDown, Minus, DollarSign, Clock, Users, Heart, Shield } from 'lucide-react';
import { KPIState } from '../data/novaPayConfig';

interface KPIDashboardProps {
  kpis: KPIState;
  currentWeek: number;
  totalWeeks: number;
}

interface KPICardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status: 'good' | 'warning' | 'critical';
}

function KPICard({ label, value, subValue, icon, trend, trendValue, status }: KPICardProps) {
  const statusColors = {
    good: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    warning: 'bg-primary/10 border-primary/20 text-primary',
    critical: 'bg-rose-500/10 border-rose-500/20 text-rose-500'
  };

  const colorsClass = statusColors[status];
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="p-4 rounded-2xl bg-card border border-border shadow-sm group hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorsClass.split(' ').slice(0, 2).join(' ')}`}>
          {icon}
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${colorsClass.split(' ').pop()}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-foreground">{value}</span>
        {subValue && <span className="text-[10px] font-medium text-muted-foreground">{subValue}</span>}
      </div>
    </div>
  );
}

export function KPIDashboard({ kpis, currentWeek, totalWeeks }: KPIDashboardProps) {
  const budgetUsed = Math.round(((kpis.initialBudget - kpis.budget) / kpis.initialBudget) * 100);
  const budgetLeft = kpis.budget;
  const progressPercent = Math.round((currentWeek / totalWeeks) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Live Metrics</h3>
        <span className="text-[10px] font-medium text-muted-foreground">Real-time updates</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Budget */}
        <KPICard
          label="Budget"
          value={`$${(budgetLeft / 1000).toFixed(0)}K`}
          subValue={`${budgetUsed}% used`}
          icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
          trend={budgetUsed < 70 ? 'stable' : 'down'}
          trendValue={budgetUsed < 70 ? 'On track' : 'Tight'}
          status={budgetUsed < 70 ? 'good' : budgetUsed < 85 ? 'warning' : 'critical'}
        />

        {/* Progress */}
        <KPICard
          label="Progress"
          value={`${progressPercent}%`}
          subValue={`Week ${currentWeek} of ${totalWeeks}`}
          icon={<Clock className="w-4 h-4 text-blue-500" />}
          trend="up"
          trendValue={`${totalWeeks - currentWeek} wks left`}
          status="good"
        />

        {/* Team Morale */}
        <KPICard
          label="Team Morale"
          value={`${Math.round(kpis.teamMorale)}%`}
          subValue="Engineering team"
          icon={<Users className={`w-4 h-4 ${kpis.teamMorale > 60 ? 'text-emerald-500' : 'text-primary'}`} />}
          trend={kpis.teamMorale > 60 ? 'up' : 'down'}
          trendValue={kpis.teamMorale > 60 ? 'Healthy' : 'Needs attention'}
          status={kpis.teamMorale > 70 ? 'good' : kpis.teamMorale > 50 ? 'warning' : 'critical'}
        />

        {/* Stakeholder Trust */}
        <KPICard
          label="Stakeholder Trust"
          value={`${Math.round(kpis.stakeholderTrust)}%`}
          subValue="CEO + team trust"
          icon={<Heart className={`w-4 h-4 ${kpis.stakeholderTrust > 60 ? 'text-emerald-500' : 'text-primary'}`} />}
          trend={kpis.stakeholderTrust > 50 ? 'up' : 'down'}
          trendValue={kpis.stakeholderTrust > 70 ? 'Strong' : 'Building'}
          status={kpis.stakeholderTrust > 70 ? 'good' : kpis.stakeholderTrust > 50 ? 'warning' : 'critical'}
        />
      </div>

      {/* Risk indicator */}
      <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Risk Assessment</span>
          </div>
          <span className={`text-xs font-bold ${kpis.riskLevel < 30 ? 'text-emerald-500' : kpis.riskLevel < 60 ? 'text-primary' : 'text-rose-500'}`}>
            {kpis.riskLevel < 30 ? 'Low' : kpis.riskLevel < 60 ? 'Medium' : 'High'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              kpis.riskLevel < 30 ? 'bg-emerald-500' : kpis.riskLevel < 60 ? 'bg-primary' : 'bg-rose-500'
            }`}
            style={{ width: `${kpis.riskLevel}%` }}
          />
        </div>
      </div>
    </div>
  );
}
  );
}