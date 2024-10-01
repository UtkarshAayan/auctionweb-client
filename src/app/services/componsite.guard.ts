import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const compositeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isBuyer = auth.isBuyerUser() && auth.isLoggedIn();
  const isSeller = auth.isSellerUser() && auth.isLoggedIn();

  if (isBuyer || isSeller) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
