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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { AppConfigService } from '../../app-config/app-config.service';
import { AUTH_MODULE_CONFIG } from './auth-config';
import { AuthConfigService } from './auth-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';

describe('AuthConfigService', () => {
    let service: AuthConfigService;
    let appConfigService: AppConfigService;

    const mockAuthConfigImplicitFlow: OauthConfigModel = {
        host: 'http://localhost:3000/auth/realms/alfresco',
        clientId: 'fakeClientId',
        scope: 'openid profile email',
        secret: '',
        implicitFlow: true,
        silentLogin: true,
        redirectSilentIframeUri: 'http://localhost:3000/assets/silent-refresh.html',
        redirectUri: '/',
        redirectUriLogout: '#/logout',
        publicUrls: ['**/preview/s/*', '**/settings', '**/logout']
    };

    const mockAuthConfigSubfolderRedirectUri: OauthConfigModel = {
        host: 'http://localhost:3000/auth/realms/alfresco',
        clientId: 'fakeClientId',
        scope: 'openid profile email',
        secret: '',
        implicitFlow: true,
        silentLogin: true,
        redirectSilentIframeUri: 'http://localhost:3000/subfolder/assets/silent-refresh.html',
        redirectUri: '/subfolder',
        redirectUriLogout: '#/logout',
        publicUrls: ['**/preview/s/*', '**/settings', '**/logout']
    };

    const mockAuthConfigSubfolder2RedirectUri: OauthConfigModel = {
        host: 'http://localhost:3000/auth/realms/alfresco',
        clientId: 'fakeClientId',
        scope: 'openid profile email',
        secret: '',
        implicitFlow: true,
        silentLogin: true,
        redirectSilentIframeUri: 'http://localhost:3000/subfolder2/assets/silent-refresh.html',
        redirectUri: '/subfolder2',
        redirectUriLogout: '#/logout',
        publicUrls: ['**/preview/s/*', '**/settings', '**/logout']
    };

    const mockAuthConfigSlashRedirectUri: OauthConfigModel = {
        host: 'http://localhost:3000/auth/realms/alfresco',
        clientId: 'fakeClientId',
        scope: 'openid profile email',
        secret: '',
        implicitFlow: true,
        silentLogin: true,
        redirectSilentIframeUri: 'http://localhost:3000/assets/silent-refresh.html',
        redirectUri: '/',
        redirectUriLogout: '#/logout',
        publicUrls: ['**/preview/s/*', '**/settings', '**/logout']
    };

    const mockAuthConfigCodeFlow = {
        host: 'http://localhost:3000/auth/realms/alfresco',
        clientId: 'fakeClientId',
        scope: 'openid profile email',
        secret: '',
        implicitFlow: false,
        codeFlow: true,
        silentLogin: true,
        redirectSilentIframeUri: 'http://localhost:3000/assets/silent-refresh.html',
        redirectUri: '/',
        redirectUriLogout: '#/logout',
        publicUrls: ['**/preview/s/*', '**/settings', '**/logout']
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: AUTH_MODULE_CONFIG, useValue: { useHash: true } }]
        });
        service = TestBed.inject(AuthConfigService);
        spyOn<any>(service, 'getLocationOrigin').and.returnValue('http://localhost:3000');

        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.onLoad = EMPTY;
    });

    describe('load auth config using hash', () => {
        it('should load configuration if implicit flow is true ', async () => {
            spyOnProperty(appConfigService, 'oauth2').and.returnValue(mockAuthConfigImplicitFlow);
            const expectedConfig = {
                oidc: true,
                issuer: 'http://localhost:3000/auth/realms/alfresco',
                redirectUri: 'http://localhost:3000/#/view/authentication-confirmation/?',
                silentRefreshRedirectUri: 'http://localhost:3000/assets/silent-refresh.html',
                postLogoutRedirectUri: 'http://localhost:3000/#/logout',
                clientId: 'fakeClientId',
                scope: 'openid profile email',
                dummyClientSecret: ''
            };

            expect(await service.loadConfig()).toEqual(jasmine.objectContaining(expectedConfig));
        });

        it('should load configuration if code flow is true ', async () => {
            spyOnProperty(appConfigService, 'oauth2').and.returnValue(mockAuthConfigCodeFlow);
            const expectedConfig = {
                oidc: true,
                issuer: 'http://localhost:3000/auth/realms/alfresco',
                redirectUri: 'http://localhost:3000/#/view/authentication-confirmation/?',
                silentRefreshRedirectUri: 'http://localhost:3000/assets/silent-refresh.html',
                postLogoutRedirectUri: 'http://localhost:3000/#/logout',
                clientId: 'fakeClientId',
                scope: 'openid profile email',
                responseType: 'code',
                dummyClientSecret: ''
            };

            expect(await service.loadConfig()).toEqual(jasmine.objectContaining(expectedConfig));
        });
    });

    describe('getRedirectUri', () => {
        it('should return redirect uri with subfolder path', () => {
            const expectedUri = 'http://localhost:3000/subfolder/#/view/authentication-confirmation/?';
            spyOnProperty(appConfigService, 'oauth2').and.returnValue(mockAuthConfigSubfolderRedirectUri);
            expect(service.getRedirectUri()).toBe(expectedUri);
        });

        it('should return redirect uri with subfolder2 path', () => {
            const expectedUri = 'http://localhost:3000/subfolder2/#/view/authentication-confirmation/?';
            spyOnProperty(appConfigService, 'oauth2').and.returnValue(mockAuthConfigSubfolder2RedirectUri);
            expect(service.getRedirectUri()).toBe(expectedUri);
        });

        it('should return redirect uri without modeling and admin if redirectUri from app.config is equal to slash', () => {
            const expectedUri = 'http://localhost:3000/#/view/authentication-confirmation/?';
            spyOnProperty(appConfigService, 'oauth2').and.returnValue(mockAuthConfigSlashRedirectUri);
            expect(service.getRedirectUri()).toBe(expectedUri);
        });
    });

    describe('silentRefreshRedirectUri', () => {
        it('should return the silentRefreshRedirectUri with subfolder path', () => {
            const expectedUri = 'http://localhost:3000/subfolder/assets/silent-refresh.html';
            spyOnProperty(appConfigService, 'oauth2').and.returnValue(mockAuthConfigSubfolderRedirectUri);
            expect(service.loadAppConfig().silentRefreshRedirectUri).toBe(expectedUri);
        });

        it('should return the silentRefreshRedirectUri with subfolder2 path', () => {
            const expectedUri = 'http://localhost:3000/subfolder2/assets/silent-refresh.html';
            spyOnProperty(appConfigService, 'oauth2').and.returnValue(mockAuthConfigSubfolder2RedirectUri);
            expect(service.loadAppConfig().silentRefreshRedirectUri).toBe(expectedUri);
        });
    });

    describe('postLogoutRedirectUri', () => {
        const getConfig = (config: Partial<OauthConfigModel>): OauthConfigModel => {
            const defaultConfig = {
                host: 'http://localhost:3000/auth/realms/alfresco',
                clientId: 'fakeClientId',
                scope: 'openid profile email',
                secret: '',
                implicitFlow: true,
                silentLogin: true,
                redirectSilentIframeUri: 'http://localhost:3000/assets/silent-refresh.html',
                redirectUri: '/',
                redirectUriLogout: '/',
                publicUrls: ['**/preview/s/*', '**/settings', '**/logout']
            };

            return {
                ...defaultConfig,
                ...config
            };
        };
        it('should return proper postLogoutRedirectUri when the redirectUriLogout is "/"', () => {
            const testConfig = getConfig({
                redirectUriLogout: '/'
            });

            spyOnProperty(appConfigService, 'oauth2').and.returnValue(testConfig);
            expect(service.loadAppConfig().postLogoutRedirectUri).toBe('http://localhost:3000/');
        });

        it('should return proper postLogoutRedirectUri when the redirectUriLogout is empty', () => {
            const testConfig = getConfig({
                redirectUriLogout: undefined
            });

            spyOnProperty(appConfigService, 'oauth2').and.returnValue(testConfig);
            expect(service.loadAppConfig().postLogoutRedirectUri).toBe('http://localhost:3000/');
        });

        it('should return proper postLogoutRedirectUri when the redirectUriLogout starts with slash', () => {
            const testConfig = getConfig({
                redirectUriLogout: '/asd'
            });

            spyOnProperty(appConfigService, 'oauth2').and.returnValue(testConfig);
            expect(service.loadAppConfig().postLogoutRedirectUri).toBe('http://localhost:3000/asd');
        });
    });

    describe('clockSkewInSec', () => {
        it('should return clockSkewInSec equal to 0', () => {
            const expectedClockSkewInSec = 0;
            spyOnProperty(appConfigService, 'oauth2').and.returnValue({ clockSkewInSec: 0 } as any);
            expect(service.loadAppConfig().clockSkewInSec).toBe(expectedClockSkewInSec);
        });
        it('should not return clockSkewInSec if is not defined', () => {
            spyOnProperty(appConfigService, 'oauth2').and.returnValue({} as any);
            expect(service.loadAppConfig().clockSkewInSec).toBeUndefined();
        });

        it('should not return clockSkewInSec if is undefined', () => {
            spyOnProperty(appConfigService, 'oauth2').and.returnValue({ clockSkewInSec: undefined } as any);
            expect(service.loadAppConfig().clockSkewInSec).toBeUndefined();
        });

        it('should return empty object if clockSkewInSec is null', () => {
            const mockOauth2Value = { clockSkewInSec: null } as any;
            expect(service.getClockSkewInSec(mockOauth2Value)).toEqual({});
        });

        it('should return empty object if clockSkewInSec is a string', () => {
            const mockOauth2Value = { clockSkewInSec: 'null' } as any;
            expect(service.getClockSkewInSec(mockOauth2Value)).toEqual({});
        });
    });

    describe('sessionChecksEnabled', () => {
        it('should return sessionChecksEnabled equal to true', () => {
            spyOnProperty(appConfigService, 'oauth2').and.returnValue({ sessionChecksEnabled: true } as any);
            expect(service.loadAppConfig().sessionChecksEnabled).toBeTrue();
        });

        it('should return sessionChecksEnabled equal to false', () => {
            spyOnProperty(appConfigService, 'oauth2').and.returnValue({ sessionChecksEnabled: false } as any);
            expect(service.loadAppConfig().sessionChecksEnabled).toBeFalse();
        });

        it('should not return sessionChecksEnabled if is not defined', () => {
            expect(service.getSessionCheckEnabled({} as any)).toEqual({});
        });

        it('should not return sessionChecksEnabled if is a string', () => {
            expect(service.getSessionCheckEnabled({ sessionChecksEnabled: 'fake' } as any)).toEqual({});
        });

        it('should not return sessionChecksEnabled if is undefined', () => {
            expect(service.getSessionCheckEnabled({ sessionChecksEnabled: undefined } as any)).toEqual({});
        });

        it('should not return sessionChecksEnabled if is null', () => {
            expect(service.getSessionCheckEnabled({ sessionChecksEnabled: null } as any)).toEqual({});
        });

        it('should not return sessionChecksEnabled if is a number', () => {
            expect(service.getSessionCheckEnabled({ sessionChecksEnabled: 666 } as any)).toEqual({});
        });
    });
});
