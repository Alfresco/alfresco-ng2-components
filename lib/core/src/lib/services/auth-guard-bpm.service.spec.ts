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
import { AppConfigService } from '../app-config/app-config.service';
import { AuthGuardBpm } from './auth-guard-bpm.service';
import { AuthenticationService } from './authentication.service';
import { RouterStateSnapshot, Router } from '@angular/router';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('AuthGuardService BPM', () => {

    let authGuard: AuthGuardBpm;
    let authService: AuthenticationService;
    let router: Router;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        localStorage.clear();
        authService = TestBed.get(AuthenticationService);
        authGuard = TestBed.get(AuthGuardBpm);
        router = TestBed.get(Router);
        appConfigService = TestBed.get(AppConfigService);

        appConfigService.config.providers = 'BPM';
        appConfigService.config.auth = {};
        appConfigService.config.oauth2 = {};
    });

    it('if the alfresco js api is logged in should canActivate be true', async(() => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        const route: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, route)).toBeTruthy();
    }));

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async(() => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        const route: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, route)).toBeTruthy();
    }));

    it('if the alfresco js api is NOT logged in should canActivate be false', async(() => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
        spyOn(router, 'navigateByUrl').and.stub();
        const route: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        expect(authGuard.canActivate(null, route)).toBeFalsy();
    }));

    it('if the alfresco js api is NOT logged in should trigger a redirect event', async(() => {
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
        const route: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, route)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login?redirectUrl=some-url');
    }));

    it('should redirect url if the alfresco js api is NOT logged in and isOAuthWithoutSilentLogin', async(() => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;
        const route: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, route)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    }));

    it('should redirect url if the alfresco js api is NOT logged in and isOAuthWithSilentLogin', async(() => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = true;
        const route: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, route)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    }));

    it('should redirect url if NOT logged in and isOAuth but no silentLogin configured', async(() => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = undefined;
        const route: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, route)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    }));

    it('should set redirect url', async(() => {
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        authGuard.canActivate(null, route);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'BPM', url: 'some-url'
        });
        expect(authService.getRedirect()).toEqual('some-url');
    }));

    it('should set redirect navigation commands with query params', async(() => {
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url;q=123' };

        authGuard.canActivate(null, route);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'BPM', url: 'some-url;q=123'
        });
        expect(authService.getRedirect()).toEqual('some-url;q=123');
    }));

    it('should set redirect navigation commands with query params', async(() => {
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route: RouterStateSnapshot = <RouterStateSnapshot> { url: '/' };

        authGuard.canActivate(null, route);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'BPM', url: '/'
        });
        expect(authService.getRedirect()).toEqual('/');
    }));

    it('should get redirect url from config if there is one configured', async(() => {
        appConfigService.config.loginRoute = 'fakeLoginRoute';
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        authGuard.canActivate(null, route);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'BPM', url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith('/fakeLoginRoute?redirectUrl=some-url');
    }));

});
