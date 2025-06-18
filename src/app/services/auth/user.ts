import { Injectable, signal, inject } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class User {
  auth = inject(Auth);
  router = inject(Router);

  isLoggedIn = signal<boolean>(false);
  uid = signal<string | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user: FirebaseUser | null) => {
      this.isLoggedIn.set(!!user);
      this.uid.set(user?.uid ? user.uid : null);
    });
  }

  logOut() {
    signOut(this.auth)
      .then(() => {
        console.log('Logout successful');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  }
}
