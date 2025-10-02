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
import { Subject } from 'rxjs';
import { CrossAppAuthIntegrationService } from './cross-app-auth-integration.service';
import { CrossAppAuthSyncService, CrossAppAuthConfig } from './cross-app-auth-sync.service';
import { RedirectAuthService } from '../oidc/redirect-auth.service';

describe('CrossAppAuthIntegrationService', () => {
    let service: CrossAppAuthIntegrationService;
    let mockCrossAppSyncService: jasmine.SpyObj<CrossAppAuthSyncService>;
    let mockRedirectAuthService: any;
    let mockOAuthService: jasmine.SpyObj<any>;
    let onLogoutSubject: Subject<void>;

    beforeEach(() => {
        mockOAuthService = jasmine.createSpyObj('OAuthService', ['initLoginFlow'], {
            customQueryParams: {}
        });

        onLogoutSubject = new Subject<void>();

        const crossAppSyncSpy = jasmine.createSpyObj('CrossAppAuthSyncService', [
            'initialize',
            'hasAuthTokensInLinkedApps',
            'clearTokensFromAllApps'
        ]);
        crossAppSyncSpy.initialize.and.returnValue(Promise.resolve());

        mockRedirectAuthService = {
            authenticated: false,
            onLogout$: onLogoutSubject.asObservable(),
            oauthService: mockOAuthService,
            login: jasmine.createSpy('login'),
            ensureDiscoveryDocument: jasmine.createSpy('ensureDiscoveryDocument').and.returnValue(Promise.resolve(true))
        };

        TestBed.configureTestingModule({
            providers: [
                CrossAppAuthIntegrationService,
                { provide: CrossAppAuthSyncService, useValue: crossAppSyncSpy },
                { provide: RedirectAuthService, useValue: mockRedirectAuthService }
            ]
        });

        service = TestBed.inject(CrossAppAuthIntegrationService);
        mockCrossAppSyncService = TestBed.inject(CrossAppAuthSyncService) as jasmine.SpyObj<CrossAppAuthSyncService>;
    });

    afterEach(() => {
        onLogoutSubject.complete();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('initialize', () => {
        it('should initialize with default configuration', async () => {
            await service.initialize();

            expect(mockCrossAppSyncService.initialize).toHaveBeenCalledWith({});
        });

        it('should initialize with custom configuration', async () => {
            const config: CrossAppAuthConfig = {
                appPrefixes: ['APP1_', 'APP2_']
            };

            await service.initialize(config, 'CURRENT_APP_');

            expect(mockCrossAppSyncService.initialize).toHaveBeenCalledWith(config);
        });

        it('should set current app prefix', async () => {
            await service.initialize(undefined, 'MY_APP_');

            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(false);
            await service.attemptSilentLoginFromLinkedApps();

            expect(mockCrossAppSyncService.hasAuthTokensInLinkedApps).toHaveBeenCalledWith('MY_APP_');
        });

        it('should subscribe to logout events and clear tokens', async () => {
            await service.initialize();

            onLogoutSubject.next();

            expect(mockCrossAppSyncService.clearTokensFromAllApps).toHaveBeenCalled();
        });
    });

    describe('attemptSilentLoginFromLinkedApps', () => {
        beforeEach(async () => {
            await service.initialize();
        });

        it('should return false if already authenticated', async () => {
            mockRedirectAuthService.authenticated = true;

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(false);
            expect(mockCrossAppSyncService.hasAuthTokensInLinkedApps).not.toHaveBeenCalled();
        });

        it('should return false if no linked tokens exist', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(false);

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(false);
            expect(mockCrossAppSyncService.hasAuthTokensInLinkedApps).toHaveBeenCalled();
        });

        it('should attempt silent login with prompt=none when linked tokens exist', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);
            mockRedirectAuthService.ensureDiscoveryDocument.and.returnValue(Promise.resolve(true));

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(true);
            expect(mockRedirectAuthService.ensureDiscoveryDocument).toHaveBeenCalled();
            expect(mockOAuthService.initLoginFlow).toHaveBeenCalled();
        });

        it('should set and restore customQueryParams with prompt=none', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);
            mockRedirectAuthService.ensureDiscoveryDocument.and.returnValue(Promise.resolve(true));

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(true);
            expect(mockRedirectAuthService.ensureDiscoveryDocument).toHaveBeenCalled();
            expect(mockOAuthService.initLoginFlow).toHaveBeenCalled();
        });

        it('should handle missing OAuth service gracefully with fallback login', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);

            (mockRedirectAuthService as any).oauthService = undefined;

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(true);
            expect(mockRedirectAuthService.login).toHaveBeenCalled();
        });

        it('should handle missing initLoginFlow method gracefully with fallback login', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);

            (mockRedirectAuthService as any).oauthService = {};

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(true);
            expect(mockRedirectAuthService.login).toHaveBeenCalled();
        });

        it('should return false if silent login throws an error', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);
            mockRedirectAuthService.ensureDiscoveryDocument.and.returnValue(Promise.reject(new Error('Network error')));

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(false);
        });

        it('should handle OAuth service initLoginFlow throwing an error', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);
            mockRedirectAuthService.ensureDiscoveryDocument.and.returnValue(Promise.resolve(true));
            mockOAuthService.initLoginFlow.and.throwError('OAuth error');

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(false);
        });

        it('should exclude current app prefix when checking for linked tokens', async () => {
            service.initialize(undefined, 'CURRENT_APP_');
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(false);

            await service.attemptSilentLoginFromLinkedApps();

            expect(mockCrossAppSyncService.hasAuthTokensInLinkedApps).toHaveBeenCalledWith('CURRENT_APP_');
        });

        it('should preserve existing customQueryParams when adding prompt=none', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);
            mockRedirectAuthService.ensureDiscoveryDocument.and.returnValue(Promise.resolve(true));

            await service.attemptSilentLoginFromLinkedApps();

            expect(mockRedirectAuthService.ensureDiscoveryDocument).toHaveBeenCalled();
            expect(mockOAuthService.initLoginFlow).toHaveBeenCalled();
        });
    });

    describe('clearTokensFromAllApps', () => {
        it('should delegate to sync service', () => {
            service.clearTokensFromAllApps();

            expect(mockCrossAppSyncService.clearTokensFromAllApps).toHaveBeenCalled();
        });
    });

    describe('getSyncService', () => {
        it('should return the underlying sync service', () => {
            const syncService = service.getSyncService();

            expect(syncService).toBe(mockCrossAppSyncService);
        });
    });

    describe('integration scenarios', () => {
        beforeEach(() => {
            service.initialize({ appPrefixes: ['APP1_', 'APP2_'] }, 'CURRENT_');
        });

        it('should perform complete silent login flow successfully', async () => {
            mockRedirectAuthService.authenticated = false;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);
            mockRedirectAuthService.ensureDiscoveryDocument.and.returnValue(Promise.resolve(true));

            let loginFlowCalled = false;
            mockOAuthService.initLoginFlow.and.callFake(() => {
                loginFlowCalled = true;
            });

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(true);
            expect(mockCrossAppSyncService.hasAuthTokensInLinkedApps).toHaveBeenCalledWith('CURRENT_');
            expect(mockRedirectAuthService.ensureDiscoveryDocument).toHaveBeenCalled();
            expect(loginFlowCalled).toBe(true);
        });

        it('should handle logout and clear all tokens', async () => {
            await service.initialize({ appPrefixes: ['APP1_', 'APP2_'] }, 'CURRENT_');

            onLogoutSubject.next();

            expect(mockCrossAppSyncService.clearTokensFromAllApps).toHaveBeenCalled();
        });

        it('should not attempt silent login for already authenticated users', async () => {
            mockRedirectAuthService.authenticated = true;
            mockCrossAppSyncService.hasAuthTokensInLinkedApps.and.returnValue(true);

            const result = await service.attemptSilentLoginFromLinkedApps();

            expect(result).toBe(false);
            expect(mockCrossAppSyncService.hasAuthTokensInLinkedApps).not.toHaveBeenCalled();
            expect(mockOAuthService.initLoginFlow).not.toHaveBeenCalled();
        });
    });
});
