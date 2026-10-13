import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';
import { LocaleService } from '../../core/locale';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css',
})
export class AccessDeniedPage {
  readonly locale: LocaleService;

  constructor(private readonly auth: AuthService, locale: LocaleService, private readonly router: Router) {
    this.locale = locale;
  }

  signOut(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
