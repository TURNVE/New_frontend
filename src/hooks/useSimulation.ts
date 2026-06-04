import { useEffect, useState, useCallback } from 'react';
import useSimulationCore from '../shared/simulation/useSimulationCore';
import type { SimulationConfig, GameStateSnapshot } from '../shared/simulation/types';
import { supabase } from '../lib/supabase';

export function useSimulation(config: SimulationConfig) {
    const [initialState, setInitialState] = useState<GameStateSnapshot | null>(() => {
        if (typeof window === 'undefined') return null;
        try {
            const cached = window.localStorage.getItem(`turnve_sim_state_${config.id}`);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });

    const core = useSimulationCore(config, initialState);

    // Persist to local storage and Supabase when gameState changes
    useEffect(() => {
        if (!core.gameState) return;

        const stateStr = JSON.stringify(core.gameState);
        window.localStorage.setItem(`turnve_sim_state_${config.id}`, stateStr);

        // Sync with Supabase in the background if authenticated
        const syncSession = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Check if session exists in DB or insert/update
                const { data: existing } = await supabase
                    .from('simulation_sessions')
                    .select('id')
                    .eq('id', core.gameState.sessionId)
                    .maybeSingle();

                if (existing) {
                    await supabase
                        .from('simulation_sessions')
                        .update({
                            state: core.gameState,
                            status: core.isCompleted ? 'completed' : 'active',
                            current_week: core.gameState.week,
                            current_phase: core.gameState.week.toString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', core.gameState.sessionId);
                } else {
                    await supabase
                        .from('simulation_sessions')
                        .insert({
                            id: core.gameState.sessionId,
                            user_id: user.id,
                            scenario_key: config.id,
                            status: core.isCompleted ? 'completed' : 'active',
                            current_week: core.gameState.week,
                            total_weeks: config.totalWeeks,
                            current_phase: core.gameState.week.toString(),
                            state: core.gameState,
                            started_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        });
                }
            } catch (err) {
                console.error('Failed to sync simulation state to database:', err);
            }
        };

        // Debounce database sync to avoid spamming on timer ticks
        const timer = setTimeout(syncSession, 2000);
        return () => clearTimeout(timer);
    }, [core.gameState, core.isCompleted, config.id, config.totalWeeks]);

    // Handle restart or clear
    const restartSimulation = useCallback(() => {
        window.localStorage.removeItem(`turnve_sim_state_${config.id}`);
        core.restartSimulation();
    }, [core, config.id]);

    return {
        ...core,
        restartSimulation,
    };
}

export default useSimulation;
