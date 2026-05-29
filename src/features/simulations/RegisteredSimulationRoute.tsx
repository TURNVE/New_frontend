import { Navigate, useParams } from 'react-router-dom';
import SimulationShell from '../../shared/simulation/SimulationShell';
import { getSimulationConfig } from './index';

export default function RegisteredSimulationRoute() {
    const { simulationId } = useParams();
    const config = simulationId ? getSimulationConfig(simulationId) : undefined;

    if (!config) {
        return <Navigate to="/simulations" replace />;
    }

    return <SimulationShell config={config} />;
}
