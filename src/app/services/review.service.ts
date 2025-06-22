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

  addHostResponse(reviewId: number, responseRequest: { response: string }): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/${reviewId}/host-response`, responseRequest);
  }

}
