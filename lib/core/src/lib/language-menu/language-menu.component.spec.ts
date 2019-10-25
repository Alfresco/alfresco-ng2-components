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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService } from '../app-config/app-config.service';
import { LanguageMenuComponent } from './language-menu.component';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { UserPreferencesService } from '../services/user-preferences.service';

describe('LanguageMenuComponent', () => {

    let fixture: ComponentFixture<LanguageMenuComponent>;
    let component: LanguageMenuComponent;
    let appConfig: AppConfigService;
    let userPreferencesService: UserPreferencesService;

    const languages = <any> [
        {
            key: 'fake-key-1',
            label: 'fake-label-1'
        },
        {
            key: 'fake-key-2',
            label: 'fake-label-2'
        },
        {
            key: 'fake-key-3',
            label: 'fake-label-3',
            direction: 'rtl'
        }
    ];

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageMenuComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.get(AppConfigService);
        userPreferencesService = TestBed.get(UserPreferencesService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should fetch the languages from the app config if present', () => {
        fixture.detectChanges();

        expect(component.languages).toEqual([{ key: 'en', label: 'English' }]);

        appConfig.config.languages = languages;

        component.ngOnInit();
        expect(component.languages).toEqual(languages);
    });

    it('should change user preference locale', () => {
        appConfig.config.languages = languages;

        userPreferencesService.locale = 'fake-key-2';

        fixture.detectChanges();
        component.changeLanguage(languages[0]);

        expect(userPreferencesService.locale).toEqual(languages[0].key);
    });

    it('should set text orientation when laguage direction is declared', () => {
        appConfig.config.languages = languages;
        userPreferencesService.locale = 'fake-key-1';
        const spy = spyOn(userPreferencesService, 'set');
        fixture.detectChanges();

        component.changeLanguage(languages[2]);
        expect(spy.calls.mostRecent().args[0]).toBe('textOrientation', 'rtl');
    });

    it('should change text orientation to default when laguage direction is not declared', () => {
        appConfig.config.languages = languages;
        userPreferencesService.locale = 'fake-key-1';
        const spy = spyOn(userPreferencesService, 'set');
        fixture.detectChanges();

        component.changeLanguage(languages[1]);
        expect(spy.calls.mostRecent().args[0]).toBe('textOrientation', 'ltr');
    });
});
