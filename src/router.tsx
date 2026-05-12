import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './components/communications/NotificationCenter';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// ── Eager loaded pages (critical path) ────────────────────────
import App from './App';
import AuthPage from './pages/auth/AuthPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';

// ── Lazy loaded pages (to improve dev server performance) ─────
const Program1Page = lazy(() => import('./pages/program1/Program1Page'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const DevelopersPage = lazy(() => import('./pages/DevelopersPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OrganizationPage = lazy(() => import('./pages/organization/OrganizationPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const SimulationsPage = lazy(() => import('./pages/SimulationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'));
const StartSimulationPage = lazy(() => import('./pages/StartSimulationPage'));
const ProjectBriefingPage = lazy(() => import('./pages/ProjectBriefingPage'));
const NotFoundPage = lazy(() => import('./pages/notfound/NotFoundPage'));
const OAuthCallbackPage = lazy(() => import('./pages/auth/OAuthCallbackPage'));

// ── Admin pages ────────────────────────────────────────────────
const ProtectedAdminRoute = lazy(() => import('./components/admin/ProtectedAdminRoute').then(m => ({ default: m.ProtectedAdminRoute })));
const AdminLayout = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminUsersPage })));
const AdminAnalyticsPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminAnalyticsPage })));
const AdminSimulationsPage = lazy(() => import('./pages/admin/simulations').then(m => ({ default: m.AdminSimulationsPage })));
const CreateSimulationPage = lazy(() => import('./pages/admin/simulations').then(m => ({ default: m.CreateSimulationPage })));
const EditSimulationPage = lazy(() => import('./pages/admin/simulations').then(m => ({ default: m.EditSimulationPage })));
const AdminBlogListPage = lazy(() => import('./pages/admin/blogs').then(m => ({ default: m.AdminBlogListPage })));
const CreateBlogPage = lazy(() => import('./pages/admin/blogs').then(m => ({ default: m.CreateBlogPage })));
const EditBlogPage = lazy(() => import('./pages/admin/blogs').then(m => ({ default: m.EditBlogPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));

// ── Simulations ───────────────────────────────────────────────
const PayLinkSimulation = lazy(() => import('./features/sim-pm-001-paylink/PayLinkSimulation'));
const ShopEaseSimulation = lazy(() => import('./features/sim-pm-002-shopease/ShopEaseSimulation'));
const TechCoreSimulation = lazy(() => import('./features/sim-pm-003-techcore/TechCoreSimulation'));
const NewWaveSimulation = lazy(() => import('./features/sim-pm-004-newwave/NewWaveSimulation'));
const InternOnboarding = lazy(() => import('./features/sim-intern-onboarding/InternOnboarding'));

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function Router() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/bootcamp" element={<Program1Page />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/organization" element={<OrganizationPage />} />

            {/* ── Auth ────────────────────────────────────────────────── */}
            <Route path="/login" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<AuthPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/auth/callback" element={<OAuthCallbackPage />} />

            {/* ── Protected Routes with Dashboard Layout ───────────────────── */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/simulations" element={<SimulationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/tracks" element={<Navigate to="/start-simulation" replace />} />
              <Route path="/industries" element={<Navigate to="/start-simulation" replace />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/start-simulation" element={<StartSimulationPage />} />
              <Route path="/briefing" element={<ProjectBriefingPage />} />
            </Route>

            {/* ── Modular simulations (new SimulationShell architecture) ── */}
            <Route path="/simulation/pm-01/*" element={<ProtectedRoute><PayLinkSimulation /></ProtectedRoute>} />
            <Route path="/simulation/sim-pm-001/*" element={<ProtectedRoute><PayLinkSimulation /></ProtectedRoute>} />
            <Route path="/simulation/pm-02/*" element={<ProtectedRoute><ShopEaseSimulation /></ProtectedRoute>} />
            <Route path="/simulation/sim-pm-002/*" element={<ProtectedRoute><ShopEaseSimulation /></ProtectedRoute>} />
            <Route path="/simulation/pm-03/*" element={<ProtectedRoute><TechCoreSimulation /></ProtectedRoute>} />
            <Route path="/simulation/sim-pm-003/*" element={<ProtectedRoute><TechCoreSimulation /></ProtectedRoute>} />
            <Route path="/simulation/pm-04/*" element={<ProtectedRoute><NewWaveSimulation /></ProtectedRoute>} />
            <Route path="/simulation/sim-pm-004/*" element={<ProtectedRoute><NewWaveSimulation /></ProtectedRoute>} />

            {/* ── Intern Onboarding Simulation ── */}
            <Route path="/simulation/intern/*" element={<ProtectedRoute><InternOnboarding /></ProtectedRoute>} />
            <Route path="/simulation/sim-intern-001/*" element={<ProtectedRoute><InternOnboarding /></ProtectedRoute>} />

            {/* ── Legacy simulation route - redirect to simulations list ── */}
            <Route path="/simulation/:id" element={<Navigate to="/simulations" replace />} />

            {/* ── Admin Routes ──────────────────────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                </Suspense>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="simulations" element={<AdminSimulationsPage />} />
              <Route path="simulations/new" element={<CreateSimulationPage />} />
              <Route path="simulations/:id/edit" element={<EditSimulationPage />} />
              <Route path="blogs" element={<AdminBlogListPage />} />
              <Route path="blogs/new" element={<CreateBlogPage />} />
              <Route path="blogs/:id/edit" element={<EditBlogPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default Router;
