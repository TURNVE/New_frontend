import { useState } from 'react';
import { ArrowLeft, Play, ArrowRight, Briefcase, Code, Palette, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';

// Career tracks data
const careerTracks = [
  {
    id: 'business',
    name: 'Business',
    description: 'Grow and scale businesses with strategy and management',
    icon: <Briefcase className="w-8 h-8" />,
    bgColor: 'bg-blue-50',
    color: 'from-blue-500 to-blue-600',
    roles: [
      { id: 'product-management', name: 'Product Management' }
    ]
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Build robust systems and analyze data for insights',
    icon: <Code className="w-8 h-8" />,
    bgColor: 'bg-sky-50',
    color: 'from-sky-500 to-sky-600',
    roles: [
      { id: 'web-dev', name: 'Web Dev' },
      { id: 'data-analytics', name: 'Data Analytics' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Design beautiful experiences and build iconic brands',
    icon: <Palette className="w-8 h-8" />,
    bgColor: 'bg-rose-50',
    color: 'from-rose-500 to-rose-600',
    roles: [
      { id: 'brand-design-advertising', name: 'Brand Design and Advertising' }
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Optimize processes and manage complex projects',
    icon: <Settings className="w-8 h-8" />,
    bgColor: 'bg-amber-50',
    color: 'from-amber-500 to-amber-600',
    roles: [
      { id: 'project-management', name: 'Project Management' }
    ]
  }
];

const TracksPage = () => {
  usePageSetup();
  const navigate = useNavigate();
  const [location] = useState(() => window.location);
  const urlParams = new URLSearchParams(location.search);
  const industryName = urlParams.get('industry') || 'selected industry';

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const selectedTrack = careerTracks.find(t => t.id === selectedTrackId);

  const handleRoleSelect = (roleId: string) => {
    navigate(`/briefing?industry=${industryName}&track=${selectedTrackId}&role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
            </Link>
            <button
              onClick={() => selectedTrackId ? setSelectedTrackId(null) : navigate('/industries')}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {selectedTrackId ? 'Back to Tracks' : 'Back to Industries'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {!selectedTrackId ? (
            <>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-4">
                <Play className="h-3 w-3 mr-1" />
                Step 2 of 4
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Select Your Track
              </h1>
              <p className="text-lg text-gray-600">
                Choose a career pathway that aligns with your interests and goals in <span className="font-semibold text-gray-900 capitalize">{industryName}</span>.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
                <Play className="h-3 w-3 mr-1" />
                Step 3 of 4
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Role
              </h1>
              <p className="text-lg text-gray-600">
                You've selected the <span className="font-semibold text-gray-900">{selectedTrack?.name}</span> track. Now, pick a specific role to specialize in.
              </p>
            </>
          )}
        </div>

        {!selectedTrackId ? (
          /* Track Selection Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {careerTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-left"
              >
                <div className={`w-16 h-16 ${track.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="text-blue-600">
                    {track.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{track.name}</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {track.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  View Roles <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Role Selection List */
          <div className="max-w-3xl mx-auto space-y-4">
            {selectedTrack?.roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="w-full group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${selectedTrack.bgColor} rounded-xl flex items-center justify-center text-blue-600`}>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-600">Start your journey in {role.name}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            ))}
            
            {/* Back Button for mobile/visual convenience */}
            <button
              onClick={() => setSelectedTrackId(null)}
              className="w-full py-4 text-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
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