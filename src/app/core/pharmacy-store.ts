import { Injectable, signal } from '@angular/core';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface PharmacyRecord {
  id: string;
  [key: string]: string | number | boolean | unknown;
}

export interface ReturnRequest {
  id: string;
  invoiceId: string;
  customer: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
  method: string;
  amount: number;
  date: string;
  status: 'pending' | 'refunded' | 'rejected';
}

export interface ReturnableItem {
  productId: string;
  productName: string;
  remaining: number;
  unitPrice: number;
}

type RecordSet = Record<string, PharmacyRecord[]>;

const seedRoles: Role[] = [
  { id: 'role-admin', name: 'Administrator', description: 'Full access across the pharmacy workspace.', permissions: ['dashboard', 'pos', 'sales', 'prescriptions', 'returns', 'inventory', 'products', 'purchasing', 'customers', 'suppliers', 'reports', 'users', 'permissions', 'masterData', 'settings'] },
  { id: 'role-manager', name: 'Branch manager', description: 'Manage one branch and its daily operations.', permissions: ['dashboard', 'pos', 'sales', 'prescriptions', 'returns', 'inventory', 'products', 'purchasing', 'customers', 'suppliers', 'reports', 'users'] },
  { id: 'role-pharmacist', name: 'Pharmacist', description: 'Dispense medicine and review prescriptions.', permissions: ['dashboard', 'pos', 'sales', 'prescriptions', 'returns', 'inventory', 'products', 'customers'] },
  { id: 'role-cashier', name: 'Cashier', description: 'Process sales and customer returns.', permissions: ['dashboard', 'pos', 'sales', 'returns', 'customers'] },
];

const seedRecords: RecordSet = {
  users: [
    { id: 'USR-001', name: 'Sherif Mostafa', email: 'sherif@pharmacybyme.eg', role: 'Administrator', branch: 'Zamalek', status: 'Active' },
    { id: 'USR-002', name: 'Salma Khaled', email: 'salma@pharmacybyme.eg', role: 'Pharmacist', branch: 'Zamalek', status: 'Active' },
    { id: 'USR-003', name: 'Mahmoud Ali', email: 'mahmoud@pharmacybyme.eg', role: 'Cashier', branch: 'Nasr City', status: 'Active' },
  ],
  products: [
    { id: 'MED-001', name: 'Panadol Extra 20 tablets', barcode: '6223001201058', category: 'Pain relief', price: 52, quantity: 8, reorder: 20, batch: 'B-128 / 18 Jul 2026' },
    { id: 'MED-002', name: 'Augmentin 1g 14 tablets', barcode: '6223001202048', category: 'Antibiotics', price: 220, quantity: 5, reorder: 12, batch: 'A-441 / 05 Aug 2026' },
    { id: 'MED-003', name: 'Vitamin D3 5000 IU', barcode: '6223001204511', category: 'Vitamins', price: 90, quantity: 42, reorder: 10, batch: 'D-520 / 10 Feb 2027' },
    { id: 'MED-004', name: 'Brufen 400mg 30 tablets', barcode: '6223001205327', category: 'Pain relief', price: 39, quantity: 67, reorder: 15, batch: 'B-332 / 19 Mar 2027' },
  ],
  customers: [
    { id: 'CUS-1042', name: 'Nour Hassan', phone: '010 2345 6789', visits: 12, balance: 0 },
    { id: 'CUS-1043', name: 'Omar Fathy', phone: '011 0987 6543', visits: 8, balance: 125 },
  ],
  suppliers: [
    { id: 'SUP-001', name: 'EVA Pharma', phone: '02 2528 8500', email: 'orders@evapharma.com', terms: '30 days' },
    { id: 'SUP-002', name: 'GSK Egypt', phone: '02 3539 1000', email: 'supply.eg@gsk.com', terms: '45 days' },
  ],
  sales: [
    { id: 'INV-240618', date: '18 Jun 2026', customer: 'Nour Hassan', total: 684.5, status: 'Paid', items: [{ productId: 'MED-001', productName: 'Panadol Extra 20 tablets', quantity: 2, unitPrice: 52 }, { productId: 'MED-003', productName: 'Vitamin D3 5000 IU', quantity: 1, unitPrice: 90 }] },
    { id: 'INV-240617', date: '18 Jun 2026', customer: 'Walk-in customer', total: 237, status: 'Paid', items: [{ productId: 'MED-002', productName: 'Augmentin 1g 14 tablets', quantity: 1, unitPrice: 220 }] },
    { id: 'INV-240616', date: '18 Jun 2026', customer: 'Omar Fathy', total: 1250, status: 'Pending', items: [{ productId: 'MED-001', productName: 'Panadol Extra 20 tablets', quantity: 1, unitPrice: 52 }] },
  ],
  prescriptions: [
    { id: 'RX-00814', customer: 'Youssef Adel', doctor: 'Dr. Karim Nassar', date: '18 Jun 2026', status: 'Pending' },
    { id: 'RX-00813', customer: 'Farida Samir', doctor: 'Dr. Dina Maher', date: '18 Jun 2026', status: 'Pending' },
  ],
  purchases: [
    { id: 'PO-00291', supplier: 'EVA Pharma', date: '18 Jun 2026', expected: '20 Jun 2026', total: 12480, status: 'Pending' },
    { id: 'PO-00290', supplier: 'GSK Egypt', date: '17 Jun 2026', expected: '19 Jun 2026', total: 8960, status: 'Received' },
  ],
  masterData: [
    { id: 'MD-001', name: 'Pain relief', type: 'Medicine category', status: 'Active' },
    { id: 'MD-002', name: 'Cash', type: 'Payment method', status: 'Active' },
    { id: 'MD-003', name: 'VAT 14%', type: 'Tax group', status: 'Active' },
  ],
};

