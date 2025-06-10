import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketModel } from '../models/ticket-model';
import { TicketReplyModel } from '../models/ticketreply-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = ApiPathUtil.getTicketPath();

  constructor(private http: HttpClient) { }

  createTicket(request: any): Observable<TicketModel> {
    return this.http.post<TicketModel>(`${this.apiUrl}/create`, request);
  }

  getTicketById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMyTickets(): Observable<TicketModel[]> {
    return this.http.get<TicketModel[]>(`${this.apiUrl}/my-tickets`);
  }

  getAllTickets(status?: string): Observable<TicketModel[]> {
    const url = status ? `${this.apiUrl}?status=${status}` : `${this.apiUrl}`;
    return this.http.get<TicketModel[]>(url);
  }

  assignTicket(id: number): Observable<TicketModel> {
    return this.http.post<TicketModel>(`${this.apiUrl}/${id}/assign`, {});
  }

  solveTicket(id: number): Observable<TicketModel> {
    return this.http.post<TicketModel>(`${this.apiUrl}/${id}/solve`, {});
  }

  closeTicket(id: number): Observable<TicketModel> {
    return this.http.post<TicketModel>(`${this.apiUrl}/${id}/close`, {});
  }

  addReply(id: number, request: any): Observable<TicketReplyModel> {
    return this.http.post<TicketReplyModel>(`${this.apiUrl}/${id}/replies`, request);
  }
}
