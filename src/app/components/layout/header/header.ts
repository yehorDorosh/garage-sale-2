import { Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  auth = inject(Auth);

  onLogout() {
    signOut(this.auth)
      .then(() => {
        console.log('Logout successful');
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  }
}
