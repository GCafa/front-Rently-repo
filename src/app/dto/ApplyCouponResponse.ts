

export class ApplyCouponResponse {
  couponCode: string;
  discountAmount: number;

  constructor(couponCode: string, discountAmount: number) {
    this.couponCode = couponCode;
    this.discountAmount = discountAmount;
  }
}
