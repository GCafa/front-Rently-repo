export class ApplyCouponRequest {
  userId: number;
  couponCode: string;
  totalAmount: number;

    constructor(userId: number, couponCode: string, totalAmount: number) {
        this.userId = userId;
        this.couponCode = couponCode;
        this.totalAmount = totalAmount;
    }
}
