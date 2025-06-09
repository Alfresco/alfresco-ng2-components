/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AppConfigService, AuthService } from '@alfresco/adf-core';
import { AUTH_MODULE_CONFIG } from './auth-config';
import { firstValueFrom, of, take, throwError } from 'rxjs';

interface MockAppConfigOAuth2 {
    oauth2: {
        logoutParameters: Array<string>;
    };
}

const mockAppConfigService = {
    config: {
        oauth2: {
            logoutParameters: ['client_id', 'returnTo', 'response_type']
        }
    } as MockAppConfigOAuth2,

    setConfig(newConfig: { logoutParameters: Array<string> }) {
        this.config.oauth2 = newConfig;
    },

    get(key: string, defaultValue?: { logoutParameters: Array<string> }) {
        if (key === 'oauth2') {
            return this.config.oauth2;
        }

        if (key === 'providers') {
            return 'mock-providers';
        }
        return defaultValue;
    }
};

const mockOAuthService = {
    clientId: 'testClientId',
    redirectUri: 'testRedirectUri',
    logOut: jasmine.createSpy(),
    hasValidAccessToken: jasmine.createSpy(),
    hasValidIdToken: jasmine.createSpy()
};

const mockAuthService = {
    baseAuthLogin: jasmine.createSpy()
};

describe('OidcAuthenticationService', () => {
    let service: OidcAuthenticationService;
    let oauthService: OAuthService;
    let appConfig: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                OidcAuthenticationService,
                { provide: AppConfigService, useValue: mockAppConfigService },
                { provide: OAuthService, useValue: mockOAuthService },
                { provide: OAuthStorage, useValue: {} },
                { provide: AUTH_MODULE_CONFIG, useValue: {} },
                { provide: AuthService, useValue: mockAuthService }
            ]
        });
        service = TestBed.inject(OidcAuthenticationService);
        oauthService = TestBed.inject(OAuthService);
        appConfig = TestBed.inject(AppConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should call AuthService with credentials', async () => {
            const appConfigSpy = spyOn(mockAppConfigService, 'get').and.callThrough();
            const mockTokenResponse = { access_token: 'mock-token' };
            mockAuthService.baseAuthLogin.and.returnValue(of(mockTokenResponse));
            const onLogin = firstValueFrom(service.onLogin.pipe(take(1)));

            const response = await firstValueFrom(service.login('username', 'password'));

            expect(mockAuthService.baseAuthLogin).toHaveBeenCalledWith('username', 'password');
            expect(await onLogin).toEqual(mockTokenResponse);
            expect(response).toEqual({
                type: 'mock-providers',
                ticket: mockTokenResponse
            });
            expect(appConfigSpy).toHaveBeenCalledWith('providers');
        });

        it('should handle login errors', async () => {
            const mockError = 'Login failed';
            mockAuthService.baseAuthLogin.and.returnValue(throwError(() => mockError));
            const onError = firstValueFrom(service.onError.pipe(take(1)));

            await expectAsync(firstValueFrom(service.login('username', 'password'))).toBeRejectedWith(mockError);
            expect(await onError).toEqual(mockError);
        });
    });

    describe('logout', () => {
        let appConfigService: AppConfigService;

        beforeEach(() => {
            appConfigService = TestBed.inject(AppConfigService) as any;
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
            appConfigService['setConfig']({
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
            appConfigService['setConfig']({ logoutParameters: [] });

            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({});
        });

        it('should ignore undefined parameters', () => {
            appConfigService['setConfig']({
                logoutParameters: ['client_id', 'unknown_param']
            });
            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({
                client_id: 'testClientId'
            });
        });
    });

    describe('loggedIn', () => {
        it('should return true if has valid tokens', () => {
            mockOAuthService.hasValidAccessToken.and.returnValue(true);
            mockOAuthService.hasValidIdToken.and.returnValue(true);

            expect(service.isLoggedIn()).toBeTrue();
        });

        it('should return false if does not have valid access token', () => {
            mockOAuthService.hasValidAccessToken.and.returnValue(false);
            mockOAuthService.hasValidIdToken.and.returnValue(true);

            expect(service.isLoggedIn()).toBeFalse();
        });

        it('should return false if does not have valid id token', () => {
            mockOAuthService.hasValidAccessToken.and.returnValue(true);
            mockOAuthService.hasValidIdToken.and.returnValue(false);

            expect(service.isLoggedIn()).toBeFalse();
        });
    });

    describe('isEcmLoggedIn', () => {
        beforeEach(() => {
            mockOAuthService.hasValidAccessToken.and.returnValue(true);
            mockOAuthService.hasValidIdToken.and.returnValue(true);
        });

        it('should return true if is ECM provider', () => {
            spyOn(appConfig, 'get').and.returnValue('ECM');
            expect(service.isEcmLoggedIn()).toBeTrue();
        });

        it('should return true if is all provider', () => {
            spyOn(appConfig, 'get').and.returnValue('ALL');
            expect(service.isEcmLoggedIn()).toBeTrue();
        });

        it('should return false if is not ECM provider', () => {
            spyOn(appConfig, 'get').and.returnValue('BPM');
            expect(service.isEcmLoggedIn()).toBeFalse();
        });

        it('should return false if provider is not defined', () => {
            spyOn(appConfig, 'get').and.returnValue(undefined);
            expect(service.isEcmLoggedIn()).toBeFalse();
        });
    });

    describe('isBpmLoggedIn', () => {
        beforeEach(() => {
            mockOAuthService.hasValidAccessToken.and.returnValue(true);
            mockOAuthService.hasValidIdToken.and.returnValue(true);
        });

        it('should return true if is BPM provider', () => {
            spyOn(appConfig, 'get').and.returnValue('BPM');
            expect(service.isBpmLoggedIn()).toBeTrue();
        });

        it('should return true if is all provider', () => {
            spyOn(appConfig, 'get').and.returnValue('ALL');
            expect(service.isBpmLoggedIn()).toBeTrue();
        });

        it('should return false if is not BPM provider', () => {
            spyOn(appConfig, 'get').and.returnValue('ECM');
            expect(service.isBpmLoggedIn()).toBeFalse();
        });

        it('should return false if provider is not defined', () => {
            spyOn(appConfig, 'get').and.returnValue(undefined);
            expect(service.isBpmLoggedIn()).toBeFalse();
        });
    });
});

