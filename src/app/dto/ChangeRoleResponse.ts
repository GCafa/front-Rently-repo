
export class ChangeRoleResponse {
  id: number;
  username: string;
  motivation: string;
  status: string;

  constructor(id: number, username: string, motivation: string, status: string) {
    this.id = id;
    this.username = username;
    this.motivation = motivation;
    this.status = status;
  }
}
