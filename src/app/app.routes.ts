import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { permissionGuard } from './core/permission.guard';
import { AccessDeniedPage } from './pages/access-denied/access-denied';
import { DashboardPage } from './pages/dashboard/dashboard';
import { LoginPage } from './pages/login/login';
import { PermissionsPage } from './pages/permissions/permissions';
import { ReturnsPage } from './pages/returns/returns';
import { RecordsPage } from './pages/records/records';

export const routes: Routes = [
	{ path: 'login', component: LoginPage },
	{ path: 'access-denied', component: AccessDeniedPage, canActivate: [authGuard] },
	{
		path: '',
		children: [
			{ path: '', component: DashboardPage, canActivate: [authGuard, permissionGuard] },
			{ path: 'permissions', component: PermissionsPage, canActivate: [authGuard, permissionGuard], data: { permission: 'permissions' } },
			{ path: 'returns', component: ReturnsPage, canActivate: [authGuard, permissionGuard], data: { permission: 'returns' } },
			{ path: 'records/:kind', component: RecordsPage, canActivate: [authGuard, permissionGuard] },
		],
	},
	{ path: '**', redirectTo: '' },
];
