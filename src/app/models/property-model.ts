import {UserModel} from "./user-model";
import {BookingModel} from "./booking-model";
import {ReviewModel} from "./review-model";

export class PropertyModel {

  id: number;
  host: UserModel;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  favoritedBy: UserModel[];
  bookings: BookingModel[];
  propertyImages: string[];
  reviews: ReviewModel[];
  cleaningFee: number;
  serviceFee: number;

  constructor(
    id: number,
    host: UserModel,
    title: string,
    description: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pricePerNight: number,
    maxGuests: number,
    bedrooms: number,
    bathrooms: number,
    available: boolean,
    createdAt: Date,
    updatedAt: Date,
    favoritedBy: UserModel[],
    bookings: BookingModel[],
    propertyImages: string[],
    reviews: ReviewModel[],
    cleaningFee: number = 0,
    serviceFee: number = 0
  ) {
    this.id = id;
    this.host = host;
    this.title = title;
    this.description = description;
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.pricePerNight = pricePerNight;
    this.maxGuests = maxGuests;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.isAvailable = available;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.favoritedBy = favoritedBy;
    this.bookings = bookings;
    this.propertyImages = propertyImages;
    this.reviews = reviews;
    this.cleaningFee = cleaningFee;
    this.serviceFee = serviceFee;
  }
  }
