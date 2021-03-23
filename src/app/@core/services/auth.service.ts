import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REDIRECTS_ROUTES } from '@core/constants/config';
import { ISession, IMeData } from '@core/interfaces/session.interface';
import { LOGIN_QUERY, ME_DATA_QUERY } from '@graphql/operations/query/user';
import { ApiService } from '@graphql/services/api.service';
import { optionsWithDetails } from '@shared/alerts/alerts';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {

  accessVar = new Subject<IMeData>();
  accessVar$ = this.accessVar.asObservable();

  constructor(apollo: Apollo) {
    super(apollo);
  }

  updateSession(newValue: IMeData) {
    this.accessVar.next(newValue);
  }

  start() {
    if (this.getSession() !== null) {
      this.getMe().subscribe((result: IMeData) => {
        if (!result.status) {
          this.resetSession();
          return;
        }
        this.updateSession(result);
      });
      return;
    }
    this.updateSession({ status: false });
  }

   // Consume API
  login(email: string, password: string) {
    return this.get(LOGIN_QUERY, { email, password, include: false }).pipe(map((result: any) => {
      return result.login;
    }));
  }

  getMe() {
    return this.get(ME_DATA_QUERY, { include: false }, {
      headers: new HttpHeaders ({
        Authorization: this.getSession().token
      })
    }).pipe(map((result: any) => {
      return result.me;
    }));
  }

  setSession(token: string, expireTimeInHours = 24) {
    const date = new Date();
    date.setHours(date.getHours() + expireTimeInHours);
    const session: ISession = {
      expiresIn: new Date(date).toISOString(),
      token
    };
    localStorage.setItem('session', JSON.stringify(session));
  }

  getSession(): ISession {
    return JSON.parse(localStorage.getItem('session'));
  }

  async resetSession(routesUrl: string = '') {
    const result = await optionsWithDetails('Log out', `Are you sure you want to log out?`, 360, 'Yes, log out', 'No');
    if (!result) {
        return;
    }
    if (REDIRECTS_ROUTES.includes(routesUrl)) {
      // If we find the path, we redirect
      localStorage.setItem('route_after_login', routesUrl);
    }
    localStorage.removeItem('session');
    this.updateSession({ status: false });
  }

}
