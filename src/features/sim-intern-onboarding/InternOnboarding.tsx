/**
 * Intern Onboarding Simulation — Page Entry Point
 *
 * This is a THIN component. All logic lives in SimulationShell.
 * To change intern onboarding behavior, edit:
 *   - src/features/sim-intern-onboarding/config.ts     (data/content)
 *   - src/features/sim-intern-onboarding/intern-content.ts  (detailed content)
 *   - src/shared/simulation/SimulationShell.tsx        (layout/logic)
 *   - src/shared/simulation/useSimulationCore.ts     (engine)
 */

import SimulationShell from '../../shared/simulation/SimulationShell';
import { INTERN_ONBOARDING_CONFIG } from './config';

export default function InternOnboarding() {
    return <SimulationShell config={INTERN_ONBOARDING_CONFIG} />;
}