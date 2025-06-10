import {TicketModel} from "./ticket-model";
import {UserModel} from "./user-model";


export class TicketReplyModel {
  ticketReplyId: number;
  content: string;
  creationDate: Date;
  ticket: TicketModel;
  user: UserModel;
  fromModerator: boolean;

  constructor(
    ticketReplyId: number,
    content: string,
    creationDate: Date,
    ticket: TicketModel,
    user: UserModel,
    fromModerator: boolean
  ) {
    this.ticketReplyId = ticketReplyId;
    this.content = content;
    this.creationDate = creationDate;
    this.ticket = ticket;
    this.user = user;
    this.fromModerator = fromModerator;
  }
}
