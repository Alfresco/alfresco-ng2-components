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
import { Router } from '@angular/router';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('AuthGuardService', () => {
    let state;
    let authService: AuthenticationService;
    let router: Router;
    let service: AuthGuard;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        localStorage.clear();
        state = { url: '' };
        authService = TestBed.get(AuthenticationService);
        router = TestBed.get(Router);
        service = TestBed.get(AuthGuard);
        appConfigService = TestBed.get(AppConfigService);
    });

    it('if the alfresco js api is logged in should canActivate be true', async(() => {
        spyOn(router, 'navigate');
        spyOn(authService, 'isLoggedIn').and.returnValue(true);

        expect(service.canActivate(null, state)).toBeTruthy();
        expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('if the alfresco js api is NOT logged in should canActivate be false', async(() => {
        state.url = 'some-url';
        spyOn(router, 'navigate');
        spyOn(authService, 'isLoggedIn').and.returnValue(false);

        expect(service.canActivate(null, state)).toBeFalsy();
        expect(router.navigate).toHaveBeenCalled();
    }));

    it('should set redirect url', async(() => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigate');
        spyOn(authService, 'setRedirect');

        service.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should set redirect url with query params', async(() => {
        state.url = 'some-url;q=query';
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigate');
        spyOn(authService, 'setRedirect');

        service.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url;q=query'
        });
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should get redirect url from config if there is one configured', async(() => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'fakeLoginRoute';

        spyOn(router, 'navigate');
        spyOn(authService, 'setRedirect');

        service.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: 'some-url'
        });
        expect(router.navigate).toHaveBeenCalledWith(['/fakeLoginRoute']);
    }));

    it('should pass actual redirect when no state segments exists', async(() => {
        state.url = '/';

        spyOn(router, 'navigate');
        spyOn(authService, 'setRedirect');

        service.canActivate(null, state);

        expect(authService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL', url: '/'
        });
    }));
});
