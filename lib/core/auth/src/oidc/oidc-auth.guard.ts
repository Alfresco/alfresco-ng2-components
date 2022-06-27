import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseAuthenticationService } from '../base-authentication.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OidcAuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private readonly authentication: BaseAuthenticationService) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._isAuthenticated(state);
  }

  canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._isAuthenticated(state);
  }

  /**
   * Checks if a user is authenticated.
   * If not authenticated, routes the user to the login screen.
   *
   * @param state Represents the state of the router at that moment in time.
   */
  private _isAuthenticated(state: RouterStateSnapshot) {

    if (this.shouldBeBypassed() || this._auth.authenticated) {
      return true;
    }

    const loginResult = this._auth.login(state.url);

    if (loginResult instanceof Promise) {
      return loginResult.then(() => true).catch(() => false);
    }

    return false;
  }

    shouldBeBypassed() {
        return this.authentication.authName !== 'OIDC';
    }
}
