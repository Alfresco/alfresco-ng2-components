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
import { AppConfigService } from '../../app-config/app-config.service';
import { StorageService } from '../../common/services/storage.service';
import { NoopAuthModule } from '@alfresco/adf-core';

describe('StorageService', () => {
    let storage: StorageService;
    let appConfig: AppConfigService;
    const key = 'test_key';
    const value = 'test_value';

    describe('with local storage and prefix', () => {
        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [NoopAuthModule]
            });
            appConfig = TestBed.inject(AppConfigService);
            storage = TestBed.inject(StorageService);
            await appConfig.load();
            storage.clear();
        });

        it('should get the prefix for the storage from app config', () => {
            expect(storage.prefix).toBe('ADF_APP_');
        });

        it('should set a property with the prefix in the local storage', () => {
            storage.setItem(key, value);
            const storageKey = localStorage.key(0);
            expect(storageKey).toBe('ADF_APP_' + key);
            expect(localStorage.getItem(storageKey)).toBe(value);
        });

        it('should be able to get a property from the local storage', () => {
            storage.setItem(key, value);

            expect(storage.getItem(key)).toBe(value);
        });

        it('should retrieve all items with the prefix from local storage', () => {
            localStorage.setItem('ADF_APP_key1', 'value1');
            localStorage.setItem('ADF_APP_key2', 'value2');

            const items = storage.getItems();

            expect(items).toEqual({
                key1: 'value1',
                key2: 'value2'
            });
        });

        it('should return an empty object if no items match the prefix in local storage', () => {
            localStorage.setItem('other_key', 'value');

            const items = storage.getItems();

            expect(items).toEqual({});
        });
    });

    describe('without local storage and prefix', () => {
        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [NoopAuthModule]
            });
            appConfig = TestBed.inject(AppConfigService);

            appConfig.config = {
                application: {
                    storagePrefix: ''
                }
            };
            storage = TestBed.inject(StorageService);
            await appConfig.load();
            storage.clear();
        });

        it('should set an empty prefix when the it is not defined in the app config', () => {
            expect(storage.prefix).toBe('');
        });

        it('should set a property without a prefix in the local storage', () => {
            storage.setItem(key, value);

            expect(localStorage.getItem(key)).toBe(value);
        });

        it('should retrieve all items without a prefix from local storage', () => {
            localStorage.setItem('key1', 'value1');
            localStorage.setItem('key2', 'value2');

            const items = storage.getItems();
            expect(items).toEqual({
                key1: 'value1',
                key2: 'value2'
            });
        });
    });

    describe('with memory storage', () => {
        beforeEach(async () => {
            Object.defineProperty(window, 'localStorage', {
                value: undefined,
                configurable: true
            });

            TestBed.configureTestingModule({
                imports: [NoopAuthModule]
            });
            appConfig = TestBed.inject(AppConfigService);
            storage = TestBed.inject(StorageService);
            await appConfig.load();
            storage.clear();
        });

        it('should be able to get a property from storage', () => {
            storage.setItem(key, value);

            expect(storage.getItem(key)).toBe(value);
        });

        it('should retrieve all items from storage', () => {
            storage.setItem('key1', 'value1');
            storage.setItem('key2', 'value2');

            const items = storage.getItems();

            expect(items).toEqual({
                key1: 'value1',
                key2: 'value2'
            });
        });
    });
});
