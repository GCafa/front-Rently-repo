export class PropertyUpdateRequest {
  title: string;
  description: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  isAvailable: boolean;

  constructor(
    title: string,
    description: string,
    pricePerNight: number,
    bedrooms: number,
    bathrooms: number,
    maxGuests: number,
    isAvailable: boolean
  ) {
    this.title = title;
    this.description = description;
    this.pricePerNight = pricePerNight;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.maxGuests = maxGuests;
    this.isAvailable = isAvailable;
  }
}
