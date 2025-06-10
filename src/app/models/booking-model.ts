import {UserModel} from "./user-model";
import {PropertyModel} from "./property-model";

export class BookingModel {
  bookingId: number;
  checkInDate: Date;
  checkOutDate: Date;
  numOfAdults: number;
  numOfChildren: number;
  total: number;
  bookingConfirmationCode: string;
  user: UserModel;
  property: PropertyModel;
  status: string;
  discountAmount: number;
  createdAt: Date;


  constructor(
    bookingId: number,
    checkInDate: Date,
    checkOutDate: Date,
    numOfAdults: number,
    numOfChildren: number,
    total: number,
    bookingConfirmationCode: string,
    user: UserModel,
    property: PropertyModel,
    status: string = 'UPCOMING',
    discountAmount: number = 0,
    createdAt: Date = new Date()
  ) {
    this.bookingId = bookingId;
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.numOfAdults = numOfAdults;
    this.numOfChildren = numOfChildren;
    this.total = total;
    this.bookingConfirmationCode = bookingConfirmationCode;
    this.user = user;
    this.property = property;
    this.status = status;
    this.discountAmount = discountAmount;
    this.createdAt = createdAt;
  }
}
