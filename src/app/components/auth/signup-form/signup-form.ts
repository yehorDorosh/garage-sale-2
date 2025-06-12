import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
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
      validators: [this.comparePasswords],
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

  onSubmit() {
    console.log(this.form, this.form.value?.email);
  }
}
