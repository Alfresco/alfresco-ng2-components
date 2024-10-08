/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { OidcAuthenticationService } from './oidc-authentication.service';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AUTH_MODULE_CONFIG } from './auth-config';
import { StorageService } from '../../common';
import { AuthService, JWT_STORAGE_SERVICE } from '../public-api';
import { AppConfigService } from '../../app-config';

interface MockAppConfigOAuth2 {
    oauth2: {
        logoutParameters: Array<string>;
    };
}

class MockAppConfigService {
    config: MockAppConfigOAuth2 = {
        oauth2: {
            logoutParameters: ['client_id', 'returnTo', 'response_type']
        }
    };

    setConfig(newConfig: { logoutParameters: Array<string> }) {
        this.config.oauth2 = newConfig;
    }

    get(key: string, defaultValue?: { logoutParameters: Array<string> }) {
        if (key === 'oauth2') {
            return this.config.oauth2;
        }
        return defaultValue;
    }
}

class MockOAuthService {
    clientId = 'testClientId';
    redirectUri = 'testRedirectUri';
    logOut = jasmine.createSpy();
}

describe('OidcAuthenticationService', () => {
    let service: OidcAuthenticationService;
    let oauthService: OAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                OidcAuthenticationService,
                { provide: AppConfigService, useClass: MockAppConfigService },
                { provide: OAuthService, useClass: MockOAuthService },
                { provide: JWT_STORAGE_SERVICE, useValue: StorageService },
                { provide: OAuthStorage, useValue: {} },
                { provide: AUTH_MODULE_CONFIG, useValue: {} },
                { provide: AuthService, useValue: {} }
            ]
        });
        service = TestBed.inject(OidcAuthenticationService);
        oauthService = TestBed.inject(OAuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('logout', () => {
        let mockAppConfigService: MockAppConfigService;

        beforeEach(() => {
            mockAppConfigService = TestBed.inject(AppConfigService) as any;
        });

        it('should handle logout with default parameters', () => {
            service.logout();
            expect(oauthService.logOut).toHaveBeenCalledWith({
                client_id: 'testClientId',
                returnTo: 'testRedirectUri',
                response_type: 'code'
            });
        });

        it('should handle logout with additional parameter redirect_uri', () => {
            mockAppConfigService.setConfig({
                logoutParameters: ['client_id', 'returnTo', 'redirect_uri', 'response_type']
            });

            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({
                client_id: 'testClientId',
                returnTo: 'testRedirectUri',
                redirect_uri: 'testRedirectUri',
                response_type: 'code'
            });
        });

        it('should handle logout with an empty configuration object', () => {
            mockAppConfigService.setConfig({ logoutParameters: [] });

            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({});
        });

        it('should ignore undefined parameters', () => {
            mockAppConfigService.setConfig({
                logoutParameters: ['client_id', 'unknown_param']
            });
            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({
                client_id: 'testClientId'
            });
        });
    });
});
