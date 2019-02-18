/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { async, TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('AuthGuardService', () => {
    let state;
    let authService: AuthenticationService;
    let routerService: Router;
    let authGuard: AuthGuard;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        localStorage.clear();
        state = { url: '' };
        authService = TestBed.get(AuthenticationService);
        routerService = TestBed.get(Router);
        authGuard = TestBed.get(AuthGuard);
        appConfigService = TestBed.get(AppConfigService);

        appConfigService.config.auth = {};
    });

    it('if the alfresco js api is logged in should canActivate be true', async(() => {
        spyOn(routerService, 'navigate');
        spyOn(authService, 'isLoggedIn').and.returnValue(true);

        expect(authGuard.canActivate(null, state)).toBeTruthy();
        expect(routerService.navigate).not.toHaveBeenCalled();
    }));

    it('if the alfresco js api is NOT logged in should canActivate be false', async(() => {
        state.url = 'some-url';
        spyOn(routerService, 'navigate');
        spyOn(authService, 'isLoggedIn').and.returnValue(false);

        expect(authGuard.canActivate(null, state)).toBeFalsy();
        expect(routerService.navigate).toHaveBeenCalled();
    }));

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async(() => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        const router: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, router)).toBeTruthy();
    }));

    it('should set redirect url', async(() => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'login';

        spyOn(routerService, 'navigate');
        spyOn(authService, 'setRedirect');

        authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should set redirect url with query params', async(() => {
        state.url = 'some-url;q=query';
        appConfigService.config.loginRoute = 'login';

        spyOn(routerService, 'navigate');
        spyOn(authService, 'setRedirect');

        authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url;q=query'
        });
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should get redirect url from config if there is one configured', async(() => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'fakeLoginRoute';

        spyOn(routerService, 'navigate');
        spyOn(authService, 'setRedirect');

        authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(routerService.navigate).toHaveBeenCalledWith(['/fakeLoginRoute']);
    }));

    it('should pass actual redirect when no state segments exists', async(() => {
        state.url = '/';

        spyOn(routerService, 'navigate');
        spyOn(authService, 'setRedirect');

        authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: '/'
        });
    }));
});
