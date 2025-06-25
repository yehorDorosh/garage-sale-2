import { Component, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
  private auth = inject(Auth);
  private fireStore = inject(Firestore);
  private router = inject(Router);

  loading = signal(false);
  beError = '';

  form = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(254),
      ],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(254),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$'),
      ],
    }),
    confirmPassword: new FormControl('', {
      validators: [this.comparePasswords, Validators.required],
    }),
    phone: new FormControl('', {
      validators: [
        Validators.maxLength(254),
        Validators.pattern('^\\+[0-9]{1,3}[0-9\\s\\-()]{6,19}$'),
      ],
    }),
    messanger: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    slackUsername: new FormControl('', {
      validators: [Validators.maxLength(254)],
    }),
  });

  comparePasswords(control: AbstractControl) {
    if (!control.parent) {
      return null;
    }

    const password = control.parent.get('password')?.value;
    const confirmPassword = control.value;

    if (password === confirmPassword) {
      return null;
    }

    return { passwordsDoesntMatch: true };
  }

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

  get confirmPasswordInvalid() {
    return (
      this.form.controls.confirmPassword.touched &&
      this.form.controls.confirmPassword.dirty &&
      this.form.controls.confirmPassword.invalid
    );
  }

  get phoneInvalid() {
    return (
      this.form.controls.phone.touched &&
      this.form.controls.phone.dirty &&
      this.form.controls.phone.invalid
    );
  }

  get hasPhoneNumber() {
    return !!this.form.controls.phone.value;
  }

  async onSubmit() {
    // console.log(this.form, this.form.value?.email);
    this.form.markAllAsTouched();
    this.form.markAllAsDirty();
    this.beError = '';
    if (this.form.invalid) return;
    this.loading.set(true);

    const email = this.form.value.email!;
    const password = this.form.value.password!;
    const phone = this.form.value.phone || null;
    const messanger = this.form.value.messanger;
    const slackUsername = this.form.value.slackUsername || null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('User registered:', userCredential.user);

      const uid = userCredential.user.uid;
      await setDoc(doc(this.fireStore, 'users', uid), {
        email,
        phone,
        messanger,
        slackUsername,
      });
      console.log('User data saved');
      this.form.reset();
      this.loading.set(false);
      this.router.navigate(['/']);
    } catch (error) {
      this.loading.set(false);
      console.error('Registration error:', error);

      if (error instanceof FirebaseError) {
        this.beError = error.code;
      }
    }
  }
}
