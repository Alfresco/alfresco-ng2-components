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
import { AlfrescoApiService } from './alfresco-api.service';
import { AppConfigModule, AppConfigService } from './app-config.service';
import { StorageService } from './storage.service';
import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesService', () => {

    const defaultPaginationSize: number = 10;
    let preferences: UserPreferencesService;
    let storage: StorageService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule
            ],
            providers: [
                AlfrescoApiService,
                StorageService,
                UserPreferencesService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.pagination = {
            size: 10
        };
        preferences = TestBed.get(UserPreferencesService);
        storage = TestBed.get(StorageService);
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

});
