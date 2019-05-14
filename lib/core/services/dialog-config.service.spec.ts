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
import { DialogConfigService } from './dialog-config.service';
import { CoreTestingModule } from '../testing/core.testing.module';
import { setupTestBed } from '../testing/setupTestBed';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { UserPreferencesService } from './user-preferences.service';
import { Direction } from '@angular/cdk/bidi';

describe('DialogConfigService', () => {
    let matDialogConfig: MatDialogConfig;
    let userPreferencesService: UserPreferencesService;
    let matDialogGlobalOptions: MatDialogConfig;

    setupTestBed({
        imports: [CoreTestingModule],
        providers: [
            DialogConfigService,
            UserPreferencesService,
            {
                provide: MAT_DIALOG_DEFAULT_OPTIONS,
                useValue: MAT_DIALOG_DEFAULT_OPTIONS
            }
        ]
    });

    beforeEach(() => {
        userPreferencesService = TestBed.get(UserPreferencesService);
        matDialogConfig = TestBed.get(MatDialogConfig);
        matDialogGlobalOptions = TestBed.get(MAT_DIALOG_DEFAULT_OPTIONS);
    });

    it('should load custom defaults', () => {
        expect(matDialogConfig).toEqual(jasmine.objectContaining({
            autoFocus: true,
            closeOnNavigation: true
        }));
    });

    it('should set dialog direction option on textOrientation event', () => {
        userPreferencesService.set('textOrientation', 'rtl');

        expect(matDialogGlobalOptions).toEqual(jasmine.objectContaining({
            direction: <Direction> 'rtl'
        }));

        userPreferencesService.set('textOrientation', 'ltr');

        expect(matDialogGlobalOptions).toEqual(jasmine.objectContaining({
            direction: <Direction> 'ltr'
        }));
    });
});
