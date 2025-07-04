import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { SignupPage } from './pages/signup-page/signup-page';
import { AccountPage } from './pages/account-page/account-page';
import { authGuard, unAuthZoneGuard } from './router-guards';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [unAuthZoneGuard],
  },
  {
    path: 'signup',
    component: SignupPage,
    canActivate: [unAuthZoneGuard],
  },
  {
    path: 'user',
    component: AccountPage,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
