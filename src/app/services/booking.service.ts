import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { BookingModel } from '../models/booking-model';
import { BookingCreateRequest } from '../dto/request/BookingCreateRequest';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';
import {BookingDashboardResponse} from '../dto/BookingDashboardResponse';
import {UserSummary} from '../dto/UserSummary';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = ApiPathUtil.getBookingPath();

  constructor(private http: HttpClient) { }

  saveBooking(bookingCreateRequest: BookingCreateRequest): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/create`, bookingCreateRequest);
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
        response.map(item =>
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
  getBookedDates(propertyId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/booked-dates/${propertyId}`);
  }

  blockDateRange(payload: { propertyId: number; start: string; end: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/block-dates`, payload);
  }

}
