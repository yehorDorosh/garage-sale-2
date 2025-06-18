import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(Auth);

  const user = await new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u);
    });
  });

  if (user) {
    return true;
  } else {
    return new RedirectCommand(router.parseUrl('/'));
  }
};

export const unAuthZoneGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(Auth);

  const user = await new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u);
    });
  });

  if (!user) {
    return true;
  } else {
    return new RedirectCommand(router.parseUrl('/'));
  }
};
