import {UserSummary} from './UserSummary';


export class BookingDashboardResponse {
  title: string;
  user: UserSummary;
  checkInDate: Date;
  checkOutDate: Date;
  total: number;

  constructor(
    title: string,
    user: UserSummary,
    checkInDate: Date,
    checkOutDate: Date,
    total: number
  ) {
    this.title = title;
    this.user = user;
    this.checkInDate = new Date(checkInDate);
    this.checkOutDate = new Date(checkOutDate);
    this.total = total;
  }
}
