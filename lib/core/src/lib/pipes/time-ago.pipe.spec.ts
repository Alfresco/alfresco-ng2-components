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

import { TimeAgoPipe } from './time-ago.pipe';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferencesService } from '../common/services/user-preferences.service';
import { of } from 'rxjs';
import { Injector, runInInjectionContext } from '@angular/core';

describe('TimeAgoPipe', () => {
    let pipe: TimeAgoPipe;
    let userPreferences: UserPreferencesService;

    beforeEach(() => {
        userPreferences = TestBed.inject(UserPreferencesService);
        const injector = TestBed.inject(Injector);
        spyOn(userPreferences, 'select').and.returnValue(of(''));
        runInInjectionContext(injector, () => {
            pipe = new TimeAgoPipe(userPreferences, TestBed.inject(AppConfigService));
        });
    });

    it('should return time difference for a given date', () => {
        const date = new Date();
        expect(pipe.transform(date)).toBe('less than a minute ago');
    });

    it('should return exact date if given date is more than seven days ', () => {
        const date = new Date('1990-11-03T15:25:42.749');
        expect(pipe.transform(date)).toBe('03/11/1990 15:25');
    });

    it('should return empty string if given date is empty', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    describe('When a locale is given', () => {
        it('should return a localised message', () => {
            const date = new Date();
            const transformedDate = pipe.transform(date, 'de');
            /* cspell:disable-next-line */
            expect(transformedDate).toBe('vor weniger als 1 Minute');
        });
    });
});
