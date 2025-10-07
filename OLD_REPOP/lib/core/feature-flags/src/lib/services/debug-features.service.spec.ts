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
import { DebugFeaturesService } from './debug-features.service';
import { OverridableFeaturesServiceToken, WritableFeaturesServiceConfigToken, WritableFeaturesServiceToken } from '../interfaces/features.interface';
import { DummyFeaturesService } from './dummy-features.service';
import { StorageFeaturesService } from './storage-features.service';
import { take } from 'rxjs/operators';

describe('DebugFeaturesService', () => {
    let service: DebugFeaturesService;
    let mockStorageKey: string;
    let mockStorage;

    beforeEach(() => {
        mockStorageKey = 'storage-key-test';
        mockStorage = { [mockStorageKey]: true };

        TestBed.configureTestingModule({
            providers: [
                DebugFeaturesService,
                {
                    provide: WritableFeaturesServiceConfigToken,
                    useValue: { storageKey: mockStorageKey }
                },
                { provide: WritableFeaturesServiceToken, useClass: StorageFeaturesService },
                { provide: OverridableFeaturesServiceToken, useClass: DummyFeaturesService }
            ]
        });

        spyOn(sessionStorage, 'getItem').and.callFake((key) => JSON.stringify(mockStorage[key]));
        spyOn(sessionStorage, 'setItem').and.callFake((key, value) => {
            mockStorage[key] = value;
        });

        service = TestBed.inject(DebugFeaturesService);
    });

    it('should return false for isOn$ when flag is enabled', (done) => {
        const flagKey = 'feature1';

        service
            .isOn$(flagKey)
            .pipe(take(1))
            .subscribe((isEnabled) => {
                expect(isEnabled).toBeFalse();
                done();
            });
    });

    it('should return false for isOn$ when flag is disabled', (done) => {
        const flagKey = 'feature2';

        service
            .isOn$(flagKey)
            .pipe(take(1))
            .subscribe((isEnabled) => {
                expect(isEnabled).toBeFalse();
                done();
            });
    });

    it('should return true for isOff$ when flag is enabled', (done) => {
        const flagKey = 'feature3';

        service
            .isOff$(flagKey)
            .pipe(take(1))
            .subscribe((isEnabled) => {
                expect(isEnabled).toBeTrue();
                done();
            });
    });

    it('should return true for isOff$ when flag is disabled', (done) => {
        const flagKey = 'feature4';

        service
            .isOff$(flagKey)
            .pipe(take(1))
            .subscribe((isEnabled) => {
                expect(isEnabled).toBeTrue();
                done();
            });
    });

    it('should always reset specified flags', () => {
        const flagsToReset = {
            feature1: true
        };
        const writableFeaturesServiceToken = TestBed.inject(WritableFeaturesServiceToken);
        const spy = spyOn(writableFeaturesServiceToken, 'resetFlags');
        service.resetFlags(flagsToReset);

        expect(spy).toHaveBeenCalled();
    });

    it('should get the flags as an observable', (done) => {
        service.getFlags$().subscribe((flags) => {
            expect(flags).toEqual({});
            done();
        });
    });
});
