import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Eye, MousePointer, DollarSign,
  Users, BarChart3, Target, Download, RefreshCw, CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MetaAdStats {
  campaignId: string;
  campaignName: string;
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  roas: number;
  frequency: number;
  engagementRate: number;
  adSets: {
    name: string;
    objective: string;
    impressions: number;
    engagement: number;
    clicks: number;
  }[];
  demographics: {
    age18_24: number;
    age25_34: number;
    age35_44: number;
    age45_plus: number;
  };
}

interface MetaAdsPanelProps {
  stats: MetaAdStats | null;
  onImportStats: () => void;
  isLoading?: boolean;
}

export const MetaAdsPanel = ({ stats, onImportStats, isLoading }: MetaAdsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'adsets' | 'demographics'>('overview');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatPercent = (num: number): string => {
    return num.toFixed(2) + '%';
  };

  const getTargetStatus = (value: number, target: number, type: 'higher' | 'lower' = 'higher') => {
    if (type === 'higher') {
      return value >= target ? (
        <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
          <CheckCircle className="w-3 h-3" aria-hidden="true" />
          Target: {target}
        </span>
      ) : (
        <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          Target: {target}
        </span>
      );
    }
    return value <= target ? (
      <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
        <CheckCircle className="w-3 h-3" aria-hidden="true" />
        Target: {target}
      </span>
    ) : (
      <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
        <AlertCircle className="w-3 h-3" aria-hidden="true" />
        Target: {target}
      </span>
    );
  };

  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Meta Ads Performance</h3>
              <p className="text-xs text-gray-500">Campaign analytics</p>
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-2">No Campaign Data</h4>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            Import your Meta campaign stats to see performance metrics and optimize your ads
          </p>
          <button
            onClick={onImportStats}
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Import Meta Stats
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const budgetPercent = Math.round((stats.spent / stats.budget) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">{stats.campaignName}</h3>
              <p className="text-blue-200 text-xs">{stats.objective}</p>
            </div>
          </div>
          <button
            onClick={onImportStats}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-blue-200">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Budget: {formatCurrency(stats.budget)}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Spent: {formatCurrency(stats.spent)} ({budgetPercent}%)
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700" role="tablist">
        <div className="flex">
          {(['overview', 'adsets', 'demographics'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Eye}
                label="Impressions"
                value={formatNumber(stats.impressions)}
                color="blue"
              />
              <MetricCard
                icon={Users}
                label="Reach"
                value={formatNumber(stats.reach)}
                color="violet"
              />
              <MetricCard
                icon={MousePointer}
                label="Clicks"
                value={formatNumber(stats.clicks)}
                color="green"
                trend={{
                  value: formatPercent(stats.ctr),
                  isGood: stats.ctr >= 1.5,
                  target: '1.5%'
                }}
              />
              <MetricCard
                icon={DollarSign}
                label="CPM"
                value={'$' + stats.cpm.toFixed(2)}
                color="amber"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <PerformanceCard
                label="ROAS"
                value={stats.roas.toFixed(1) + 'x'}
                target={2.5}
                type="higher"
                description="Return on ad spend"
              />
              <PerformanceCard
                label="CTR"
                value={formatPercent(stats.ctr)}
                target={1.5}
                type="higher"
                description="Click-through rate"
              />
              <PerformanceCard
                label="Engagement"
                value={formatPercent(stats.engagementRate)}
                target={8}
                type="higher"
                description="Engagement rate"
              />
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Frequency</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.frequency.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Cost per Click</span>
                <span className="font-medium text-gray-900 dark:text-white">${stats.cpc.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adsets' && (
          <div className="space-y-4">
            {stats.adSets.map((adSet, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{adSet.name}</h4>
                  <span className="text-xs text-gray-500">{adSet.objective}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Impressions</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatNumber(adSet.impressions)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Clicks</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatNumber(adSet.clicks)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Engagement</p>
                    <p className="font-medium text-green-500">{formatPercent(adSet.engagement)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'demographics' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Age 18-24', value: stats.demographics.age18_24, color: 'bg-blue-500' },
                { label: 'Age 25-34', value: stats.demographics.age25_34, color: 'bg-green-500' },
                { label: 'Age 35-44', value: stats.demographics.age35_44, color: 'bg-amber-500' },
                { label: 'Age 45+', value: stats.demographics.age45_plus, color: 'bg-purple-500' },
              ].map((demo) => (
                <div key={demo.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{demo.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{demo.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${demo.color} rounded-full transition-all`}
                      style={{ width: `${demo.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Gen Z Focus</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Your ad is reaching {stats.demographics.age18_24 + stats.demographics.age25_34}% of the 18-34 demographic - your target audience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
  trend
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'blue' | 'violet' | 'green' | 'amber';
  trend?: { value: string; isGood: boolean; target: string };
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    violet: 'bg-violet-500/10 text-violet-500',
    green: 'bg-green-500/10 text-green-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 ${trend.isGood ? 'text-green-500' : 'text-amber-500'}`}>
          {trend.isGood ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="text-xs">{trend.value}</span>
        </div>
      )}
    </div>
  );
}

function PerformanceCard({
  label,
  value,
  target,
  type,
  description
}: {
  label: string;
  value: string;
  target: number;
  type: 'higher' | 'lower';
  description: string;
}) {
  const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const isGood = type === 'higher' ? numValue >= target : numValue <= target;

  return (
    <div className={`p-4 rounded-lg border ${isGood ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        {isGood ? (
          <CheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <AlertCircle className="w-3 h-3 text-amber-500" />
        )}
      </div>
      <p className={`text-xl font-bold ${isGood ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">Target: {target}{type === 'higher' && '%'}</p>
      <p className="text-[10px] text-gray-400 mt-2">{description}</p>
    </div>
  );
}

export default MetaAdsPanel;