import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth';
import { LocaleService } from '../../core/locale';
import { PharmacyRecord, PharmacyStore } from '../../core/pharmacy-store';

interface Field { key: string; label: string; }
interface Definition { title: string; fields: Field[]; }
interface SelectOption { value: string; label: string; }

const definitions: Record<string, Definition> = {
  users: { title: 'usersTitle', fields: [{ key: 'name', label: 'name' }, { key: 'email', label: 'email' }, { key: 'role', label: 'role' }, { key: 'branch', label: 'branchField' }, { key: 'status', label: 'status' }] },
  products: { title: 'productsTitle', fields: [{ key: 'name', label: 'productName' }, { key: 'barcode', label: 'barcode' }, { key: 'category', label: 'category' }, { key: 'price', label: 'price' }, { key: 'quantity', label: 'stock' }, { key: 'reorder', label: 'reorder' }, { key: 'batch', label: 'batch' }] },
  customers: { title: 'customersTitle', fields: [{ key: 'name', label: 'name' }, { key: 'phone', label: 'phone' }, { key: 'visits', label: 'visits' }, { key: 'balance', label: 'balance' }] },
  suppliers: { title: 'suppliersTitle', fields: [{ key: 'name', label: 'name' }, { key: 'phone', label: 'phone' }, { key: 'email', label: 'email' }, { key: 'terms', label: 'terms' }] },
  sales: { title: 'salesTitle', fields: [{ key: 'date', label: 'date' }, { key: 'customer', label: 'customer' }, { key: 'total', label: 'total' }, { key: 'status', label: 'status' }] },
  prescriptions: { title: 'prescriptionsTitle', fields: [{ key: 'customer', label: 'customer' }, { key: 'doctor', label: 'doctor' }, { key: 'date', label: 'date' }, { key: 'status', label: 'status' }] },
  purchases: { title: 'purchasesTitle', fields: [{ key: 'supplier', label: 'supplier' }, { key: 'date', label: 'date' }, { key: 'expected', label: 'expected' }, { key: 'total', label: 'total' }, { key: 'status', label: 'status' }] },
  masterData: { title: 'standardsTitle', fields: [{ key: 'name', label: 'name' }, { key: 'type', label: 'type' }, { key: 'status', label: 'status' }] },
};

@Component({
  selector: 'app-records',
  imports: [CommonModule, FormsModule],
  templateUrl: './records.html',
  styleUrl: './records.css',
})
export class RecordsPage {
  readonly kind = signal('products');
  readonly mode = signal('');
  readonly query = signal('');
  readonly formOpen = signal(false);
  readonly formError = signal('');
  readonly store: PharmacyStore;
  readonly locale: LocaleService;
  readonly auth: AuthService;
  readonly definition = computed(() => definitions[this.kind()] ?? definitions['products']);
  readonly permissionModule = computed(() => {
    const mode = this.mode();
    if (mode === 'pos' || mode === 'reports' || mode === 'settings' || mode === 'inventory') return mode;
    return this.kind() === 'products' ? 'products' : this.kind();
  });
  readonly canCreate = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, this.permissionModule(), 'create'));
  readonly canEdit = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, this.permissionModule(), 'edit'));
  readonly canDelete = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, this.permissionModule(), 'delete'));
  readonly rows = computed(() => (this.store.records()[this.kind()] ?? []).filter((row) => JSON.stringify(row).toLowerCase().includes(this.query().trim().toLowerCase())));
  draft: Record<string, string | number | boolean | unknown> = {};
  passwordDraft = '';
  editingId = '';
  private editingEmail = '';

  constructor(route: ActivatedRoute, store: PharmacyStore, locale: LocaleService, auth: AuthService) {
    this.store = store;
    this.locale = locale;
    this.auth = auth;
    route.paramMap.subscribe((params) => {
      const kind = params.get('kind') ?? 'products';
      this.kind.set(definitions[kind] ? kind : 'products');
      this.query.set('');
      this.formOpen.set(false);
    });
    route.queryParamMap.subscribe((params) => this.mode.set(params.get('mode') ?? ''));
  }

  open(row?: PharmacyRecord): void {
    if (row ? !this.canEdit() : !this.canCreate()) return;
    this.editingId = row?.id ?? '';
    this.editingEmail = String(row?.['email'] ?? '');
    this.passwordDraft = '';
    this.formError.set('');
    this.draft = row ? { ...row } : this.kind() === 'users'
      ? { role: this.store.roles()[0]?.name ?? '', branch: 'Zamalek', status: 'Active' }
      : {};
    this.formOpen.set(true);
  }

  optionsFor(field: Field): SelectOption[] | null {
    if (this.kind() !== 'users') return null;
    if (field.key === 'role') return this.store.roles().map((role) => ({ value: role.name, label: role.name }));
    if (field.key === 'branch') {
      return [
        { value: 'Zamalek', label: this.locale.text('branchZamalek') },
        { value: 'Nasr City', label: this.locale.text('branchNasrCity') },
        { value: 'Maadi', label: this.locale.text('branchMaadi') },
        { value: 'New Cairo', label: this.locale.text('branchNewCairo') },
        { value: 'Heliopolis', label: this.locale.text('branchHeliopolis') },
      ];
    }
    if (field.key === 'status') {
      return [
        { value: 'Active', label: this.locale.text('active') },
        { value: 'Inactive', label: this.locale.text('inactive') },
      ];
    }
    return null;
  }

  async save(): Promise<void> {
    if (this.editingId ? !this.canEdit() : !this.canCreate()) return;
    const fields = this.definition().fields;
    if (fields.some((field) => String(this.draft[field.key] ?? '').trim() === '')) return;
    if (this.kind() === 'users') {
      const email = String(this.draft['email']).trim().toLowerCase();
      const name = String(this.draft['name']);
      const role = String(this.draft['role']);
      if (!this.editingId && this.passwordDraft.length < 8) {
        this.formError.set(this.passwordDraft ? 'passwordMinLength' : 'passwordRequired');
        return;
      }
      if (this.editingId && this.passwordDraft && this.passwordDraft.length < 8) {
        this.formError.set('passwordMinLength');
        return;
      }
      const duplicate = (this.store.records()['users'] ?? []).some((user) => user.id !== this.editingId && String(user['email']).trim().toLowerCase() === email);
      if (duplicate) {
        this.formError.set('duplicateUserEmail');
        return;
      }
      const credentialSaved = this.editingId
        ? await this.auth.updateAccount(this.editingEmail, email, this.passwordDraft, name, role)
        : await this.auth.createAccount(email, this.passwordDraft, name, role);
      if (!credentialSaved) {
        this.formError.set('duplicateUserEmail');
        return;
      }
    }
    const id = this.editingId || `${this.kind().slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    this.store.saveRecord(this.kind(), { ...this.draft, id } as PharmacyRecord);
    this.formOpen.set(false);
  }

  remove(row: PharmacyRecord): void {
    if (!this.canDelete()) return;
    if (window.confirm(this.locale.text('confirmDelete'))) this.store.deleteRecord(this.kind(), row.id);
  }

  value(row: PharmacyRecord, field: Field): string {
    const value = row[field.key];
    return value === undefined || value === null ? '—' : String(value);
  }
}
