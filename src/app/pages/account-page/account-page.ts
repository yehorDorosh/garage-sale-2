import { Component, inject } from '@angular/core';
import { MainTemp } from '../../components/layout/page-template/main-temp/main-temp';
import { Auth, deleteUser } from '@angular/fire/auth';
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-account-page',
  imports: [MainTemp],
  templateUrl: './account-page.html',
  styleUrl: './account-page.scss',
})
export class AccountPage {
  auth = inject(Auth);
  firestore = inject(Firestore);

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
