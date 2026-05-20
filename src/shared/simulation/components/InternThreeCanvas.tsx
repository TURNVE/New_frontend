import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { WeeklyActionItem } from '../types';
import {
    getVisibleActionIds,
    STAGE_NODES,
    type InternThreeStageProps,
    type StageNodeConfig,
    type StageNodeKind,
} from './internStageModel';

function useIsDarkMode() {
    const [isDark, setIsDark] = useState(() =>
        typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
    );

    useEffect(() => {
        const root = document.documentElement;
        const observer = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

function StageObject({
    node,
    action,
    isCompleted,
    isUnlocked,
    isDark,
    onOpenAction,
}: {
    node: StageNodeConfig;
    action?: WeeklyActionItem;
    isCompleted: boolean;
    isUnlocked: boolean;
    isDark: boolean;
    onOpenAction: (action: WeeklyActionItem) => void;
}) {
    const groupRef = useRef<Group>(null);
    const [hovered, setHovered] = useState(false);
    const clickable = Boolean(action && isUnlocked);
    const primary = isDark ? node.darkColor : node.color;
    const muted = isDark ? '#3f4554' : '#d8dee9';
    const objectColor = isCompleted ? '#22c55e' : clickable ? primary : muted;

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        groupRef.current.position.y = node.position[1] + Math.sin(clock.elapsedTime * 1.8 + node.position[0]) * 0.035;
        groupRef.current.rotation.y = hovered && clickable ? Math.sin(clock.elapsedTime * 3) * 0.08 : 0;
    });

    const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setHovered(true);
        if (clickable) document.body.style.cursor = 'pointer';
    };

    const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setHovered(false);
        document.body.style.cursor = '';
    };

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        if (action && clickable) onOpenAction(action);
    };

    return (
        <group
            ref={groupRef}
            position={node.position}
            scale={hovered && clickable ? 1.08 : 1}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            <ObjectGeometry kind={node.kind} color={objectColor} accent={node.accent} isDark={isDark} isCompleted={isCompleted} isUnlocked={isUnlocked} />
            {clickable && (
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.54, 0.68, 48]} />
                    <meshStandardMaterial color={objectColor} transparent opacity={hovered ? 0.34 : 0.18} />
                </mesh>
            )}
        </group>
    );
}

