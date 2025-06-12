import {Injectable} from "@angular/core";
import {ApiPathUtil} from "../utils/ApiPathUtil";
import {HttpClient} from "@angular/common/http";
import {BookingCreateRequest} from "../dto/request/BookingCreateRequest";
import {Observable} from "rxjs";
import {CustomResponse} from "../dto/CustomResponse";
import {BookingModel} from "../models/booking-model";
import {ChangeRoleModel} from "../models/changeRole-model";
import {ChangeRoleRequest} from "../dto/request/ChangeRoleRequest";
import {ChangeRoleResponse} from '../dto/ChangeRoleResponse';

@Injectable({
  providedIn: 'root'
})
export class ChangeRoleService {
  private apiUrl = ApiPathUtil.getChangeRolePath();

  constructor(private http: HttpClient) { }

  requestChangeRole(changeRoleRequest: ChangeRoleRequest): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/request`, changeRoleRequest);
  }

  findAllChangeRoleRequests(): Observable<ChangeRoleResponse[]> {
    return this.http.get<ChangeRoleResponse[]>(`${this.apiUrl}/requests`);
  }

  acceptChangeRole(requestId: number): Observable<CustomResponse> {
    console.log('Service - requestId:', requestId); // Debug
    if (!requestId || isNaN(requestId)) {
      throw new Error('ID richiesta non valido');
    }
    return this.http.post<CustomResponse>(`${this.apiUrl}/accept/${requestId}`, null);
  }

  rejectChangeRole(requestId: number, motivation: string): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/reject/${requestId}`, { motivation });
  }


}
