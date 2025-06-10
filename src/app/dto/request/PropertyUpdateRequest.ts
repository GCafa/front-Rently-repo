export class PropertyUpdateRequest {
  title: string;
  description: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  isActive: boolean;

  constructor(
    title: string,
    description: string,
    pricePerNight: number,
    bedrooms: number,
    bathrooms: number,
    maxGuests: number,
    isActive: boolean
  ) {
    this.title = title;
    this.description = description;
    this.pricePerNight = pricePerNight;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.maxGuests = maxGuests;
    this.isActive = isActive;
  }
}