function ObjectGeometry({
    kind,
    color,
    accent,
    isDark,
    isCompleted,
    isUnlocked,
}: {
    kind: StageNodeKind;
    color: string;
    accent: string;
    isDark: boolean;
    isCompleted: boolean;
    isUnlocked: boolean;
}) {
    const metalness = isCompleted ? 0.18 : 0.08;
    const roughness = isDark ? 0.42 : 0.54;
    const opacity = isUnlocked ? 1 : 0.45;

    if (kind === 'letter') {
        return (
            <group>
                <mesh position={[0, 0.08, 0]} rotation={[0, -0.25, 0]}>
                    <boxGeometry args={[0.92, 0.12, 0.58]} />
                    <meshStandardMaterial color={color} transparent opacity={opacity} metalness={metalness} roughness={roughness} />
                </mesh>
                <mesh position={[0, 0.18, -0.03]} rotation={[0, -0.25, 0.55]}>
                    <boxGeometry args={[0.42, 0.06, 0.55]} />
                    <meshStandardMaterial color={accent} transparent opacity={opacity} roughness={roughness} />
                </mesh>
            </group>
        );
    }

    if (kind === 'pm') {
        return (
            <group>
                <mesh position={[0, 0.16, 0]}>
                    <boxGeometry args={[1.0, 0.28, 0.62]} />
                    <meshStandardMaterial color={isDark ? '#334155' : '#e2e8f0'} transparent opacity={opacity} roughness={roughness} />
                </mesh>
                <mesh position={[0, 0.56, 0]}>
                    <sphereGeometry args={[0.28, 32, 24]} />
                    <meshStandardMaterial color={color} transparent opacity={opacity} metalness={metalness} roughness={roughness} />
                </mesh>
                <mesh position={[0, 0.28, 0]}>
                    <cylinderGeometry args={[0.22, 0.3, 0.36, 28]} />
                    <meshStandardMaterial color={accent} transparent opacity={opacity} roughness={roughness} />
                </mesh>
            </group>
        );
    }

    if (kind === 'calendar') {
        return (
            <group rotation={[0, -0.1, 0]}>
                <mesh position={[0, 0.42, 0]}>
                    <boxGeometry args={[0.86, 0.72, 0.08]} />
                    <meshStandardMaterial color={color} transparent opacity={opacity} metalness={metalness} roughness={roughness} />
                </mesh>
                {[[-0.23, 0.52], [0, 0.52], [0.23, 0.52], [-0.23, 0.28], [0, 0.28], [0.23, 0.28]].map(([x, y]) => (
                    <mesh key={`${x}-${y}`} position={[x, y, 0.055]}>
                        <boxGeometry args={[0.14, 0.11, 0.025]} />
                        <meshStandardMaterial color={accent} transparent opacity={opacity} roughness={roughness} />
                    </mesh>
                ))}
                <mesh position={[0, 0.04, 0]}>
                    <cylinderGeometry args={[0.14, 0.18, 0.18, 24]} />
                    <meshStandardMaterial color={isDark ? '#475569' : '#94a3b8'} transparent opacity={opacity} roughness={roughness} />
                </mesh>
            </group>
        );
    }

    if (kind === 'invite') {
        return (
            <group>
                <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.38, 0.075, 16, 48]} />
                    <meshStandardMaterial color={color} transparent opacity={opacity} metalness={0.15} roughness={roughness} />
                </mesh>
                <mesh position={[0, 0.42, 0]}>
                    <sphereGeometry args={[0.2, 32, 20]} />
                    <meshStandardMaterial color={accent} transparent opacity={opacity} roughness={roughness} />
                </mesh>
            </group>
        );
    }

    if (kind === 'team') {
        return (
            <group>
                {[[-0.34, -0.06], [0.02, 0.18], [0.38, -0.04]].map(([x, z], index) => (
                    <group key={index} position={[x, 0, z]}>
                        <mesh position={[0, 0.36, 0]}>
                            <sphereGeometry args={[0.18, 24, 18]} />
                            <meshStandardMaterial color={index === 1 ? color : accent} transparent opacity={opacity} roughness={roughness} />
                        </mesh>
                        <mesh position={[0, 0.11, 0]}>
                            <cylinderGeometry args={[0.12, 0.16, 0.22, 20]} />
                            <meshStandardMaterial color={isDark ? '#334155' : '#e2e8f0'} transparent opacity={opacity} roughness={roughness} />
                        </mesh>
                    </group>
                ))}
            </group>
        );
    }

    if (kind === 'meeting') {
        return (
            <group>
                <mesh position={[0, 0.46, 0]}>
                    <torusGeometry args={[0.42, 0.055, 16, 64]} />
                    <meshStandardMaterial color={color} emissive={isUnlocked ? color : '#000000'} emissiveIntensity={isUnlocked ? 0.25 : 0} transparent opacity={opacity} roughness={roughness} />
                </mesh>
                <mesh position={[0, 0.46, -0.025]}>
                    <circleGeometry args={[0.34, 48]} />
                    <meshStandardMaterial color={isDark ? '#111827' : '#dbeafe'} transparent opacity={opacity} roughness={roughness} />
                </mesh>
                <mesh position={[0, 0.03, 0]}>
                    <boxGeometry args={[0.62, 0.08, 0.28]} />
                    <meshStandardMaterial color={accent} transparent opacity={opacity} roughness={roughness} />
                </mesh>
            </group>
        );
    }

    if (kind === 'task') {
        return (
            <group rotation={[0, 0.18, 0]}>
                <mesh position={[0, 0.46, 0]}>
                    <boxGeometry args={[0.84, 0.68, 0.08]} />
                    <meshStandardMaterial color={isDark ? '#1e293b' : '#ffffff'} transparent opacity={opacity} roughness={roughness} />
                </mesh>
                {[[-0.2, 0.57], [0.18, 0.44], [-0.05, 0.29]].map(([x, y], index) => (
                    <mesh key={`${x}-${y}`} position={[x, y, 0.06]}>
                        <boxGeometry args={[0.26, 0.12, 0.025]} />
                        <meshStandardMaterial color={index === 1 ? color : accent} transparent opacity={opacity} roughness={roughness} />
                    </mesh>
                ))}
            </group>
        );
    }

    return (
        <group>
            <mesh position={[0, 0.32, 0]}>
                <cylinderGeometry args={[0.24, 0.32, 0.42, 32]} />
                <meshStandardMaterial color={color} metalness={0.28} roughness={roughness} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.68, 0]}>
                <sphereGeometry args={[0.34, 32, 18]} />
                <meshStandardMaterial color={accent} metalness={0.32} roughness={roughness} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.42, 0.46, 0.12, 32]} />
                <meshStandardMaterial color={isDark ? '#475569' : '#f8fafc'} roughness={roughness} transparent opacity={opacity} />
            </mesh>
        </group>
    );
}

