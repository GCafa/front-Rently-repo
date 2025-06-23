import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { BookingModel } from '../models/booking-model';
import { BookingCreateRequest } from '../dto/request/BookingCreateRequest';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';
import {BookingDashboardResponse} from '../dto/BookingDashboardResponse';
import {UserSummary} from '../dto/UserSummary';
import {PropertyModel} from '../models/property-model';
import {UserModel} from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = ApiPathUtil.getBookingPath();

  constructor(private http: HttpClient) { }

  saveBooking(bookingCreateRequest: BookingCreateRequest): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/create`, bookingCreateRequest);
  }

  blockBookingOnDate(property: PropertyModel, date: Date, host: UserModel): Observable<CustomResponse> {
    const fakeBooking = new BookingCreateRequest(
      date,
      date,
      1,
      0,
      host, // Assuming user is an object with at least an id
      property,
      null
    );

    // This method will add a fake booking to block a date for a property
    return this.saveBooking(fakeBooking);
  }


  getAllBookings(): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.apiUrl}/bookings`);
  }

  getAllUsersBookings(userId: number): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.apiUrl}/user/${userId}`);
  }

  cancelBooking(bookingId: number): Observable<CustomResponse> {
    return this.http.delete<CustomResponse>(`${this.apiUrl}/${bookingId}`);
  }

  getHostBookingDashboard(hostId: number): Observable<BookingDashboardResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/host/${hostId}`).pipe(
      map(response =>
        // Filter out bookings where the user is the host (host-created bookings to block dates)
        response.filter(item => item.user.id !== hostId).map(item =>
          new BookingDashboardResponse(
            item.title,
            new UserSummary(item.user.id, item.user.firstname, item.user.lastname),
            item.checkInDate,
            item.checkOutDate,
            item.total
          )
        )
      )
    );
  }
}
