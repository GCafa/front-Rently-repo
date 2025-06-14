import {UserModel} from "./user-model";

export class NotificationModel {
  id: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  user: UserModel;

  constructor(
    id: number,
    message: string,
    type: string,
    read: boolean,
    createdAt: Date,
    user: UserModel
  ) {
    this.id = id;
    this.message = message;
    this.type = type;
    this.read = read;
    this.createdAt = createdAt;
    this.user = user;
  }
}
