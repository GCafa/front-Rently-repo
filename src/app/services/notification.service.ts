import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationModel } from '../models/notification-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = ApiPathUtil.getNotificationPath();

  constructor(private http: HttpClient) { }

  getAllNotifications(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(`${this.apiUrl}`);
  }

  getNotificationById(notificationId: number): Observable<NotificationModel> {
    return this.http.get<NotificationModel>(`${this.apiUrl}/${notificationId}`);
  }

  markAsRead(notificationId: number): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/${notificationId}/mark-read`, {});
  }

  markAllAsRead(): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/mark-all-read`, {});
  }

  deleteNotification(notificationId: number): Observable<CustomResponse> {
    return this.http.delete<CustomResponse>(`${this.apiUrl}/${notificationId}`);
  }

  deleteAllNotifications(): Observable<CustomResponse> {
    return this.http.delete<CustomResponse>(`${this.apiUrl}/all`);
  }
}
