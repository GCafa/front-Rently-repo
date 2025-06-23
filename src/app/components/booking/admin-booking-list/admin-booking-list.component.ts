import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../models/booking-model';
import { BookingService } from '../../../services/booking.service';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';
import { CommonModule, NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-admin-bookings-list',
  templateUrl: './admin-booking-list.component.html',
  styleUrls: ['./admin-booking-list.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf]
})
export class AdminBookingListComponent implements OnInit {
  bookings: BookingModel[] = [];
  loading = true;
  errorMessage = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        // Filter out bookings where the user is the host of the property (host-created bookings to block dates)
        this.bookings = data.filter(booking => booking.user.id !== booking.property.host.id);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Errore durante il caricamento delle prenotazioni.';
        this.loading = false;
      }
    });
  }

  cancelBooking(id: number): void {
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== id);
      },
      error: () => {
        this.errorMessage = 'Errore durante la cancellazione della prenotazione.';
      }
    });
  }

  protected readonly ApiPathUtil = ApiPathUtil;
}
