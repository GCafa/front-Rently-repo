import {PropertyModel} from './property-model';
import {ChatMessageModel} from './chatMessage-model';
import {BookingModel} from './booking-model';
import {CouponModel} from './coupon-model';
import {ReviewModel} from './review-model';
import {NotificationModel} from './notification-model';

export class UserModel {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  imageUrl: string;
  balance: number;
  sentMessages: ChatMessageModel[];
  receivedMessages: ChatMessageModel[];
  properties: PropertyModel[];
  bookings: BookingModel[];
  favorites: PropertyModel[];
  coupons: CouponModel[];
  reviews: ReviewModel[];
  notifications: NotificationModel[];


  constructor(
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    password: string,
    role: string,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
    imageUrl: string

  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.username = username;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
    this.imageUrl = imageUrl;
    this.balance = 0; // Default balance
    this.sentMessages = [];
    this.receivedMessages = [];
    this.properties = [];
    this.bookings = [];
    this.favorites = [];
    this.coupons = [];
    this.reviews = [];
    this.notifications = [];
  }
}
