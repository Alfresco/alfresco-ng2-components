/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { async, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { providers } from '../../index';

import { AppConfigModule, AppConfigService } from './app-config.service';
import { StorageService } from './storage.service';
import { AlfrescoTranslateLoader } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesService', () => {

    const defaultPaginationSize: number = 10;
    let preferences: UserPreferencesService;
    let storage: StorageService;
    let appConfig: AppConfigService;
    let translate: TranslateService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: AlfrescoTranslateLoader
                    }
                })
            ],
            providers: [
                ...providers(),
                UserPreferencesService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        appConfig = TestBed.get(AppConfigService);
        appConfig.config = {
            pagination: {
                size: 10
            }
        };
        preferences = TestBed.get(UserPreferencesService);
        storage = TestBed.get(StorageService);
        translate = TestBed.get(TranslateService);
    });

    it('should get default pagination from app config', () => {
        expect(preferences.paginationSize).toBe(defaultPaginationSize);
    });

    it('should use [GUEST] as default storage prefix', () => {
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

    it('should save value with custom prefix', () => {
        preferences.setStoragePrefix('USER_A');
        preferences.set('propertyA', 'valueA');
        const propertyKey = preferences.getPropertyKey('propertyA');
        expect(storage.getItem(propertyKey)).toBe('valueA');
    });

    it('should store custom pagination settings for default prefix', () => {
        preferences.paginationSize = 5;
        expect(preferences.paginationSize).toBe(5);
    });

    it('should return default paginationSize value', () => {
        preferences.set('PAGINATION_SIZE', 0);
        expect(preferences.paginationSize).toBe(defaultPaginationSize);
    });

    it('should return as default locale the app.config locate as first', () => {
        appConfig.config.locale = 'fake-locate-config';
        spyOn(translate, 'getBrowserLang').and.returnValue('fake-locate-browser');
        expect(preferences.getDefaultLocale()).toBe('fake-locate-config');
    });

    it('should return as default locale the browser locale as second', () => {
        spyOn(translate, 'getBrowserLang').and.returnValue('fake-locate-browser');
        expect(preferences.getDefaultLocale()).toBe('fake-locate-browser');
    });

    it('should return as default locale the component propery as third ', () => {
        spyOn(translate, 'getBrowserLang').and.stub();
        expect(preferences.getDefaultLocale()).toBe('en');
    });

    it('should return as locale the store locate', () => {
        preferences.locale = 'fake-store-locate';
        appConfig.config.locale = 'fake-locate-config';
        spyOn(translate, 'getBrowserLang').and.returnValue('fake-locate-browser');
        expect(preferences.locale).toBe('fake-store-locate');
    });

});
