export class ReviewCreateRequest {
  title: string;
  description: string;
  rating: number;

  constructor(title: string, description: string, rating: number) {
    this.title = title;
    this.description = description;
    this.rating = rating;
  }
}
