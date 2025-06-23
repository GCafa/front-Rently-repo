import { Component, OnInit } from '@angular/core';
import { BookingService} from '../../services/booking.service'; // aggiorna path se necessario
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { PropertyModel } from '../../models/property-model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingDashboardResponse } from '../../dto/BookingDashboardResponse';
import {UserModel} from '../../models/user-model';

@Component({
  selector: 'app-host-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './host-calendar.component.html',
  styleUrls: ['./host-calendar.component.css']
})
export class HostCalendarComponent implements OnInit {
  propertyId?: number;
  hostId!: number;
  properties: PropertyModel[] = [];
  host!: UserModel;
  selectedProperty!: PropertyModel;
  bookings: BookingDashboardResponse[] = [];
  showBookings: boolean = false;
  isLoading: boolean = false;
  dateForm!: FormGroup;

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private propertyService: PropertyService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.hostId = user.id;
        this.host = user;
        this.loadHostProperties();
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });
  }

  private initForm(): void {
    this.dateForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  loadHostProperties(): void {
    this.propertyService.getPropertiesByHostId(this.hostId).subscribe({
      next: (properties) => {
        this.properties = properties;
        if (properties.length > 0) {
          this.selectedProperty = properties[0];
          this.propertyId = this.selectedProperty.id;
        }
      },
      error: (error) => {
        console.error('Error fetching host properties:', error);
      }
    });
  }

  onPropertyChange(property: PropertyModel): void {
    this.selectedProperty = property;
    this.propertyId = property.id;
  }


  formatDate(date: Date | string | null | undefined): string {
    if (!date) {
      return '';
    }

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  viewBookings(): void {
    if (this.dateForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.showBookings = true;

    // Set startDate to beginning of the day (00:00:00)
    const startDate = new Date(this.dateForm.value.startDate);
    console.log(startDate);
    startDate.setHours(0, 0, 0, 0);

    // Set endDate to end of the day (23:59:59)
    const endDate = new Date(this.dateForm.value.endDate);
    console.log(endDate);
    endDate.setHours(23, 59, 59, 999);

    this.bookingService.getHostBookingDashboard(this.hostId).subscribe({
      next: (bookings) => {
        // Filter bookings for the selected property and date range
        this.bookings = bookings.filter(booking => {
          // Check if booking is for the selected property
          if (booking.title !== this.selectedProperty?.title) {
            return false;
          }

          // Check if booking dates overlap with selected date range
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);

          // Only show bookings that are completely within the selected date range
          // Both check-in and check-out dates must be within or equal to the selected range
          return checkIn >= startDate && checkOut <= endDate;
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        this.isLoading = false;
      }
    });
  }

  blockDates(): void {
    if (this.dateForm.invalid || !this.selectedProperty) {
      return;
    }

    this.isLoading = true;

    // Set startDate to beginning of the day (00:00:00)
    const startDate = new Date(this.dateForm.value.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Set endDate to end of the day (23:59:59)
    const endDate = new Date(this.dateForm.value.endDate);
    endDate.setHours(23, 59, 59, 999);

    // First, get all bookings for the host to identify which dates are already booked
    this.bookingService.getHostBookingDashboard(this.hostId).subscribe({
      next: (bookings) => {
        // Filter bookings for the selected property
        const propertyBookings = bookings.filter(booking =>
          booking.title === this.selectedProperty?.title
        );

        // Create a Set to store all dates that are already booked
        const bookedDates = new Set<string>();

        // For each booking, add all dates between checkInDate and checkOutDate to the bookedDates Set
        propertyBookings.forEach(booking => {
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);

          // Iterate through each day of the booking
          const currentDate = new Date(checkIn);
          while (currentDate <= checkOut) {
            bookedDates.add(currentDate.toISOString().split('T')[0]); // Store date as YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        // Now block only dates that are not already booked
        const currentDate = new Date(startDate);
        let blockedCount = 0;
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split('T')[0];

          // Only block the date if it's not already booked
          if (!bookedDates.has(dateString)) {
            const dateToBlock = new Date(currentDate);
            this.bookingService.blockBookingOnDate(this.selectedProperty, dateToBlock, this.host).subscribe({
              next: () => {
                console.log(`Blocked date: ${dateToBlock.toLocaleDateString()}`);
                blockedCount++;

                // Check if this is the last date to process
                if (blockedCount === totalDays - bookedDates.size) {
                  this.isLoading = false;
                  alert(`Date bloccate con successo! (${blockedCount} date bloccate)`);
                  // Optionally refresh the view
                  this.viewBookings();
                }
              },
              error: (error) => {
                console.error(`Error blocking date ${dateToBlock.toLocaleDateString()}:`, error);
                blockedCount++;

                // Check if this is the last date to process
                if (blockedCount === totalDays - bookedDates.size) {
                  this.isLoading = false;
                  alert(`Alcune date non sono state bloccate correttamente. Controlla la console per i dettagli.`);
                }
              }
            });
          } else {
            console.log(`Date ${dateString} is already booked, skipping`);
          }

          // Move to the next day
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // If there are no dates to block, show a message
        if (bookedDates.size === totalDays) {
          this.isLoading = false;
          alert('Tutte le date nel periodo selezionato sono già prenotate.');
        }
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        this.isLoading = false;
        alert('Si è verificato un errore durante il recupero delle prenotazioni.');
      }
    });
  }
}
