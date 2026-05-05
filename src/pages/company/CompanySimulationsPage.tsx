import { usePageSetup } from '../../hooks/usePageSetup';

export function CompanySimulationsPage() {
  usePageSetup();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Simulations</h1>
      <p className="text-[#8a8f98] mb-8">Manage your organization's simulations.</p>
      <div className="bg-[#111418] border border-[#23252a] rounded-xl p-12 text-center">
        <p className="text-[#8a8f98]">No simulations created yet. Create your first simulation to get started.</p>
      </div>
    </div>
  );
}

export default CompanySimulationsPage;