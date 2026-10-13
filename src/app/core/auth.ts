import { Injectable, signal } from '@angular/core';

export interface SessionUser {
  email: string;
  name: string;
  role: string;
}

interface Credential extends SessionUser {
  salt: string;
  passwordHash: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly demoEmail = 'sherif@pharmacybyme.eg';
  readonly legacyDemoEmail = 'mariam@pharmacybyme.eg';
  readonly demoName = 'Sherif Mostafa';
  readonly demoPassword = 'Pharmacy123!';
  readonly currentUser = signal<SessionUser | null>(this.readSession());
  private readonly credentialsKey = 'pbm-auth-credentials';
  private readonly sessionKey = 'pbm-auth-session';
  private readonly demoReady: Promise<void>;

  constructor() {
    this.demoReady = this.ensureDemoAccount();
  }

  async login(email: string, password: string): Promise<boolean> {
    await this.demoReady;
    const normalizedEmail = email.trim().toLowerCase();
    const credential = this.readCredentials().find((item) => item.email === normalizedEmail);
    if (!credential || await this.hashPassword(password, credential.salt) !== credential.passwordHash) return false;
    const user = { email: credential.email, name: credential.name, role: credential.role };
    this.currentUser.set(user);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
    return true;
  }

  async createAccount(email: string, password: string, name: string, role: string): Promise<boolean> {
    await this.demoReady;
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === this.legacyDemoEmail || this.readCredentials().some((credential) => credential.email === normalizedEmail)) return false;
    const salt = this.createSalt();
    const credential: Credential = {
      email: normalizedEmail,
      name: name.trim(),
      role,
      salt,
      passwordHash: await this.hashPassword(password, salt),
    };
    this.writeCredentials([...this.readCredentials(), credential]);
    return true;
  }

  async updateAccount(previousEmail: string, email: string, password: string, name: string, role: string): Promise<boolean> {
    await this.demoReady;
    const normalizedPreviousEmail = previousEmail.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const credentials = this.readCredentials();
    if (normalizedEmail !== normalizedPreviousEmail && credentials.some((credential) => credential.email === normalizedEmail)) return false;
    const existing = credentials.find((credential) => credential.email === normalizedPreviousEmail);
    if (!existing && !password) return true;
    const salt = password ? this.createSalt() : existing!.salt;
    const passwordHash = password ? await this.hashPassword(password, salt) : existing!.passwordHash;
    const updated: Credential = { email: normalizedEmail, name: name.trim(), role, salt, passwordHash };
    this.writeCredentials(existing
      ? [...credentials.filter((credential) => credential.email !== normalizedPreviousEmail), updated]
      : [...credentials, updated]);
    if (this.currentUser()?.email === normalizedPreviousEmail) {
      this.currentUser.set({ email: normalizedEmail, name: updated.name, role: updated.role });
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser()));
    }
    return true;
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionKey);
    this.currentUser.set(null);
  }

  private async ensureDemoAccount(): Promise<void> {
    const credentials = this.readCredentials();
    const currentIndex = credentials.findIndex((credential) => credential.email === this.demoEmail);
    const legacyIndex = credentials.findIndex((credential) => credential.email === this.legacyDemoEmail);
    const existing = currentIndex >= 0 ? credentials[currentIndex] : legacyIndex >= 0 ? credentials[legacyIndex] : undefined;
    if (existing) {
      const migratedCredential: Credential = { ...existing, email: this.demoEmail, name: this.demoName, role: 'Administrator' };
      const nextCredentials = credentials.filter((credential) => credential.email !== this.demoEmail && credential.email !== this.legacyDemoEmail);
      nextCredentials.push(migratedCredential);
      this.writeCredentials(nextCredentials);
      const session = this.currentUser();
      if (session?.email === this.demoEmail || session?.email === this.legacyDemoEmail) {
        const migratedSession = { ...session, email: this.demoEmail, name: this.demoName, role: 'Administrator' };
        this.currentUser.set(migratedSession);
        sessionStorage.setItem(this.sessionKey, JSON.stringify(migratedSession));
      }
      return;
    }
    const salt = this.createSalt();
    credentials.push({
      email: this.demoEmail,
      name: this.demoName,
      role: 'Administrator',
      salt,
      passwordHash: await this.hashPassword(this.demoPassword, salt),
    });
    this.writeCredentials(credentials);
  }

  private readCredentials(): Credential[] {
    try {
      return JSON.parse(localStorage.getItem(this.credentialsKey) ?? '[]') as Credential[];
    } catch {
      return [];
    }
  }

  private writeCredentials(credentials: Credential[]): void {
    localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
  }

  private readSession(): SessionUser | null {
    try {
      const session = JSON.parse(sessionStorage.getItem(this.sessionKey) ?? 'null') as SessionUser | null;
      if (session?.email === this.demoEmail || session?.email === this.legacyDemoEmail) {
        const migratedSession = { ...session, email: this.demoEmail, name: this.demoName, role: 'Administrator' };
        sessionStorage.setItem(this.sessionKey, JSON.stringify(migratedSession));
        return migratedSession;
      }
      return session;
    } catch {
      return null;
    }
  }

  private createSalt(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return btoa(String.fromCharCode(...bytes));
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: Uint8Array.from(atob(salt), (char) => char.charCodeAt(0)), iterations: 120000, hash: 'SHA-256' }, material, 256);
    return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}
