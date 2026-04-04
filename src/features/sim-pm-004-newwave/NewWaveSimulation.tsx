import SimulationShell from '../../shared/simulation/SimulationShell';
import { NEWWAVE_CONFIG } from './config';

export default function NewWaveSimulation() {
    return <SimulationShell config={NEWWAVE_CONFIG} />;
}
