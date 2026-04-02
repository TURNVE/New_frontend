import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import IndustriesPage from '../pages/IndustriesPage';
import TracksPage from '../pages/TracksPage';
import ConfirmationPage from '../pages/ConfirmationPage';
import SimulationPage from '../pages/SimulationPage';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <LoginPage />
  },
  {
    path: '/sign-in',
    element: <AuthPage />
  },
  {
    path: '/sign-up',
    element: <SignUpPage />
  },
  {
    path: '/auth/callback',
    element: <OAuthCallbackPage />
  },
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/industries',
    element: <IndustriesPage />
  },
  {
    path: '/tracks',
    element: <TracksPage />
  },
  {
    path: '/confirmation',
    element: <ConfirmationPage />
  },
  {
    path: '/simulation/:id',
    element: <SimulationPage />
  },
  // PM Simulation Templates
  {
    path: '/simulation/sim-pm-001',
    element: <SimulationPage />
  },
  {
    path: '/simulation/sim-pm-002',
    element: <SimulationPage />
  },
  {
    path: '/simulation/sim-pm-003',
    element: <SimulationPage />
  },
  {
    path: '/simulation/sim-pm-004',
    element: <SimulationPage />
  },
  {
    path: '/simulations',
    element: <SimulationsPage />
  },
  {
    path: '/portfolio',
    element: <PortfolioPage />
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/team',
    element: <TeamPage />
  },
  {
    path: '/achievements',
    element: <AchievementsPage />
  },
  {
    path: '/projects',
    element: <ProjectsPage />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;