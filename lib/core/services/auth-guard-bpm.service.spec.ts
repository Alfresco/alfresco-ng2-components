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
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CookieServiceMock } from './../mock/cookie.service.mock';
import { AlfrescoApiService } from './alfresco-api.service';
import { SettingsService } from './settings.service';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthGuardBpm } from './auth-guard-bpm.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';
import { TranslateLoaderService } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';
import { RouterStateSnapshot, Router } from '@angular/router';

describe('AuthGuardService BPM', () => {

    let authGuard: AuthGuardBpm;
    let authService: AuthenticationService;
    let routerService: Router;
    let appConfigService: AppConfigService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService
                    }
                })
            ],
            providers: [
                AuthGuardBpm,
                SettingsService,
                AlfrescoApiService,
                AuthenticationService,
                StorageService,
                UserPreferencesService,
                { provide: CookieService, useClass: CookieServiceMock },
                LogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        authService = TestBed.get(AuthenticationService);
        authGuard = TestBed.get(AuthGuardBpm);
        routerService = TestBed.get(Router);
        appConfigService = TestBed.get(AppConfigService);
    });

    it('if the alfresco js api is logged in should canActivate be true', async(() => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        const router: RouterStateSnapshot = <RouterStateSnapshot>  {url : ''};

        expect(authGuard.canActivate(null, router)).toBeTruthy();
    }));

    it('if the alfresco js api is NOT logged in should canActivate be false', async(() => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: '' };

        expect(authGuard.canActivate(null, router)).toBeFalsy();
    }));

    it('if the alfresco js api is NOT logged in should trigger a redirect event', async(() => {
        spyOn(routerService, 'navigate');
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
        const router: RouterStateSnapshot = <RouterStateSnapshot>  {url : ''};

        expect(authGuard.canActivate(null, router)).toBeFalsy();
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should set redirect url', async(() => {
        spyOn(authService, 'setRedirectUrl').and.callThrough();
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        authGuard.canActivate(null, router);

        expect(authService.setRedirectUrl).toHaveBeenCalledWith({provider: 'BPM', url: 'some-url' } );
        expect(authService.getRedirectUrl('BPM')).toBe('some-url');
    }));

    it('should get redirect url from config if there is one configured', async(() => {
        appConfigService.config.loginRoute = 'fakeLoginRoute';
        spyOn(authService, 'setRedirectUrl').and.callThrough();
        spyOn(routerService, 'navigate').and.stub();
        const router: RouterStateSnapshot = <RouterStateSnapshot> { url: 'some-url' };

        authGuard.canActivate(null, router);

        expect(authService.setRedirectUrl).toHaveBeenCalledWith({provider: 'BPM', url: 'some-url' } );
        expect(routerService.navigate).toHaveBeenCalledWith(['/fakeLoginRoute']);
    }));

});
