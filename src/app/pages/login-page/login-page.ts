import { Component } from '@angular/core';
import { MainTemp } from '../../components/layout/page-template/main-temp/main-temp';
import { LoginForm } from '../../components/auth/login-form/login-form';

@Component({
  selector: 'app-login-page',
  imports: [MainTemp, LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {}
