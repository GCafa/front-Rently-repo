import { UserModel } from "./user-model";
import { PropertyModel } from "./property-model";

export class ReviewModel {
  id: number;
  title: string;
  description: string;
  reviewer: UserModel;
  property: PropertyModel | null;
  reviewed: UserModel | null;
  createdAt: Date;
  rating: number;
  hostResponse: string | null;
  hostResponseCreatedAt: Date | null;

  constructor(
    id: number,
    title: string,
    description: string,
    reviewer: UserModel,
    property: PropertyModel | null,
    reviewed: UserModel | null,
    createdAt: Date,
    rating: number,
    hostResponse: string | null,
    hostResponseCreatedAt: Date | null
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.reviewer = reviewer;
    this.property = property;
    this.reviewed = reviewed;
    this.createdAt = createdAt;
    this.rating = rating;
    this.hostResponse = hostResponse;
    this.hostResponseCreatedAt = hostResponseCreatedAt;
  }
}
