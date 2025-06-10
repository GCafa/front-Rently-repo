

export class CouponModel {
  couponId: number;
  code: string;
  discountedAmount: number;
  discountPercentage: number;
  expiryDate: Date;

  constructor(
    couponId: number,
    code: string,
    discountedAmount: number,
    discountPercentage: number,
    expiryDate: Date
  ) {
    this.couponId = couponId;
    this.code = code;
    this.discountedAmount = discountedAmount;
    this.discountPercentage = discountPercentage;
    this.expiryDate = expiryDate;
  }

}
