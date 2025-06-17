import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { PropertyModel } from '../../../models/property-model';
import { BookingCreateRequest } from '../../../dto/request/BookingCreateRequest';
import { CommonModule, NgIf } from '@angular/common';
import {UserModel} from '../../../models/user-model';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf]
})
export class CreateBookingComponent implements OnInit {
  property: PropertyModel | null = null;
  bookingForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Access state from history object
    const state = history.state;
    this.property = state.property as PropertyModel | null;

    console.log('Property from state:', this.property);

    if (!this.property) {
      this.errorMessage = 'Proprietà non disponibile.';
      return;
    }

    this.bookingForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numOfAdults: [1, [Validators.required, Validators.min(1)]],
      numOfChildren: [0, [Validators.required, Validators.min(0)]],
      couponCode: ['' || null]
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.property) return;

    const form = this.bookingForm.value;

    this.userService.getCurrentUser().subscribe({
      next: (user: UserModel) => {
        if (!user) {
          this.errorMessage = 'Utente non autenticato.';
          return;
        }

        const bookingRequest = new BookingCreateRequest(
          new Date(form.checkInDate),
          new Date(form.checkOutDate),
          form.numOfAdults,
          form.numOfChildren,
          user,
          this.property!,
          form.couponCode
        );

        this.bookingService.saveBooking(bookingRequest).subscribe({
          next: (res) => {
            this.successMessage = 'Prenotazione completata con successo!';
          },
          error: () => {
            this.errorMessage = 'Errore durante la prenotazione.';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dell\'utente.';
      }
    });
  }
}
