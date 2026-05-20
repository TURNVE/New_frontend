import SimulationShell from '../../shared/simulation/SimulationShell';
import { VERICASH_KYC_CONFIG } from './configs';

export default function VeriCashKycSimulation() {
    return <SimulationShell config={VERICASH_KYC_CONFIG} />;
}
