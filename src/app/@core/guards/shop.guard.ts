import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class ShopGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Check there's a session
    if (this.auth.getSession() !== null) {
      console.log('We are logged in');
      const dataDecode: any = this.decodeToken();
      // Check token is not expired
      if (dataDecode.exp < new Date().getTime() / 1000) {
        console.log('Expired session');
        this.redirect();
      }
      return true;
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
