/**
 * CalendarPanel — Shows team availability and meeting management
 * Used in Intern Onboarding simulation
 */

import { useState } from 'react';
import { 
    Calendar, 
    Clock, 
    Users, 
    Check, 
    X, 
    ChevronRight,
    Bell,
    Video,
    MapPin
} from 'lucide-react';
import type { CalendarSlot } from '../../features/sim-intern-onboarding/intern-content';

interface CalendarPanelProps {
    slots: CalendarSlot[];
    onAcceptMeeting?: (slotId: string) => void;
    onDeclineMeeting?: (slotId: string) => void;
    onSelectSlot?: (slot: CalendarSlot) => void;
    selectedSlot?: string;
    primaryColor?: string;
}

export function CalendarPanel({ 
    slots, 
    onAcceptMeeting, 
    onDeclineMeeting, 
    onSelectSlot,
    selectedSlot,
    primaryColor = '#8b5cf6'
}: CalendarPanelProps) {
    const [showHint, setShowHint] = useState(true);
    const acceptedSlots = slots.filter(s => !s.available);
    const availableSlots = slots.filter(s => s.available);

    return (
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border bg-white dark:bg-[#121212]">
                <div className="flex items-center gap-3 mb-2">
                    <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                    >
                        <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Calendar
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Team availability and meetings
                        </p>
                    </div>
                </div>
                
                {/* Stats */}
                <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {availableSlots.length} Available
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {acceptedSlots.length} Scheduled
                        </span>
                    </div>
                </div>
            </div>

            {/* Hint Banner */}
            {showHint && (
                <div className="mx-4 mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                                This is your Calendar
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Shows when team members are available. Green slots are open - click to view details or accept invites!
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowHint(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
                
                {/* Available Slots */}
                {availableSlots.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Available Meetings
                        </h3>
                        <div className="space-y-3">
                            {availableSlots.map((slot) => (
                                <div 
                                    key={slot.id}
                                    className={`bg-white dark:bg-[#1a1a1a] rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                                        selectedSlot === slot.id 
                                            ? 'border-purple-500 shadow-md' 
                                            : 'border-border hover:border-purple-300'
                                    }`}
                                    onClick={() => onSelectSlot?.(slot)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                {slot.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {slot.with}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full">
                                            OPEN
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {slot.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {slot.duration}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        {slot.description}
                                    </p>

                                    {selectedSlot === slot.id && (
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAcceptMeeting?.(slot.id);
                                                }}
                                                className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Check className="w-3 h-3" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeclineMeeting?.(slot.id);
                                                }}
                                                className="py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Scheduled Meetings */}
                {acceptedSlots.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            Your Scheduled Meetings
                        </h3>
                        <div className="space-y-3">
                            {acceptedSlots.map((slot) => (
                                <div 
                                    key={slot.id}
                                    className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-border p-4 opacity-75"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                {slot.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {slot.with}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-bold rounded-full">
                                            CONFIRMED
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {slot.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Video className="w-3 h-3" />
                                            Virtual
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {slots.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-foreground font-medium text-sm">No meetings scheduled</p>
                        <p className="text-text-tertiary text-xs mt-1">Check back later for new invites</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CalendarPanel;