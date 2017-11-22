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

import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CookieServiceMock } from './../mock/cookie.service.mock';
import { AlfrescoApiService } from './alfresco-api.service';
import { SettingsService } from './settings.service';
import { AppConfigModule } from '../app-config/app-config.module';
import { AuthGuardBpm } from './auth-guard-bpm.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';
import { TranslateLoaderService } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';

describe('AuthGuardService BPM', () => {

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

    it('if the alfresco js api is logged in should canActivate be true',
        async(inject([AuthGuardBpm, Router, SettingsService, StorageService, AuthenticationService], (auth, router, settingsService, storage, authService) => {
            spyOn(router, 'navigate');

            authService.isBpmLoggedIn = () => {
                return true;
            };

            expect(auth.canActivate(null, { url: '' })).toBeTruthy();
            expect(router.navigate).not.toHaveBeenCalled();
        }))
    );

    it('if the alfresco js api is NOT logged in should canActivate be false',
        async(inject([AuthGuardBpm, Router, SettingsService, StorageService, AuthenticationService], (auth, router, settingsService, storage, authService) => {

            spyOn(router, 'navigate');

            authService.isBpmLoggedIn = () => {
                return false;
            };

            expect(auth.canActivate(null, { url: '' })).toBeFalsy();
            expect(router.navigate).toHaveBeenCalled();
        }))
    );

    it('should set redirect url',
        async(inject([AuthGuardBpm, Router, AuthenticationService], (auth, router, authService) => {
            const state = { url: 'some-url' };

            spyOn(router, 'navigate');
            spyOn(authService, 'setRedirectUrl');

            auth.canActivate(null , state);

            expect(authService.setRedirectUrl).toHaveBeenCalledWith(state.url);
        }))
    );
});
