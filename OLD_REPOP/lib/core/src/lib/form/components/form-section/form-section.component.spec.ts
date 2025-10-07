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
import { UnitTestingUtils, NoopTranslateModule } from '../../../testing';
import { FormFieldModel, FormModel } from '../widgets';
import { FormSectionComponent } from './form-section.component';
import { mockSectionWithFields } from '../mock/form-renderer.component.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormSectionComponent', () => {
    let fixture: ComponentFixture<FormSectionComponent>;
    let component: FormSectionComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormSectionComponent, NoopTranslateModule, NoopAnimationsModule]
        });
        fixture = TestBed.createComponent(FormSectionComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
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

    it('should display fields inside section', () => {
        const sectionField = new FormFieldModel(new FormModel(), mockSectionWithFields);
        fixture.componentRef.setInput('field', sectionField);
        fixture.detectChanges();

        const sectionFields = testingUtils.getAllByCSS('.adf-grid-list-section-column-view-item adf-form-field');
        expect(sectionFields.length).toBe(2);
    });

    describe('getSectionColumnWidth', () => {
        it('should cap width at 100% when numberOfColumns is not a number', () => {
            const columnField = { colspan: 2 } as FormFieldModel;

            const width = component.getSectionColumnWidth('invalid' as unknown as number, [columnField]);
            expect(width).toBe('100');
        });

        it('should cap width at 100% when numberOfColumns is null', () => {
            const columnField = { colspan: 3 } as FormFieldModel;

            const width = component.getSectionColumnWidth(null as unknown as number, [columnField]);
            expect(width).toBe('100');
        });

        it('should return 100% when numberOfColumns is undefined', () => {
            const columnField = { colspan: 1 } as FormFieldModel;

            const width = component.getSectionColumnWidth(undefined as unknown as number, [columnField]);
            expect(width).toBe('100');
        });

        it('should cap width at 100% when numberOfColumns is 0', () => {
            const columnField = { colspan: 2 } as FormFieldModel;

            const width = component.getSectionColumnWidth(0, [columnField]);
            expect(width).toBe('100');
        });

        it('should cap width at 100% when numberOfColumns is negative', () => {
            const columnField = { colspan: 3 } as FormFieldModel;

            const width = component.getSectionColumnWidth(-1, [columnField]);
            expect(width).toBe('100');
        });

        it('should return 100 when numberOfColumns is falsy and no colspan is defined', () => {
            const columnField = {} as FormFieldModel;

            const width = component.getSectionColumnWidth(null as unknown as number, [columnField]);
            expect(width).toBe('100');
        });

        it('should calculate percentage width when numberOfColumns is a valid number', () => {
            const numberOfColumns = 4;
            const columnField = { colspan: 2 } as FormFieldModel;

            const width = component.getSectionColumnWidth(numberOfColumns, [columnField]);
            expect(width).toBe('50');
        });

        it('should cap width at 100% when colspan exceeds numberOfColumns', () => {
            const numberOfColumns = 2;
            const columnField = { colspan: 5 } as FormFieldModel;

            const width = component.getSectionColumnWidth(numberOfColumns, [columnField]);
            expect(width).toBe('100');
        });

        it('should use default colspan of 1 when field has no colspan and numberOfColumns is valid', () => {
            const numberOfColumns = 5;
            const columnField = {} as FormFieldModel;

            const width = component.getSectionColumnWidth(numberOfColumns, [columnField]);
            expect(width).toBe('20');
        });

        it('should handle empty columnFields array', () => {
            const numberOfColumns = 3;

            const width = component.getSectionColumnWidth(numberOfColumns, []);
            expect(parseFloat(width)).toBeCloseTo(33.33);
        });

        it('should use first field colspan when multiple fields are provided', () => {
            const numberOfColumns = 2;
            const columnFields = [{ colspan: 1 } as FormFieldModel, { colspan: 3 } as FormFieldModel];

            const width = component.getSectionColumnWidth(numberOfColumns, columnFields);
            expect(width).toBe('50');
        });
    });
});
