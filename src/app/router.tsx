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

import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// ── Scroll to top wrapper ───────────────────────────────────
function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

// ── Non-simulation pages (eager-loaded) ───────────────────────
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import IndustriesPage from '../pages/IndustriesPage';
import TracksPage from '../pages/TracksPage';
import ConfirmationPage from '../pages/ConfirmationPage';
import PortfolioPage from '../pages/PortfolioPage';
import PublicPortfolioPage from '../pages/PublicPortfolioPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import TeamPage from '../pages/TeamPage';
import AchievementsPage from '../pages/AchievementsPage';
import ProjectsPage from '../pages/ProjectsPage';
import SimulationsPage from '../pages/SimulationsPage';
import AuthPage from '../pages/auth/AuthPage';
import StartSimulationPage from '../pages/StartSimulationPage';
import ProjectBriefingPage from '../pages/ProjectBriefingPage';
import SignUpPage from '../pages/auth/SignUpPage';
import OAuthCallbackPage from '../pages/auth/OAuthCallbackPage';
import { NotFound } from '../pages/NotFoundPage';
import Program1Page from '../pages/program1/Program1Page';
import FAQPage from '../pages/FAQPage';
import ContactPage from '../pages/ContactPage';
// Organization marketing page
import OrganizationPage from '../pages/organization/OrganizationPage';

// ── Admin pages ────────────────────────────────────────────────
import { ProtectedAdminRoute } from '../components/admin/ProtectedAdminRoute';
import { ProtectedRoleRoute } from '../components/ProtectedRoleRoute';
import { AdminLayout, AdminDashboardPage, AdminUsersPage, AdminAnalyticsPage } from '../pages/admin';
import { AdminSimulationsPage, CreateSimulationPage, EditSimulationPage } from '../pages/admin/simulations';
import { AdminBlogListPage, CreateBlogPage, EditBlogPage } from '../pages/admin/blogs';

// ── Company pages ──────────────────────────────────────────────
import { CompanyLayout } from '../pages/company/CompanyLayout';
import { CompanyDashboardPage } from '../pages/company/CompanyDashboardPage';
import { CompanySimulationsPage } from '../pages/company/CompanySimulationsPage';
import { CompanySimulationCreator } from '../pages/company/CompanySimulationCreator';

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
  {
    element: <RootLayout />,
    children: [
      // ── Public / Marketing ──────────────────────────────────────
      { path: '/', element: <LandingPage /> },
      { path: '/bootcamp', element: <Program1Page /> },
      { path: '/organization', element: <OrganizationPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/contact', element: <ContactPage /> },

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
      { path: '/portfolio/public/:shareToken', element: <PublicPortfolioPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/achievements', element: <AchievementsPage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/industries', element: <IndustriesPage /> },
      { path: '/tracks', element: <TracksPage /> },
      { path: '/confirmation', element: <ConfirmationPage /> },
      { path: '/start-simulation', element: <StartSimulationPage /> },
      { path: '/briefing', element: <ProjectBriefingPage /> },

      // ── Simulations (Isolated, Code-Split) ───────────────────────
      // Each simulation path maps to its own standalone page.
      // Editing one simulation cannot affect another.
      { path: '/simulation/sim-pm-001', element: withSuspense(PayLinkSimulation) },
      { path: '/simulation/sim-pm-002', element: withSuspense(ShopEaseSimulation) },
      { path: '/simulation/sim-pm-003', element: withSuspense(TechCoreSimulation) },
      { path: '/simulation/sim-pm-004', element: withSuspense(NewWaveSimulation) },

      // ── Admin Routes ────────────────────────────────────────────────
      {
        path: '/admin',
        element: (
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'simulations', element: <AdminSimulationsPage /> },
          { path: 'simulations/new', element: <CreateSimulationPage /> },
          { path: 'simulations/:id/edit', element: <EditSimulationPage /> },
          { path: 'blogs', element: <AdminBlogListPage /> },
          { path: 'blogs/new', element: <CreateBlogPage /> },
          { path: 'blogs/:id/edit', element: <EditBlogPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'analytics', element: <AdminAnalyticsPage /> },
        ],
      },

      // ── Company/Organization Routes ─────────────────────────────────
      {
        path: '/company',
        element: (
          <ProtectedRoleRoute allowedRoles={['COMPANY']}>
            <CompanyLayout />
          </ProtectedRoleRoute>
        ),
        children: [
          { index: true, element: <CompanyDashboardPage /> },
          { path: 'simulations', element: <CompanySimulationsPage /> },
          { path: 'simulations/new', element: <CompanySimulationCreator /> },
          { path: 'analytics', element: <div className="p-8 text-white">Analytics (Coming Soon)</div> },
          { path: 'settings', element: <div className="p-8 text-white">Settings (Coming Soon)</div> },
        ],
      },

      // ── 404 ─────────────────────────────────────────────────────
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;