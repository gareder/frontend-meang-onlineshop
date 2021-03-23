import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {

  constructor(private auth: AuthService, private router: Router) { }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Check there's a session
    if (this.auth.getSession() !== null) {
      const dataDecode: any = this.decodeToken();
      // Check token is not expired
      if (dataDecode.exp < new Date().getTime() / 1000) {
        this.redirect();
      }
      // User role is ADMIN
      if (dataDecode.user.role === 'ADMIN') {
        return true;
      }
    }
    this.redirect();
  }

  decodeToken() {
    return jwt_decode(this.auth.getSession().token);
  }

  redirect() {
    this.router.navigateByUrl('/login');
    return false;
  }

}
