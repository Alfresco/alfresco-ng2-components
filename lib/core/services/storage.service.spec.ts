/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { AppConfigService } from '../app-config/app-config.service';
import { StorageService } from './storage.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { AppConfigServiceMock } from '../mock/app-config.service.mock';

describe('StorageService', () => {

    let storage: StorageService;
    let appConfig: AppConfigServiceMock;
    const key = 'test_key';
    const value = 'test_value';

    describe('StorageService', () => {
        setupTestBed({
            imports: [CoreTestingModule]
        });

        beforeEach(() => {
            appConfig = TestBed.get(AppConfigService);
            appConfig.config = {
                application: {
                    storagePrefix: 'ADF_APP'
                }
            };
            storage = TestBed.get(StorageService);
        });

        it('should get the prefix for the storage from app config', (done) => {
            appConfig.load().then(() => {
                expect(storage.prefix).toBe('ADF_APP_');
                done();
            });
        });

        it('should set a property with the prefix in the local storage', (done) => {
            storage.clear();

            appConfig.load().then(() => {
                storage.setItem(key, value);
                const storageKey = localStorage.key(0);
                expect(storageKey).toBe('ADF_APP_' + key);
                expect(localStorage.getItem(storageKey)).toBe(value);
                done();
            });
        });

        it('should be able to get a property from the local storage', (done) => {
            storage.clear();

            appConfig.load().then(() => {
                storage.setItem(key, value);

                expect(storage.getItem(key)).toBe(value);
                done();
            });
        });
    });

    describe('StorageService', () => {
        setupTestBed({
            imports: [CoreTestingModule]
        });

        beforeEach(() => {
            appConfig = TestBed.get(AppConfigService);
            appConfig.config = {
                application: {
                    storagePrefix: ''
                }
            };
            storage = TestBed.get(StorageService);
        });

        it('should set an empty prefix when the it is not defined in the app config', (done) => {
            appConfig.load().then(() => {
                expect(storage.prefix).toBe('');
                done();
            });
        });

        it('should set a property without a prefix in the local storage', (done) => {
            appConfig.load().then(() => {
                storage.setItem(key, value);

                expect(localStorage.getItem(key)).toBe(value);
                done();
            });
        });
    });
});
