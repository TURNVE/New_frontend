import React from 'react';
import { Bell, Search, User, ChevronRight } from 'lucide-react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface SimulationShellProps {
  userName: string;
  children: React.ReactNode;
  unreadNotifications?: number;
  currentWeek?: number;
  totalWeeks?: number;
  weekChangeOverlay?: boolean;
}

export function SimulationShell({
  userName,
  children,
  unreadNotifications = 0,
  currentWeek = 1,
  totalWeeks = 12,
  weekChangeOverlay = false,
}: SimulationShellProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetingText = `${greeting}, ${userName}. Here's what needs your attention this week.`;
  const weekChangeText = `Week ${currentWeek} of ${totalWeeks} — ${totalWeeks - currentWeek} weeks remaining`;

  const { displayedText: titleText } = useTypingEffect('PM Workspace', { speed: 40, delay: 200 });
  const { displayedText: greetingDisplayed } = useTypingEffect(greetingText, { speed: 25, delay: 300 });
  const { displayedText: weekOverlayText } = useTypingEffect(weekChangeText, {
    speed: 30,
    delay: 500,
    enabled: weekChangeOverlay,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white min-h-[1.75rem]">{titleText}</h1>
            <p className="text-sm text-slate-400 min-h-[1.25rem]">{greetingDisplayed}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <div className="relative">
              <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
            <button className="flex items-center gap-2 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700" aria-label="User profile">
              <User className="w-5 h-5" />
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {weekChangeOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl max-w-md text-center">
            <div className="text-6xl font-bold text-blue-400 mb-4">{currentWeek}</div>
            <h2 className="text-xl font-semibold text-white mb-2">Week {currentWeek}</h2>
            <p className="text-slate-400 min-h-[1.5rem]">{weekOverlayText}</p>
          </div>
        </div>
      )}

      <main className="p-6">{children}</main>
    </div>
  );
}

export default SimulationShell;
