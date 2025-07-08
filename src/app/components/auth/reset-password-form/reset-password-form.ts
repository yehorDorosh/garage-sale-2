import { Component, signal, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { User } from '../../../services/auth/user';

@Component({
  selector: 'app-reset-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password-form.html',
  styleUrl: './reset-password-form.scss',
})
export class ResetPasswordForm {
  private router = inject(Router);
  private user = inject(User);

  loading = signal(false);
  beError = '';

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  get emailInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    this.form.markAllAsDirty();
    this.loading.set(true);
    this.beError = '';
    try {
      const { email } = this.form.value;
      if (email) {
        await this.user.resetPassword(email);
        this.router.navigate(['/']);
      } else {
        throw new Error('No email error.');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.beError = error.code;
      } else if (error instanceof Error) {
        this.beError = error.message;
      } else {
        this.beError = 'An unknown error occurred';
      }
    } finally {
      this.loading.set(false);
    }
  }
}
