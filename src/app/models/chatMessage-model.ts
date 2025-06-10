import {UserModel} from "./user-model";

export class ChatMessageModel {
  chatMessageId: number;
  content: string;
  sender: UserModel;
  receiver: UserModel;
  sendAt: Date;

  constructor(
    chatMessageId: number,
    content: string,
    sender: UserModel,
    receiver: UserModel,
    sendAt: Date
  ) {
    this.chatMessageId = chatMessageId;
    this.content = content;
    this.sender = sender;
    this.receiver = receiver;
    this.sendAt = sendAt;
  }
}
