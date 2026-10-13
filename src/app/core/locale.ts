import { effect, Injectable, signal } from '@angular/core';

const copy: Record<'en' | 'ar', Record<string, string>> = {
  en: {
    brand: 'Pharmacy by Me', workspace: 'PHARMACY WORKSPACE', branch: 'Zamalek, Cairo', dashboard: 'Dashboard', operations: 'OPERATIONS', catalog: 'CATALOG', management: 'MANAGEMENT',
    pointOfSale: 'Point of sale', sales: 'Sales & invoices', prescriptions: 'Prescriptions', returns: 'Returns', inventory: 'Inventory', products: 'Medicine catalog', purchasing: 'Purchasing', customers: 'Customers', suppliers: 'Suppliers', reports: 'Reports',
    users: 'Users & staff', permissions: 'Roles & permissions', masterData: 'Standard data', settings: 'Settings', help: 'Help center', overview: 'Overview',
    greeting: 'Good morning, Mariam', greetingPrefix: 'Good morning,', dashboardSub: "Here is what's happening at your pharmacy today.", netSales: 'Net sales today', transactions: 'Transactions', lowStock: 'Low stock items', expiring: 'Expiring soon', recentSales: 'Recent sales', stockAlerts: 'Stock alerts', viewAll: 'View all',
    newSale: 'New sale', newReturn: 'Create return', newRole: 'Add role', addUser: 'Add staff user', addRecord: 'Add record', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', actions: 'Actions', search: 'Search this list...',
    name: 'Name', email: 'Email', password: 'Password', passwordOptional: 'New password (optional)', role: 'Role', branchField: 'Branch', status: 'Status', active: 'Active', inactive: 'Inactive', permissionsLabel: 'Permissions', description: 'Description', selectOption: 'Choose an option', moduleName: 'Module', viewAccess: 'View', createAccess: 'Create', editAccess: 'Edit', deleteAccess: 'Delete', reviewAccess: 'Review', accessDeniedTitle: 'Access not granted', accessDeniedMessage: 'Your role does not include permission to open this area.',
    passwordRequired: 'Set a password for the new user.', passwordMinLength: 'Password must be at least 8 characters.', duplicateUserEmail: 'This email is already registered.', loginTitle: 'Sign in to your pharmacy', loginSubtitle: 'Use your staff account to continue.', login: 'Sign in', checkingLogin: 'Checking…', invalidCredentials: 'Email or password is incorrect.', demoCredentials: 'Demo administrator account', localAuthNote: 'This local demo stores hashed credentials in this browser only. Use a secure backend for real staff accounts.', signOut: 'Sign out', toggleNavigation: 'Toggle navigation', hideNavigation: 'Hide navigation', pinNavigation: 'Pin navigation',
    branchZamalek: 'Zamalek', branchNasrCity: 'Nasr City', branchMaadi: 'Maadi', branchNewCairo: 'New Cairo', branchHeliopolis: 'Heliopolis',
    permissionIntro: 'Create roles and choose exactly which pharmacy areas each role can access.', roleName: 'Role name', roleDescription: 'Role description', modules: 'Application modules', saveRole: 'Save role', editRole: 'Edit role', deleteRole: 'Delete role',
    returnsTitle: 'Returns & refunds', returnsIntro: 'Register returned items, review requests, and track refund status.', returnNo: 'Return #', invoice: 'Invoice', customer: 'Customer', item: 'Medicine', quantity: 'Quantity', reason: 'Return reason', refundMethod: 'Refund method', amount: 'Refund amount', requested: 'Requested', returnStatus: 'Return status', approve: 'Approve & restock', reject: 'Reject', refunded: 'Refunded', rejected: 'Rejected', pending: 'Pending review', createReturn: 'Create return', selectInvoice: 'Select invoice', selectItem: 'Select an item', expiry: 'Expired or near expiry', damaged: 'Damaged packaging', wrongItem: 'Wrong item supplied', customerRequest: 'Customer changed their mind', cash: 'Cash', card: 'Card', wallet: 'Mobile wallet',
    returnSaved: 'Return request saved', roleSaved: 'Role saved', recordSaved: 'Changes saved', confirmDelete: 'Delete this record?', invoiceRequired: 'Choose an invoice and item.', quantityInvalid: 'Enter a valid quantity available on the invoice.', noRecords: 'No records found.',
    amountEGP: 'EGP', productsTitle: 'Medicine catalog', usersTitle: 'Users & staff', customersTitle: 'Customers', suppliersTitle: 'Suppliers', salesTitle: 'Sales & invoices', prescriptionsTitle: 'Prescriptions', purchasesTitle: 'Purchase orders', standardsTitle: 'Standard data',
    productName: 'Medicine name', barcode: 'Barcode', category: 'Category', price: 'Selling price (EGP)', stock: 'Stock', reorder: 'Reorder level', batch: 'Batch / expiry', phone: 'Phone', visits: 'Visits', balance: 'Balance (EGP)', terms: 'Payment terms', date: 'Date', total: 'Total (EGP)', doctor: 'Prescribed by', expected: 'Expected delivery', type: 'Type',
    paid: 'Paid', draft: 'Draft', complete: 'Complete', dashboardLink: 'Workspace', filter: 'Filter', records: 'Records', noPermissions: 'Select at least one module.', duplicateRole: 'A role with this name already exists.',
  },
  ar: {
    brand: 'صيدليتي', workspace: 'نظام الصيدلية', branch: 'الزمالك، القاهرة', dashboard: 'لوحة التحكم', operations: 'العمليات', catalog: 'الكتالوج', management: 'الإدارة',
    pointOfSale: 'نقطة البيع', sales: 'المبيعات والفواتير', prescriptions: 'الوصفات الطبية', returns: 'المرتجعات', inventory: 'المخزون', products: 'دليل الأدوية', purchasing: 'المشتريات', customers: 'العملاء', suppliers: 'الموردون', reports: 'التقارير',
    users: 'المستخدمون والفريق', permissions: 'الأدوار والصلاحيات', masterData: 'البيانات الأساسية', settings: 'الإعدادات', help: 'مركز المساعدة', overview: 'نظرة عامة',
    greeting: 'صباح الخير، مريم', greetingPrefix: 'صباح الخير،', dashboardSub: 'إليك ملخص نشاط الصيدلية اليوم.', netSales: 'صافي مبيعات اليوم', transactions: 'المعاملات', lowStock: 'أصناف منخفضة المخزون', expiring: 'قريبة الانتهاء', recentSales: 'أحدث المبيعات', stockAlerts: 'تنبيهات المخزون', viewAll: 'عرض الكل',
    newSale: 'عملية بيع جديدة', newReturn: 'إنشاء مرتجع', newRole: 'إضافة دور', addUser: 'إضافة مستخدم', addRecord: 'إضافة سجل', edit: 'تعديل', delete: 'حذف', save: 'حفظ', cancel: 'إلغاء', actions: 'إجراءات', search: 'ابحث في القائمة...',
    name: 'الاسم', email: 'البريد الإلكتروني', password: 'كلمة المرور', passwordOptional: 'كلمة مرور جديدة (اختياري)', role: 'الدور', branchField: 'الفرع', status: 'الحالة', active: 'نشط', inactive: 'غير نشط', permissionsLabel: 'الصلاحيات', description: 'الوصف', selectOption: 'اختر', moduleName: 'القسم', viewAccess: 'عرض', createAccess: 'إضافة', editAccess: 'تعديل', deleteAccess: 'حذف', reviewAccess: 'مراجعة', accessDeniedTitle: 'لا تملك صلاحية الوصول', accessDeniedMessage: 'الدور المعيّن لحسابك لا يتضمن صلاحية فتح هذا القسم.',
    passwordRequired: 'أدخل كلمة مرور للمستخدم الجديد.', passwordMinLength: 'يجب ألا تقل كلمة المرور عن 8 أحرف.', duplicateUserEmail: 'هذا البريد الإلكتروني مسجل بالفعل.', loginTitle: 'تسجيل الدخول إلى الصيدلية', loginSubtitle: 'استخدم حساب الموظف للمتابعة.', login: 'دخول', checkingLogin: 'جارٍ التحقق…', invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', demoCredentials: 'حساب المدير التجريبي', localAuthNote: 'هذا نموذج محلي يحفظ كلمات المرور المشفرة في هذا المتصفح فقط. استخدم خادمًا آمنًا لحسابات الموظفين الفعلية.', signOut: 'تسجيل الخروج', toggleNavigation: 'إظهار أو إخفاء القائمة', hideNavigation: 'إخفاء القائمة', pinNavigation: 'تثبيت القائمة',
    branchZamalek: 'الزمالك', branchNasrCity: 'مدينة نصر', branchMaadi: 'المعادي', branchNewCairo: 'القاهرة الجديدة', branchHeliopolis: 'مصر الجديدة',
    permissionIntro: 'أنشئ الأدوار وحدد أقسام الصيدلية التي يمكن لكل دور الوصول إليها.', roleName: 'اسم الدور', roleDescription: 'وصف الدور', modules: 'أقسام التطبيق', saveRole: 'حفظ الدور', editRole: 'تعديل الدور', deleteRole: 'حذف الدور',
    returnsTitle: 'المرتجعات والاسترداد', returnsIntro: 'تسجيل الأصناف المرتجعة ومراجعة الطلبات ومتابعة الاسترداد.', returnNo: 'رقم المرتجع', invoice: 'الفاتورة', customer: 'العميل', item: 'الدواء', quantity: 'الكمية', reason: 'سبب الإرجاع', refundMethod: 'طريقة الاسترداد', amount: 'قيمة الاسترداد', requested: 'تاريخ الطلب', returnStatus: 'حالة المرتجع', approve: 'موافقة وإعادة للمخزون', reject: 'رفض', refunded: 'تم الاسترداد', rejected: 'مرفوض', pending: 'بانتظار المراجعة', createReturn: 'إنشاء مرتجع', selectInvoice: 'اختر الفاتورة', selectItem: 'اختر صنفًا', expiry: 'منتهي أو قريب الانتهاء', damaged: 'عبوة تالفة', wrongItem: 'صنف غير صحيح', customerRequest: 'تراجع العميل', cash: 'نقدًا', card: 'بطاقة', wallet: 'محفظة إلكترونية',
    returnSaved: 'تم تسجيل طلب المرتجع', roleSaved: 'تم حفظ الدور', recordSaved: 'تم حفظ التعديلات', confirmDelete: 'هل تريد حذف هذا السجل؟', invoiceRequired: 'اختر الفاتورة والصنف.', quantityInvalid: 'أدخل كمية متاحة وصحيحة من الفاتورة.', noRecords: 'لا توجد سجلات.',
    amountEGP: 'جنيه', productsTitle: 'دليل الأدوية', usersTitle: 'المستخدمون والفريق', customersTitle: 'العملاء', suppliersTitle: 'الموردون', salesTitle: 'المبيعات والفواتير', prescriptionsTitle: 'الوصفات الطبية', purchasesTitle: 'أوامر الشراء', standardsTitle: 'البيانات الأساسية',
    productName: 'اسم الدواء', barcode: 'الباركود', category: 'الفئة', price: 'سعر البيع (جنيه)', stock: 'المخزون', reorder: 'حد إعادة الطلب', batch: 'الدفعة / الانتهاء', phone: 'الهاتف', visits: 'الزيارات', balance: 'الرصيد (جنيه)', terms: 'شروط الدفع', date: 'التاريخ', total: 'الإجمالي (جنيه)', doctor: 'الطبيب', expected: 'التسليم المتوقع', type: 'النوع',
    paid: 'مدفوعة', draft: 'مسودة', complete: 'مكتملة', dashboardLink: 'مساحة العمل', filter: 'تصفية', records: 'السجلات', noPermissions: 'اختر صلاحية واحدة على الأقل.', duplicateRole: 'يوجد دور آخر بالاسم نفسه.',
  },
};

@Injectable({ providedIn: 'root' })
export class LocaleService {
  readonly language = signal<'en' | 'ar'>(this.readLanguage());

  constructor() {
    effect(() => {
      const language = this.language();
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('pbm-lang', language);
    });
  }

  text(key: string): string {
    return copy[this.language()][key] ?? copy.en[key] ?? key;
  }

  toggle(): void {
    this.language.update((language) => language === 'en' ? 'ar' : 'en');
  }

  private readLanguage(): 'en' | 'ar' {
    return localStorage.getItem('pbm-lang') === 'ar' ? 'ar' : 'en';
  }
}
