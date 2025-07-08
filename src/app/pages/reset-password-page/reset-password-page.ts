import { Component } from '@angular/core';
import { MainTemp } from '../../components/layout/page-template/main-temp/main-temp';
import { ResetPasswordForm } from '../../components/auth/reset-password-form/reset-password-form';

@Component({
  selector: 'app-reset-password-page',
  imports: [MainTemp, ResetPasswordForm],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
})
export class ResetPasswordPage {}
