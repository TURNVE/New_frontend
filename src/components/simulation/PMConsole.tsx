import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface PMMetric {
  id: string;
  name: string;
  currentValue: number | string;
  targetValue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface PMStakeholder {
  id: string;
  name: string;
  role: string;
  satisfaction: number;
}

interface PMSignal {
  id: string;
  source: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface PMGameState {
  company: {
    name: string;
    mission: string;
    currentQuarter: number;
    totalScore: number;
  };
  product: {
    currentMetrics: PMMetric[];
  };
  signals: PMSignal[];
  stakeholders: PMStakeholder[];
}

const MOCK_PM_STATE: PMGameState = {
  company: { name: 'Acme Corp', mission: 'Deliver great products', currentQuarter: 1, totalScore: 0 },
  product: { currentMetrics: [] },
  signals: [],
  stakeholders: [],
};

interface PMConsoleProps {}

const PMConsole: React.FC<PMConsoleProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameState] = useState<PMGameState>(MOCK_PM_STATE);
  const [selectedDecision, setSelectedDecision] = useState<string>('');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleDecision = useCallback((decisionId: string) => {
    setSelectedDecision(decisionId);
    console.log(`Decision selected: ${decisionId}`);
    // In a real implmentation, this would send the decision to the simulation engine
  }, []);

  if (isLoading || !gameState) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white">Initializing simulation...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{gameState.company.name} - Product Management Simulator</h1>
          <p className="text-gray-300">{gameState.company.mission}</p>
          <div className="mt-2 text-sm text-gray-400">
            Quarter {gameState.company.currentQuarter} | Score: {gameState.company.totalScore}
          </div>
        </header>

        {/* Metrics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {gameState.product.currentMetrics.map(metric => (
            <div key={metric.id} className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="font-semibold text-lg">{metric.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-2xl font-bold">
                  {typeof metric.currentValue === 'number' ? metric.currentValue.toFixed(1) : metric.currentValue}
                  {metric.id.includes('rate') || metric.id.includes('completion') ? '%' : ''}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  metric.trend === 'increasing' ? 'bg-green-900 text-green-300' :
                  metric.trend === 'decreasing' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {metric.trend}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Target: {metric.targetValue}{(metric.id.includes('rate') || metric.id.includes('completion')) ? '%' : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Signals Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Signals Received</h3>
              {gameState.signals.length > 0 ? (
                <div className="space-y-3">
                  {gameState.signals.map(signal => (
                    <div 
                      key={signal.id} 
                      className={`p-3 rounded border-l-4 ${
                        signal.priority === 'high' ? 'border-red-500 bg-red-900/20' :
                        signal.priority === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                        'border-gray-500 bg-gray-700/50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{signal.source}</span>
                        <span className="text-sm text-gray-400">{new Date(signal.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="mt-1">{signal.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No active signals</p>
              )}
            </div>

            {/* Available Actions */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Decisions to Make</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  onClick={() => handleDecision('investigate-onboarding')}
                  className={`p-4 rounded-lg text-left transition ${
                    selectedDecision === 'investigate-onboarding' 
                      ? 'bg-blue-600 border-2 border-blue-400' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h4 className="font-medium">Investigate Onboarding</h4>
                  <p className="text-sm text-gray-300 mt-1">Review user session data and conduct customer interviews</p>
                </button>
                
                <button 
                  onClick={() => handleDecision('add-new-feature')}
                  className={`p-4 rounded-lg text-left transition ${
                    selectedDecision === 'add-new-feature' 
                      ? 'bg-blue-600 border-2 border-blue-400' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h4 className="font-medium">Add New Feature</h4>
                  <p className="text-sm text-gray-300 mt-1">Implement feature requested by Sales team</p>
                </button>
                
                <button 
                  onClick={() => handleDecision('ignore-issue')}
                  className={`p-4 rounded-lg text-left transition ${
                    selectedDecision === 'ignore-issue' 
                      ? 'bg-blue-600 border-2 border-blue-400' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h4 className="font-medium">Monitor Situation</h4>
                  <p className="text-sm text-gray-300 mt-1">Continue observing metrics before taking action</p>
                </button>
                
                <button 
                  onClick={() => handleDecision('team-meeting')}
                  className={`p-4 rounded-lg text-left transition ${
                    selectedDecision === 'team-meeting' 
                      ? 'bg-blue-600 border-2 border-blue-400' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h4 className="font-medium">Hold Team Meeting</h4>
                  <p className="text-sm text-gray-300 mt-1">Discuss issues with Design and Engineering</p>
                </button>
              </div>
            </div>
          </div>

          {/* Stakeholders Panel */}
          <div>
            <h2 className="text-xl font-bold mb-4">Key Stakeholders</h2>
            <div className="space-y-3">
              {gameState.stakeholders.slice(0, 5).map((stakeholder, index) => (
                <div key={`${stakeholder.id}-${index}`} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{stakeholder.name}</h3>
                      <p className="text-sm text-gray-400">{stakeholder.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded mr-2">Needs attention</span>
                    <span className="text-xs text-gray-400">Sat: {stakeholder.satisfaction}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Summary */}
            <div className="mt-6 bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Quarter Forecast</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Activation Rate:</span>
                  <span>{gameState.product.currentMetrics[0].currentValue}% &rarr; Predicted 36%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Revenue Impact:</span>
                  <span className="text-red-400">Below Target</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risk Level:</span>
                  <span className="text-orange-400">Medium-High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMConsole;