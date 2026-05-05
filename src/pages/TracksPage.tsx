import { useState } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, Code, Palette, Settings, ChevronRight, Target, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import { usePageTheme } from '../hooks/usePageTheme';

const TracksPage = () => {
  usePageSetup();
  const navigate = useNavigate();
  const [location] = useState(() => window.location);
  const urlParams = new URLSearchParams(location.search);
  const industryName = urlParams.get('industry') || 'selected industry';
  const pageTheme = usePageTheme(industryName, null, null);

  const careerTracks = [
    {
      id: 'business',
      name: 'Business',
      description: 'Grow and scale businesses with strategy and management',
      icon: Briefcase,
      roles: [
        { id: 'product-management', name: 'Product Management', description: 'Lead product strategy and development' }
      ]
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Build robust systems and analyze data for insights',
      icon: Code,
      roles: [
        { id: 'web-dev', name: 'Web Development', description: 'Build modern web applications' },
        { id: 'data-analytics', name: 'Data Analytics', description: 'Transform data into insights' }
      ]
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Design beautiful experiences and build iconic brands',
      icon: Palette,
      roles: [
        { id: 'brand-design-advertising', name: 'Brand Design & Advertising', description: 'Create compelling brand experiences' }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      description: 'Optimize processes and manage complex projects',
      icon: Settings,
      roles: [
        { id: 'project-management', name: 'Project Management', description: 'Deliver projects on time and budget' }
      ]
    }
  ];

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const selectedTrack = careerTracks.find(t => t.id === selectedTrackId);

  const handleRoleSelect = (roleId: string) => {
    navigate(`/briefing?industry=${industryName}&track=${selectedTrackId}&role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-[#010102]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#010102]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
            </Link>
            <button
              onClick={() => selectedTrackId ? setSelectedTrackId(null) : navigate('/industries')}
              className="flex items-center text-sm font-medium text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              {selectedTrackId ? 'Back to Tracks' : 'Back to Industries'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
          {!selectedTrackId ? (
            <>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wide mb-4" style={{ backgroundColor: pageTheme.badgeBg, borderColor: pageTheme.ring, color: pageTheme.primary }}>
                <Layers className="h-3.5 w-3.5 mr-1.5" />
                Step 2 of 4
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#f7f8f8] tracking-tight mb-3 sm:mb-4">
                Select Your Track
              </h1>
              <p className="text-base sm:text-lg text-[#8a8f98] leading-relaxed">
                Choose a career pathway that aligns with your interests and goals in <span className="font-semibold text-[#d0d6e0] capitalize">{industryName}</span>.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wide mb-4" style={{ backgroundColor: pageTheme.badgeBg, borderColor: pageTheme.ring, color: pageTheme.primary }}>
                <Target className="h-3.5 w-3.5 mr-1.5" />
                Step 3 of 4
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#f7f8f8] tracking-tight mb-3 sm:mb-4">
                Choose Your Role
              </h1>
              <p className="text-base sm:text-lg text-[#8a8f98] leading-relaxed">
                You've selected the <span className="font-semibold text-[#d0d6e0]">{selectedTrack?.name}</span> track. Now, pick a specific role to specialize in.
              </p>
            </>
          )}
        </div>

        {!selectedTrackId ? (
          /* Track Selection Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
            {careerTracks.map((track) => {
              const IconComponent = track.icon;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className="group relative overflow-hidden bg-[#0a0a0a] rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 text-left hover:shadow-2xl transform hover:-translate-y-1"
                  style={{ '--hover-shadow': `${pageTheme.primary}30` } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 20px 40px -10px ${pageTheme.primary}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Background gradient on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${pageTheme.primary}20, ${pageTheme.primary}10)` }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 border group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${pageTheme.primary}15`, borderColor: `${pageTheme.primary}30`, color: pageTheme.primary }}
                    >
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-semibold text-[#f7f8f8] mb-2 sm:mb-3 group-hover:text-white transition-colors">
                      {track.name}
                    </h3>
                    <p className="text-sm text-[#8a8f98] mb-4 sm:mb-5 leading-relaxed">
                      {track.description}
                    </p>

                    {/* CTA */}
                    <div
                      className="flex items-center text-sm font-semibold group-hover:translate-x-1 transition-all"
                      style={{ color: pageTheme.primary }}
                    >
                      View Roles
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Role Selection List */
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4 px-4 sm:px-0">
            {selectedTrack?.roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="w-full group bg-[#0a0a0a] rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 flex items-center justify-between text-left transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{ backgroundColor: `${pageTheme.primary}15`, borderColor: `${pageTheme.primary}30`, color: pageTheme.primary }}
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#f7f8f8] group-hover:text-white transition-colors">
                      {role.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#62666d] mt-0.5">{role.description}</p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 border border-white/10"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#8a8f98' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = pageTheme.primary;
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#8a8f98';
                  }}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
            ))}

            {/* Back Button */}
            <button
              onClick={() => setSelectedTrackId(null)}
              className="w-full py-4 text-center text-[#62666d] hover:text-[#8a8f98] font-medium transition-colors text-sm"
            >
              Go back to tracks
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TracksPage;
