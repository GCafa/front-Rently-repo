export class ChatMessageRequest {
  content: string;
  receiverId: string;

  constructor(content: string, receiverId: string) {
    this.content = content;
    this.receiverId = receiverId;
  }
}
