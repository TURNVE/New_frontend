import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  LayoutDashboard,
  Gamepad2,
  Users,
  BarChart3,
  Settings,
  UserCircle,
  Plus,
  LogOut,
  FileText,
  Bell,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../../lib/organization/utils';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      shortcut: 'G D',
      action: () => { navigate('/org/dashboard'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'simulations',
      label: 'Go to Simulations',
      icon: <Gamepad2 className="w-4 h-4" />,
      shortcut: 'G S',
      action: () => { navigate('/org/simulations'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'clients',
      label: 'Go to Clients',
      icon: <Users className="w-4 h-4" />,
      shortcut: 'G C',
      action: () => { navigate('/org/clients'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'analytics',
      label: 'Go to Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      shortcut: 'G A',
      action: () => { navigate('/org/analytics'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'team',
      label: 'Go to Team',
      icon: <UserCircle className="w-4 h-4" />,
      shortcut: 'G T',
      action: () => { navigate('/org/team'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      icon: <Settings className="w-4 h-4" />,
      shortcut: 'G ,',
      action: () => { navigate('/org/settings'); onClose(); },
      category: 'Navigation',
    },
    // Actions
    {
      id: 'new-simulation',
      label: 'Create New Simulation',
      icon: <Plus className="w-4 h-4" />,
      shortcut: 'C S',
      action: () => { navigate('/org/simulations/new'); onClose(); },
      category: 'Actions',
    },
    {
      id: 'invite-clients',
      label: 'Invite Clients',
      icon: <Users className="w-4 h-4" />,
      shortcut: 'C I',
      action: () => { navigate('/org/clients'); onClose(); },
      category: 'Actions',
    },
    {
      id: 'export-analytics',
      label: 'Export Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      shortcut: 'E A',
      action: () => { navigate('/org/analytics'); onClose(); },
      category: 'Actions',
    },
    // Quick Access
    {
      id: 'notifications',
      label: 'View Notifications',
      icon: <Bell className="w-4 h-4" />,
      shortcut: 'N',
      action: () => { onClose(); },
      category: 'Quick Access',
    },
    {
      id: 'help',
      label: 'Help & Documentation',
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => { onClose(); },
      category: 'Quick Access',
    },
    {
      id: 'logout',
      label: 'Log Out',
      icon: <LogOut className="w-4 h-4" />,
      action: () => { onClose(); },
      category: 'Quick Access',
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Get all commands in a flat array for keyboard navigation
  const flatCommands = Object.values(groupedCommands).flat();

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < flatCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatCommands, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Reset search on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search commands"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 text-base outline-none text-gray-900 placeholder-gray-400"
          />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="px-2 py-1 bg-gray-100 rounded">ESC</span>
            <span>to close</span>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category} className="mb-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category}
              </div>
              {items.map((cmd, idx) => {
                const flatIndex = flatCommands.findIndex((c) => c.id === cmd.id);
                const isSelected = flatIndex === selectedIndex;

                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(flatIndex)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 mx-2 rounded-lg transition-colors text-left',
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-blue-100' : 'bg-gray-100'
                      )}>
                        {cmd.icon}
                      </div>
                      <span className="font-medium">{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <div className="flex items-center gap-1">
                        {cmd.shortcut.split(' ').map((key, i) => (
                          <React.Fragment key={i}>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                              {key}
                            </span>
                            {i < cmd.shortcut!.split(' ').length - 1 && (
                              <span className="text-gray-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No commands found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↑↓</span>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↵</span>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">esc</span>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}

// Hook for keyboard shortcuts
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Cmd/Ctrl + B for sidebar toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        // Dispatch custom event for sidebar toggle
        window.dispatchEvent(new CustomEvent('toggle-sidebar'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}

// Hook for navigation shortcuts
export function useNavigationShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    let keyBuffer = '';
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle when not in input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Navigation shortcuts (G + letter)
      if (keyBuffer === 'g' || (keyBuffer === '' && e.key.toLowerCase() === 'g')) {
        if (keyBuffer === '') {
          keyBuffer = 'g';
          timeout = setTimeout(() => { keyBuffer = ''; }, 1000);
        } else {
          clearTimeout(timeout);
          keyBuffer = '';
          
          switch (e.key.toLowerCase()) {
            case 'd':
              e.preventDefault();
              navigate('/org/dashboard');
              break;
            case 's':
              e.preventDefault();
              navigate('/org/simulations');
              break;
            case 'c':
              e.preventDefault();
              navigate('/org/clients');
              break;
            case 'a':
              e.preventDefault();
              navigate('/org/analytics');
              break;
            case 't':
              e.preventDefault();
              navigate('/org/team');
              break;
            case ',':
              e.preventDefault();
              navigate('/org/settings');
              break;
          }
        }
      }

      // Creation shortcuts (C + letter)
      if (keyBuffer === 'c' || (keyBuffer === '' && e.key.toLowerCase() === 'c')) {
        if (keyBuffer === '') {
          keyBuffer = 'c';
          timeout = setTimeout(() => { keyBuffer = ''; }, 1000);
        } else {
          clearTimeout(timeout);
          keyBuffer = '';
          
          switch (e.key.toLowerCase()) {
            case 's':
              e.preventDefault();
              navigate('/org/simulations/new');
              break;
            case 'i':
              e.preventDefault();
              navigate('/org/clients');
              break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [navigate]);
}

// Keyboard shortcut help component
export function KeyboardShortcutsHelp() {
  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Open command palette' },
    { keys: ['⌘', 'B'], description: 'Toggle sidebar' },
    { keys: ['G', 'D'], description: 'Go to Dashboard' },
    { keys: ['G', 'S'], description: 'Go to Simulations' },
    { keys: ['G', 'C'], description: 'Go to Clients' },
    { keys: ['G', 'A'], description: 'Go to Analytics' },
    { keys: ['G', 'T'], description: 'Go to Team' },
    { keys: ['C', 'S'], description: 'Create simulation' },
    { keys: ['Esc'], description: 'Close dialogs/modals' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
      <div className="space-y-3">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{shortcut.description}</span>
            <div className="flex items-center gap-1">
              {shortcut.keys.map((key, i) => (
                <React.Fragment key={i}>
                  <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono">
                    {key}
                  </span>
                  {i < shortcut.keys.length - 1 && (
                    <span className="text-gray-400">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
