import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Program1Page from './pages/program1/Program1Page';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ProgramsPage from './pages/ProgramsPage';
import DevelopersPage from './pages/DevelopersPage';
import FAQPage from './pages/FAQPage';
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

          {/* ── Auth ────────────────────────────────────────────────── */}
          <Route path="/login" element={<Navigate to="/sign-in" replace />} />
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />

          {/* ── Protected Routes ─────────────────────────────────────── */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/simulations" element={<ProtectedRoute><SimulationsPage /></ProtectedRoute>} />

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

          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
          <Route path="/tracks" element={<ProtectedRoute><TracksPage /></ProtectedRoute>} />
          <Route path="/industries" element={<ProtectedRoute><IndustriesPage /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
          <Route path="/briefing" element={<ProtectedRoute><ProjectBriefingPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default Router;
