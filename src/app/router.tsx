/**
 * TURNVE — Canonical Router
 *
 * ─── Structure ──────────────────────────────────────────────
 * Each simulation is code-split with React.lazy.
 * To add a new simulation:
 *  1. Create src/features/sim-pm-XXX-name/
 *  2. Add lazy import here
 *  3. Add route entry below
 * ─────────────────────────────────────────────────────────────
 */

import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// ── Non-simulation pages (eager-loaded) ───────────────────────
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import IndustriesPage from '../pages/IndustriesPage';
import TracksPage from '../pages/TracksPage';
import ConfirmationPage from '../pages/ConfirmationPage';
import PortfolioPage from '../pages/PortfolioPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import TeamPage from '../pages/TeamPage';
import AchievementsPage from '../pages/AchievementsPage';
import ProjectsPage from '../pages/ProjectsPage';
import SimulationsPage from '../pages/SimulationsPage';
import AuthPage from '../pages/auth/AuthPage';
import SignUpPage from '../pages/auth/SignUpPage';
import OAuthCallbackPage from '../pages/auth/OAuthCallbackPage';
import { NotFound } from '../pages/NotFoundPage';
import Program1Page from '../pages/program1/Program1Page';

// ── Simulation pages (code-split, isolated) ───────────────────
const PayLinkSimulation = lazy(() => import('../features/sim-pm-001-paylink/PayLinkSimulation'));
const ShopEaseSimulation = lazy(() => import('../features/sim-pm-002-shopease/ShopEaseSimulation'));
const TechCoreSimulation = lazy(() => import('../features/sim-pm-003-techcore/TechCoreSimulation'));
const NewWaveSimulation = lazy(() => import('../features/sim-pm-004-newwave/NewWaveSimulation'));

// ── Shared loading fallback ────────────────────────────────────
const SimulationLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading simulation...</p>
    </div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<SimulationLoader />}>
    <Component />
  </Suspense>
);

// ── Router ─────────────────────────────────────────────────────
const router = createBrowserRouter([
  // ── Public / Marketing ──────────────────────────────────────
  { path: '/', element: <LandingPage /> },
  { path: '/bootcamp', element: <Program1Page /> },

  // ── Auth ────────────────────────────────────────────────────
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <LoginPage /> },
  { path: '/sign-in', element: <AuthPage /> },
  { path: '/sign-up', element: <SignUpPage /> },
  { path: '/auth/callback', element: <OAuthCallbackPage /> },

  // ── App ─────────────────────────────────────────────────────
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/simulations', element: <SimulationsPage /> },
  { path: '/portfolio', element: <PortfolioPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/team', element: <TeamPage /> },
  { path: '/achievements', element: <AchievementsPage /> },
  { path: '/projects', element: <ProjectsPage /> },
  { path: '/industries', element: <IndustriesPage /> },
  { path: '/tracks', element: <TracksPage /> },
  { path: '/confirmation', element: <ConfirmationPage /> },

  // ── Simulations (Isolated, Code-Split) ───────────────────────
  // Each simulation path maps to its own standalone page.
  // Editing one simulation cannot affect another.
  { path: '/simulation/sim-pm-001', element: withSuspense(PayLinkSimulation) },
  { path: '/simulation/sim-pm-002', element: withSuspense(ShopEaseSimulation) },
  { path: '/simulation/sim-pm-003', element: withSuspense(TechCoreSimulation) },
  { path: '/simulation/sim-pm-004', element: withSuspense(NewWaveSimulation) },

  // ── 404 ─────────────────────────────────────────────────────
  { path: '*', element: <NotFound /> },
]);

export default router;