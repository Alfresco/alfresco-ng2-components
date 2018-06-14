/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { AuthGuardEcm } from './auth-guard-ecm.service';
import { AuthenticationService } from './authentication.service';
import { RouterStateSnapshot, Router } from '@angular/router';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('AuthGuardService ECM', () => {

    let authGuard: AuthGuardEcm;
    let authService: AuthenticationService;
    let routerService: Router;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        localStorage.clear();
        authService = TestBed.get(AuthenticationService);
        authGuard = TestBed.get(AuthGuardEcm);
        routerService = TestBed.get(Router);
        appConfigService = TestBed.get(AppConfigService);
    });

    it('if the alfresco js api is logged in should canActivate be true', async(() => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
        const router: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, router)).toBeTruthy();
    }));

    it('if the alfresco js api is NOT logged in should canActivate be false', async(() => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        expect(authGuard.canActivate(null, router)).toBeFalsy();
    }));

    it('if the alfresco js api is NOT logged in should trigger a redirect event', async(() => {
        appConfigService.config.loginRoute = 'login';

        spyOn(routerService, 'navigate');
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        const router: RouterStateSnapshot = <RouterStateSnapshot>  {url : 'some-url'};

        expect(authGuard.canActivate(null, router)).toBeFalsy();
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should set redirect navigation commands', async(() => {
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        authGuard.canActivate(null, router);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM', url: 'some-url'
        });
        expect(authService.getRedirect('ECM')).toEqual('some-url');
    }));

    it('should set redirect navigation commands with query params', async(() => {
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url;q=123' };

        authGuard.canActivate(null, router);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM', url: 'some-url;q=123'
        });
        expect(authService.getRedirect('ECM')).toEqual('some-url;q=123');
    }));

    it('should set redirect navigation commands with query params', async(() => {
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: '/' };

        authGuard.canActivate(null, router);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM', url: '/'
        });
        expect(authService.getRedirect('ECM')).toEqual('/');
    }));

    it('should get redirect url from config if there is one configured', async(() => {
        appConfigService.config.loginRoute = 'fakeLoginRoute';
        spyOn(authService, 'setRedirect').and.callThrough();
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        authGuard.canActivate(null, router);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM', url: 'some-url'
        });
        expect(routerService.navigate).toHaveBeenCalledWith(['/fakeLoginRoute']);
    }));

});
