import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(file, 'utf8');
const exists = (file) => fs.existsSync(file);
const migrations = fs.readdirSync('supabase/migrations').map((file) => path.join('supabase/migrations', file));

const files = {
  router: read('src/router.tsx'),
  header: read('src/components/layout/Header.tsx'),
  app: read('src/App.tsx'),
  auth: read('src/lib/auth.ts'),
  companyDashboard: read('src/pages/company/CompanyDashboardPage.tsx'),
  adminDashboard: read('src/pages/admin/AdminDashboardPage.tsx'),
  adminAnalytics: read('src/pages/admin/AdminAnalyticsPage.tsx'),
};

const migrationText = migrations.map(read).join('\n');

const checks = [
  {
    name: 'Public company entry routes exist before protected company dashboard routes',
    passed:
      files.router.includes('path="/company/start"') &&
      files.router.includes('path="/company/login"') &&
      files.router.includes('path="/company/sign-up"') &&
      files.router.includes('loginPath="/company/login"'),
  },
  {
    name: 'Homepage/header expose a company entry point',
    passed:
      files.header.includes("href: '/company/start'") &&
      files.app.includes('to="/company/start"') &&
      files.app.includes('Company Simulation Studio'),
  },
  {
    name: 'Company auth constants use company-facing paths',
    passed:
      files.auth.includes("ORG_SIGN_IN: '/company/login'") &&
      files.auth.includes("ORG_SIGN_UP: '/company/sign-up'"),
  },
  {
    name: 'Company statistics data layer and dashboard metrics are implemented',
    passed:
      exists('src/lib/companyStats.ts') &&
      files.companyDashboard.includes('getCompanyDashboardStats') &&
      files.companyDashboard.includes('Learners reached') &&
      files.companyDashboard.includes('Completion rate'),
  },
  {
    name: 'Admin statistics data layer replaces mocked admin metrics',
    passed:
      exists('src/lib/adminStats.ts') &&
      files.adminDashboard.includes('getAdminDashboardStats') &&
      files.adminAnalytics.includes('getAdminAnalytics') &&
      !files.adminDashboard.includes('Mock stats') &&
      !files.adminAnalytics.includes('Mock data'),
  },
  {
    name: 'Company simulations and admin analytics have database support',
    passed:
      migrationText.includes('create table if not exists public.company_simulations') &&
      migrationText.includes('Admins can view all simulation sessions') &&
      migrationText.includes('Admins can view all simulation scores'),
  },
];

const failures = checks.filter((check) => !check.passed);

if (failures.length > 0) {
  console.error('Business dashboard check failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log('Business dashboard check passed.');
