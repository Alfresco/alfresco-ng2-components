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
import { CrossAppAuthSyncService, CrossAppAuthConfig } from './cross-app-auth-sync.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { of } from 'rxjs';

describe('CrossAppAuthSyncService', () => {
    let service: CrossAppAuthSyncService;
    let mockLocalStorage: { [key: string]: string };
    let mockAppConfigService: jasmine.SpyObj<AppConfigService>;
    let originalLocalStorage: Storage;

    // eslint-disable-next-line jsdoc/require-jsdoc
    function restoreOriginalLocalStorage() {
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true,
            configurable: true
        });
        mockLocalStorage = {};
    }

    beforeEach(() => {
        originalLocalStorage = window.localStorage;

        mockLocalStorage = {};
        const localStorageMock = {
            getItem: jasmine.createSpy('getItem').and.callFake((key: string) => mockLocalStorage[key] || null),
            setItem: jasmine.createSpy('setItem').and.callFake((key: string, value: string) => {
                mockLocalStorage[key] = value;
            }),
            removeItem: jasmine.createSpy('removeItem').and.callFake((key: string) => {
                delete mockLocalStorage[key];
            }),
            clear: jasmine.createSpy('clear').and.callFake(() => {
                mockLocalStorage = {};
            }),
            key: jasmine.createSpy('key').and.callFake((index: number) => {
                const keys = Object.keys(mockLocalStorage);
                return keys[index] || null;
            }),
            get length() {
                return Object.keys(mockLocalStorage).length;
            }
        };

        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true,
            configurable: true
        });

        const appConfigSpy = jasmine.createSpyObj('AppConfigService', ['get']);

        TestBed.configureTestingModule({
            providers: [CrossAppAuthSyncService, { provide: AppConfigService, useValue: appConfigSpy }]
        });

        service = TestBed.inject(CrossAppAuthSyncService);
        mockAppConfigService = TestBed.inject(AppConfigService) as jasmine.SpyObj<AppConfigService>;
        mockAppConfigService.onLoad = of(true);
    });

    afterEach(() => {
        restoreOriginalLocalStorage();
    });

    it('should create service instance successfully', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize service using app config linked storage auth prefixes when no custom config provided', async () => {
        mockAppConfigService.get.and.returnValue(['CONFIG_APP1_', 'CONFIG_APP2_']);

        await service.initialize(); // No config provided

        expect(mockAppConfigService.get).toHaveBeenCalledWith('application.linkedStorageAuthPrefix');
        expect(service.getConfiguration()).toEqual(['CONFIG_APP1_', 'CONFIG_APP2_']);
    });

    it('should warn and handle gracefully when app config contains invalid non-array format for linked storage prefixes', async () => {
        spyOn(console, 'warn');
        mockAppConfigService.get.and.returnValue('invalid_string_format');

        await service.initialize(); // No config provided

        expect(console.warn).toHaveBeenCalledWith(jasmine.stringContaining('No app prefixes configured'));
    });

    it('should warn user when no app prefixes are configured in app config or provided manually', async () => {
        spyOn(console, 'warn');
        mockAppConfigService.get.and.returnValue(null);

        await service.initialize(); // No config provided

        expect(console.warn).toHaveBeenCalledWith(jasmine.stringContaining('No app prefixes configured'));
    });

    it('should initialize service with custom app prefixes without consulting app config service', async () => {
        const config: CrossAppAuthConfig = {
            appPrefixes: ['APP_ADMIN_', 'APP_MODELING_']
        };

        await service.initialize(config);

        expect(service.getConfiguration()).toEqual(['APP_ADMIN_', 'APP_MODELING_']);
        expect(mockAppConfigService.get).not.toHaveBeenCalled();
    });

    describe('hasAuthTokensInLinkedApps', () => {
        beforeEach(async () => {
            await service.initialize({
                appPrefixes: ['APP_ADMIN_', 'APP_MODELING_', 'APP_CONTENT_']
            });
        });

        it('should return false when no authentication tokens exist in any linked application storage', () => {
            expect(service.hasAuthTokensInLinkedApps()).toBe(false);
        });

        it('should return true when access tokens are found in any configured linked application storage', () => {
            mockLocalStorage['APP_ADMIN_access_token'] = 'admin_token_123';

            expect(service.hasAuthTokensInLinkedApps()).toBe(true);
        });

        it('should exclude specified app prefix from token detection to avoid detecting current app tokens', () => {
            mockLocalStorage['APP_ADMIN_access_token'] = 'admin_token_123';
            mockLocalStorage['APP_MODELING_access_token'] = 'modeling_token_456';

            expect(service.hasAuthTokensInLinkedApps('APP_ADMIN_')).toBe(true);
            expect(service.hasAuthTokensInLinkedApps('APP_MODELING_')).toBe(true);

            delete mockLocalStorage['APP_MODELING_access_token'];
            expect(service.hasAuthTokensInLinkedApps('APP_ADMIN_')).toBe(false);
        });

        it('should detect authentication tokens across multiple configured linked applications dynamically', () => {
            expect(service.hasAuthTokensInLinkedApps()).toBe(false);

            mockLocalStorage['APP_MODELING_access_token'] = 'modeling_token';
            expect(service.hasAuthTokensInLinkedApps()).toBe(true);

            delete mockLocalStorage['APP_MODELING_access_token'];
            mockLocalStorage['APP_CONTENT_access_token'] = 'content_token';
            expect(service.hasAuthTokensInLinkedApps()).toBe(true);
        });
    });

    describe('clearTokensFromAllApps', () => {
        beforeEach(async () => {
            await service.initialize({
                appPrefixes: ['APP_ADMIN_', 'APP_MODELING_']
            });
        });

        it('should remove all OAuth authentication tokens from all configured linked applications on logout', () => {
            mockLocalStorage['APP_ADMIN_access_token'] = 'admin_access';
            mockLocalStorage['APP_ADMIN_refresh_token'] = 'admin_refresh';
            mockLocalStorage['APP_ADMIN_id_token'] = 'admin_id';
            mockLocalStorage['APP_ADMIN_expires_at'] = '1234567890';
            mockLocalStorage['APP_MODELING_access_token'] = 'modeling_access';
            mockLocalStorage['APP_MODELING_refresh_token'] = 'modeling_refresh';
            mockLocalStorage['APP_MODELING_id_token'] = 'modeling_id';
            mockLocalStorage['APP_MODELING_expires_at'] = '1234567890';

            service.clearTokensFromAllApps();

            expect(mockLocalStorage['APP_ADMIN_access_token']).toBeUndefined();
            expect(mockLocalStorage['APP_ADMIN_refresh_token']).toBeUndefined();
            expect(mockLocalStorage['APP_ADMIN_id_token']).toBeUndefined();
            expect(mockLocalStorage['APP_ADMIN_expires_at']).toBeUndefined();
            expect(mockLocalStorage['APP_MODELING_access_token']).toBeUndefined();
            expect(mockLocalStorage['APP_MODELING_refresh_token']).toBeUndefined();
            expect(mockLocalStorage['APP_MODELING_id_token']).toBeUndefined();
            expect(mockLocalStorage['APP_MODELING_expires_at']).toBeUndefined();
        });

        it('should clear all standard OAuth2 and OIDC token keys from localStorage for complete cleanup', async () => {
            const prefix = 'APP_TEST_';
            await service.initialize({ appPrefixes: [prefix] });

            const oauthKeys = [
                'access_token',
                'access_token_stored_at',
                'expires_at',
                'granted_scopes',
                'id_token',
                'id_token_claims_obj',
                'id_token_expires_at',
                'id_token_stored_at',
                'nonce',
                'PKCE_verifier',
                'refresh_token',
                'session_state'
            ];

            oauthKeys.forEach((key) => {
                mockLocalStorage[`${prefix}${key}`] = `test_${key}_value`;
            });

            service.clearTokensFromAllApps();

            oauthKeys.forEach((key) => {
                expect(mockLocalStorage[`${prefix}${key}`]).toBeUndefined();
            });
        });
    });

    describe('getConfiguration', () => {
        it('should return immutable copy of current app prefixes configuration to prevent external modification', async () => {
            const config = ['APP1_', 'APP2_'];
            await service.initialize({ appPrefixes: config });

            const result = service.getConfiguration();
            const secondResult = service.getConfiguration();

            expect(result).toEqual(config);
            expect(result).not.toBe(secondResult);
        });

        it('should return empty array when service has not been initialized with any app prefixes', () => {
            expect(service.getConfiguration()).toEqual([]);
        });
    });
});
