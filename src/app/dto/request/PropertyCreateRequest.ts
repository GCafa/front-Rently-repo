export class PropertyCreateRequest {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;

  constructor(
    title: string,
    description: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pricePerNight: number,
    bedrooms: number,
    bathrooms: number,
    maxGuests: number
  ) {
    this.title = title;
    this.description = description;
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.pricePerNight = pricePerNight;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.maxGuests = maxGuests;
  }
}
