import type React from 'react';

interface SkillRadarProps {
  skills: Record<string, number>;
  size?: number;
  className?: string;
}

const SKILL_COLORS = {
  leadership: '#3B82F6',
  communication: '#10B981',
  problemSolving: '#F59E0B',
  strategicThinking: '#8B5CF6',
  riskManagement: '#EF4444',
  decisionMaking: '#06B6D4',
  timeManagement: '#84CC16',
  teamBuilding: '#EC4899',
};

const formatSkillLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const SkillRadar: React.FC<SkillRadarProps> = ({
  skills,
  size = 300,
  className = '',
}) => {
  const skillEntries = Object.entries(skills);
  const numSkills = skillEntries.length;
  
  if (numSkills === 0) {
    return (
      <div className={`flex items-center justify-center text-gray-400 ${className}`}>
        No skills data available
      </div>
    );
  }

  const center = size / 2;
  const radius = (size - 60) / 2;
  const angleStep = (2 * Math.PI) / numSkills;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number): { x: number; y: number } => {
    const angle = startAngle + index * angleStep;
    const normalizedValue = value / 100;
    const r = radius * normalizedValue;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = skillEntries
    .map(([, value], index) => {
      const point = getPoint(index, value);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = skillEntries
      .map((_, index) => {
        const point = getPoint(index, level);
        return `${point.x},${point.y}`;
      })
      .join(' ');
    return points;
  });

  return (
    <div className={className}>
      <svg
        role="img"
        aria-label="Skill radar chart showing proficiency levels across different skills"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
      >
        <title>Skill Radar Chart</title>
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
          </radialGradient>
        </defs>

        {gridPolygons.map((points, index) => (
          <polygon
            key={`grid-${index}`}
            points={points}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}

        {skillEntries.map(([, value], index) => {
          const point = getPoint(index, value);
          const angle = startAngle + index * angleStep;
          const labelRadius = radius + 25;
          const labelX = center + labelRadius * Math.cos(angle);
          const labelY = center + labelRadius * Math.sin(angle);

          return (
            <g key={`label-${index}`}>
              <line
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-gray-600 dark:fill-gray-400 font-medium"
              >
                {formatSkillLabel(skillEntries[index][0])}
              </text>
              <text
                x={labelX}
                y={labelY + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[9px] fill-gray-400"
              >
                {value}%
              </text>
            </g>
          );
        })}

        <polygon
          points={polygonPoints}
          fill="url(#radarGradient)"
          stroke="#3B82F6"
          strokeWidth={2}
        />

        {skillEntries.map(([, value], index) => {
          const point = getPoint(index, value);
          const skillKey = skillEntries[index][0];
          const color = SKILL_COLORS[skillKey as keyof typeof SKILL_COLORS] || '#3B82F6';

          return (
            <circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth={2}
            />
          );
        })}

        <circle
          cx={center}
          cy={center}
          r={3}
          fill="#9CA3AF"
        />
      </svg>
    </div>
  );
};

interface SkillRadarLegendProps {
  skills: Record<string, number>;
  className?: string;
}

export const SkillRadarLegend: React.FC<SkillRadarLegendProps> = ({
  skills,
  className = '',
}) => {
  const skillEntries = Object.entries(skills).sort(([, a], [, b]) => b - a);

  return (
    <div className={`space-y-2 ${className}`}>
      {skillEntries.map(([key, value]) => {
        const color = SKILL_COLORS[key as keyof typeof SKILL_COLORS] || '#6B7280';
        
        return (
          <div key={key} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="flex-1 text-sm text-gray-600 dark:text-gray-400">
              {formatSkillLabel(key)}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {value}%
            </span>
          </div>
        );
      })}
    </div>
  );
};