
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn ,Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';

export const sellerPagesGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot):any => {
   
    const auth = inject(AuthService)
    
      return auth.isSellerUser() && auth.isLoggedIn();
    
};
