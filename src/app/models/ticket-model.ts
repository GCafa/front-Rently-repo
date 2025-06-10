import {UserModel} from "./user-model";

export class TicketModel {
  ticketId: number;
  title: string;
  description: string;
  creationDate: Date;
  closingDate: Date;
  user: UserModel;
  status: string;

  constructor(
    ticketId: number,
    title: string,
    description: string,
    creationDate: Date,
    closingDate: Date,
    user: UserModel,
    status: string
  ) {
    this.ticketId = ticketId;
    this.title = title;
    this.description = description;
    this.creationDate = creationDate;
    this.closingDate = closingDate;
    this.user = user;
    this.status = status;
  }
}
