import { adminStats, type AdminAnalyticsTimeRange } from './admin';

export type {
  AdminAnalyticsData,
  AdminAnalyticsTimeRange,
  AdminDashboardData,
  AdminDashboardStats,
  AdminRecentActivity,
  AdminRecentSimulation,
} from './admin';

export function getAdminDashboardStats() {
  return adminStats.getDashboard();
}

export function getAdminAnalytics(timeRange: AdminAnalyticsTimeRange) {
  return adminStats.getAnalytics(timeRange);
}

export function getEmptyAdminDashboardStats() {
  return adminStats.emptyDashboard();
}

export function getEmptyAdminAnalytics() {
  return adminStats.emptyAnalytics();
}
