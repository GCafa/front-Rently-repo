export class CustomResponse<T = any> {
  message: string;
  success: any;

  constructor(message: string) {
    this.message = message;
  }
}
