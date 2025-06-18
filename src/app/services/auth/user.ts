import { Injectable, OnInit, signal, inject } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from '@angular/fire/auth';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class User {
  auth = inject(Auth);
  isLoggedIn = signal<boolean>(false);

  constructor() {
    onAuthStateChanged(this.auth, (user: FirebaseUser | null) => {
      this.isLoggedIn.set(!!user);
    });
  }

  logOut() {
    signOut(this.auth)
      .then(() => {
        console.log('Logout successful');
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  }
}
