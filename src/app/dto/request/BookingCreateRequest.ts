import {UserModel} from "../../models/user-model";
import {PropertyModel} from "../../models/property-model";

export class BookingCreateRequest {
  checkInDate: Date;
  checkOutDate: Date;
  numOfAdults: number;
  numOfChildren: number;
  user: UserModel;
  property: PropertyModel;
  couponCode: string | null;

  constructor(
    checkInDate: Date,
    checkOutDate: Date,
    numOfAdults: number,
    numOfChildren: number,
    user: UserModel,
    property: PropertyModel,
    couponCode: string | null
  ) {
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.numOfAdults = numOfAdults;
    this.numOfChildren = numOfChildren;
    this.user = user;
    this.property = property;
    this.couponCode = couponCode;
  }
}
