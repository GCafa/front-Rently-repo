import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { BookingModel } from '../../../models/booking-model';
import { UserService } from '../../../services/user.service';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import {ApiPathUtil} from '../../../utils/ApiPathUtil';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, RouterLink]
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingModel[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private bookingService: BookingService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: { id: any; }) => {
        if (!user) {
          this.errorMessage = 'Utente non autenticato.';
          this.loading = false;
          return;
        }
        const userId = user.id;
        this.bookingService.getAllUsersBookings(userId).subscribe({
          next: (data) => {
            this.bookings = data;
            console.log('Prenotazioni recuperate:', this.bookings);
            this.loading = false;
          },
          error: (err) => {
            this.errorMessage = 'Errore durante il caricamento delle Prenotazioni.';
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Errore nel recupero dell’utente.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  protected readonly ApiPathUtil = ApiPathUtil;
}
