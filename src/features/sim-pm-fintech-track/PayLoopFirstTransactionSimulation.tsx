import SimulationShell from '../../shared/simulation/SimulationShell';
import { PAYLOOP_FIRST_TRANSACTION_CONFIG } from './configs';

export default function PayLoopFirstTransactionSimulation() {
    return <SimulationShell config={PAYLOOP_FIRST_TRANSACTION_CONFIG} />;
}
