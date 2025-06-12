import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';
import { UserRegistrationRequest } from '../dto/request/UserRegistrationRequest';
import { UserModifyRequest } from "../dto/request/UserModifyRequest";
import { UserPasswordChangeRequest } from "../dto/request/UserPasswordChangeRequest";
import { PropertyModel } from "../models/property-model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = ApiPathUtil.getUserPath();

  constructor(private http: HttpClient) { }

  modifyWithImage(userModifyRequest: FormData, image: undefined | File): Observable<CustomResponse> {
    const formData = new FormData();
    const userModifyRequestJson = JSON.stringify(userModifyRequest);

    formData.append('UserModifyRequest', userModifyRequestJson);
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<CustomResponse>(
      `${this.apiUrl}/modify`,
      formData
    );
  }

  changePassword(userPasswordChangeRequest: UserPasswordChangeRequest): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(
      `${this.apiUrl}/change-password`,
      userPasswordChangeRequest
    );
  }

  disable(userId: number): Observable<CustomResponse> {
    return this.http.patch<CustomResponse>(`${this.apiUrl}/disable/${userId}`, {});
  }

  enable(userId: number): Observable<CustomResponse> {
    return this.http.patch<CustomResponse>(`${this.apiUrl}/enable/${userId}`, {});
  }

  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/me`);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}`);
  }

  getAllFavoriteProperties(username: string): Observable<PropertyModel[]> {
    return this.http.get<PropertyModel[]>(`${this.apiUrl}/favorite-properties`, {
      params: { username }
    });
  }

  addFavoriteProperty(username: string, propertyId: number): Observable<UserModel> {
    return this.http.post<UserModel>(
      `${this.apiUrl}/favorite-properties/${propertyId}`,
      null,
      { params: { username } }
    );
  }

  removeFavoriteProperty(username: string, propertyId: number): Observable<UserModel> {
    return this.http.delete<UserModel>(
      `${this.apiUrl}/favorite-properties/${propertyId}`,
      { params: { username } }
    );
  }

  rechargeBalance(username: string, amount: number): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('amount', amount.toString());

    return this.http.post(`${this.apiUrl}/recharge-balance`, null, { params });
  }


  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'assets/images/default-ProfileImage.png';
    }
    return `${this.apiUrl}/images/${imagePath}`;
  }
}
