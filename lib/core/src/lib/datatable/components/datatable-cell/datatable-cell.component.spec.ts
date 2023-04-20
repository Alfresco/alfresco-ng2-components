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

import { UserPreferencesService } from '../../../common/services/user-preferences.service';
import { AppConfigService } from '../../../app-config';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '../../../testing';
import { DateCellComponent } from '../date-cell/date-cell.component';

describe('DateCellComponent', () => {
    let appConfigService: AppConfigService;
    let userPreferencesService: UserPreferencesService;
    let fixture: ComponentFixture<DateCellComponent>;
    let component: DateCellComponent;
    let getLocaleSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule
            ],
            declarations: [DateCellComponent]
        });
        appConfigService = TestBed.inject(AppConfigService);
        userPreferencesService = TestBed.inject(UserPreferencesService);

        getLocaleSpy = spyOn(userPreferencesService, 'select').and.callThrough();
        appConfigService.config = {
            dateValues: {
                defaultDateFormat: 'mediumDate',
                defaultTooltipDateFormat: 'medium'
            }
        };
        fixture = TestBed.createComponent(DateCellComponent);
        component = fixture.componentInstance;
    });

    it('should read locale from user preferences service', () => {
        expect(getLocaleSpy).toHaveBeenCalledWith('locale');
        expect(component.currentLocale).toEqual('en');
    });

    it('should read date format values from app config service', () => {
        expect(component.format).toEqual('mediumDate');
        expect(component.tooltipDateFormat).toEqual('medium');
    });

    it('should date values be formatted based on the formats defined in the app config', () => {
        component.value$.next('2022-07-14T11:50:45.973+0000');
        component.tooltip = '2022-07-14T11:50:45.973+0000';
        fixture.detectChanges();
        const dateCellValue = fixture.nativeElement.querySelector('.adf-datatable-cell-value');
        const tooltipValue = dateCellValue.attributes['title'].value;

        expect(dateCellValue.textContent.trim()).toEqual('Jul 14, 2022');
        expect(tooltipValue).toEqual('Jul 14, 2022, 11:50:45 AM');
    });
});
