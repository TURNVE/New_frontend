import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, CheckCircle } from 'lucide-react';

const ConfirmationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const industry = searchParams.get('industry') || 'technology';
  const track = searchParams.get('track') || 'product-management';
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const [userName, setUserName] = useState('');

  const avatarColors = [
    'bg-blue-700',
    'bg-emerald-600',
    'bg-primary',
    'bg-red-600',
    'bg-violet-600',
    'bg-cyan-600'
  ];

  const industryData = {
    technology: { name: 'Technology', color: 'bg-blue-700' },
    marketing: { name: 'Marketing', color: 'bg-emerald-600' },
    finance: { name: 'Finance', color: 'bg-violet-600' },
    healthcare: { name: 'Healthcare', color: 'bg-red-600' },
    consulting: { name: 'Consulting', color: 'bg-primary' },
    retail: { name: 'Retail', color: 'bg-cyan-600' },
    education: { name: 'Education', color: 'bg-indigo-600' },
    manufacturing: { name: 'Manufacturing', color: 'bg-slate-600' }
  };

  const trackData = {
    'product-management': { name: 'Product Manager', color: 'bg-emerald-600' },
    'ux-design': { name: 'UX Designer', color: 'bg-emerald-600' },
    'data-analytics': { name: 'Data Analyst', color: 'bg-primary' },
    'digital-marketing': { name: 'Digital Marketer', color: 'bg-emerald-600' },
    'financial-analysis': { name: 'Financial Analyst', color: 'bg-primary' },
    consulting: { name: 'Strategy Consultant', color: 'bg-red-600' }
  };

  const selectedIndustry = industryData[industry as keyof typeof industryData];
  const selectedTrack = trackData[track as keyof typeof trackData];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Almost Ready
          </h1>
          <p className="text-lg text-gray-500">
            Personalize your experience
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6 mb-8">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Your Avatar
            </label>
            <div className="flex gap-3">
              {avatarColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(index)}
                  className={`w-12 h-12 rounded-full ${color} text-white font-bold text-xl flex items-center justify-center transition-all ${
                    selectedAvatar === index
                      ? 'ring-4 ring-offset-2 ring-blue-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                >
                  A
                </button>
              ))}
            </div>
          </div>

          {/* Project Card */}
          <div className="border-2 border-gray-300 rounded-xl p-5 bg-white">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Your First Project</p>
                <h3 className="text-lg font-bold text-gray-900">Dashboard Analytics Module</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 ml-13">
              Create a real-time analytics dashboard showing key business metrics
              with customizable widgets.
            </p>
            <div className="flex items-center gap-4 ml-13 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${selectedIndustry.color}`} />
                <span className="text-sm text-gray-500">{selectedIndustry.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${selectedTrack.color}`} />
                <span className="text-sm text-gray-500">{selectedTrack.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mb-8">
          <Link
            to={`/simulation/sim-intern-001`}
            className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors min-w-[200px] text-center"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Info Cards - Keep this section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-lg font-bold text-blue-600 mb-1">4-5 weeks</div>
            <div className="text-xs text-gray-600">Estimated Duration</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-lg font-bold text-violet-600 mb-1">3 Simulations</div>
            <div className="text-xs text-gray-600">Hands-on Projects</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-lg font-bold text-emerald-600 mb-1">
              <CheckCircle className="w-5 h-5 inline" />
            </div>
            <div className="text-xs text-gray-600">Upon Completion</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;
