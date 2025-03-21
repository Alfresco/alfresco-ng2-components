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
import { LocalPreferenceCloudService } from './local-preference-cloud.service';
import { StorageService } from '@alfresco/adf-core';

describe('LocalPreferenceCloudService', () => {
    let service: LocalPreferenceCloudService;
    let storageServiceSpy: jasmine.SpyObj<StorageService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('StorageService', ['getItem', 'getItems', 'setItem']);

        TestBed.configureTestingModule({
            providers: [LocalPreferenceCloudService, { provide: StorageService, useValue: spy }]
        });

        service = TestBed.inject(LocalPreferenceCloudService);
        storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    });

    it('should return preferences for a given key', (done) => {
        const key = 'testKey';
        const value = '[{"name": "test"}]';
        storageServiceSpy.getItem.and.returnValue(value);

        service.getPreferences('', key).subscribe((result) => {
            expect(result.list.entries[0].entry.key).toBe(key);
            expect(result.list.entries[0].entry.value).toBe(value);
            done();
        });
    });

    it('should return all preferences if no key is provided', (done) => {
        const items = {
            key1: '[{"name": "test1"}]',
            key2: '[{"name": "test2"}]'
        };
        storageServiceSpy.getItems.and.returnValue(items);

        service.getPreferences('', undefined).subscribe((result) => {
            expect(result.list.entries.length).toBe(2);
            expect(result.list.entries[0].entry.key).toBe('key1');
            expect(result.list.entries[0].entry.value).toBe(items['key1']);
            expect(result.list.entries[1].entry.key).toBe('key2');
            expect(result.list.entries[1].entry.value).toBe(items['key2']);
            done();
        });
    });
});
