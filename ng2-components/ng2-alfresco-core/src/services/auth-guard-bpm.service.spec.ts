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

import { TestBed, async, inject } from '@angular/core/testing';
import { Router} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AlfrescoAuthenticationService } from './alfresco-authentication.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { StorageService } from './storage.service';
import { LogService } from './log.service';
import { CookieService } from './cookie.service';
import { CookieServiceMock } from './../assets/cookie.service.mock';
import { AuthGuardBpm } from './auth-guard-bpm.service';
import { AppConfigModule } from './app-config.service';

describe('AuthGuardService BPM', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule,
                RouterTestingModule
            ],
            declarations: [
            ],
            providers: [
                AuthGuardBpm,
                AlfrescoSettingsService,
                AlfrescoApiService,
                AlfrescoAuthenticationService,
                StorageService,
                { provide: CookieService, useClass: CookieServiceMock },
                LogService
            ]
        }).compileComponents();
    }));

    it('if the alfresco js api is logged in should canActivate be true',
        async(inject([AuthGuardBpm, Router, AlfrescoSettingsService, StorageService, AlfrescoAuthenticationService], (auth, router, settingsService, storage, authService) => {
            spyOn(router, 'navigate');

            authService.isBpmLoggedIn = () => {
                return true;
            };

            expect(auth.canActivate()).toBeTruthy();
            expect(router.navigate).not.toHaveBeenCalled();
        }))
    );

    it('if the alfresco js api is NOT logged in should canActivate be false',
        async(inject([AuthGuardBpm, Router, AlfrescoSettingsService, StorageService, AlfrescoAuthenticationService], (auth, router, settingsService, storage, authService) => {

            spyOn(router, 'navigate');

            authService.isBpmLoggedIn = () => {
                return false;
            };

            expect(auth.canActivate()).toBeFalsy();
            expect(router.navigate).toHaveBeenCalled();
        }))
    );

});
