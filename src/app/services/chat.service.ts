// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessageModel} from '../models/chatMessage-model';
import { ChatMessageRequest} from '../dto/request/ChatMessageRequest';
import {ApiPathUtil} from '../utils/ApiPathUtil';
import {UserModel} from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = ApiPathUtil.getChatPath();

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatMessageRequest): Observable<ChatMessageModel> {
    return this.http.post<ChatMessageModel>(`${this.apiUrl}/send`, request);
  }

  getConversation(userId: number): Observable<ChatMessageModel[]> {
    return this.http.get<ChatMessageModel[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAllHostConversations(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/users`);
  }
}
