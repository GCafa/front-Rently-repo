import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeRoleService } from '../../../services/changeRole.service';
import { ChangeRoleRequest } from '../../../dto/request/ChangeRoleRequest';

@Component({
  selector: 'app-change-role-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-role-request.component.html',
  styleUrl: './change-role-request.component.css'
})
export class ChangeRoleRequestComponent implements OnInit {
  motivation: string = '';
  isSubmitting = false;
  roleChangeForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private changeRoleService: ChangeRoleService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.roleChangeForm = this.fb.group({
      motivation: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.motivation.length < 10 || this.motivation.length > 500) {
      this.errorMessage = 'La motivazione deve essere tra 10 e 500 caratteri';
      return;
    }

    this.isSubmitting = true;
    const request = new ChangeRoleRequest(this.motivation);

    this.changeRoleService.requestChangeRole(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Richiesta inviata con successo';
        setTimeout(() => this.router.navigate(['/profile']), 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Errore durante l\'invio della richiesta';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
