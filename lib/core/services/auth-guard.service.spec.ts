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
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('AuthGuardService', () => {
    let state;
    let authService: AuthenticationService;
    let router: Router;
    let authGuard: AuthGuard;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        localStorage.clear();
        state = { url: '' };
        authService = TestBed.inject(AuthenticationService);
        router = TestBed.inject(Router);
        authGuard = TestBed.inject(AuthGuard);
        appConfigService = TestBed.inject(AppConfigService);

        appConfigService.config.auth = {};
        appConfigService.config.oauth2 = {};
    });

    it('if the alfresco js api is logged in should canActivate be true', async(async () => {
        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isLoggedIn').and.returnValue(true);

        expect(await authGuard.canActivate(null, state)).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    }));

    it('if the alfresco js api is NOT logged in should canActivate be false', async(async () => {
        state.url = 'some-url';
        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isLoggedIn').and.returnValue(false);

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    }));

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async(async () => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        const route: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        expect(await authGuard.canActivate(null, route)).toBeTruthy();
    }));

    it('should redirect url if the User is NOT logged in and isOAuthWithoutSilentLogin', async(async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    }));

    it('should redirect url if the User is NOT logged in and isOAuth but no silentLogin configured', async(async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = undefined;

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    }));

    it('should NOT redirect url if the User is NOT logged in and isOAuth but with silentLogin configured', async(async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = true;

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    }));

    it('should set redirect url', async(async () => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login?redirectUrl=some-url');
    }));

    it('should set redirect url with query params', async(async () => {
        state.url = 'some-url;q=query';
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url;q=query'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login?redirectUrl=some-url;q=query');
    }));

    it('should get redirect url from config if there is one configured', async(async () => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'fakeLoginRoute';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith('/fakeLoginRoute?redirectUrl=some-url');
    }));

    it('should pass actual redirect when no state segments exists', async(async () => {
        state.url = '/';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: '/'
        });
    }));
});
