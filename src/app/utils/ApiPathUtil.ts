import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
  }
)

export class ApiPathUtil {
  private static readonly BASE_URL = 'http://localhost:8080/api/v1';

  public static getAuthPath(): string {
    return `${this.BASE_URL}/auth`;
  }
  public static getBookingPath(): string {
    return `${this.BASE_URL}/booking`;
  }
  public static getChangeRolePath(): string {
    return `${this.BASE_URL}/change-role`;
  }

  public static getChatPath(): string {
    return `${this.BASE_URL}/chat`;
  }

  public static getCouponPath(): string {
    return `${this.BASE_URL}/coupon`;
  }

  public static getNotificationPath(): string {
    return `${this.BASE_URL}/notifications`;
  }

  public static getPropertiesPath(): string {
    return `${this.BASE_URL}/property`;
  }

  public static getReviewPath(): string {
    return `${this.BASE_URL}/review`;
  }

  public static getTicketPath(): string {
    return `${this.BASE_URL}/ticket`;
  }

  public static getUserPath(): string {
    return `${this.BASE_URL}/user`;
  }
}
