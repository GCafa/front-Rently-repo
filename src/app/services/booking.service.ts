import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingModel } from '../models/booking-model';
import { BookingCreateRequest } from '../dto/request/BookingCreateRequest';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = ApiPathUtil.getBookingPath();

  constructor(private http: HttpClient) { }

  saveBooking(bookingCreateRequest: BookingCreateRequest): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/create`, bookingCreateRequest);
  }

  getBooking(confirmationCode: string): Observable<BookingModel> {
    return this.http.get<BookingModel>(`${this.apiUrl}/${confirmationCode}`);
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

  generateConfirmationCode(bookingId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/generate-code`);
  }

}
