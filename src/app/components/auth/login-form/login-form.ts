import { Component, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private auth = inject(Auth);
  private router = inject(Router);

  loading = signal(false);
  beError = '';

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
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

  get passwordInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  async onSubmit() {
    this.loading.set(true);
    this.beError = '';
    try {
      const { email, password } = this.form.value;
      if (email && password) {
        await signInWithEmailAndPassword(this.auth, email, password);
        console.log('Login successful');
        this.router.navigate(['/']);
      } else {
        throw new Error('Email and password are required');
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
