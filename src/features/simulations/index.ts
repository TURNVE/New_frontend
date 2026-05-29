/**
 * Simulation Catalogue Index
 *
 * Add new simulations here. This is the ONLY place the router
 * and SimulationsPage need to read from to discover all simulations.
 * Never import individual configs everywhere — import this index.
 */

import { PAYLINK_CONFIG } from '../sim-pm-001-paylink/config';
import { SHOPEASE_CONFIG } from '../sim-pm-002-shopease/config';
import { TECHCORE_CONFIG } from '../sim-pm-003-techcore/config';
import { NEWWAVE_CONFIG } from '../sim-pm-004-newwave/config';
import { FINTECH_PM_SIMULATIONS } from '../sim-pm-fintech-track/configs';
import { INTERN_ONBOARDING_CONFIG } from '../sim-intern-onboarding/config';
import type { SimulationConfig } from '../../shared/simulation/types';

const FINTECH_PM_REGISTRY = Object.fromEntries(
    FINTECH_PM_SIMULATIONS.map((simulation) => [simulation.id, simulation])
) as Record<string, SimulationConfig>;

// ─── Registry ─────────────────────────────────────────────────
// To add a new simulation: add its config here and register a route in the router.
export const SIMULATION_REGISTRY: Record<string, SimulationConfig> = {
    'sim-pm-001': PAYLINK_CONFIG,
    'sim-pm-002': SHOPEASE_CONFIG,
    'sim-pm-003': TECHCORE_CONFIG,
    'sim-pm-004': NEWWAVE_CONFIG,
    ...FINTECH_PM_REGISTRY,
    'sim-intern-001': INTERN_ONBOARDING_CONFIG,
};

// ─── Helpers ──────────────────────────────────────────────────
export function getSimulationConfig(id: string): SimulationConfig | undefined {
    return SIMULATION_REGISTRY[id];
}

export function getAllSimulations(): SimulationConfig[] {
    return Object.values(SIMULATION_REGISTRY);
}

export function getAllSimulationIds(): string[] {
    return Object.keys(SIMULATION_REGISTRY);
}
