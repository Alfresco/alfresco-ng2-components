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
import { LanguageService } from './language.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { UserPreferencesService } from '../../common/services/user-preferences.service';
import { DEFAULT_LANGUAGE_LIST } from '../../common/models/default-languages.model';
import { LanguageItem } from '../../common/services/language-item.interface';

describe('LanguageService', () => {
    let service: LanguageService;
    let appConfigService: jasmine.SpyObj<AppConfigService>;
    let userPreferencesService: jasmine.SpyObj<UserPreferencesService>;

    const customLanguages: LanguageItem[] = [
        { key: 'en', label: 'English' },
        { key: 'fr', label: 'French' },
        { key: 'ar', label: 'Arabic', direction: 'rtl' }
    ];

    beforeEach(() => {
        const appConfigSpy = jasmine.createSpyObj('AppConfigService', ['get']);
        const userPrefsSpy = jasmine.createSpyObj('UserPreferencesService', ['set'], {
            locale: 'en'
        });

        TestBed.configureTestingModule({
            providers: [
                LanguageService,
                { provide: AppConfigService, useValue: appConfigSpy },
                { provide: UserPreferencesService, useValue: userPrefsSpy }
            ]
        });

        service = TestBed.inject(LanguageService);
        appConfigService = TestBed.inject(AppConfigService) as jasmine.SpyObj<AppConfigService>;
        userPreferencesService = TestBed.inject(UserPreferencesService) as jasmine.SpyObj<UserPreferencesService>;
    });

    it('should initialize with default languages when no custom languages are provided', () => {
        appConfigService.get.and.returnValue(null);
        service = new LanguageService(appConfigService, userPreferencesService);

        service.languages$.subscribe((languages) => {
            expect(languages).toEqual(DEFAULT_LANGUAGE_LIST);
        });
    });

    it('should initialize with custom languages when provided', () => {
        appConfigService.get.and.returnValue(customLanguages);
        service = new LanguageService(appConfigService, userPreferencesService);

        service.languages$.subscribe((languages) => {
            expect(languages).toEqual(customLanguages);
        });
    });

    it('should update HTML lang attribute when language is changed', () => {
        const originalSetAttribute = document.documentElement.setAttribute;

        const setAttributeSpy = jasmine.createSpy('setAttribute');
        document.documentElement.setAttribute = setAttributeSpy;

        try {
            service.changeLanguage(customLanguages[1]);

            expect(setAttributeSpy).toHaveBeenCalledWith('lang', 'fr');
        } finally {
            document.documentElement.setAttribute = originalSetAttribute;
        }
    });
});
