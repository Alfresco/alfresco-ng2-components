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
import { TimeSyncDateTimeProvider } from './time-sync-date-time-provider';
import { TimeSyncService } from '../services/time-sync.service';

describe('TimeSyncDateTimeProvider', () => {
    let provider: TimeSyncDateTimeProvider;
    let timeSyncServiceSpy: jasmine.SpyObj<TimeSyncService>;

    beforeEach(() => {
        timeSyncServiceSpy = jasmine.createSpyObj('TimeSyncService', ['getCorrectedNow']);

        TestBed.configureTestingModule({
            providers: [TimeSyncDateTimeProvider, { provide: TimeSyncService, useValue: timeSyncServiceSpy }]
        });

        provider = TestBed.inject(TimeSyncDateTimeProvider);
    });

    describe('now', () => {
        it('should return corrected timestamp from TimeSyncService', () => {
            const correctedTime = 1728911640000;
            timeSyncServiceSpy.getCorrectedNow.and.returnValue(correctedTime);

            expect(provider.now()).toBe(correctedTime);
        });

        it('should delegate to TimeSyncService.getCorrectedNow', () => {
            timeSyncServiceSpy.getCorrectedNow.and.returnValue(0);

            provider.now();

            expect(timeSyncServiceSpy.getCorrectedNow).toHaveBeenCalled();
        });
    });

    describe('new', () => {
        it('should return a Date object based on corrected timestamp', () => {
            const correctedTime = 1728911640000;
            timeSyncServiceSpy.getCorrectedNow.and.returnValue(correctedTime);

            const result = provider.new();

            expect(result).toBeInstanceOf(Date);
            expect(result.getTime()).toBe(correctedTime);
        });

        it('should return a Date reflecting server-synchronized time', () => {
            const correctedTime = 1728911640000; // (GMT): Monday, October 14, 2024 1:14:00 PM
            timeSyncServiceSpy.getCorrectedNow.and.returnValue(correctedTime);

            const result = provider.new();

            expect(result.toISOString()).toBe('2024-10-14T13:14:00.000Z');
        });
    });
});
