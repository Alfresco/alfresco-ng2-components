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
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from '../../app-config/app-config.service';
import { StorageService } from '../../common/services/storage.service';
import { UserPreferencesService, UserPreferenceValues } from '../../common/services/user-preferences.service';
import { AppConfigServiceMock } from '../mock/app-config.service.mock';

describe('UserPreferencesService', () => {
    const supportedPaginationSize = [5, 10, 15, 20];
    let preferences: UserPreferencesService;
    let storage: StorageService;
    let appConfig: AppConfigServiceMock;
    let translate: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: AppConfigService, useClass: AppConfigServiceMock }]
        });
        appConfig = TestBed.inject(AppConfigService);
        appConfig.config = {
            pagination: {
                size: 10,
                supportedPageSizes: [5, 10, 15, 20]
            }
        };

        preferences = TestBed.inject(UserPreferencesService);
        storage = TestBed.inject(StorageService);
        storage.clear();
        translate = TestBed.inject(TranslateService);
    });

    afterEach(() => {
        storage.clear();
        TestBed.resetTestingModule();
    });

    it('should set document direction on textOrientation event to `rtl`', () => {
        preferences.set('textOrientation', 'rtl');
        expect(document.body.getAttribute('dir')).toBe('rtl');
    });

    it('should set document direction on textOrientation event to `ltr`', () => {
        preferences.set('textOrientation', 'ltr');
        expect(document.body.getAttribute('dir')).toBe('ltr');
    });

    describe(' with pagination config', () => {
        it('should get default pagination from app config', (done) => {
            appConfig.config.pagination.size = 0;
            appConfig.load().then(() => {
                expect(preferences.paginationSize).toBe(0);
                done();
            });
        });

        it('should return supported page sizes defined in the app config', () => {
            const supportedPages = preferences.supportedPageSizes;
            appConfig.load();
            expect(supportedPages).toEqual(supportedPaginationSize);
        });

        it('should use [GUEST] as default storage prefix', () => {
            preferences.setStoragePrefix(null);
            expect(preferences.getStoragePrefix()).toBe('GUEST');
        });

        it('should change storage prefix', () => {
            preferences.setStoragePrefix('USER_A');
            expect(preferences.getStoragePrefix()).toBe('USER_A');
        });

        it('should format property key for default prefix', () => {
            preferences.setStoragePrefix(null);
            expect(preferences.getPropertyKey('propertyA')).toBe('GUEST__propertyA');
        });

        it('should format property key for custom prefix', () => {
            preferences.setStoragePrefix('USER_A');
            expect(preferences.getPropertyKey('propertyA')).toBe('USER_A__propertyA');
        });

        it('should save value with default prefix', () => {
            preferences.set('propertyA', 'valueA');
            const propertyKey = preferences.getPropertyKey('propertyA');
            expect(storage.getItem(propertyKey)).toBe('valueA');
        });

        it('should null value return default prefix', () => {
            storage.setItem('paginationSize', '');
            const paginationSize = preferences.getPropertyKey('paginationSize');
            expect(preferences.get(paginationSize, 'default')).toBe('default');
        });

        it('should save value with custom prefix', () => {
            preferences.setStoragePrefix('USER_A');
            preferences.set('propertyA', 'valueA');
            const propertyKey = preferences.getPropertyKey('propertyA');
            expect(storage.getItem(propertyKey)).toBe('valueA');
        });

        it('should return as default locale the app.config locate as first', () => {
            appConfig.config.locale = 'fake-locate-config';
            spyOn(translate, 'getBrowserCultureLang').and.returnValue('fake-locate-browser');
            expect(preferences.getDefaultLocale()).toBe('fake-locate-config');
        });

        it('should return as default locale the browser locale as second', () => {
            spyOn(translate, 'getBrowserCultureLang').and.returnValue('fake-locate-browser');
            expect(preferences.getDefaultLocale()).toBe('fake-locate-browser');
        });

        it('should return as default locale the component property as third ', () => {
            spyOn(translate, 'getBrowserCultureLang').and.stub();
            expect(preferences.getDefaultLocale()).toBe('en');
        });

        it('should return as locale the store locate', () => {
            preferences.locale = 'fake-store-locate';
            appConfig.config.locale = 'fake-locate-config';
            spyOn(translate, 'getBrowserCultureLang').and.returnValue('fake-locate-browser');
            expect(preferences.locale).toBe('fake-store-locate');
        });

        it('should not store in the storage the locale if the app.config.json does not have a value', () => {
            preferences.locale = 'fake-store-locate';
            spyOn(translate, 'getBrowserCultureLang').and.returnValue('fake-locate-browser');
            expect(preferences.locale).toBe('fake-store-locate');
            expect(storage.getItem(UserPreferenceValues.Locale)).toBe(null);
        });

        it('should stream the page size value when is set', () => {
            let lastValue;
            preferences.onChange.subscribe((userPreferenceStatus) => {
                lastValue = userPreferenceStatus[UserPreferenceValues.PaginationSize];
            });
            preferences.paginationSize = 5;
            expect(lastValue).toBe(5);
        });

        it('should stream the user preference status when changed', () => {
            let lastValue;
            preferences.onChange.subscribe((userPreferenceStatus) => {
                lastValue = userPreferenceStatus.propertyA;
            });
            preferences.set('propertyA', 'valueA');
            expect(lastValue).toBe('valueA');
        });
    });

    describe('with language config', () => {
        it('should store default textOrientation based on language', () => {
            appConfig.config.languages = [
                {
                    key: 'fake-locale-config'
                }
            ];
            appConfig.config.locale = 'fake-locale-config';
            appConfig.load();
            const textOrientation = preferences.getPropertyKey('textOrientation');
            expect(storage.getItem(textOrientation)).toBe('ltr');
        });

        it('should store textOrientation based on language config direction', () => {
            appConfig.config.languages = [
                {
                    key: 'fake-locale-config',
                    direction: 'rtl'
                }
            ];
            appConfig.config.locale = 'fake-locale-config';
            appConfig.load();
            const textOrientation = preferences.getPropertyKey('textOrientation');
            expect(storage.getItem(textOrientation)).toBe('rtl');
        });

        it('should set direction from default languages when language config is not present', () => {
            appConfig.config.languages = [
                {
                    key: 'fake-locale-config',
                    direction: 'ltr'
                }
            ];
            appConfig.config.locale = 'ar';
            appConfig.load();
            const textOrientation = preferences.getPropertyKey('textOrientation');
            expect(storage.getItem(textOrientation)).toBe('rtl');
        });

        it('should not store textOrientation based on language ', () => {
            appConfig.config.languages = [
                {
                    key: 'fake-locale-browser'
                }
            ];

            const textOrientation = preferences.getPropertyKey('textOrientation');
            expect(storage.getItem(textOrientation)).toBe(null);
        });

        it('should default to browser locale for textOrientation when locale is not defined in configuration', () => {
            appConfig.config.languages = [
                {
                    key: 'fake-locale-browser',
                    direction: 'rtl'
                }
            ];
            spyOn(translate, 'getBrowserCultureLang').and.returnValue('fake-locale-browser');
            appConfig.load();

            let lastValue;

            preferences.onChange.subscribe((userPreferenceStatus) => {
                lastValue = userPreferenceStatus['textOrientation'];
            });

            expect(lastValue).toBe('rtl');
        });
    });
});
