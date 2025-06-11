import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {CustomResponse} from "../dto/CustomResponse";
import {UserRegistrationRequest} from "../dto/request/UserRegistrationRequest";
import {catchError, tap} from "rxjs/operators";
import {LoginResponse} from "../dto/LoginResponse";
import {ApiPathUtil} from "../utils/ApiPathUtil";
import {UserLoginRequest} from "../dto/request/UserLoginRequest";
import {UserModel} from "../models/user-model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);
  public currentUser$: Observable<UserModel | null> = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  private getAuthPath(): string {
    return ApiPathUtil.getAuthPath();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadStoredUser();
  }

  private handleError(error: any, context: string): Observable<never> {
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser) as UserModel;
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenKey);
      }
    }
  }

  register(registerData: UserRegistrationRequest, image: File): Observable<CustomResponse> {
    const formData = new FormData();
    formData.append('userRegistrationRequest', JSON.stringify(registerData));
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<CustomResponse>(`${this.getAuthPath()}/register`, formData).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem(this.userKey, JSON.stringify(registerData));
        }
      }),
      catchError(error => this.handleError(error, 'registrazione'))
    );
  }

  login(loginData: UserLoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.getAuthPath()}/login`, loginData).pipe(
      tap(response => {
        if (response.jwt) { // ✅ Fix: usa 'jwt' invece di 'token'
          localStorage.setItem(this.tokenKey, response.jwt);
          this.loadStoredUser(); // opzionale: se vuoi popolare currentUserSubject
        }
      }),
      catchError(error => this.handleError(error, 'accesso'))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) {
      return false;
    }
    return user.role === role;
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getUserLoggedUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      console.log('Decoded JWT payload:', payload);
      return payload?.username || payload?.sub || null;
    }
    return null;
  }
}
