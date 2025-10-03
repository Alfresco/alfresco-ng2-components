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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CrossAppAuthInitializerService } from './cross-app-auth-initializer.service';
import { CrossAppAuthIntegrationService } from './cross-app-auth-integration.service';

describe('CrossAppAuthInitializerService', () => {
    let service: CrossAppAuthInitializerService;
    let mockCrossAppIntegration: jasmine.SpyObj<CrossAppAuthIntegrationService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('CrossAppAuthIntegrationService', ['initialize', 'processCrossAppAuthRequest']);

        TestBed.configureTestingModule({
            providers: [CrossAppAuthInitializerService, { provide: CrossAppAuthIntegrationService, useValue: spy }]
        });

        service = TestBed.inject(CrossAppAuthInitializerService);
        mockCrossAppIntegration = TestBed.inject(CrossAppAuthIntegrationService) as jasmine.SpyObj<CrossAppAuthIntegrationService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('initializeWithSilentLogin', () => {
        it('should successfully initialize and attempt silent login', async () => {
            mockCrossAppIntegration.initialize.and.returnValue(Promise.resolve());
            mockCrossAppIntegration.processCrossAppAuthRequest.and.returnValue(Promise.resolve(true));

            const result = await service.initializeCrossAppLogin();

            expect(result).toBe(true);
            expect(mockCrossAppIntegration.initialize).toHaveBeenCalled();
            expect(mockCrossAppIntegration.processCrossAppAuthRequest).toHaveBeenCalled();
        });

        it('should return false if silent login is not attempted', async () => {
            mockCrossAppIntegration.initialize.and.returnValue(Promise.resolve());
            mockCrossAppIntegration.processCrossAppAuthRequest.and.returnValue(Promise.resolve(false));

            const result = await service.initializeCrossAppLogin();

            expect(result).toBe(false);
            expect(mockCrossAppIntegration.initialize).toHaveBeenCalled();
            expect(mockCrossAppIntegration.processCrossAppAuthRequest).toHaveBeenCalled();
        });

        it('should handle initialization timeout', fakeAsync(async () => {
            mockCrossAppIntegration.initialize.and.returnValue(
                new Promise(() => {}) // Never resolves - simulates hanging
            );
            spyOn(console, 'warn');

            const result = await service.initializeCrossAppLogin();
            tick();

            expect(result).toBe(false);
            expect(console.warn).toHaveBeenCalledWith('Cross-app auth initialization failed:', 'Cross-app auth initialization timed out');
        }));

        it('should handle initialization errors', async () => {
            const error = new Error('Network error');
            mockCrossAppIntegration.initialize.and.returnValue(Promise.reject(error));
            spyOn(console, 'warn');

            const result = await service.initializeCrossAppLogin();

            expect(result).toBe(false);
            expect(console.warn).toHaveBeenCalledWith('Cross-app auth initialization failed:', 'Network error');
        });

        it('should handle various error types', async () => {
            const customError = new Error('Custom initialization error');
            mockCrossAppIntegration.initialize.and.returnValue(Promise.reject(customError));
            spyOn(console, 'warn');

            const result = await service.initializeCrossAppLogin();

            expect(result).toBe(false);
            expect(console.warn).toHaveBeenCalledWith('Cross-app auth initialization failed:', 'Custom initialization error');
        });

        it('should handle silent login errors', async () => {
            mockCrossAppIntegration.initialize.and.returnValue(Promise.resolve());
            mockCrossAppIntegration.processCrossAppAuthRequest.and.returnValue(Promise.reject(new Error('Fake login failed')));
            spyOn(console, 'warn');

            const result = await service.initializeCrossAppLogin();

            expect(result).toBe(false);
            expect(console.warn).toHaveBeenCalledWith('Cross-app auth initialization failed:', 'Fake login failed');
        });
    });
});
