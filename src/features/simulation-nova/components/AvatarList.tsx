/**
 * AvatarList - Sidebar showing 5 avatar stakeholders
 */

import { MessageSquare } from 'lucide-react';
import { AvatarId, getAllAvatars } from '../data/novaPayAvatars';

interface AvatarListProps {
  selectedAvatarId: AvatarId | null;
  onSelectAvatar: (id: AvatarId) => void;
  unreadCounts?: Record<AvatarId, number>;
}

export function AvatarList({ selectedAvatarId, onSelectAvatar, unreadCounts = {} }: AvatarListProps) {
  const avatars = getAllAvatars();

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest px-3 mb-4">
        Stakeholders
      </div>
      
      {avatars.map(avatar => {
        const isSelected = selectedAvatarId === avatar.id;
        const unread = unreadCounts[avatar.id] || 0;

        return (
          <button
            key={avatar.id}
            onClick={() => onSelectAvatar(avatar.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
              isSelected 
                ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                : 'hover:bg-secondary/50 border border-transparent'
            }`}
          >
            {/* Avatar Circle */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm"
              style={{ 
                background: avatar.bgColor,
                color: avatar.color
              }}
            >
              {avatar.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold truncate ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {avatar.name}
                </span>
                {unread > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground shadow-sm">
                    {unread}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-muted-foreground/70 truncate">{avatar.role}</p>
            </div>

            {/* Chat icon */}
            <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground/30 group-hover:text-muted-foreground/50'}`} />
          </button>
        );
      })}
    </div>
  );
}