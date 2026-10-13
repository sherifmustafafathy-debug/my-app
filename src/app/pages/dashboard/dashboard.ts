import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { LocaleService } from '../../core/locale';
import { PharmacyRecord, PharmacyStore } from '../../core/pharmacy-store';

@Component({ selector: 'app-dashboard', imports: [CommonModule, RouterLink], templateUrl: './dashboard.html', styleUrl: './dashboard.css' })
export class DashboardPage {
  readonly store: PharmacyStore;
  readonly locale: LocaleService;
  readonly auth: AuthService;
  readonly canViewSales = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'sales', 'view'));
  readonly canViewInventory = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'inventory', 'view'));
  readonly canViewReturns = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'returns', 'view'));
  readonly canStartSale = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'pos', 'view') && this.store.hasPermission(this.auth.currentUser()?.role, 'pos', 'create'));
  constructor(store: PharmacyStore, locale: LocaleService, auth: AuthService) { this.store = store; this.locale = locale; this.auth = auth; }
  money(value: unknown): string { return `EGP ${new Intl.NumberFormat('en-EG', { maximumFractionDigits: 2 }).format(Number(value ?? 0))}`; }
  sumSales = (sum: number, sale: PharmacyRecord): number => sum + Number(sale['total'] ?? 0);
  lowStock = (product: PharmacyRecord): boolean => Number(product['quantity']) <= Number(product['reorder']);
  pending = (request: { status: string }): boolean => request.status === 'pending';
}
