
export class ChangeRoleResponse {
  requestid: number;
  username: string;
  motivation: string;
  status: string;

  constructor(requestid: number, username: string, motivation: string, status: string) {
    this.requestid = requestid;
    this.username = username;
    this.motivation = motivation;
    this.status = status;
  }
}
