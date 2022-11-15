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

import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from './authentication.service';
import { DiscoveryApiService } from './discovery-api.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { ApiClientsService } from '../../../api/api-clients.service';
import { RepositoryInfo } from '@alfresco/js-api';
import { Observable } from 'rxjs';

fdescribe('DiscoveryApiService', () => {

    let service: DiscoveryApiService;
    let authService: AuthenticationService;
    let alfrescoApiService: AlfrescoApiService;
    let apiClientsService: ApiClientsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ]
        });

        authService = TestBed.inject(AuthenticationService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        apiClientsService = TestBed.inject(ApiClientsService);
        spyOn(alfrescoApiService.getInstance(), 'isEcmLoggedIn').and.returnValue(false);
        spyOn(DiscoveryApiService.prototype, 'getEcmProductInfo').and.returnValue(new Observable<RepositoryInfo>());
    });

    it('should filter out events when Kerberos is not enabled',  () => {
        spyOn(authService, 'isECMProvider').and.returnValue(true);
        spyOn(authService, 'isALLProvider').and.returnValue(true);
        spyOn(authService, 'isKerberosEnabled').and.returnValue(false);
        service = new DiscoveryApiService(alfrescoApiService, authService, apiClientsService);
        authService.onLogin.next(new RepositoryInfo());
        expect(service.getEcmProductInfo).not.toHaveBeenCalled()
    });

    it('should filter out events when ECM provider and all provider are both not enabled',  () => {
        spyOn(authService, 'isECMProvider').and.returnValue(false);
        spyOn(authService, 'isALLProvider').and.returnValue(false);
        spyOn(authService, 'isKerberosEnabled').and.returnValue(true);
        service = new DiscoveryApiService(alfrescoApiService, authService, apiClientsService);
        authService.onLogin.next(new RepositoryInfo());
        expect(service.getEcmProductInfo).not.toHaveBeenCalled()
    });

    it('should pass events when Kerberos and ECM or all provider are enabled',  () => {
        spyOn(authService, 'isECMProvider').and.returnValue(false);
        spyOn(authService, 'isALLProvider').and.returnValue(true);
        spyOn(authService, 'isKerberosEnabled').and.returnValue(true);
        service = new DiscoveryApiService(alfrescoApiService, authService, apiClientsService);
        authService.onLogin.next(new RepositoryInfo());
        expect(service.getEcmProductInfo).toHaveBeenCalled()
    });
});
