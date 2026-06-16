import React, { useState, useEffect, useRef } from 'react';
import { SimulationEngine, type Scenario } from '../simulation/core/SimulationEngine';
import { ScenarioManager } from '../simulation/scenarios/ScenarioManager';
import PMConsole from '../components/simulation/PMConsole';

interface PMGameContainerProps {}

const PMGameContainer: React.FC<PMGameContainerProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(true);
  const simulationRef = useRef<SimulationEngine | null>(null);
  
  useEffect(() => {
    try {
      const scenarioManager = new ScenarioManager();
      const scenario = scenarioManager.getScenario('pm-simulation-scenario');
      
      if (scenario) {
        const gameState = scenarioManager.createGameStateFromScenario('pm-simulation-scenario');
        
        if (gameState) {
          const engine = new SimulationEngine(gameState as unknown as Scenario);
          simulationRef.current = engine;
          
          if (simulationRunning) {
            engine.start();
          }
          
          setIsLoading(false);
        } else {
          setError('Failed to initialize game state');
        }
      } else {
        setError('Failed to load simulation scenario');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [simulationRunning]);

  const toggleSimulation = () => {
    if (simulationRef.current) {
      if (simulationRunning) {
        simulationRef.current.stop();
      } else {
        simulationRef.current.start();
      }
      setSimulationRunning(!simulationRunning);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-red-500 bg-gray-800 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="simulation-container">
      <div className="controls mb-4 p-4 bg-gray-800 flex justify-end">
        <button
          onClick={toggleSimulation}
          className={`px-4 py-2 rounded-md ${
            simulationRunning 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {simulationRunning ? 'Pause Simulation' : 'Resume Simulation'}
        </button>
      </div>
      
      <PMConsole />
    </div>
  );
};

export default PMGameContainer;