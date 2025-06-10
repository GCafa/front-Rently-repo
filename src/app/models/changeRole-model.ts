import {UserModel} from "./user-model";

export class ChangeRoleModel {

  changeRoleId: number;
  user: UserModel;
  changeRoleStatus: string;
  createdAt: Date;
  fulfilledAt: Date;
  fulfilledBy: UserModel;
  motivation: string;

  constructor(
    changeRoleId: number,
    user: UserModel,
    changeRoleStatus: string,
    createdAt: Date,
    fulfilledAt: Date,
    fulfilledBy: UserModel,
    motivation: string
  ) {
    this.changeRoleId = changeRoleId;
    this.user = user;
    this.changeRoleStatus = changeRoleStatus;
    this.createdAt = createdAt;
    this.fulfilledAt = fulfilledAt;
    this.fulfilledBy = fulfilledBy;
    this.motivation = motivation;
  }

}
