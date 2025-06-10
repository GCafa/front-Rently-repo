import {UserModel} from "../../models/user-model";
import {PropertyModel} from "../../models/property-model";

export class BookingCreateRequest {
  checkInDate: Date;
  checkOutDate: Date;
  numberOfAdults: number;
  numberOfChildren: number;
  bookingConfirmationCode: string;
  user: UserModel;
  property: PropertyModel;
  couponCode: string;

  constructor(
    checkInDate: Date,
    checkOutDate: Date,
    numberOfAdults: number,
    numberOfChildren: number,
    bookingConfirmationCode: string,
    user: UserModel,
    property: PropertyModel,
    couponCode: string
  ) {
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.numberOfAdults = numberOfAdults;
    this.numberOfChildren = numberOfChildren;
    this.bookingConfirmationCode = bookingConfirmationCode;
    this.user = user;
    this.property = property;
    this.couponCode = couponCode;
  }
}
