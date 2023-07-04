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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SearchFilterTabbedComponent } from './search-filter-tabbed.component';

fdescribe('SearchFilterTabbedComponent', () => {
    let component: SearchFilterTabbedComponent;
    let fixture: ComponentFixture<SearchFilterTabbedComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchFilterTabbedComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });
        fixture = TestBed.createComponent(SearchFilterTabbedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should emit a single combined query when multiple queries are provided', () => {
        spyOn(component.queriesCombined, 'emit');
        component.queries = {
            testField1: 'test-query-1',
            testField2: 'test-query-2',
            testField3: 'test-query-3'
        };
        fixture.detectChanges();
        expect(component.queriesCombined.emit).toHaveBeenCalledWith('test-query-1 AND test-query-2 AND test-query-3');
    });

    it ('should emit a single combined value to display when multiple display values are provided', () => {
        spyOn(component.valuesToDisplayCombined, 'emit');
        component.settings = {
            field: 'testField1, testField2, testField3',
            displayedLabelsByField: {
                testField1: 'Field 1',
                testField2: 'Field 2',
                testField3: 'Field 3'
            }
        };
        component.valuesToDisplay = {
           testField1: 'test-display-value-1',
           testField2: 'test-display-value-2',
           testField3: 'test-display-value-3'
       };
       fixture.detectChanges();
       expect(component.valuesToDisplayCombined.emit).toHaveBeenCalledWith('FIELD 1: test-display-value-1 FIELD 2: test-display-value-2 FIELD 3: test-display-value-3');
    });

    it('should emit translated display labels by field when settings are set', () => {
        spyOn(component.displayedLabelsByFieldTranslated, 'emit');
        component.settings = {
            field: 'testField1, testField2, testField3',
            displayedLabelsByField: {
                testField1: 'Field 1',
                testField2: 'Field 2',
                testField3: 'Field 3'
            }
        };
        fixture.detectChanges();
        const displayedLabelsMap = {
            testField1: 'Field 1',
            testField2: 'Field 2',
            testField3: 'Field 3'
        };
        expect(component.displayedLabelsByFieldTranslated.emit).toHaveBeenCalledWith(displayedLabelsMap);
    });

    it('should emit an array of fields when all the fields are provided in a combined string via settings', () => {
       spyOn(component.fieldsChanged, 'emit');
       component.settings = {
           field: 'testField1, testField2, testField3'
       };
       fixture.detectChanges();
       expect(component.fieldsChanged.emit).toHaveBeenCalledWith(['testField1', 'testField2', 'testField3']);
    });
});
