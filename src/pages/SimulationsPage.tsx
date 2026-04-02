import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Clock, CheckCircle, TrendingUp,
  Play, Calendar, Users, DollarSign, Flag, Star, ArrowLeft
} from 'lucide-react';

interface Simulation {
  id: number;
  title: string;
  industry: string;
  client: string;
  budget: number;
  duration: string;
  progress: number;
  deadline: string;
  status: 'ongoing' | 'in-progress' | 'completed';
  color: string;
  teamSize: number;
  rating?: number;
  completedDate?: string;
}

const SimulationsPage = () => {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'in-progress' | 'completed'>('all');

  const simulations: Simulation[] = [
    {
      id: 1,
      title: 'Product Launch Strategy',
      industry: 'Technology',
      client: 'TechStart Inc.',
      budget: 50000,
      duration: '4 weeks',
      progress: 75,
      deadline: '3 days left',
      status: 'ongoing',
      color: 'bg-blue-500',
      teamSize: 4
    },
    {
      id: 2,
      title: 'Marketing Campaign',
      industry: 'Marketing',
      client: 'Growth Labs',
      budget: 35000,
      duration: '3 weeks',
      progress: 45,
      deadline: '1 week left',
      status: 'in-progress',
      color: 'bg-emerald-500',
      teamSize: 3
    },
    {
      id: 3,
      title: 'Financial Analysis',
      industry: 'Finance',
      client: 'FinCorp',
      budget: 75000,
      duration: '6 weeks',
      progress: 20,
      deadline: '2 weeks left',
      status: 'ongoing',
      color: 'bg-violet-500',
      teamSize: 5
    },
    {
      id: 4,
      title: 'E-commerce Platform Redesign',
      industry: 'Retail',
      client: 'ShopMax',
      budget: 60000,
      duration: '5 weeks',
      progress: 100,
      deadline: 'Completed',
      status: 'completed',
      color: 'bg-amber-500',
      teamSize: 4,
      rating: 4.9,
      completedDate: 'Feb 2026'
    },
    {
      id: 5,
      title: 'Mobile Banking App',
      industry: 'Finance',
      client: 'BankFlow',
      budget: 80000,
      duration: '6 weeks',
      progress: 100,
      deadline: 'Completed',
      status: 'completed',
      color: 'bg-pink-500',
      teamSize: 6,
      rating: 4.8,
      completedDate: 'Jan 2026'
    },
    {
      id: 6,
      title: 'SaaS Analytics Dashboard',
      industry: 'Technology',
      client: 'DataViz Pro',
      budget: 45000,
      duration: '4 weeks',
      progress: 100,
      deadline: 'Completed',
      status: 'completed',
      color: 'bg-cyan-500',
      teamSize: 3,
      rating: 4.7,
      completedDate: 'Dec 2025'
    }
  ];

  const filteredSimulations = filter === 'all' 
    ? simulations 
    : simulations.filter(sim => sim.status === filter);

  const stats = {
    ongoing: simulations.filter(s => s.status === 'ongoing').length,
    inProgress: simulations.filter(s => s.status === 'in-progress').length,
    completed: simulations.filter(s => s.status === 'completed').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-emerald-100 text-emerald-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Play className="h-4 w-4" />;
      case 'in-progress':
        return <TrendingUp className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <Link
              to="/industries"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              New Simulation
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Simulations</h1>
          <p className="text-gray-600">Track your ongoing, in-progress, and completed simulations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.ongoing}</p>
                <p className="text-sm text-gray-500">Ongoing</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Simulations
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === 'ongoing'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Play className="h-4 w-4" />
              Ongoing
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Completed
            </button>
          </div>
        </div>

        {/* Simulations List */}
        <div className="space-y-4">
          {filteredSimulations.map((simulation) => (
            <Link
              key={simulation.id}
              to={`/simulation/${simulation.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${getStatusBadge(simulation.status)}`}>
                        {getStatusIcon(simulation.status)}
                        {simulation.status.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{simulation.industry}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{simulation.title}</h3>
                    <p className="text-sm text-gray-500">Client: {simulation.client}</p>
                  </div>
                  {simulation.status === 'completed' && simulation.rating && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-lg">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="text-sm font-bold text-gray-900">{simulation.rating}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-sm font-semibold text-gray-900">${simulation.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{simulation.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Team</p>
                      <p className="text-sm font-semibold text-gray-900">{simulation.teamSize} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Flag className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Deadline</p>
                      <p className="text-sm font-semibold text-gray-900">{simulation.deadline}</p>
                    </div>
                  </div>
                </div>

                {simulation.status !== 'completed' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 font-medium">{simulation.progress}% complete</span>
                      <span className="text-xs text-gray-500">{simulation.deadline}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`${simulation.color} h-2 rounded-full transition-all`}
                        style={{ width: `${simulation.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {simulation.status === 'completed' && simulation.completedDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Completed {simulation.completedDate}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredSimulations.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No simulations found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You haven't started any simulations yet"
                : `No ${filter} simulations at the moment`}
            </p>
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Play className="h-4 w-4" />
              Start a Simulation
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SimulationsPage;
