export class ChatMessageRequest {
  content: string;
  receiverId: number;

  constructor(content: string, receiverId: number) {
    this.content = content;
    this.receiverId = receiverId;
  }
}
