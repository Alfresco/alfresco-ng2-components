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
import { StorageFeaturesService } from './storage-features.service';
import { FlagSet, WritableFeaturesServiceConfigToken } from '../interfaces/features.interface';
import { skip, take } from 'rxjs/operators';

describe('StorageFeaturesService', () => {
    let storageFeaturesService: StorageFeaturesService;

    describe('if flags are present in sessionStorage', () => {
        let mockStorageKey: string;
        let mockStorage;

        beforeEach(() => {
            mockStorageKey = 'storage-key-test';
            mockStorage = {
                [mockStorageKey]: {
                    feature1: {
                        current: true
                    },
                    feature2: {
                        current: false,
                        fictive: true
                    }
                }
            };

            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: WritableFeaturesServiceConfigToken,
                        useValue: { storageKey: mockStorageKey }
                    }
                ]
            });

            spyOn(sessionStorage, 'getItem').and.callFake((key) => JSON.stringify(mockStorage[key]));
            spyOn(sessionStorage, 'setItem').and.callFake((key, value) => {
                mockStorage[key] = value;
            });

            storageFeaturesService = TestBed.inject(StorageFeaturesService);
            storageFeaturesService.init();
        });

        it('should return the stored flag set', (done) => {
            storageFeaturesService
                .getFlags$()
                .pipe(take(1))
                .subscribe((flags) => {
                    expect(flags).toEqual({
                        feature1: {
                            current: true,
                            previous: null
                        },
                        feature2: {
                            current: false,
                            fictive: true,
                            previous: null
                        }
                    });
                    done();
                });
        });

        it('should set a flag and retrieve its value', (done) => {
            const flagKey = 'testFlag';
            const flagValue = true;

            storageFeaturesService.setFlag(flagKey, flagValue);
            storageFeaturesService
                .getFlags$()
                .pipe(take(1))
                .subscribe((flags) => {
                    expect(flags[flagKey]).toEqual({ current: true, previous: null, fictive: true });
                    done();
                });
        });

        it('should remove a flag', (done) => {
            const flagKey = 'testFlag';
            const flagValue = true;

            storageFeaturesService.setFlag(flagKey, flagValue);
            storageFeaturesService.removeFlag(flagKey);
            storageFeaturesService
                .getFlags$()
                .pipe(take(1))
                .subscribe((flags) => {
                    expect(flags[flagKey]).toBeUndefined();
                    done();
                });
        });

        it('should reset flags to the provided set', (done) => {
            const flagSet: FlagSet = { feature1: true };
            storageFeaturesService.resetFlags(flagSet);

            storageFeaturesService
                .getFlags$()
                .pipe(take(1))
                .subscribe((flags) => {
                    expect(flags.feature1.previous).toBeNull();
                    expect(flags.feature1.fictive).toBe(true);
                    done();
                });
        });

        it('should merge flags to the provided set', (done) => {
            const newFlags = {
                feature2: {
                    current: false,
                    previous: null
                },
                feature3: {
                    current: false,
                    previous: null
                }
            };

            storageFeaturesService.mergeFlags(newFlags);

            storageFeaturesService
                .getFlags$()
                .pipe(take(1))
                .subscribe((flags) => {
                    expect(flags).toEqual({
                        feature1: { current: true, previous: null, fictive: true },
                        feature2: { current: false, previous: false },
                        feature3: { current: false, previous: null }
                    });
                    done();
                });
        });

        it('should emit flag changes when a flag is set', (done) => {
            const flagKey = 'testFlag';
            const flagValue = true;

            storageFeaturesService
                .getFlags$()
                .pipe(skip(1))
                .subscribe((flags) => {
                    expect(flags[flagKey]).toEqual({ current: true, previous: null, fictive: true });
                    done();
                });

            storageFeaturesService.setFlag(flagKey, flagValue);
        });

        it('should return custom storageFeaturesService key', () => {
            expect(storageFeaturesService.storageKey).toEqual('storage-key-test');
        });
    });

    describe('if flags are not present in LocalStorage and no configuration is provided', () => {
        beforeEach(() => {
            storageFeaturesService = TestBed.inject(StorageFeaturesService);
        });

        it('should return initial empty flag set', (done) => {
            storageFeaturesService.init().subscribe((flags) => {
                expect(flags).toEqual({});
                done();
            });
        });

        it('should return default storageFeaturesService key', () => {
            expect(storageFeaturesService.storageKey).toEqual('feature-flags');
        });
    });
});
