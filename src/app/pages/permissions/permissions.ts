import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { LocaleService } from '../../core/locale';
import { PharmacyStore, Role } from '../../core/pharmacy-store';

interface ModuleOption { key: string; en: string; ar: string; }

@Component({
  selector: 'app-permissions',
  imports: [CommonModule, FormsModule],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css',
})
export class PermissionsPage {
  readonly modules: ModuleOption[] = [
    { key: 'dashboard', en: 'Dashboard', ar: 'لوحة التحكم' }, { key: 'pos', en: 'Point of sale', ar: 'نقطة البيع' },
    { key: 'sales', en: 'Sales & invoices', ar: 'المبيعات والفواتير' }, { key: 'prescriptions', en: 'Prescriptions', ar: 'الوصفات الطبية' },
    { key: 'returns', en: 'Returns & refunds', ar: 'المرتجعات والاسترداد' }, { key: 'inventory', en: 'Inventory', ar: 'المخزون' },
    { key: 'products', en: 'Medicine catalog', ar: 'دليل الأدوية' }, { key: 'purchasing', en: 'Purchasing', ar: 'المشتريات' },
    { key: 'customers', en: 'Customers', ar: 'العملاء' }, { key: 'suppliers', en: 'Suppliers', ar: 'الموردون' },
    { key: 'reports', en: 'Reports', ar: 'التقارير' }, { key: 'users', en: 'Users & staff', ar: 'المستخدمون والفريق' },
    { key: 'permissions', en: 'Roles & permissions', ar: 'الأدوار والصلاحيات' }, { key: 'masterData', en: 'Standard data', ar: 'البيانات الأساسية' },
    { key: 'settings', en: 'Settings', ar: 'الإعدادات' },
  ];
  readonly actions = ['view', 'create', 'edit', 'delete', 'review'];
  readonly formOpen = signal(false);
  readonly errorKey = signal('');
  readonly store: PharmacyStore;
  readonly locale: LocaleService;
  readonly auth: AuthService;
  readonly canCreate = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'permissions', 'create'));
  readonly canEdit = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'permissions', 'edit'));
  readonly canDelete = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'permissions', 'delete'));
  draft: Role = this.emptyRole();
  editingId = '';

  constructor(store: PharmacyStore, locale: LocaleService, auth: AuthService) {
    this.store = store;
    this.locale = locale;
    this.auth = auth;
  }

  moduleLabel(module: ModuleOption): string {
    return this.locale.language() === 'ar' ? module.ar : module.en;
  }

  open(role?: Role): void {
    if (role ? !this.canEdit() : !this.canCreate()) return;
    this.editingId = role?.id ?? '';
    this.draft = role ? { ...role, permissions: [...role.permissions] } : this.emptyRole();
    this.errorKey.set('');
    this.formOpen.set(true);
  }

  permissionChecked(module: string, action: string): boolean {
    return this.draft.permissions.includes(module) || this.draft.permissions.includes(`${module}:${action}`);
  }

  togglePermission(module: string, action: string, checked: boolean): void {
    const selected = new Set(this.draft.permissions);
    const wasModuleWide = selected.delete(module);
    if (wasModuleWide) {
      for (const existingAction of this.actions) selected.add(`${module}:${existingAction}`);
    }
    const permission = `${module}:${action}`;
    checked ? selected.add(permission) : selected.delete(permission);
    this.draft.permissions = [...selected];
  }

  save(): void {
    if (this.editingId ? !this.canEdit() : !this.canCreate()) return;
    const name = this.draft.name.trim();
    if (!this.draft.permissions.length) { this.errorKey.set('noPermissions'); return; }
    if (this.store.roles().some((role) => role.id !== this.editingId && role.name.trim().toLowerCase() === name.toLowerCase())) {
      this.errorKey.set('duplicateRole'); return;
    }
    this.store.saveRole({ ...this.draft, id: this.editingId || `role-${Date.now()}`, name });
    this.formOpen.set(false);
  }

  remove(role: Role): void {
    if (!this.canDelete()) return;
    if (window.confirm(`${this.locale.text('deleteRole')} “${role.name}”?`)) this.store.deleteRole(role.id);
  }

  private emptyRole(): Role {
    return { id: '', name: '', description: '', permissions: [] };
  }
}
