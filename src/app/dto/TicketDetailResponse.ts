import {UserModel} from "../models/user-model";
import {TicketReplyModel} from "../models/ticketreply-model";

export class TicketDetailResponse {
  id: number;
  title: string;
  description: string;
  creationDate: Date;
  closingDate: Date;
  status: string;
  user: UserModel;
  replies: TicketReplyModel[];

  constructor(
    id: number,
    title: string,
    description: string,
    creationDate: Date,
    closingDate: Date,
    status: string,
    user: UserModel,
    replies: TicketReplyModel[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.creationDate = creationDate;
    this.closingDate = closingDate;
    this.status = status;
    this.user = user;
    this.replies = replies;
  }
}
