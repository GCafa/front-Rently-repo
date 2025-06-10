import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewModel } from '../models/review-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = ApiPathUtil.getReviewPath();

  constructor(private http: HttpClient) { }

  createPropertyReview(propertyId: number, reviewCreateRequest: any): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/property/${propertyId}`, reviewCreateRequest);
  }

  createUserReview(userId: number, reviewCreateRequest: any): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/user/${userId}`, reviewCreateRequest);
  }

  updateReview(reviewId: number, reviewUpdateRequest: any): Observable<CustomResponse> {
    return this.http.put<CustomResponse>(`${this.apiUrl}/${reviewId}`, reviewUpdateRequest);
  }

  deleteReview(reviewId: number): Observable<CustomResponse> {
    return this.http.delete<CustomResponse>(`${this.apiUrl}/${reviewId}`);
  }

  getReviewById(reviewId: number): Observable<ReviewModel> {
    return this.http.get<ReviewModel>(`${this.apiUrl}/${reviewId}`);
  }

  getReviewsByPropertyId(propertyId: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/property/${propertyId}`);
  }

  getReviewsByReviewerId(reviewerId: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/reviewer/${reviewerId}`);
  }

  getAllReviews(): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}`);
  }
}
