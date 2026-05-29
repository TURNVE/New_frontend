import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, TrendingUp, TrendingDown, Minus, AlertTriangle, 
  CheckCircle, Clock, DollarSign, Users, Shield, Target
} from 'lucide-react';
import { GameState, ScoreResult, Stakeholder } from '../../simulation/core/SimulationEngine';

interface MetricsPanelProps {
  gameState: GameState;
  score: ScoreResult | null;
}

const MetricItem = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue',
  format = 'number'
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'stable';
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'violet';
  format?: 'number' | 'percent' | 'currency';
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    violet: 'bg-violet-50 text-violet-600'
  };

  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const formatValue = (val: number) => {
    if (format === 'percent') return `${Math.round(val)}%`;
    if (format === 'currency') return `$${val.toLocaleString()}K`;
    return val.toLocaleString();
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-lg font-bold text-gray-900">{formatValue(value)}</p>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export function MetricsPanel({ gameState, score }: MetricsPanelProps) {
  const budgetPercent = gameState.initialBudget > 0 
    ? (gameState.budget / gameState.initialBudget) * 100 
    : 100;

  const budgetTrend = budgetPercent > 80 ? 'up' : budgetPercent > 50 ? 'stable' : 'down';
  const moraleTrend = gameState.teamMorale > 70 ? 'up' : gameState.teamMorale > 40 ? 'stable' : 'down';
  const riskTrend = gameState.riskLevel < 0.3 ? 'up' : gameState.riskLevel < 0.6 ? 'stable' : 'down';

  return (
    <div className="space-y-4">
      {/* Week & Score Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 opacity-80" />
          <div>
            <p className="text-xs opacity-80">Week</p>
            <p className="text-2xl font-bold">{gameState.week} <span className="text-lg font-normal opacity-80">/ {gameState.totalWeeks}</span></p>
          </div>
        </div>
        {score && (
          <div className="text-right">
            <p className="text-xs opacity-80">Score</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{score.overall}</span>
              <span className={`text-lg font-bold px-2 py-0.5 rounded ${
                score.grade === 'A' ? 'bg-emerald-500' :
                score.grade === 'B' ? 'bg-blue-500' :
                score.grade === 'C' ? 'bg-amber-500' : 'bg-red-500'
              }`}>{score.grade}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Project Progress</span>
          <span className="text-sm font-bold text-gray-900">{Math.round(gameState.progress)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${gameState.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-2">
        <MetricItem 
          label="Budget"
          value={gameState.budget}
          icon={DollarSign}
          trend={budgetTrend}
          color="emerald"
          format="currency"
        />
        <MetricItem 
          label="Team Morale"
          value={gameState.teamMorale}
          icon={Users}
          trend={moraleTrend}
          color={gameState.teamMorale > 60 ? 'emerald' : gameState.teamMorale > 30 ? 'amber' : 'red'}
          format="percent"
        />
        <MetricItem 
          label="Risk Level"
          value={gameState.riskLevel * 100}
          icon={Shield}
          trend={riskTrend}
          color={gameState.riskLevel < 0.3 ? 'emerald' : gameState.riskLevel < 0.6 ? 'amber' : 'red'}
          format="percent"
        />
        <MetricItem 
          label="Stakeholder Trust"
          value={gameState.stakeholderTrust}
          icon={Target}
          color="violet"
          format="percent"
        />
      </div>

      {/* Score Breakdown */}
      {score && (
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Score Breakdown</h4>
          <div className="space-y-2">
            {[
              { label: 'Execution', value: score.execution, color: 'bg-blue-500' },
              { label: 'Risk Management', value: score.riskManagement, color: 'bg-emerald-500' },
              { label: 'Stakeholder', value: score.stakeholderManagement, color: 'bg-violet-500' },
              { label: 'Budget', value: score.budgetManagement, color: 'bg-amber-500' },
              { label: 'Team Leadership', value: score.teamLeadership, color: 'bg-rose-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-28">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className={`h-full ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-10 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricsPanel;