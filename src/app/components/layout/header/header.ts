import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../../services/auth/user';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  user = inject(User);

  onLogout() {
    this.user.logOut();
  }
}
