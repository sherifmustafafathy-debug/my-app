import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { PharmacyStore } from './pharmacy-store';

const kindPermissions: Record<string, string[]> = {
  users: ['users'],
  products: ['products', 'inventory'],
  customers: ['customers'],
  suppliers: ['suppliers'],
  sales: ['sales'],
  prescriptions: ['prescriptions'],
  purchases: ['purchasing'],
  masterData: ['masterData'],
};

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const store = inject(PharmacyStore);
  const router = inject(Router);
  const roleName = auth.currentUser()?.role;
  const requested = route.data['permission'] as string | undefined;
  const kind = route.paramMap.get('kind');
  const mode = route.queryParamMap.get('mode');
  const permissions = requested
    ? [requested]
    : mode === 'pos' ? ['pos']
      : mode === 'reports' ? ['reports']
        : mode === 'settings' ? ['settings']
          : kind ? kindPermissions[kind] ?? [] : ['dashboard'];

  if (permissions.some((permission) => store.hasPermission(roleName, permission, 'view'))) return true;
  return router.createUrlTree(['/access-denied']);
};
