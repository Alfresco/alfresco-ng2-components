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
import { RouterTestingModule } from '@angular/router/testing';
import { CookieServiceMock } from './../mock/cookie.service.mock';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { TranslationService } from './translation.service';
import { TranslationMock } from '../mock/translation.service.mock';
import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';

describe('AuthGuardService', () => {
    let state;
    let authService: AuthenticationService;
    let router: Router;
    let service: AuthGuard;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            RouterTestingModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
            { provide: TranslationService, useClass: TranslationMock },
            { provide: CookieService, useClass: CookieServiceMock }
        ]
    });

    beforeEach(() => {
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
        spyOn(router, 'navigate');
        spyOn(authService, 'isLoggedIn').and.returnValue(false);

        expect(service.canActivate(null, state)).toBeFalsy();
        expect(router.navigate).toHaveBeenCalled();
    }));

    it('should set redirect url', async(() => {
        state.url = 'some-url';

        spyOn(router, 'navigate');
        spyOn(authService, 'setRedirectUrl');

        service.canActivate(null, state);

        expect(authService.setRedirectUrl).toHaveBeenCalledWith({ provider: 'ALL', url: 'some-url' });
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should get redirect url from config if there is one configured', async(() => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'fakeLoginRoute';

        spyOn(router, 'navigate');
        spyOn(authService, 'setRedirectUrl');

        service.canActivate(null, state);

        expect(authService.setRedirectUrl).toHaveBeenCalledWith({ provider: 'ALL', url: 'some-url' });
        expect(router.navigate).toHaveBeenCalledWith(['/fakeLoginRoute']);
    }));
});
