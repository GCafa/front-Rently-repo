import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BookingDashboardResponse } from '../../dto/BookingDashboardResponse';
import { UserModel } from '../../models/user-model';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { PropertyModel } from '../../models/property-model';

@Component({
  selector: 'app-host-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './host-dashboard.component.html',
  styleUrls: ['./host-dashboard.component.css']
})
export class HostDashboardComponent implements OnInit {
  bookings: BookingDashboardResponse[] = [];
  originalBookings: BookingDashboardResponse[] = [];
  currentUser!: UserModel;
  loading: boolean = true;
  errorMessage: string = '';
  totalEarnings: number = 0;

  fromDate: string = '';
  toDate: string = '';
  apartments: PropertyModel[] = [];
  selectedApartment: string = '';

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadBookings(user.id);
        this.loadApartments(user.id);
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dell’utente autenticato.';
        this.loading = false;
      }
    });
  }

  loadBookings(hostId: number): void {
    this.bookingService.getHostBookingDashboard(hostId).subscribe({
      next: (data) => {
        this.originalBookings = data;
        this.bookings = [...data];
        this.totalEarnings = this.calculateTotal(this.bookings);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Errore durante il caricamento delle prenotazioni.';
        this.loading = false;
      }
    });
  }

  loadApartments(hostId: number): void {
    this.propertyService.getPropertiesByHostId(hostId).subscribe({
      next: (data) => {
        this.apartments = data;
      }
    });
  }

  applyFilters(): void {
    const from = this.fromDate ? new Date(this.fromDate).getTime() : Number.MIN_SAFE_INTEGER;
    const to = this.toDate ? new Date(this.toDate).getTime() : Number.MAX_SAFE_INTEGER;

    this.bookings = this.originalBookings.filter(b => {
      const checkIn = new Date(b.checkInDate).getTime();
      const matchDate = checkIn >= from && checkIn <= to;
      const matchApartment = this.selectedApartment ? b.title === this.getApartmentTitle(this.selectedApartment) : true;
      return matchDate && matchApartment;
    });

    this.totalEarnings = this.calculateTotal(this.bookings);
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.selectedApartment = '';
    this.bookings = [...this.originalBookings];
    this.totalEarnings = this.calculateTotal(this.bookings);
  }

  getApartmentTitle(apartmentId: string): string {
    return this.apartments.find(p => p.id == +apartmentId)?.title || '';
  }

  calculateTotal(bookings: BookingDashboardResponse[]): number {
    return bookings.reduce((sum, b) => sum + Number(b.total), 0);
  }
}
