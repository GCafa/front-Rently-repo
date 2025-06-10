import {UserModel} from "./user-model";
import {PropertyModel} from "./property-model";

export class ReviewModel {
  reviewId: number;
  title: string;
  description: string;
  reviewer: UserModel;
  property: PropertyModel;
  reviewed: UserModel;
  createdAt: Date;
  rating: number;

  constructor(
    reviewId: number,
    title: string,
    description: string,
    reviewer: UserModel,
    property: PropertyModel,
    reviewed: UserModel,
    createdAt: Date,
    rating: number
  ) {
    this.reviewId = reviewId;
    this.title = title;
    this.description = description;
    this.reviewer = reviewer;
    this.property = property;
    this.reviewed = reviewed;
    this.createdAt = createdAt;
    this.rating = rating;
  }
}
