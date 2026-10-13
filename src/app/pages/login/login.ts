import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { LocaleService } from '../../core/locale';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  readonly pending = signal(false);
  readonly error = signal(false);
  readonly auth: AuthService;
  readonly locale: LocaleService;
  email = 'sherif@pharmacybyme.eg';
  password = '';

  constructor(auth: AuthService, locale: LocaleService, private readonly router: Router, private readonly route: ActivatedRoute) {
    this.auth = auth;
    this.locale = locale;
    if (auth.currentUser()) void this.router.navigateByUrl('/');
  }

  async submit(): Promise<void> {
    this.pending.set(true);
    this.error.set(false);
    try {
      const accepted = await this.auth.login(this.email, this.password);
      if (accepted) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        await this.router.navigateByUrl(returnUrl.startsWith('/') ? returnUrl : '/');
      } else {
        this.error.set(true);
      }
    } finally {
      this.pending.set(false);
    }
  }
}
