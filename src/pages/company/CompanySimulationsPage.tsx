import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Eye, Globe2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useAuth } from '../../hooks/useAuth';
import { companySimulations, type CompanySimulation } from '../../lib/companySimulations';

export function CompanySimulationsPage() {
  usePageSetup();
  const { user } = useAuth();
  const [items, setItems] = useState<CompanySimulation[]>([]);

  useEffect(() => {
    if (!user) return;
    setItems(companySimulations.listForOwner(user.id));
  }, [user]);

  const refresh = () => {
    if (!user) return;
    setItems(companySimulations.listForOwner(user.id));
  };

  const togglePublic = (simulation: CompanySimulation) => {
    if (!user) return;
    companySimulations.updateVisibility(simulation.id, user.id, !simulation.isPublic);
    refresh();
  };

  const copyLiveLink = async (simulation: CompanySimulation) => {
    const url = `${window.location.origin}${simulation.livePath}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Simulations</h1>
          <p className="text-[#8a8f98]">Manage live links and public visibility for your organization simulations.</p>
        </div>
        <Link
          to="/company/simulations/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#5e6ad2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7170ff]"
        >
          <Plus className="h-4 w-4" />
          Create Simulation
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-12 text-center">
          <p className="text-[#8a8f98] mb-6">No simulations created yet. Create your first simulation to get started.</p>
          <Link
            to="/company/simulations/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5e6ad2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7170ff]"
          >
            <Plus className="h-4 w-4" />
            Create Simulation
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((simulation) => (
            <div key={simulation.id} className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full border border-[#5e6ad2]/30 bg-[#5e6ad2]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8f95ff]">
                      {simulation.status}
                    </span>
                    {simulation.isPublic && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                        <Globe2 className="h-3 w-3" />
                        Public
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-white">{simulation.title}</h2>
                  <p className="text-sm text-[#8a8f98]">
                    {simulation.companyName} / {simulation.industry} / {simulation.durationWeeks} weeks
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyLiveLink(simulation)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#23252a] px-3 py-2 text-sm font-medium text-[#d0d6e0] hover:bg-white/5"
                  >
                    <Copy className="h-4 w-4" />
                    Copy live link
                  </button>
                  <a
                    href={simulation.livePath}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#23252a] px-3 py-2 text-sm font-medium text-[#d0d6e0] hover:bg-white/5"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => togglePublic(simulation)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#23252a] px-3 py-2 text-sm font-medium text-[#d0d6e0] hover:bg-white/5"
                  >
                    {simulation.isPublic ? <ToggleRight className="h-5 w-5 text-emerald-300" /> : <ToggleLeft className="h-5 w-5" />}
                    {simulation.isPublic ? 'Public' : 'Make public'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanySimulationsPage;
