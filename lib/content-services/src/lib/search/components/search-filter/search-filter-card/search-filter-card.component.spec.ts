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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { SearchFilterCardComponent } from './search-filter-card.component';

describe('SearchFilterCardComponent', () => {
    let component: SearchFilterCardComponent;
    let fixture: ComponentFixture<SearchFilterCardComponent>;

    const mockCategory = {
        id: 'test-id',
        name: 'test-name',
        enabled: true,
        expanded: false,
        component: {
            selector: 'date-range',
            settings: {
                pattern: 'test-pattern',
                field: 'test-field',
                placeholder: 'test-placeholder'
            }
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchFilterCardComponent);
        component = fixture.componentInstance;
        component.category = mockCategory;
        fixture.detectChanges();
    });

    it('should call clear method on clear button click', () => {
        spyOn(component, 'clear');

        const clearButton = fixture.debugElement.nativeElement.querySelector('#clear-filter-button');
        clearButton.click();

        expect(component.clear).toHaveBeenCalled();
    });

    it('should call apply method on apply button click', () => {
        spyOn(component, 'apply');

        const applyButton = fixture.debugElement.nativeElement.querySelector('#apply-filter-button');
        applyButton.click();

        expect(component.apply).toHaveBeenCalled();
    });

    it('should call resetInnerWidget method on clear', () => {
        spyOn(component.widgetContainerComponent, 'resetInnerWidget');

        component.clear();

        expect(component.widgetContainerComponent.resetInnerWidget).toHaveBeenCalled();
    });

    it('should call applyInnerWidget method on apply', () => {
        spyOn(component.widgetContainerComponent, 'applyInnerWidget');

        component.apply();

        expect(component.widgetContainerComponent.applyInnerWidget).toHaveBeenCalled();
    });
});
