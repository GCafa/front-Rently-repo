import {UserModel} from "./user-model";

export class NotificationModel {
  notificationId: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  user: UserModel;

  constructor(
    notificationId: number,
    message: string,
    type: string,
    isRead: boolean,
    createdAt: Date,
    user: UserModel
  ) {
    this.notificationId = notificationId;
    this.message = message;
    this.type = type;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.user = user;
  }
}
