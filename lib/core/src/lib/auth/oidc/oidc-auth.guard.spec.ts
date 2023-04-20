/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { OidcAuthGuard } from './oidc-auth.guard';

const state: RouterStateSnapshot = {
  root: new ActivatedRouteSnapshot(),
  url: 'http://example.com'
};
const routeSnapshot = new ActivatedRouteSnapshot();

describe('OidcAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [OidcAuthGuard]
    });
  });

  describe('#canActivate', () => {
    it('should return false if the user is not authenticated, and call login method', () => {
      const authService = { authenticated: false, login: jasmine.createSpy() } as unknown as AuthService;
      const authGuard = new OidcAuthGuard(authService);

      expect(authGuard.canActivate(routeSnapshot, state)).toEqual(false);
      expect(authService.login).toHaveBeenCalled();
    });

    it('should return true if the user is authenticated', () => {
      const authService = { authenticated: true } as unknown as AuthService;
      const authGuard = new OidcAuthGuard(authService);

      expect(authGuard.canActivate(routeSnapshot, state)).toEqual(true);
    });
  });

  describe('#canActivateChild', () => {
    it('should return false if the user is not authenticated, and call login method', () => {
      const authService = { authenticated: false, login: jasmine.createSpy() } as unknown as AuthService;
      const authGuard = new OidcAuthGuard(authService);

      expect(authGuard.canActivateChild(routeSnapshot, state)).toEqual(false);
      expect(authService.login).toHaveBeenCalled();
    });

    it('should return true if the user is authenticated', () => {
      const authService = { authenticated: true } as unknown as AuthService;
      const authGuard = new OidcAuthGuard(authService);

      expect(authGuard.canActivateChild(routeSnapshot, state)).toEqual(true);
    });
  });

});
