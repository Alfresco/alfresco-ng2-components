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
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { CrossAppTokenManager } from './cross-app-token-manager.service';

describe('CrossAppAuthIntegrationService', () => {
    let service: CrossAppAuthIntegrationService;
    let redirectAuthServiceSpy: jasmine.SpyObj<RedirectAuthService>;
    let crossAppTokenManagerSpy: jasmine.SpyObj<CrossAppTokenManager>;
    let replaceStateSpy: jasmine.Spy;
    let mockURLSearchParamsGet: jasmine.Spy;
    let onLogout$: Subject<void>;

    beforeEach(() => {
        onLogout$ = new Subject<void>();

        redirectAuthServiceSpy = jasmine.createSpyObj('RedirectAuthService', [], { onLogout$ });
        crossAppTokenManagerSpy = jasmine.createSpyObj('CrossAppTokenManager', ['initialize', 'clearTokensFromAllApps']);

        TestBed.configureTestingModule({
            providers: [
                CrossAppAuthIntegrationService,
                { provide: RedirectAuthService, useValue: redirectAuthServiceSpy },
                { provide: CrossAppTokenManager, useValue: crossAppTokenManagerSpy }
            ]
        });

        service = TestBed.inject(CrossAppAuthIntegrationService);
        redirectAuthServiceSpy = TestBed.inject(RedirectAuthService) as jasmine.SpyObj<RedirectAuthService>;
        crossAppTokenManagerSpy = TestBed.inject(CrossAppTokenManager) as jasmine.SpyObj<CrossAppTokenManager>;
    });

    describe('initialize', () => {
        it('should await the initialization of the cross-app token manager', async () => {
            crossAppTokenManagerSpy.initialize.and.resolveTo();

            await service.initialize();

            expect(crossAppTokenManagerSpy.initialize).toHaveBeenCalled();
        });

        it('should subscribe to logout events and clear tokens when logout occurs', async () => {
            crossAppTokenManagerSpy.initialize.and.resolveTo();

            await service.initialize();
            onLogout$.next();

            expect(crossAppTokenManagerSpy.clearTokensFromAllApps).toHaveBeenCalled();
        });
    });

    describe('processCrossAppAuthRequest', () => {
        let mockUrl: any;

        beforeEach(() => {
            mockURLSearchParamsGet = spyOn(URLSearchParams.prototype, 'get');
            replaceStateSpy = spyOn(window.history, 'replaceState');
            mockUrl = {
                searchParams: {
                    delete: jasmine.createSpy('delete')
                },
                toString: jasmine.createSpy('toString').and.returnValue('http://fake.com')
            };
            spyOn(window, 'URL').and.returnValue(mockUrl as unknown as URL);
        });

        it('should return false when crossAppAuth parameter is not present', async () => {
            mockURLSearchParamsGet.and.returnValue(null);

            const result = await service.processCrossAppAuthRequest();

            expect(result).toBe(false);
            expect(crossAppTokenManagerSpy.clearTokensFromAllApps).not.toHaveBeenCalled();
        });

        it('should return false when crossAppAuth parameter is not present', async () => {
            mockURLSearchParamsGet.and.returnValue(null);

            const result = await service.processCrossAppAuthRequest();

            expect(result).toBe(false);
            expect(crossAppTokenManagerSpy.clearTokensFromAllApps).not.toHaveBeenCalled();
        });

        it('should process crossAppAuth request when parameter is present with value "true"', async () => {
            mockURLSearchParamsGet.and.returnValue('true');

            const result = await service.processCrossAppAuthRequest();

            expect(result).toBe(true);
            expect(crossAppTokenManagerSpy.clearTokensFromAllApps).toHaveBeenCalled();
            expect(replaceStateSpy).toHaveBeenCalledWith({}, '', 'http://fake.com');
        });

        it('should clean up the URL by removing the crossAppAuth parameter', async () => {
            mockURLSearchParamsGet.and.returnValue('true');

            await service.processCrossAppAuthRequest();

            expect(mockUrl.searchParams.delete).toHaveBeenCalledWith('crossAppAuth');
            expect(replaceStateSpy).toHaveBeenCalledWith({}, '', 'http://fake.com');
        });

        describe('clearTokensFromAllApps', () => {
            it('should delegate to the cross-app token manager', () => {
                service.clearTokensFromAllApps();

                expect(crossAppTokenManagerSpy.clearTokensFromAllApps).toHaveBeenCalled();
            });
        });
    });
});
