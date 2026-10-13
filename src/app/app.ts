import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth';
import { LocaleService } from './core/locale';
import { PharmacyStore } from './core/pharmacy-store';

interface NavigationItem { label: string; route: string; icon: string; permission: string; query?: Record<string, string>; }
interface NavigationGroup { label: string; items: NavigationItem[]; }

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly menuOpen = signal(false);
  readonly sidebarPinned = signal(localStorage.getItem('pbm-sidebar-pinned') !== 'false');
  readonly locale: LocaleService;
  readonly auth: AuthService;
  readonly store: PharmacyStore;
  readonly groups: NavigationGroup[] = [
    { label: 'operations', items: [
      { label: 'dashboard', route: '/', icon: '◫', permission: 'dashboard' }, { label: 'pointOfSale', route: '/records/sales', query: { mode: 'pos' }, icon: '▣', permission: 'pos' },
      { label: 'sales', route: '/records/sales', icon: '↗', permission: 'sales' }, { label: 'prescriptions', route: '/records/prescriptions', icon: '⊙', permission: 'prescriptions' },
      { label: 'returns', route: '/returns', icon: '↩', permission: 'returns' },
    ] },
    { label: 'catalog', items: [
      { label: 'inventory', route: '/records/products', query: { mode: 'inventory' }, icon: '▤', permission: 'inventory' }, { label: 'products', route: '/records/products', icon: '⊞', permission: 'products' },
      { label: 'purchasing', route: '/records/purchases', icon: '⇄', permission: 'purchasing' }, { label: 'customers', route: '/records/customers', icon: '♙', permission: 'customers' },
      { label: 'suppliers', route: '/records/suppliers', icon: '♧', permission: 'suppliers' },
    ] },
    { label: 'management', items: [
      { label: 'reports', route: '/records/sales', query: { mode: 'reports' }, icon: '▥', permission: 'reports' }, { label: 'users', route: '/records/users', icon: '♙', permission: 'users' },
      { label: 'permissions', route: '/permissions', icon: '◇', permission: 'permissions' }, { label: 'masterData', route: '/records/masterData', icon: '☷', permission: 'masterData' },
      { label: 'settings', route: '/records/masterData', query: { mode: 'settings' }, icon: '⚙', permission: 'settings' },
    ] },
  ];
  readonly visibleGroups = computed(() => this.groups
    .map((group) => ({ ...group, items: group.items.filter((item) => this.store.hasPermission(this.auth.currentUser()?.role, item.permission, 'view')) }))
    .filter((group) => group.items.length > 0));

  constructor(locale: LocaleService, auth: AuthService, store: PharmacyStore, private readonly router: Router) {
    this.locale = locale;
    this.auth = auth;
    this.store = store;
  }

  closeMenu(): void { this.menuOpen.set(false); }

  toggleNavigation(): void {
    if (window.matchMedia('(max-width: 760px)').matches) {
      this.menuOpen.update((open) => !open);
      return;
    }
    this.sidebarPinned.update((pinned) => {
      const next = !pinned;
      localStorage.setItem('pbm-sidebar-pinned', String(next));
      return next;
    });
  }

  get navigationTitle(): string {
    return window.matchMedia('(max-width: 760px)').matches
      ? this.locale.text('toggleNavigation')
      : this.locale.text(this.sidebarPinned() ? 'hideNavigation' : 'pinNavigation');
  }

  signOut(): void {
    this.closeMenu();
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
