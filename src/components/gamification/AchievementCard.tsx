import React from 'react';
import { getIconComponent, getRarityColor, getRarityBgColor, Achievement as AchievementType } from './types';

interface AchievementCardProps {
  achievement: AchievementType;
  showProgress?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  showProgress = true,
}) => {
  const Icon = getIconComponent(achievement.icon);
  const rarityColor = getRarityColor(achievement.rarity);
  const bgClass = getRarityBgColor(achievement.rarity);

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${achievement.earned 
          ? 'border-opacity-100 shadow-lg' 
          : 'border-opacity-30 opacity-75 hover:opacity-100'
        }
      `}
      style={{ 
        borderColor: achievement.earned ? rarityColor : undefined,
        backgroundColor: achievement.earned ? `${rarityColor}10` : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div className={`p-3 rounded-full ${bgClass}`}>
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {achievement.name}
            </h3>
            <span 
              className="px-2 py-0.5 text-xs font-medium rounded-full"
              style={{ 
                backgroundColor: `${rarityColor}20`,
                color: rarityColor,
              }}
            >
              {achievement.rarity}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {achievement.description}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium" style={{ color: rarityColor }}>
              {achievement.points} pts
            </span>
            
            {achievement.earned && achievement.earnedAt && (
              <span className="text-xs text-gray-500">
                {new Date(achievement.earnedAt).toLocaleDateString()}
              </span>
            )}
            
            {!achievement.earned && showProgress && achievement.progress !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${achievement.progress}%`,
                      backgroundColor: rarityColor,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {achievement.progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!achievement.earned && (
        <div className="absolute inset-0 rounded-xl bg-gray-50/50" />
      )}
    </div>
  );
};

export default AchievementCard;