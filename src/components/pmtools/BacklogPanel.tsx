import { useState } from 'react';
import {
  Plus, MoreHorizontal, Filter, Search,
  Clock, User, Zap, AlertTriangle, CheckCircle,
  ArrowRight, GripVertical
} from 'lucide-react';
import type { BacklogItem } from '../../pmtools/types';
import { DEFAULT_BACKLOG_ITEMS, PRIORITY_COLORS, STATUS_COLORS, CATEGORY_ICONS } from '../../pmtools/types';

interface BacklogPanelProps {
  gameState?: {
    week: number;
  };
  items: BacklogItem[];
  setItems: (items: BacklogItem[] | ((prev: BacklogItem[]) => BacklogItem[])) => void;
}

export const BacklogPanel: React.FC<BacklogPanelProps> = ({ gameState, items, setItems }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const columns = [
    { id: 'backlog', label: 'Backlog', color: 'gray' },
    { id: 'todo', label: 'To Do', color: 'blue' },
    { id: 'in-progress', label: 'In Progress', color: 'yellow' },
    { id: 'review', label: 'Review', color: 'purple' },
    { id: 'done', label: 'Done', color: 'emerald' },
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getItemsByStatus = (status: string) =>
    filteredItems.filter(item => item.status === status);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: string) => {
    if (!draggedItem) return;

    setItems(prev => prev.map(item =>
      item.id === draggedItem
        ? { ...item, status: newStatus as BacklogItem['status'], completedWeek: newStatus === 'done' ? gameState?.week : undefined }
        : item
    ));
    setDraggedItem(null);
  };

  const totalPoints = items.reduce((sum, item) => sum + item.storyPoints, 0);
  const completedPoints = items.filter(i => i.status === 'done').reduce((sum, i) => sum + i.storyPoints, 0);
  const inProgressPoints = items.filter(i => i.status === 'in-progress').reduce((sum, i) => sum + i.storyPoints, 0);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Product Backlog</h2>
            <p className="text-xs text-[#a1a1aa]">
              {completedPoints}/{totalPoints} story points completed
            </p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{items.length}</div>
            <div className="text-xs text-[#a1a1aa]">Total Items</div>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-emerald-400">{completedPoints}</div>
            <div className="text-xs text-[#a1a1aa]">Completed</div>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-yellow-400">{inProgressPoints}</div>
            <div className="text-xs text-[#a1a1aa]">In Progress</div>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-400">{totalPoints - completedPoints}</div>
            <div className="text-xs text-[#a1a1aa]">Remaining</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
            <input
              type="text"
              placeholder="Search backlog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-[#a1a1aa]"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-3 h-full min-w-max">
          {columns.map(column => (
            <div
              key={column.id}
              className="w-64 flex-shrink-0 flex flex-col bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/5"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${column.color}-500`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{column.label}</span>
                  <span className="text-xs text-[#a1a1aa] bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                    {getItemsByStatus(column.id).length}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:bg-white/5 rounded">
                  <MoreHorizontal className="w-4 h-4 text-[#a1a1aa]" />
                </button>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {getItemsByStatus(column.id).map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    className={`bg-white dark:bg-[#141414] rounded-lg p-3 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 cursor-grab active:cursor-grabbing transition-all ${draggedItem === item.id ? 'opacity-50' : ''
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-[#a1a1aa]" />
                        <span className="text-xs">{CATEGORY_ICONS[item.category]}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[item.priority]} text-gray-900 dark:text-white`}>
                        {item.priority}
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-[#a1a1aa] line-clamp-2 mb-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.storyPoints} pts
                        </span>
                        {item.assignee && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.assignee}
                          </span>
                        )}
                      </div>
                      {item.dependencies.length > 0 && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {item.dependencies.length} deps
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {getItemsByStatus(column.id).length === 0 && (
                  <div className="text-center py-8 text-[#a1a1aa] text-sm">
                    No items
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-xs text-[#a1a1aa] flex items-center justify-between">
          <span>Drag items between columns to update status</span>
          <span>Sprint {gameState?.week || 1} • {totalPoints} story points</span>
        </div>
      </div>
    </div>
  );
};

export default BacklogPanel;