describe('OidcAuthenticationService shouldPerformSsoLogin', () => {
    let service: OidcAuthenticationService;

    const configureTestingModule = (providers: any) => {
        TestBed.configureTestingModule({
            providers: [
                OidcAuthenticationService,
                { provide: AppConfigService, useValue: mockAppConfigService },
                { provide: OAuthService, useValue: mockOAuthService },
                { provide: OAuthStorage, useValue: {} },
                { provide: AUTH_MODULE_CONFIG, useValue: {} },
                { provide: AuthService, useValue: {} },
                providers
            ]
        });
        service = TestBed.inject(OidcAuthenticationService);
    };

    it('should emit true when user is not authenticated and discovery document is loaded', async () => {
        const mockAuthServiceValue = {
            authenticated$: of(false),
            isDiscoveryDocumentLoaded$: of(true)
        };
        configureTestingModule({ provide: AuthService, useValue: mockAuthServiceValue });

        const shouldPerformSsoLogin = await service.shouldPerformSsoLogin$.toPromise();
        expect(shouldPerformSsoLogin).toBeTrue();
    });

    it('should emit false when user is authenticated', async () => {
        const mockAuthServiceValue = {
            authenticated$: of(true),
            isDiscoveryDocumentLoaded$: of(false)
        };
        configureTestingModule({ provide: AuthService, useValue: mockAuthServiceValue });

        const shouldPerformSsoLogin = await service.shouldPerformSsoLogin$.toPromise();
        expect(shouldPerformSsoLogin).toBeFalse();
    });

    it('should emit false when discovery document is not loaded', async () => {
        const mockAuthServiceValue = {
            authenticated$: of(false),
            isDiscoveryDocumentLoaded$: of(false)
        };
        configureTestingModule({ provide: AuthService, useValue: mockAuthServiceValue });

        const shouldPerformSsoLogin = await service.shouldPerformSsoLogin$.toPromise();
        expect(shouldPerformSsoLogin).toBeFalse();
    });

    it('should emit false when both user is authenticated and discovery document is loaded', async () => {
        const mockAuthServiceValue = {
            authenticated$: of(true),
            isDiscoveryDocumentLoaded$: of(true)
        };
        configureTestingModule({ provide: AuthService, useValue: mockAuthServiceValue });

        const shouldPerformSsoLogin = await service.shouldPerformSsoLogin$.toPromise();
        expect(shouldPerformSsoLogin).toBeFalse();
    });
});
