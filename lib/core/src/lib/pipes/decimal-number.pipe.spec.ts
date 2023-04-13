/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { UserPreferencesService } from '../common/services/user-preferences.service';
import { of } from 'rxjs';
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { DecimalNumberPipe } from './decimal-number.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('DecimalNumberPipe', () => {

    let pipe: DecimalNumberPipe;
    let userPreferences: UserPreferencesService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        userPreferences = TestBed.inject(UserPreferencesService);
        spyOn(userPreferences, 'select').and.returnValue(of(''));
        pipe = new DecimalNumberPipe(userPreferences, TestBed.inject(AppConfigService));
    });

    it('should return number localized and rounded following the default config', () => {
        expect(pipe.transform(1234.567)).toBe('1,234.57');
    });

    it('should return number with at least the minimum of digints in the integer part', () => {
        const decimalValues = {
            minIntegerDigits: 6,
            minFractionDigits: undefined,
            maxFractionDigits: undefined
        };

        expect(pipe.transform(1234.567, decimalValues)).toBe('001,234.57');
    });

    it('should return number with at least the minimum of digints in the integer part', () => {
        const decimalValues = {
            minIntegerDigits: undefined,
            minFractionDigits: 4,
            maxFractionDigits: 10
        };

        expect(pipe.transform(1234.567, decimalValues)).toBe('1,234.5670');
    });

    it('should return number with at least the minimum of digints in the integer part', () => {
        const decimalValues = {
            minIntegerDigits: undefined,
            minFractionDigits: 0,
            maxFractionDigits: 1
        };

        expect(pipe.transform(1234.567, decimalValues)).toBe('1,234.6');
    });
});
