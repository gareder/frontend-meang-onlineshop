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
      console.log('We are logged in');
      const dataDecode: any = this.decodeToken();
      console.log(dataDecode);
      // Check token is not expired
      if (dataDecode.exp < new Date().getTime() / 1000) {
        console.log('Expired session');
        this.redirect();
      }
      // User role is ADMIN
      if (dataDecode.user.role === 'ADMIN') {
        console.log('Admin logged in');
        return true;
      }
      console.log('Client role logged in');
    }
    console.log('Theres no session');
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
