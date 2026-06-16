import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Building2, Gamepad2, LockKeyhole } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

interface AccessPayload {
  token: string;
  label: string | null;
  organizations: {
    name: string;
    slug: string;
    logo_url: string | null;
    branding: { primaryColor?: string } | null;
  };
  organization_simulations: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: string;
    status: string;
  };
}

export default function DirectAccessPage() {
  const { token } = useParams();
  const [payload, setPayload] = useState<AccessPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccess = async () => {
      if (!token) {
        setError('Access link is missing a token.');
        setLoading(false);
        return;
      }

      const { data, error: lookupError } = await supabase
        .from('organization_access_links')
        .select(`
          token,
          label,
          organizations(name, slug, logo_url, branding),
          organization_simulations(id, title, description, duration, difficulty, status)
        `)
        .eq('token', token)
        .eq('is_active', true)
        .maybeSingle();

      if (lookupError) {
        setError(lookupError.message);
      } else if (!data) {
        setError('This access link is invalid or has been disabled.');
      } else {
        setPayload(data as unknown as AccessPayload);
      }

      setLoading(false);
    };

    loadAccess();
  }, [token]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <ScrollReveal className="text-sm text-slate-300">Loading access link...</ScrollReveal>
      </main>
    );
  }

  if (error || !payload) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <ScrollReveal className="max-w-md text-center">
          <LockKeyhole className="mx-auto mb-5 h-12 w-12 text-red-300" />
          <h1 className="text-2xl font-bold">Access unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{error}</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950">
            Back to TURNVE
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </main>
    );
  }

  const organization = payload.organizations;
  const simulation = payload.organization_simulations;
  const primaryColor = organization.branding?.primaryColor || '#2563eb';

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-10 text-slate-950">
      <ScrollReveal as="section" className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="flex items-center gap-3">
            {organization.logo_url ? (
              <img src={organization.logo_url} alt={organization.name} className="h-10 w-10 rounded-lg bg-white object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                <Building2 className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white/80">Direct access from</p>
              <h1 className="text-xl font-bold">{organization.name}</h1>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            <Gamepad2 className="h-4 w-4" />
            Branded simulation
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{simulation.title}</h2>
          <p className="mt-4 leading-7 text-slate-600">{simulation.description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">Difficulty</p>
              <p className="mt-1 font-semibold capitalize">{simulation.difficulty}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">Duration</p>
              <p className="mt-1 font-semibold">{simulation.duration} min</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">Status</p>
              <p className="mt-1 font-semibold capitalize">{simulation.status}</p>
            </div>
          </div>

          <Link
            to="/program1"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Start simulation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </ScrollReveal>
    </main>
  );
}
