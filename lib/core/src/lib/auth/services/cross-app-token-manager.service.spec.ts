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
import { CrossAppTokenManager } from './cross-app-token-manager.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { of } from 'rxjs';

describe('CrossAppTokenManager', () => {
    let service: CrossAppTokenManager;
    let appConfigService: jasmine.SpyObj<AppConfigService>;
    let localStorageSpy: jasmine.Spy;
    let consoleErrorSpy: jasmine.Spy;

    beforeEach(() => {
        appConfigService = jasmine.createSpyObj('AppConfigService', ['get', 'onLoad']);
        appConfigService.onLoad = of(null);

        TestBed.configureTestingModule({
            providers: [CrossAppTokenManager, { provide: AppConfigService, useValue: appConfigService }]
        });

        service = TestBed.inject(CrossAppTokenManager);
        localStorageSpy = spyOn(localStorage, 'removeItem');
        consoleErrorSpy = spyOn(console, 'error');
    });

    afterEach(() => {
        localStorageSpy.calls.reset();
        consoleErrorSpy.calls.reset();
    });

    describe('initialize', () => {
        it('should retrieve prefixes from AppConfigService', async () => {
            appConfigService.get.withArgs(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX).and.returnValue(['app1', 'app2_']);
            appConfigService.get.withArgs(AppConfigValues.STORAGE_PREFIX).and.returnValue('current_app');

            await service.initialize();

            expect(appConfigService.get).toHaveBeenCalledWith(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX);
            expect(appConfigService.get).toHaveBeenCalledWith(AppConfigValues.STORAGE_PREFIX);
        });

        it('should log error when no prefixes are configured', async () => {
            appConfigService.get.withArgs(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX).and.returnValue([]);
            appConfigService.get.withArgs(AppConfigValues.STORAGE_PREFIX).and.returnValue('');

            await service.initialize();

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'CrossAppTokenManager: No app prefixes configured. Set appPrefixes or application.linkedStorageAuthPrefix in app.config.json'
            );
        });
    });

    describe('clearTokensFromAllApps', () => {
        beforeEach(async () => {
            appConfigService.get.withArgs(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX).and.returnValue(['app1', 'app2_']);
            appConfigService.get.withArgs(AppConfigValues.STORAGE_PREFIX).and.returnValue('current_app');
            await service.initialize();
        });

        it('should remove all auth tokens for all configured prefixes', () => {
            service.clearTokensFromAllApps();

            const authKeys = [
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

            const expectedStorageCalls = 3 * authKeys.length;

            expect(localStorageSpy).toHaveBeenCalledTimes(expectedStorageCalls);

            expect(localStorageSpy).toHaveBeenCalledWith('app1_access_token');
            expect(localStorageSpy).toHaveBeenCalledWith('app2_refresh_token');
            expect(localStorageSpy).toHaveBeenCalledWith('current_app_id_token');
        });

        it('should handle empty prefixes when clearing tokens', async () => {
            appConfigService.get.withArgs(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX).and.returnValue([]);
            appConfigService.get.withArgs(AppConfigValues.STORAGE_PREFIX).and.returnValue('');
            await service.initialize();

            service.clearTokensFromAllApps();

            expect(localStorageSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('getConfiguredPrefixes', () => {
        it('should append underscore to prefixes that do not end with it', async () => {
            appConfigService.get.withArgs(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX).and.returnValue(['app1', 'app2_']);
            appConfigService.get.withArgs(AppConfigValues.STORAGE_PREFIX).and.returnValue('current_app');

            await service.initialize();
            service.clearTokensFromAllApps();

            expect(localStorageSpy).toHaveBeenCalledWith('app1_access_token');
            expect(localStorageSpy).toHaveBeenCalledWith('app2_access_token');
            expect(localStorageSpy).toHaveBeenCalledWith('current_app_access_token');
        });

        it('should handle empty current app prefix', async () => {
            appConfigService.get.withArgs(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX).and.returnValue(['app1_']);
            appConfigService.get.withArgs(AppConfigValues.STORAGE_PREFIX).and.returnValue('');

            await service.initialize();
            service.clearTokensFromAllApps();

            expect(localStorageSpy).toHaveBeenCalledWith('app1_access_token');
            expect(localStorageSpy).toHaveBeenCalledWith('access_token');
        });
    });

    describe('buildStorageKey', () => {
        it('should correctly format storage keys with prefixes', async () => {
            appConfigService.get.withArgs(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX).and.returnValue(['app_']);
            appConfigService.get.withArgs(AppConfigValues.STORAGE_PREFIX).and.returnValue('');

            await service.initialize();
            service.clearTokensFromAllApps();

            expect(localStorageSpy).toHaveBeenCalledWith('app_access_token');
            expect(localStorageSpy).toHaveBeenCalledWith('access_token');
        });
    });
});
