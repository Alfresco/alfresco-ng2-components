/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreTestingModule, StorageService } from '../../../../src/public-api';
import { FlagSet, WritableFeaturesServiceConfigToken, WritableFlagChangeset } from '../interfaces/features.interface';
import { skip } from 'rxjs/operators';

describe('StorageFeaturesService', () => {
    let storageFeaturesService: StorageFeaturesService;

    describe('if flags are present in LocalStorage', () => {
        const mockStorage = {
            getItem: () =>
                JSON.stringify({
                    feature1: {
                        current: true
                    },
                    feature2: {
                        current: false,
                        fictive: true
                    }
                }),
            setItem: () => {}
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CoreTestingModule],
                providers: [
                    { provide: StorageService, useValue: mockStorage },
                    {
                        provide: WritableFeaturesServiceConfigToken,
                        useValue: {
                            storageKey: 'storageFeaturesService-key-test'
                        }
                    },
                    StorageFeaturesService
                ]
            });

            storageFeaturesService = TestBed.inject(StorageFeaturesService);
            storageFeaturesService.init();
        });

        it('should return the stored flag set', () => {
            expect(storageFeaturesService.getFlagsSnapshot()).toEqual({
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
        });

        it('should set a flag and retrieve its value', () => {
            const flagKey = 'testFlag';
            const flagValue = true;

            storageFeaturesService.setFlag(flagKey, flagValue);

            expect(storageFeaturesService.getFlagsSnapshot()[flagKey]).toEqual({ current: true, previous: null, fictive: true });
        });

        it('should remove a flag', () => {
            const flagKey = 'testFlag';
            const flagValue = true;

            storageFeaturesService.setFlag(flagKey, flagValue);
            storageFeaturesService.removeFlag(flagKey);

            expect(storageFeaturesService.getFlagsSnapshot()[flagKey]).toBeUndefined();
        });

        it('should reset flags to the provided set', () => {
            const flagSet: FlagSet = { feature1: true };
            storageFeaturesService.resetFlags(flagSet);

            expect(storageFeaturesService.getFlagsSnapshot().feature1.previous).toBeNull();
            expect((storageFeaturesService.getFlagsSnapshot().feature1 as WritableFlagChangeset).fictive).toBe(true);
        });

        it('should merge flags to the provided set', () => {
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

            expect(storageFeaturesService.getFlagsSnapshot()).toEqual({
                feature1: Object({ current: true, previous: null, fictive: true }),
                feature2: Object({ current: false, previous: false }),
                feature3: Object({ current: false, previous: null })
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
    });

    describe('if flags are not present in LocalStorage and no configuration is provided', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CoreTestingModule],
                providers: [StorageFeaturesService]
            });

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
