import {
  Component,
  inject,
  signal,
  input,
  SimpleChanges,
  output,
  OnInit,
  OnChanges,
} from '@angular/core';
import {
  Auth,
  updateEmail,
  updatePassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
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
import { doc, setDoc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-edit-user-from',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-from.html',
  styleUrl: './edit-user-from.scss',
})
export class EditUserFrom implements OnInit, OnChanges {
  private auth = inject(Auth);
  private fireStore = inject(Firestore);

  emailCurrent = input<string>();
  phoneCurrent = input<string | null>();
  messangerCurrent = input<[boolean, boolean, boolean] | null>();
  slackUsernameCurrent = input<string | null>();

  onSubmitSuccess = output<void>();

  loading = signal(false);
  beError = '';

  form = new FormGroup({
    email: new FormControl(this.emailCurrent(), {
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(254),
      ],
    }),
    password: new FormControl('', {
      validators: [
        Validators.minLength(6),
        Validators.maxLength(254),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$'),
      ],
    }),
    confirmPassword: new FormControl('', {
      validators: [this.comparePasswords],
    }),
    phone: new FormControl(this.phoneCurrent(), {
      validators: [
        Validators.maxLength(254),
        Validators.pattern('^\\+[0-9]{1,3}[0-9\\s\\-()]{6,19}$'),
      ],
    }),
    messanger: new FormArray([
      new FormControl(
        this.messangerCurrent() ? this.messangerCurrent()![0] : false
      ),
      new FormControl(
        this.messangerCurrent() ? this.messangerCurrent()![1] : false
      ),
      new FormControl(
        this.messangerCurrent() ? this.messangerCurrent()![2] : false
      ),
    ]),
    slackUsername: new FormControl(this.slackUsernameCurrent(), {
      validators: [Validators.maxLength(254)],
    }),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['emailCurrent']) {
      this.form.controls.email.setValue(changes['emailCurrent'].currentValue);
    }
    if (changes['phoneCurrent']) {
      this.form.controls.phone.setValue(changes['phoneCurrent'].currentValue);
    }
    if (changes['messangerCurrent']) {
      this.form.controls.messanger.setValue(
        changes['messangerCurrent'].currentValue
      );
    }
    if (changes['slackUsernameCurrent']) {
      this.form.controls.slackUsername.setValue(
        changes['slackUsernameCurrent'].currentValue
      );
    }
  }

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
    const password = this.form.value.password;
    const phone = this.form.value.phone || null;
    const messanger = this.form.value.messanger;
    const slackUsername = this.form.value.slackUsername || null;
    const user = this.auth.currentUser;

    try {
      if (!user) {
        console.error('No user is currently signed in.');
        this.loading.set(false);
        return;
      }

      const uid = user.uid;

      if (user.email !== email) {
        await updateEmail(user, email);
        await updateDoc(doc(this.fireStore, 'users', uid), { email });
        console.log('Email updated successfully');
      }

      if (password) {
        await updatePassword(user, password);
        this.form.controls.password.reset('');
        this.form.controls.confirmPassword.reset('');
        console.log('Password updated successfully');
      }

      if (phone !== this.phoneCurrent()) {
        await updateDoc(doc(this.fireStore, 'users', uid), { phone });
        console.log('Phone updated successfully');
      }

      if (
        !this.messangerEqual(
          messanger as [boolean, boolean, boolean],
          this.messangerCurrent()
        )
      ) {
        await updateDoc(doc(this.fireStore, 'users', uid), { messanger });
        console.log('Messanger updated successfully');
      }

      if (slackUsername !== this.slackUsernameCurrent()) {
        await updateDoc(doc(this.fireStore, 'users', uid), { slackUsername });
        console.log('Slack username updated successfully');
      }

      this.onSubmitSuccess.emit();
      this.loading.set(false);
    } catch (error) {
      this.loading.set(false);
      console.error('User data update error:', error);

      if (error instanceof FirebaseError) {
        this.beError = error.code;
      }
    }
  }

  messangerEqual(
    a: [boolean, boolean, boolean] | null | undefined,
    b: [boolean, boolean, boolean] | null | undefined
  ) {
    if (!a || !b) return false;
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }

  ngOnInit(): void {
    this.form.controls.password.valueChanges.subscribe((value) => {
      this.form.controls.confirmPassword.markAllAsDirty();
      this.form.controls.confirmPassword.markAllAsTouched();
      this.form.controls.confirmPassword.updateValueAndValidity();
    });
  }
}
