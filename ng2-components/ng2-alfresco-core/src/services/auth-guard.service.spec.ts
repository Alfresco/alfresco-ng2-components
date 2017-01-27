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

import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AlfrescoAuthenticationService } from './alfresco-authentication.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { StorageService } from './storage.service';
import { LogService } from './log.service';
import { AuthGuard } from './auth-guard.service';
import { Router} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, inject } from '@angular/core/testing';

describe('AuthGuardService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthGuard,
                AlfrescoSettingsService,
                AlfrescoApiService,
                AlfrescoAuthenticationService,
                StorageService,
                LogService],
            imports: [RouterTestingModule]
        });
    });

    it('if the alfresco js api is logged in should canActivate be true',
        async(inject([AuthGuard, Router, AlfrescoSettingsService, StorageService, AlfrescoAuthenticationService], (auth, router, settingsService, storage, authService) => {
            spyOn(router, 'navigate');

            authService.isLoggedIn = () => {
                return true;
            };

            expect(auth.canActivate()).toBeTruthy();
            expect(router.navigate).not.toHaveBeenCalled();
        }))
    );

    it('if the alfresco js api is NOT logged in should canActivate be false',
        async(inject([AuthGuard, Router, AlfrescoSettingsService, StorageService, AlfrescoAuthenticationService], (auth, router, settingsService, storage, authService) => {

            spyOn(router, 'navigate');

            authService.isLoggedIn = () => {
                return false;
            };

            expect(auth.canActivate()).toBeFalsy();
            expect(router.navigate).toHaveBeenCalled();
        }))
    );

});
