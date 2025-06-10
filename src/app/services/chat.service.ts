import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessageModel } from '../models/chatMessage-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = ApiPathUtil.getChatPath();

  constructor(private http: HttpClient) { }





}
