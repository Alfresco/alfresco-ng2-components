/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreTestingModule } from '../../../testing';
import { FormFieldModel, FormModel } from '../widgets';
import { FormSectionComponent } from './form-section.component';
import { mockSectionWithFields } from '../mock/form-renderer.component.mock';

describe('FormFieldComponent', () => {
    let fixture: ComponentFixture<FormSectionComponent>;
    let component: FormSectionComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        fixture = TestBed.createComponent(FormSectionComponent);
        component = fixture.componentInstance;
    });

    it('should calculate the correct width for section columns', () => {
        const numberOfColumns = 3;
        const columnField = { colspan: 2 } as FormFieldModel;

        const width = component.getSectionColumnWidth(numberOfColumns, [columnField]);
        expect(width).toBe('66.66666666666667');
    });

    it('should handle columns with no colspan defined', () => {
        const numberOfColumns = 3;
        const columnField = {} as FormFieldModel;

        const width = component.getSectionColumnWidth(numberOfColumns, [columnField]);
        expect(width).toBe('33.333333333333336');
    });

    it('should display fields inside sections', () => {
        const sectionField = new FormFieldModel(new FormModel(), mockSectionWithFields);
        fixture.componentRef.setInput('field', sectionField);
        fixture.detectChanges();

        const sectionFields = fixture.nativeElement.querySelectorAll('.adf-grid-list-section-column-view-item adf-form-field');
        expect(sectionFields.length).toBe(2);
    });
});
