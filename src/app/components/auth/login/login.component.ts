import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService} from "../../../services/auth.service";
import { Router, RouterModule } from '@angular/router';
import { UserLoginRequest } from '../../../dto/request/UserLoginRequest';
import {NavbarComponent} from "../../navbar/navbar.component";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgClass,
        RouterModule,
        NavbarComponent
    ],
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials: UserLoginRequest = {
      username: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        if (!res) {
          this.setError('Risposta non valida dal server');
          return;
        }

        if (res.jwt) {
          const payload = this.parseJwt(res.jwt);
          if (payload?.role) {
            localStorage.setItem('userRole', payload.role);
            this.navigateByRole(payload.role);
          } else {
            this.setError('Ruolo utente non trovato nel token');
          }
        } else {
          this.setError('Token non valido nella risposta');
        }
        this.loading = false;
      },
      error: (err) => {
        console.log('Errore dal server:', err);

        if (err?.status === 403) {
          this.setError('Account disabilitato. Contatta l\'amministratore.');
        } else if (err?.status === 400) {
          this.setError('Lo username o la password non sono corretti');  // Messaggio modificato qui
        } else if(err?.status === 404) {
          this.setError('Questo account non esiste');
        } else{
          this.setError(err.error?.message || 'Errore di login');
        }
        this.loading = false;
      }
    });
  }


  private setError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
  }

  private navigateByRole(role: string): void {
    // Normalizza: togli prefisso ROLE_, spazi, lowercase → uppercase
    const normalizedRole = role.replace(/^ROLE_/, '').trim().toUpperCase();

    const routes: { [key: string]: string } = {
      'ADMIN': '/admin-home',
      'MODERATOR': '/personal-area',
      'HOST': '/personal-area',
      'CLIENT': '/user-home'
    };

    console.log('Ruolo originale:', role);
    console.log('Ruolo normalizzato:', normalizedRole);
    console.log('Route selezionata:', routes[normalizedRole]);

    const route = routes[normalizedRole];
    if (route) {
      window.location.href = `${window.location.origin}${route}`;
    } else {
      this.router.navigate(['/home']);
    }
  }



  private parseJwt(token: string): any {
    if (!token) {
      console.error('Token vuoto');
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.error('Token malformato');
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      const payload = JSON.parse(jsonPayload);
      console.log('JWT decodificato:', payload); // Debug
      return payload;
    } catch (e) {
      console.error('Errore nel parsing del JWT:', e);
      return null;
    }
  }
}
