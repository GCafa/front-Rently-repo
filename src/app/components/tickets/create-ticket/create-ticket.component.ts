// create-ticket.component.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TicketService} from '../../../services/ticket.service';
import { TicketCreationRequest} from '../../../dto/request/TicketCreationRequest';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent {
  ticketForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private ticketService: TicketService, private router: Router) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  submit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.ticketForm.invalid) return;

    const request = new TicketCreationRequest(
      this.ticketForm.value.title,
      this.ticketForm.value.description
    );

    this.ticketService.createTicket(request).subscribe({
      next: () => {
        this.successMessage = 'Ticket creato con successo';
        this.router.navigate(['/my-tickets']);
      },
      error: () => this.errorMessage = 'Errore durante la creazione del ticket'
    });
  }
}
