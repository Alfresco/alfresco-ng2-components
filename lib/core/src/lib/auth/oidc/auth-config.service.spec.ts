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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { AppConfigService } from '../../app-config/app-config.service';
import { AUTH_MODULE_CONFIG } from './auth-config';
import { mockAuthConfigCodeFlow, mockAuthConfigImplicitFlow } from '../mock/auth-config.service.mock';

import { AuthConfigService } from './auth-config.service';

describe('AuthConfigService', () => {
    let service: AuthConfigService;
    let appConfigServiceMock;

    beforeEach(() => {
        appConfigServiceMock = jasmine.createSpyObj(['get'], { onLoad: EMPTY });

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AUTH_MODULE_CONFIG, useValue: { useHash: true } },
                { provide: AppConfigService, useValue: appConfigServiceMock }
            ]
        });
        service = TestBed.inject(AuthConfigService);
        spyOn<any>(service, 'getLocationOrigin').and.returnValue('http://localhost:3000');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('load auth config using hash', () => {
        it('should load configuration if implicit flow is true ', async () => {
            appConfigServiceMock.get.and.returnValue(mockAuthConfigImplicitFlow);
            const expectedConfig = {
                oidc: true,
                issuer: 'http://localhost:3000/auth/realms/alfresco',
                redirectUri: 'http://localhost:3000/#/view/authentication-confirmation/?',
                silentRefreshRedirectUri: 'http://localhost:3000/silent-refresh.html',
                postLogoutRedirectUri: 'http://localhost:3000/#/logout',
                clientId: 'alfresco',
                scope: 'openid profile email',
                dummyClientSecret: ''
            };

            expect(await service.loadConfig()).toEqual(expectedConfig);
        });

        it('should load configuration if code flow is true ', async () => {
            appConfigServiceMock.get.and.returnValue(mockAuthConfigCodeFlow);
            const expectedConfig = {
                oidc: true,
                issuer: 'http://localhost:3000/auth/realms/alfresco',
                redirectUri: 'http://localhost:3000/#/view/authentication-confirmation',
                silentRefreshRedirectUri: 'http://localhost:3000/silent-refresh.html',
                postLogoutRedirectUri: 'http://localhost:3000/#/logout',
                clientId: 'alfresco',
                scope: 'openid profile email',
                responseType: 'code',
                dummyClientSecret: ''
            };

            expect(await service.loadConfig()).toEqual(expectedConfig);
        });
    });

});
