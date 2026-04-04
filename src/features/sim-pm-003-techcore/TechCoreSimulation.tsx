import SimulationShell from '../../shared/simulation/SimulationShell';
import { TECHCORE_CONFIG } from './config';

export default function TechCoreSimulation() {
    return <SimulationShell config={TECHCORE_CONFIG} />;
}
