import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CouponModel } from '../models/coupon-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';
import {ApplyCouponRequest} from "../dto/request/ApplyCouponRequest";

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = ApiPathUtil.getCouponPath();

  constructor(private http: HttpClient) { }
applyCoupon(applyCouponRequest: ApplyCouponRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/apply`, applyCouponRequest);
  }

}
