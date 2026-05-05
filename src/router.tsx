import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import App from './App';
import Program1Page from './pages/program1/Program1Page';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ProgramsPage from './pages/ProgramsPage';
import DevelopersPage from './pages/DevelopersPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import OrganizationPage from './pages/organization/OrganizationPage';
import AuthPage from './pages/auth/AuthPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import SimulationsPage from './pages/SimulationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PortfolioPage from './pages/PortfolioPage';
import AchievementsPage from './pages/AchievementsPage';
import TeamPage from './pages/TeamPage';
import TracksPage from './pages/TracksPage';
import IndustriesPage from './pages/IndustriesPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProjectBriefingPage from './pages/ProjectBriefingPage';
import NotFoundPage from './pages/notfound/NotFoundPage';
import { NotificationProvider } from './components/communications/NotificationCenter';
import { ProtectedRoute } from './components/ProtectedRoute';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';
import DashboardLayout from './components/layout/DashboardLayout';

// ── Admin pages ────────────────────────────────────────────────
import { ProtectedAdminRoute } from './components/admin/ProtectedAdminRoute';
import { AdminLayout, AdminDashboardPage, AdminUsersPage, AdminAnalyticsPage } from './pages/admin';
import { AdminSimulationsPage, CreateSimulationPage, EditSimulationPage } from './pages/admin/simulations';
import { AdminBlogListPage, CreateBlogPage, EditBlogPage } from './pages/admin/blogs';
import AdminLoginPage from './pages/admin/AdminLoginPage';

// ── Modular simulation pages (new architecture) ───────────────
import PayLinkSimulation from './features/sim-pm-001-paylink/PayLinkSimulation';
import ShopEaseSimulation from './features/sim-pm-002-shopease/ShopEaseSimulation';
import TechCoreSimulation from './features/sim-pm-003-techcore/TechCoreSimulation';
import NewWaveSimulation from './features/sim-pm-004-newwave/NewWaveSimulation';

function Router() {
  return (
    <BrowserRouter>
      <NotificationProvider>
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
            <Route path="/tracks" element={<TracksPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
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

          {/* ── Legacy simulation route - redirect to simulations list ── */}
          <Route path="/simulation/:id" element={<Navigate to="/simulations" replace />} />

          {/* ── Admin Routes ──────────────────────────────────────────────── */}
          {/* Admin Login - Public route for admin authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
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
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default Router;
