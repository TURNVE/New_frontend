import { useState, useEffect } from 'react';
import {
  MapPin, Calendar, Briefcase, Globe,
  Camera, Edit3, Save, X, Plus, Settings, LogOut, ChevronRight,
  Building, FileText, Link as LinkIcon, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import { useAuth } from '../hooks/useAuth';
import { profiles, simulations, supabase } from '../lib/supabase';

const ProfilePage = () => {
  usePageSetup();
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState<'personal' | 'professional' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // User data state
  const [userData, setUserData] = useState({
    name: '', title: '', email: '', phone: '', location: '', bio: '', website: '', linkedin: '', twitter: '', industry: 'Technology', experience: 'N/A', education: 'University', institution: '', skills: [], avatar_url: null as string | null
  });

  const [stats, setStats] = useState([
    { name: 'Simulations', value: '0', icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Projects', value: '0', icon: FileText, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { name: 'Avg Score', value: '0.0', icon: Star, color: 'text-primary', bgColor: 'bg-amber-50' }
  ]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { profile } = await profiles.getProfile(user.id);

      if (profile) {
        setUserData((prev: any) => ({
          ...prev,
          name: profile.full_name || user.email?.split('@')[0] || 'User',
          title: profile.role || 'Professional',
          email: user.email || '',
          website: profile.website || '',
          linkedin: 'linkedin.com/in/' + (profile.username || ''),
          twitter: '@' + (profile.username || ''),
          bio: 'Completed profile.',
          avatar_url: profile.avatar_url
        }));
      }

      const { scores } = await simulations.getScores(undefined);

      // We can also fetch the sessions just to figure out how many projects
      const { sessions: allSessions } = await simulations.getAllUserSessions(user?.id);

      const sessionCount = allSessions?.length || 0;
      const completedCount = scores?.length || 0;
      const avgScore = completedCount > 0 ? (scores.reduce((sum: number, sc: any) => sum + sc.overall_score, 0) / completedCount / 20).toFixed(1) : '0.0';

      setStats([
        { name: 'Simulations', value: sessionCount.toString(), icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { name: 'Projects', value: completedCount.toString(), icon: FileText, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { name: 'Avg Score', value: avgScore, icon: Star, color: 'text-primary', bgColor: 'bg-amber-50' }
      ]);

      if (scores && scores.length > 0) {
        setPortfolioItems(scores.slice(0, 3).map((s: any, i: number) => ({
          id: s.id, title: 'Simulation Project #' + (i + 1), date: new Date(s.completed_at).toLocaleDateString(), industry: 'Tech', rating: (s.overall_score / 20).toFixed(1)
        })));
        setAchievements(scores.slice(0, 3).map((s: any, i: number) => ({
          id: s.id, title: 'Simulation Passed', date: new Date(s.completed_at).toLocaleDateString(), description: 'Successfully finished the simulation.', icon: '🏆'
        })));
      }
      setIsLoading(false);
    }
    loadData();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setEditing(false);
    setEditMode(null);
    if (!user) return;
    await profiles.updateProfile({ full_name: userData.name, website: userData.website });
  };

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 sm:-mt-16 gap-4">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-card shadow-lg overflow-hidden">
                  {userData.avatar_url ? (
                    <img src={userData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-white">{userData.name?.substring(0, 2).toUpperCase() || 'JD'}</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-card rounded-xl shadow-md border border-border hover:bg-secondary transition-colors cursor-pointer">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !user) return;
                    setIsLoading(true);
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                    const { data, error } = await supabase.storage.from('avatars').upload(fileName, file);
                    if (!error && data) {
                      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
                      await profiles.updateProfile({ avatar_url: publicUrl });
                      setUserData((prev: any) => ({ ...prev, avatar_url: publicUrl }));
                    }
                    setIsLoading(false);
                  }} />
                </label>
              </div>

              {/* Info */}
              <div className="flex-1 pt-12 sm:pt-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{userData.name}</h1>
                      {editing && (
                        <button onClick={() => setEditMode(editMode === 'personal' ? null : 'personal')} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">{userData.title}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {userData.industry}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {userData.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {userData.experience} experience
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {editing ? (
                      <>
                        <button
                          onClick={saveProfile}
                          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={() => { setEditing(false); setEditMode(null); }}
                          className="px-5 py-2.5 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="px-5 py-2.5 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className={`w-12 h-12 ${stat.bgColor} dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color} dark:text-opacity-80`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Personal Details</h2>
                {editing && editMode !== 'personal' && (
                  <button
                    onClick={() => setEditMode('personal')}
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
                  {editing && editMode === 'personal' ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{userData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                  {editing && editMode === 'personal' ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{userData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
                  {editing && editMode === 'personal' ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{userData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Location</label>
                  {editing && editMode === 'personal' ? (
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{userData.location}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Bio</label>
                  {editing && editMode === 'personal' ? (
                    <textarea
                      value={userData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{userData.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Professional Details</h2>
                {editing && editMode !== 'professional' && (
                  <button
                    onClick={() => setEditMode('professional')}
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Job Title</label>
                  {editing && editMode === 'professional' ? (
                    <input
                      type="text"
                      value={userData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{userData.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Industry</label>
                  {editing && editMode === 'professional' ? (
                    <input
                      type="text"
                      value={userData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{userData.industry}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Experience</label>
                  {editing && editMode === 'professional' ? (
                    <input
                      type="text"
                      value={userData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{userData.experience}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Education</label>
                  {editing && editMode === 'professional' ? (
                    <input
                      type="text"
                      value={userData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{userData.education}</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      {skill}
                      {editing && editMode === 'professional' && (
                        <button className="ml-1.5 text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {editing && editMode === 'professional' && (
                    <button className="inline-flex items-center px-3 py-1.5 bg-secondary text-muted-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Skill
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Portfolio */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Recent Portfolio</h2>
                <Link to="/portfolio" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {portfolioItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{item.industry}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-950 rounded-lg">
                      <Star className="h-4 w-4 text-primary fill-current" />
                      <span className="text-sm font-bold text-foreground">{item.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Achievements</h2>
                <Link to="/achievements" className="text-primary hover:text-primary/80 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {achievements.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Social Links</h2>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{userData.website}</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{userData.linkedin}</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                  <span className="text-lg">🐦</span>
                  <span className="text-sm font-medium text-muted-foreground">{userData.twitter}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;
