import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CustomResponse } from '../../../dto/CustomResponse';
import { NgClass, CommonModule } from '@angular/common';
import { UserModel } from "../../../models/user-model";
import { AuthService } from '../../../services/auth.service';
import {ApiPathUtil} from '../../../utils/ApiPathUtil';

@Component({
    selector: 'app-user-modify',
    templateUrl: './modify.component.html',
    styleUrls: ['./modify.component.css'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgClass,
    ]
})
export class ModifyComponent implements OnInit {
  user: UserModel | null = null;
  modifyForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  loading = true;
  selectedImage?: File;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: UserModel) => {
        this.user = data;
        this.modifyForm = this.fb.group({
          username: [data.username, Validators.required],
          email: [data.email, [Validators.required, Validators.email]],
          password: ['', Validators.required]
        });
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Errore nel caricamento dei dati utente';
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'Utente non trovato. Assicurati di essere loggato.';
        } else if (err.status === 400) {
          this.errorMessage = 'Password già usata. Scegline un\'altra.';
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  get f() {
    return this.modifyForm.controls;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImage = file;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.modifyForm.invalid) return;

    // Reset dei messaggi precedenti
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const formData = new FormData();
    formData.append(
      'UserModifyRequest',
      JSON.stringify(this.modifyForm.value)
    );
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.userService.modifyWithImage(formData, this.selectedImage).subscribe({
      next: (resp: CustomResponse) => {
        this.successMessage = 'Profilo aggiornato con successo! Verrai reindirizzato alla pagina di login.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err: any) => {
        this.loading = false;
        console.log('Errore aggiornamento utente:', err);

        if (err.status === 400) {
          this.errorMessage = 'Password errata';
        } else if (err.status === 401) {
          this.errorMessage = 'Sessione scaduta. Effettua nuovamente il login.';
          setTimeout(() => this.router.navigate(['/login']), 1200);
        } else if (err.status === 403) {
          this.errorMessage = 'Non hai i permessi necessari per questa operazione.';
        } else if (err.status === 404) {
          this.errorMessage = 'Utente non trovato.';
        } else {
          this.errorMessage = err.error?.message || 'Errore durante l\'aggiornamento del profilo.';
        }
      }
    });


    this.userService.modify(formData).subscribe({
      next: (resp: CustomResponse) => {
        this.successMessage = 'Profilo aggiornato con successo! Verrai reindirizzato alla pagina di login.';
        this.loading = false;
        setTimeout(() => this.logout(), 1200)
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Errore aggiornamento utente:', err);

        switch (err.status) {
          case 400:
            this.errorMessage = 'Password errata.';
            break;
          case 401:
            this.errorMessage = 'Sessione scaduta. Effettua nuovamente il login.';
            setTimeout(() => this.router.navigate(['/login']), 1200);
            break;
          case 403:
            this.errorMessage = 'Non hai i permessi necessari per questa operazione.';
            break;
          case 404:
            this.errorMessage = 'Utente non trovato.';
            break;
          default:
            this.errorMessage = err.error?.message || 'Errore durante l\'aggiornamento del profilo.';
            break;
        }
      }
    });


  }

  logout() {
    this.authService.logout(); // Questo rimuove token e utente dal localStorage/sessionStorage
    this.router.navigate(['/login']).then(() => location.reload());
  }

  protected readonly ApiPathUtil = ApiPathUtil;
}
