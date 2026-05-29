import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { companyTemplateToSimulationConfig } from '../../lib/companySimulationConfig';
import { companySimulations, type CompanySimulation } from '../../lib/companySimulations';
import SimulationShell from '../../shared/simulation/SimulationShell';

export default function CompanySimulationRoute() {
  const { companySimulationId } = useParams();
  const [simulation, setSimulation] = useState<CompanySimulation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadSimulation() {
      if (!companySimulationId) {
        setIsLoading(false);
        return;
      }

      const nextSimulation = await companySimulations.getPublicById(companySimulationId);
      if (!isCurrent) return;

      setSimulation(nextSimulation);
      setIsLoading(false);
    }

    void loadSimulation();

    return () => {
      isCurrent = false;
    };
  }, [companySimulationId]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!simulation) {
    return <Navigate to="/simulations" replace />;
  }

  return <SimulationShell config={companyTemplateToSimulationConfig(simulation.template)} />;
}