function TechCorpOfficeScene({
    actions,
    completedIds,
    onOpenAction,
    isDark,
}: InternThreeStageProps & { isDark: boolean }) {
    const sceneRef = useRef<Group>(null);
    const actionMap = useMemo(() => new Map(actions.map((action) => [action.id, action])), [actions]);
    const visibleActionIds = useMemo(() => getVisibleActionIds(actions, completedIds), [actions, completedIds]);

    useFrame(({ clock }) => {
        if (!sceneRef.current) return;
        sceneRef.current.rotation.y = -0.35 + Math.sin(clock.elapsedTime * 0.28) * 0.08;
    });

    return (
        <>
            <ambientLight intensity={isDark ? 0.75 : 0.88} />
            <directionalLight position={[4, 8, 5]} intensity={isDark ? 1.65 : 1.4} />
            <pointLight position={[-4, 3, -2]} intensity={isDark ? 0.75 : 0.45} color={isDark ? '#a78bfa' : '#38bdf8'} />

            <group ref={sceneRef}>
                <mesh position={[0, -0.03, 0]} receiveShadow>
                    <boxGeometry args={[7.6, 0.08, 4.7]} />
                    <meshStandardMaterial color={isDark ? '#111827' : '#fff7ed'} roughness={0.68} />
                </mesh>
                <mesh position={[0, 0.03, -1.85]}>
                    <boxGeometry args={[7.6, 0.04, 0.08]} />
                    <meshStandardMaterial color={isDark ? '#334155' : '#fed7aa'} roughness={0.55} />
                </mesh>
                <mesh position={[-3.65, 0.03, 0]}>
                    <boxGeometry args={[0.08, 0.04, 4.7]} />
                    <meshStandardMaterial color={isDark ? '#334155' : '#bae6fd'} roughness={0.55} />
                </mesh>

                {STAGE_NODES.map((node) => {
                    const action = actionMap.get(node.actionId);
                    const isCompleted = completedIds.has(node.actionId);
                    const isUnlocked = visibleActionIds.has(node.actionId);
                    return (
                        <StageObject
                            key={node.actionId}
                            node={node}
                            action={action}
                            isCompleted={isCompleted}
                            isUnlocked={isUnlocked}
                            isDark={isDark}
                            onOpenAction={onOpenAction}
                        />
                    );
                })}
            </group>
        </>
    );
}

function WebGlFallback() {
    return (
        <div className="flex h-full min-h-[300px] items-center justify-center rounded-[28px] bg-white/80 p-6 text-center text-sm font-bold text-slate-600 dark:bg-white/[0.07] dark:text-slate-300">
            3D view is unavailable in this browser. Use the map view to continue.
        </div>
    );
}

export default function InternThreeCanvas({ actions, completedIds, onOpenAction }: InternThreeStageProps) {
    const isDark = useIsDarkMode();
    const visibleActionIds = useMemo(() => getVisibleActionIds(actions, completedIds), [actions, completedIds]);

    return (
        <>
            <Canvas
                shadows
                dpr={[1, 1.75]}
                camera={{ position: [4.8, 5.2, 6.2], fov: 44 }}
                gl={{ antialias: true, alpha: true }}
                fallback={<WebGlFallback />}
                onPointerMissed={() => {
                    document.body.style.cursor = '';
                }}
            >
                <TechCorpOfficeScene actions={actions} completedIds={completedIds} onOpenAction={onOpenAction} isDark={isDark} />
            </Canvas>
            <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/85 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-700 shadow-xl ring-1 ring-white/70 dark:bg-[#111318]/85 dark:text-slate-200 dark:ring-white/10">
                Interactive TechCorp office
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-2xl bg-slate-950/90 px-4 py-2 text-xs font-bold text-white shadow-xl dark:bg-white/90 dark:text-slate-950">
                Click glowing objects to act
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 hidden max-w-[58%] flex-wrap gap-1.5 sm:flex">
                {STAGE_NODES.map((node) => {
                    const action = actions.find((item) => item.id === node.actionId);
                    if (!action) return null;
                    const isCompleted = completedIds.has(node.actionId);
                    const status = isCompleted ? 'done' : visibleActionIds.has(node.actionId) ? 'open' : 'locked';
                    return (
                        <span
                            key={node.actionId}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                status === 'done'
                                    ? 'bg-emerald-500 text-white'
                                    : status === 'open'
                                        ? 'bg-white/90 text-slate-900 dark:bg-white dark:text-slate-950'
                                        : 'bg-white/45 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                            }`}
                        >
                            {node.label}
                        </span>
                    );
                })}
            </div>
        </>
    );
}
