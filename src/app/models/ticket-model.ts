import {UserModel} from "./user-model";

export class TicketModel {
  id: number;
  title: string;
  description: string;
  creationDate: Date;
  closingDate: Date;
  user: UserModel;
  status: string;

  constructor(
    id: number,
    title: string,
    description: string,
    creationDate: Date,
    closingDate: Date,
    user: UserModel,
    status: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.creationDate = creationDate;
    this.closingDate = closingDate;
    this.user = user;
    this.status = status;
  }
}
