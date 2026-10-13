import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { LocaleService } from '../../core/locale';
import { PharmacyStore, ReturnRequest } from '../../core/pharmacy-store';

@Component({
  selector: 'app-returns',
  imports: [CommonModule, FormsModule],
  templateUrl: './returns.html',
  styleUrl: './returns.css',
})
export class ReturnsPage {
  readonly formOpen = signal(false);
  readonly errorKey = signal('');
  readonly invoiceId = signal('');
  readonly store: PharmacyStore;
  readonly locale: LocaleService;
  readonly auth: AuthService;
  readonly canCreate = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'returns', 'create'));
  readonly canReview = computed(() => this.store.hasPermission(this.auth.currentUser()?.role, 'returns', 'review'));
  readonly invoices = computed(() => this.store.records()['sales'] ?? []);
  readonly returnableItems = computed(() => this.store.returnableItems(this.invoiceId()));
  draft = { invoiceId: '', productId: '', quantity: 1, reason: '', method: 'cash' };

  constructor(store: PharmacyStore, locale: LocaleService, auth: AuthService) {
    this.store = store;
    this.locale = locale;
    this.auth = auth;
  }

  open(): void {
    if (!this.canCreate()) return;
    this.draft = { invoiceId: '', productId: '', quantity: 1, reason: '', method: 'cash' };
    this.invoiceId.set('');
    this.errorKey.set('');
    this.formOpen.set(true);
  }

  invoiceChanged(invoiceId: string): void {
    this.draft.invoiceId = invoiceId;
    this.invoiceId.set(invoiceId);
    this.draft.productId = '';
    this.draft.quantity = 1;
  }

  get selectedItem() {
    return this.returnableItems().find((item) => item.productId === this.draft.productId);
  }

  get refundAmount(): number {
    return (this.selectedItem?.unitPrice ?? 0) * Number(this.draft.quantity || 0);
  }

  create(): void {
    if (!this.canCreate()) return;
    const invoice = this.invoices().find((row) => row.id === this.draft.invoiceId);
    if (!invoice || !this.selectedItem) { this.errorKey.set('invoiceRequired'); return; }
    if (!Number.isInteger(Number(this.draft.quantity)) || Number(this.draft.quantity) < 1 || Number(this.draft.quantity) > this.selectedItem.remaining) {
      this.errorKey.set('quantityInvalid'); return;
    }
    const saved = this.store.createReturn({
      invoiceId: this.draft.invoiceId,
      customer: String(invoice['customer'] ?? ''),
      productId: this.draft.productId,
      productName: this.selectedItem.productName,
      quantity: Number(this.draft.quantity),
      reason: this.draft.reason,
      method: this.draft.method,
    });
    if (!saved) { this.errorKey.set('quantityInvalid'); return; }
    this.formOpen.set(false);
  }

  review(request: ReturnRequest, status: 'refunded' | 'rejected'): void {
    if (!this.canReview()) return;
    this.store.updateReturnStatus(request.id, status);
  }

  statusLabel(status: ReturnRequest['status']): string {
    return this.locale.text(status);
  }

  amount(value: number): string {
    const formatted = new Intl.NumberFormat(this.locale.language() === 'ar' ? 'ar-EG' : 'en-EG', { maximumFractionDigits: 2 }).format(value);
    return this.locale.language() === 'ar' ? `${formatted} ${this.locale.text('amountEGP')}` : `EGP ${formatted}`;
  }
}
