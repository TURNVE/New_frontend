import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Plus, Mail, Phone, MapPin, ChevronRight, Search,
  MoreVertical, Edit3, Trash2, CheckCircle2, Clock
} from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';

const TeamPage = () => {
  // Page setup with scroll-to-top, viewport fix, and device detection
  const { isMobile, isIOS, isAndroid } = usePageSetup();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const teamMembers = [
    { id: 1, name: 'Alex Morgan', role: 'Designer', email: 'alex@example.com', location: 'San Francisco, CA', status: 'online', avatar: 'AM', projects: 8 },
    { id: 2, name: 'Taylor Kim', role: 'Developer', email: 'taylor@example.com', location: 'New York, NY', status: 'away', avatar: 'TK', projects: 12 },
    { id: 3, name: 'Jordan Smith', role: 'Marketing', email: 'jordan@example.com', location: 'Austin, TX', status: 'online', avatar: 'JS', projects: 6 },
    { id: 4, name: 'Casey Brown', role: 'Product Manager', email: 'casey@example.com', location: 'Seattle, WA', status: 'offline', avatar: 'CB', projects: 10 },
    { id: 5, name: 'Riley Johnson', role: 'Designer', email: 'riley@example.com', location: 'Boston, MA', status: 'online', avatar: 'RJ', projects: 5 },
    { id: 6, name: 'Morgan Lee', role: 'Developer', email: 'morgan@example.com', location: 'Remote', status: 'online', avatar: 'ML', projects: 9 }
  ];

  const roles = ['all', 'Designer', 'Developer', 'Marketing', 'Product Manager'];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage your team and collaborators</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Invite
          </button>
        </div>
      </div>

      <div className="py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{teamMembers.filter(m => m.status === 'online').length}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary dark:text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Away</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{teamMembers.filter(m => m.status === 'away').length}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-sm text-muted-foreground">Avg Projects</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{Math.round(teamMembers.reduce((sum, m) => sum + m.projects, 0) / teamMembers.length)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team members..."
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterRole === role
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div key={member.id} className="bg-card rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                      member.status === 'online' ? 'bg-emerald-500' :
                      member.status === 'away' ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {member.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {member.projects} projects
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Message
                </button>
                <button className="px-3 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No team members found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
