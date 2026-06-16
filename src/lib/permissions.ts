import type { OrganizationRole } from './organization/types';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ['*'],
  admin: ['create:simulation', 'edit:simulation', 'delete:simulation', 'manage:members', 'manage:team', 'manage:clients', 'manage:settings', 'view:analytics'],
  editor: ['view:simulation', 'create:simulation', 'edit:simulation'],
  member: ['view:simulation', 'create:simulation', 'edit:simulation'],
  viewer: ['view:simulation', 'view:analytics'],
};

export function hasPermission(role: OrganizationRole | string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
}