const seedReturns: ReturnRequest[] = [
  { id: 'RET-0001', invoiceId: 'INV-240618', customer: 'Nour Hassan', productId: 'MED-001', productName: 'Panadol Extra 20 tablets', quantity: 1, reason: 'Damaged packaging', method: 'Cash', amount: 52, date: '18 Jun 2026', status: 'pending' },
];

@Injectable({ providedIn: 'root' })
export class PharmacyStore {
  readonly roles = signal(this.read('pbm-roles', seedRoles));
  readonly records = signal(this.readRecords());
  readonly returns = signal(this.read('pbm-returns', seedReturns));

  saveRole(role: Role): void {
    this.roles.update((roles) => {
      const exists = roles.some((current) => current.id === role.id);
      return exists ? roles.map((current) => current.id === role.id ? role : current) : [...roles, role];
    });
    this.persist('pbm-roles', this.roles());
  }

  deleteRole(id: string): void {
    this.roles.update((roles) => roles.filter((role) => role.id !== id));
    this.persist('pbm-roles', this.roles());
  }

  hasPermission(roleName: string | undefined, module: string, action: string = 'view'): boolean {
    if (!roleName) return false;
    const role = this.roles().find((item) => item.name.trim().toLowerCase() === roleName.trim().toLowerCase());
    return Boolean(role && (
      role.permissions.includes(module) ||
      role.permissions.includes(`${module}:*`) ||
      role.permissions.includes(`${module}:${action}`)
    ));
  }

  permissionModuleCount(role: Role): number {
    return new Set(role.permissions.map((permission) => permission.split(':')[0])).size;
  }

  saveRecord(kind: string, record: PharmacyRecord): void {
    this.records.update((all) => {
      const rows = all[kind] ?? [];
      const exists = rows.some((row) => row.id === record.id);
      return { ...all, [kind]: exists ? rows.map((row) => row.id === record.id ? record : row) : [record, ...rows] };
    });
    this.persist('pbm-records', this.records());
  }

  deleteRecord(kind: string, id: string): void {
    this.records.update((all) => ({ ...all, [kind]: (all[kind] ?? []).filter((row) => row.id !== id) }));
    this.persist('pbm-records', this.records());
  }

  returnableItems(invoiceId: string): ReturnableItem[] {
    const invoice = this.records()['sales']?.find((row) => row.id === invoiceId);
    if (!invoice || !Array.isArray(invoice['items'])) return [];
    const items = invoice['items'] as Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
    return items.map((item) => {
      const alreadyReturned = this.returns().filter((request) => request.invoiceId === invoiceId && request.productId === item.productId && request.status !== 'rejected').reduce((sum, request) => sum + request.quantity, 0);
      return { productId: item.productId, productName: item.productName, remaining: Math.max(0, item.quantity - alreadyReturned), unitPrice: item.unitPrice };
    }).filter((item) => item.remaining > 0);
  }

  createReturn(input: Omit<ReturnRequest, 'id' | 'amount' | 'date' | 'status'>): boolean {
    const item = this.returnableItems(input.invoiceId).find((candidate) => candidate.productId === input.productId);
    if (!item || input.quantity <= 0 || input.quantity > item.remaining) return false;
    const request: ReturnRequest = {
      ...input,
      id: `RET-${String(Date.now()).slice(-6)}`,
      amount: item.unitPrice * input.quantity,
      date: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
      status: 'pending',
    };
    this.returns.update((returns) => [request, ...returns]);
    this.persist('pbm-returns', this.returns());
    return true;
  }

  updateReturnStatus(id: string, status: ReturnRequest['status']): void {
    const request = this.returns().find((item) => item.id === id);
    if (!request || request.status !== 'pending') return;
    if (status === 'refunded') {
      const product = this.records()['products']?.find((item) => item.id === request.productId);
      if (product) this.saveRecord('products', { ...product, quantity: Number(product['quantity']) + request.quantity });
    }
    this.returns.update((returns) => returns.map((item) => item.id === id ? { ...item, status } : item));
    this.persist('pbm-returns', this.returns());
  }

  private read<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : fallback;
    } catch {
      return fallback;
    }
  }

  private readRecords(): RecordSet {
    const stored = this.read<RecordSet>('pbm-records', {});
    const records = { ...seedRecords, ...stored };
    const users = records['users'] ?? [];
    const adminEmails = ['mariam@pharmacybyme.eg', 'sherif@pharmacybyme.eg'];
    const hasLegacyAdmin = users.some((user) => adminEmails.includes(String(user['email'])) && (user['email'] !== 'sherif@pharmacybyme.eg' || user['name'] !== 'Sherif Mostafa' || user['role'] !== 'Administrator'));
    if (hasLegacyAdmin) {
      const adminRecord = users.find((user) => adminEmails.includes(String(user['email'])));
      records['users'] = [
        ...users.filter((user) => !adminEmails.includes(String(user['email']))),
        ...(adminRecord ? [{ ...adminRecord, id: 'USR-001', name: 'Sherif Mostafa', email: 'sherif@pharmacybyme.eg', role: 'Administrator' }] : []),
      ];
      this.persist('pbm-records', records);
    }
    return records;
  }

  private persist(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
