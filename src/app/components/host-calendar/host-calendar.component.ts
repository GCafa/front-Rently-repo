import { Component, OnInit } from '@angular/core';
import { BookingService} from '../../services/booking.service'; // aggiorna path se necessario
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { PropertyModel } from '../../models/property-model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingDashboardResponse } from '../../dto/BookingDashboardResponse';

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
  selectedProperty?: PropertyModel;
  bookings: BookingDashboardResponse[] = [];
  showBookings: boolean = false;
  isLoading: boolean = false;
  dateForm!: FormGroup;

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private propertyService: PropertyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.hostId = user.id;
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
}
