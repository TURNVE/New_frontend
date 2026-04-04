/**
 * PayLink Simulation — Page Entry Point
 *
 * This is a THIN component. All logic lives in SimulationShell.
 * To change PayLink's behaviour, edit:
 *   - src/features/sim-pm-001-paylink/config.ts  (data/content)
 *   - src/shared/simulation/SimulationShell.tsx   (layout/logic)
 *   - src/shared/simulation/useSimulationCore.ts  (engine)
 */

import SimulationShell from '../../shared/simulation/SimulationShell';
import { PAYLINK_CONFIG } from './config';

export default function PayLinkSimulation() {
    return <SimulationShell config={PAYLINK_CONFIG} />;
}
