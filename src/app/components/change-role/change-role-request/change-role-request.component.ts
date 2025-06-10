import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeRoleService } from '../../../services/changeRole.service';
import { ChangeRoleRequest } from '../../../dto/request/ChangeRoleRequest';
import { MessageService } from 'primeng/api';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import {NavbarComponent} from "../../navbar/navbar.component";

@Component({
    selector: 'app-change-role-request',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextarea,
        ButtonModule,
        CardModule,
        ToastModule,
        NavbarComponent
    ],
    providers: [MessageService],
    templateUrl: './change-role-request.component.html',
    styleUrl: './change-role-request.component.css'
})
export class ChangeRoleRequestComponent implements OnInit {
  motivation: string = '';
  isSubmitting = false;
  roleChangeForm!: FormGroup;

  constructor(
    private changeRoleService: ChangeRoleService,
    private messageService: MessageService,
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
    if (this.motivation.length < 10 || this.motivation.length > 500) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please provide a valid motivation (10-500 characters)'
      });
      return;
    }

    this.isSubmitting = true;
    const motivation = this.motivation;
    const request = new ChangeRoleRequest(motivation);

    this.changeRoleService.requestChangeRole(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your role change request has been submitted successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Failed to submit role change request'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
