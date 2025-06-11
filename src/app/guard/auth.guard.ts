import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

// Guardia base per l'autenticazione
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
  const router = inject(Router);

  if (token && role) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};

// Guardia per ruolo admin
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  const router = inject(Router);

  if (token && role === 'ADMIN') {
    return true;
  }

  router.navigate(['/home']);
  return false;
};

// Guardia per ruolo moderator
export const moderatorGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  const router = inject(Router);

  if (token && (role === 'MODERATOR' || role === 'ADMIN')) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};

// Guardia per ruolo host
export const hostGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  const router = inject(Router);

  if (token && role === 'HOST') {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
