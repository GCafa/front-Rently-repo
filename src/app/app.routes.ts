import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ChangeRoleRequestComponent } from './components/change-role/change-role-request/change-role-request.component';
import { ModifyComponent } from './components/user/modify/modify.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ProfileComponent } from './components/profile/profile.component';
//import { BookingListComponent } from './components/booking/booking-list/booking-list.component';
//import { BookingDetailComponent } from './components/booking/booking-detail/booking-detail.component';
import {adminGuard, authGuard, moderatorGuard} from './guard/auth.guard';
import {RechargeBalanceComponent} from './components/user/recharge-balance/recharge-balance.component';
import {usersVisualizationComponent} from './components/users-visualization/users-visualization.component';
import {FindAllChangeRoleRequestComponent} from './components/change-role/find-all-change-role-request/find-all-change-role-request.component';
import {CreatePropertyComponent} from './components/create-property/create-property.component';
import {PropertyListComponent} from './components/property/property-list/property-list.component';
import { PropertyDetailsComponent } from './components/property/property-details/property-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes
  {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  { path: 'change-role-request', component: ChangeRoleRequestComponent, canActivate: [authGuard]},
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard]},
  { path: 'modify', component: ModifyComponent, canActivate: [authGuard]},
  { path: 'recharge-balance', component: RechargeBalanceComponent, canActivate: [authGuard]},
  { path: 'users-visualization',component:usersVisualizationComponent, canActivate: [authGuard] },
  { path: 'find-all-change-role-request', component: FindAllChangeRoleRequestComponent, canActivate: [authGuard] },
  { path: 'create-property', component: CreatePropertyComponent, canActivate: [authGuard] },
  { path: 'property-list', component: PropertyListComponent, canActivate: [authGuard] },
  { path: 'property-details/:id', component: PropertyDetailsComponent, canActivate: [authGuard] },

  // Fallback route
  { path: '**', redirectTo: '/home' }
];
