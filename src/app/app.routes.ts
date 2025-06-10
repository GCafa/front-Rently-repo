import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ChangeRoleRequestComponent } from './components/change-role/change-role-request/change-role-request.component';
import { ModifyComponent } from './components/user/modify/modify.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

//import { BookingListComponent } from './components/booking/booking-list/booking-list.component';
//import { BookingDetailComponent } from './components/booking/booking-detail/booking-detail.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'AboutUs', component: AboutUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes
  { path: 'changeRoleRequest', component: ChangeRoleRequestComponent, canActivate: [authGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: 'modify', component: ModifyComponent, canActivate: [authGuard] },

  // Fallback route
  { path: '**', redirectTo: '/home' }
];
