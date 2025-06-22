import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { PropertyModel } from '../../../models/property-model';
import { BookingCreateRequest } from '../../../dto/request/BookingCreateRequest';
import { CommonModule, NgIf } from '@angular/common';
import { UserModel } from '../../../models/user-model';
import { UserService } from '../../../services/user.service';

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
  numberOfNights = 0;
  totalAmount = 0;
  couponDiscount = 0;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.property = state.property as PropertyModel | null;

    if (!this.property) {
      this.errorMessage = 'Proprietà non disponibile.';
      return;
    }

    this.bookingForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numOfAdults: [1, [Validators.required, Validators.min(1)]],
      numOfChildren: [0, [Validators.required, Validators.min(0)]],
      couponCode: ['']
    });

    this.bookingForm.valueChanges.subscribe(() => this.updateSummary());
  }

  updateSummary(): void {
    const checkIn = new Date(this.bookingForm.value.checkInDate);
    const checkOut = new Date(this.bookingForm.value.checkOutDate);

    const msPerDay = 1000 * 60 * 60 * 24;
    this.numberOfNights = (checkOut.getTime() - checkIn.getTime()) / msPerDay;

    if (this.numberOfNights > 0 && this.property) {
      this.totalAmount = this.numberOfNights * this.property.pricePerNight;

      const code = this.bookingForm.value.couponCode?.toLowerCase();
      if (code === 'sconto10') {
        this.couponDiscount = 10;
        this.totalAmount = this.totalAmount * 0.9;
      } else if (code === 'sconto20') {
        this.couponDiscount = 20;
        this.totalAmount = this.totalAmount * 0.8;
      } else {
        this.couponDiscount = 0;
      }

      this.totalAmount = Math.round(this.totalAmount * 100) / 100;
    } else {
      this.totalAmount = 0;
    }
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
          form.couponCode === '' ? null : form.couponCode
        );

        this.bookingService.saveBooking(bookingRequest).subscribe({
          next: () => {
            this.successMessage = 'Prenotazione completata con successo!';
          },
          error: (error) => {
            const errorMsg = error.error?.message || error.message || 'Errore sconosciuto';
            if (errorMsg.includes('Unable to complete the payment')) {
              this.errorMessage = 'Saldo insufficiente per completare la prenotazione.';
              setTimeout(() => this.router.navigate(['/recharge-balance']), 1500);
            } else if (errorMsg.includes('Property not available')) {
              this.errorMessage = 'Proprietà non disponibile per le date selezionate.';
            } else if (errorMsg.includes('Coupon not found')) {
              this.errorMessage = 'Il codice coupon inserito non è valido.';
            } else {
              this.errorMessage = 'Errore durante la prenotazione: ' + errorMsg;
            }
          }
        });
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dell\'utente.';
      }
    });
  }
}
