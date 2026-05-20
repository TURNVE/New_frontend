import SimulationShell from '../../shared/simulation/SimulationShell';
import { SWIFTPAY_FAILED_TRANSFER_CONFIG } from './configs';

export default function SwiftPayFailedTransferSimulation() {
    return <SimulationShell config={SWIFTPAY_FAILED_TRANSFER_CONFIG} />;
}
