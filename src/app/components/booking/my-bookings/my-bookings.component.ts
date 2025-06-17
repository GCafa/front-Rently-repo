import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { BookingModel } from '../../../models/booking-model';
import { UserService } from '../../../services/user.service';
import { CommonModule, NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf]
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingModel[] = [];
  loading = true;
  errorMessage = '';

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
            this.errorMessage = 'Errore nel caricamento delle prenotazioni.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dell’utente.';
        this.loading = false;
      }
    });
  }
}
