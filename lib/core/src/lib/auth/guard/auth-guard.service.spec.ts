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
import { Router, RouterStateSnapshot } from '@angular/router';
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from '../services/authentication.service';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../../common/services/storage.service';

describe('AuthGuardService', () => {
    let state;
    let authService: AuthenticationService;
    let router: Router;
    let authGuard: AuthGuard;
    let storageService: StorageService;
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
        storageService = TestBed.inject(StorageService);
    });

    it('if the alfresco js api is logged in should canActivate be true', async () => {
        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isLoggedIn').and.returnValue(true);

        expect(await authGuard.canActivate(null, state)).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('if the alfresco js api is NOT logged in should canActivate be false', async () => {
        state.url = 'some-url';
        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isLoggedIn').and.returnValue(false);

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async () => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await authGuard.canActivate(null, route)).toBeTruthy();
    });

    it('should not redirect to login', async () => {
        storageService.setItem('loginFragment', 'login');

        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        expect(await authGuard.canActivate(null, state)).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect url if the User is NOT logged in and isOAuthWithoutSilentLogin', async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should redirect url if the User is NOT logged in and isOAuth but no silentLogin configured', async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = undefined;

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should NOT redirect url if the User is NOT logged in and isOAuth but with silentLogin configured', async () => {
        spyOn(authService, 'ssoImplicitLogin').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = true;

        expect(await authGuard.canActivate(null, state)).toBeFalsy();
        expect(authService.ssoImplicitLogin).toHaveBeenCalledTimes(1);
    });

    it('should set redirect url', async () => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url'));
    });

    it('should set redirect url with query params', async () => {
        state.url = 'some-url;q=query';
        appConfigService.config.loginRoute = 'login';
        appConfigService.config.provider = 'ALL';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url;q=query'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url;q=query'));
    });

    it('should get redirect url from config if there is one configured', async () => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'fakeLoginRoute';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/fakeLoginRoute?redirectUrl=some-url'));
    });

    it('should pass actual redirect when no state segments exists', async () => {
        state.url = '/';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'setRedirect');

        await authGuard.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: '/'
        });
    });
});
