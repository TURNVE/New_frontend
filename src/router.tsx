import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Program1Page from './pages/program1/Program1Page';
import AuthPage from './pages/auth/AuthPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import SimulationsPage from './pages/SimulationsPage';
import SimulationPage from './pages/SimulationPage';
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

// ── Modular simulation pages (new architecture) ───────────────
import PayLinkSimulation from './features/sim-pm-001-paylink/PayLinkSimulation';

function Router() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/bootcamp" element={<Program1Page />} />

          <Route path="/login" element={<AuthPage />} />
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/simulations" element={<SimulationsPage />} />

          {/* ── Modular simulations (new SimulationShell architecture) ── */}
          <Route path="/simulation/pm-01/*" element={<PayLinkSimulation />} />
          <Route path="/simulation/sim-pm-001/*" element={<PayLinkSimulation />} />

          {/* ── Legacy simulation page (other sim IDs fall here) ── */}
          <Route path="/simulation/:id" element={<SimulationPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/tracks" element={<TracksPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/briefing" element={<ProjectBriefingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default Router;
