import {Injectable} from "@angular/core";
import {ApiPathUtil} from "../utils/ApiPathUtil";
import {HttpClient} from "@angular/common/http";
import {BookingCreateRequest} from "../dto/request/BookingCreateRequest";
import {Observable} from "rxjs";
import {CustomResponse} from "../dto/CustomResponse";
import {BookingModel} from "../models/booking-model";
import {ChangeRoleModel} from "../models/changeRole-model";
import {ChangeRoleRequest} from "../dto/request/ChangeRoleRequest";

@Injectable({
  providedIn: 'root'
})
export class ChangeRoleService {
  private apiUrl = ApiPathUtil.getChangeRolePath();

  constructor(private http: HttpClient) { }

  requestChangeRole(changeRoleRequest: ChangeRoleRequest): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/request`, changeRoleRequest);
  }

  findAllChangeRoleRequests(): Observable<ChangeRoleModel[]> {
    return this.http.get<ChangeRoleModel[]>(`${this.apiUrl}/requests`);
  }

  acceptChangeRole(requestId: number): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/accept/${requestId}`, {});
  }

  rejectChangeRole(requestId: number, changeRoleRequest: ChangeRoleRequest): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/reject/${requestId}`, {changeRoleRequest});
  }

}
