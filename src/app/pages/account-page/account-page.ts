import { Component, inject, OnInit, signal } from '@angular/core';
import { MainTemp } from '../../components/layout/page-template/main-temp/main-temp';
import { Auth, deleteUser } from '@angular/fire/auth';
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../../services/auth/user';
import { getDoc } from 'firebase/firestore';
import { UserData } from '../../types/user.model';
import { EditUserFrom } from '../../components/auth/edit-user-from/edit-user-from';

@Component({
  selector: 'app-account-page',
  imports: [MainTemp, EditUserFrom],
  templateUrl: './account-page.html',
  styleUrl: './account-page.scss',
})
export class AccountPage implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private user = inject(User);
  email = signal<string | null>(null);
  phone = signal<string | null>(null);
  messanger = signal<[boolean, boolean, boolean] | null>(null);
  slackUsername = signal<string | null>(null);

  ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    const uid = this.user.uid();
    if (!uid) return;
    const userDocRef = doc(this.firestore, 'users', uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as UserData;
      this.email.set(data.email);
      this.phone.set(data.phone);
      this.messanger.set(data.messanger);
      this.slackUsername.set(data.slackUsername);
    }
  }

  async onDeleteAccount() {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      const user = this.auth.currentUser;
      if (user) {
        try {
          await deleteDoc(doc(this.firestore, 'users', user.uid));
          await deleteUser(user);
          this.router.navigate(['/']);
          console.log('Account deleted successfully.');
        } catch (error) {
          console.log('Failed to delete account: ' + error);
          window.alert(
            'Failed to delete account: ' +
              (error instanceof Error ? error.message : error)
          );
        }
      } else {
        console.log('No user is currently signed in.');
      }
    }
  }
}
