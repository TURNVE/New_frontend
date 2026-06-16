import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Program1Page from './pages/program1/Program1Page';
import NotFoundPage from './pages/notfound/NotFoundPage';
import OrganizationPage from './pages/organization/OrganizationPage';
import AboutPage from './pages/about/AboutPage';
import TestimonialPage from './pages/testimonial/TestimonialPage';
import FeaturesPage from './pages/features/FeaturesPage';
import BusinessPage from './pages/business/BusinessPage';
import TeamPage from './pages/team/TeamPage';
import ServicesPage from './pages/services/ServicesPage';
import BlogPage from './pages/blog/BlogPage';

// Organization Pages - Direct imports
import OrgDashboardPage from './pages/organization/OrgDashboardPage';
import OrgCreatePage from './pages/organization/OrgCreatePage';
import OrgSimulationsPage from './pages/organization/OrgSimulationsPage';
import OrgSimulationCreatePage from './pages/organization/OrgSimulationCreatePage';
import OrgSimulationEditPage from './pages/organization/OrgSimulationEditPage';
import OrgClientsPage from './pages/organization/OrgClientsPage';
import OrgClientDetailPage from './pages/organization/OrgClientDetailPage';
import OrgAnalyticsPage from './pages/organization/OrgAnalyticsPage';
import OrgSettingsPage from './pages/organization/OrgSettingsPage';
import OrgTeamPage from './pages/organization/OrgTeamPage';
import DirectAccessPage from './pages/organization/DirectAccessPage';

// Auth
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import AuthPage from './pages/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';

// Admin Pages
import AdminPage from './pages/admin/AdminPage';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        <Route path="/signin" element={<AuthPage mode="sign-in" />} />
        <Route path="/login" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
        <Route path="/signup" element={<AuthPage mode="sign-up" />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/service" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/projects" element={<BusinessPage />} />
        <Route path="/testimonial" element={<TestimonialPage />} />
        <Route path="/testimonials" element={<TestimonialPage />} />
        <Route path="/access/:token" element={<DirectAccessPage />} />
        <Route path="/program1" element={
          <ProtectedRoute>
            <Program1Page />
          </ProtectedRoute>
        } />
        
        {/* Organization Routes - Protected */}
        <Route path="/org/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path="create" element={<OrgCreatePage />} />
              <Route path="dashboard" element={<OrgDashboardPage />} />
              <Route path="simulations" element={<OrgSimulationsPage />} />
              <Route path="simulations/new" element={
                <RoleProtectedRoute requiredPermission="create:simulation">
                  <OrgSimulationCreatePage />
                </RoleProtectedRoute>
              } />
              <Route path="simulations/:id/edit" element={
                <RoleProtectedRoute requiredPermission="edit:simulation">
                  <OrgSimulationEditPage />
                </RoleProtectedRoute>
              } />
              <Route path="clients" element={<OrgClientsPage />} />
              <Route path="clients/:id" element={<OrgClientDetailPage />} />
              <Route path="team" element={
                <RoleProtectedRoute requiredPermission="manage:team">
                  <OrgTeamPage />
                </RoleProtectedRoute>
              } />
              <Route path="analytics" element={
                <RoleProtectedRoute requiredPermission="view:analytics">
                  <OrgAnalyticsPage />
                </RoleProtectedRoute>
              } />
              <Route path="settings" element={
                <RoleProtectedRoute requiredPermission="manage:settings">
                  <OrgSettingsPage />
                </RoleProtectedRoute>
              } />
            </Routes>
          </ProtectedRoute>
        } />
        
        {/* Platform Admin Route */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <RoleProtectedRoute requiredRole="admin">
              <AdminPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } />
        
        {/* Catch all - 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
