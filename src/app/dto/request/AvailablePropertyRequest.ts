export class AvailablePropertyRequest {
  checkInDate: Date;
  checkOutDate: Date;
  city: string;
  numOfAdults: number;
  numOfChildren: number;

  constructor(checkInDate: Date, checkOutDate: Date, city: string, numOfAdults: number, numOfChildren: number) {
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.city = city;
    this.numOfAdults = numOfAdults;
    this.numOfChildren = numOfChildren;
  }
}
