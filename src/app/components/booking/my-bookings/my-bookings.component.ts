import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { UserService } from '../../../services/user.service';
import { BookingModel } from '../../../models/booking-model';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  imports: [
    DatePipe,
    NgClass,
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingModel[] = [];
  loading = true;
  errorMessage = '';
  imageBaseUrl = ApiPathUtil.getImageBaseUrl();

  bookingIdToDelete: number | null = null;

  constructor(
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.bookingService.getAllUsersBookings(user.id).subscribe({
          next: (data) => {
            this.bookings = data;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Errore durante il caricamento delle prenotazioni.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dell’utente autenticato.';
        this.loading = false;
      }
    });
  }

  openCancelModal(bookingId: number): void {
    this.bookingIdToDelete = bookingId;
    const modal = document.getElementById('confirmCancelModal');
    if (modal) new bootstrap.Modal(modal).show();
  }

  confirmCancellation(): void {
    if (!this.bookingIdToDelete) return;
    this.bookingService.cancelBooking(this.bookingIdToDelete).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== this.bookingIdToDelete);
        this.bookingIdToDelete = null;
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmCancelModal')!);
        modal?.hide();
      },
      error: () => {
        this.errorMessage = 'Errore durante la cancellazione della prenotazione.';
        this.bookingIdToDelete = null;
      }
    });
  }
}
