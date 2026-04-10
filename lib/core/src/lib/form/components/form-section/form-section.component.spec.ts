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
        const columns = [{ fields: [{ colspan: 2 } as FormFieldModel] }];

        const width = component.getSectionColumnWidth(numberOfColumns, columns, 0);
        expect(width).toBe('66.66666666666667');
    });

    it('should handle columns with no colspan defined', () => {
        const numberOfColumns = 3;
        const columns = [{ fields: [{} as FormFieldModel] }];

        const width = component.getSectionColumnWidth(numberOfColumns, columns, 0);
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
            const columns = [{ fields: [{ colspan: 2 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth('invalid' as unknown as number, columns, 0);
            expect(width).toBe('100');
        });

        it('should cap width at 100% when numberOfColumns is null', () => {
            const columns = [{ fields: [{ colspan: 3 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(null as unknown as number, columns, 0);
            expect(width).toBe('100');
        });

        it('should return 100% when numberOfColumns is undefined', () => {
            const columns = [{ fields: [{ colspan: 1 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(undefined as unknown as number, columns, 0);
            expect(width).toBe('100');
        });

        it('should cap width at 100% when numberOfColumns is 0', () => {
            const columns = [{ fields: [{ colspan: 2 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(0, columns, 0);
            expect(width).toBe('100');
        });

        it('should cap width at 100% when numberOfColumns is negative', () => {
            const columns = [{ fields: [{ colspan: 3 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(-1, columns, 0);
            expect(width).toBe('100');
        });

        it('should return 100 when numberOfColumns is falsy and no colspan is defined', () => {
            const columns = [{ fields: [{} as FormFieldModel] }];

            const width = component.getSectionColumnWidth(null as unknown as number, columns, 0);
            expect(width).toBe('100');
        });

        it('should calculate percentage width when numberOfColumns is a valid number', () => {
            const numberOfColumns = 4;
            const columns = [{ fields: [{ colspan: 2 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(numberOfColumns, columns, 0);
            expect(width).toBe('50');
        });

        it('should cap width at 100% when colspan exceeds numberOfColumns', () => {
            const numberOfColumns = 2;
            const columns = [{ fields: [{ colspan: 5 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(numberOfColumns, columns, 0);
            expect(width).toBe('100');
        });

        it('should use default colspan of 1 when field has no colspan and numberOfColumns is valid', () => {
            const numberOfColumns = 5;
            const columns = [{ fields: [{} as FormFieldModel] }];

            const width = component.getSectionColumnWidth(numberOfColumns, columns, 0);
            expect(width).toBe('20');
        });

        it('should return default width for an authored empty spacer column', () => {
            const numberOfColumns = 3;
            const columns = [{ fields: [] }, { fields: [{ colspan: 1 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(numberOfColumns, columns, 0);
            expect(width).toBe('33.333333333333336');
        });

        it('should return 0 width for an empty column covered by a previous colspan', () => {
            const numberOfColumns = 4;
            const columns = [{ fields: [{ colspan: 3 } as FormFieldModel] }, { fields: [] }, { fields: [] }, { fields: [] }];

            const width = component.getSectionColumnWidth(numberOfColumns, columns, 1);
            expect(width).toBe('0');
        });

        it('should use max field colspan when multiple fields are provided', () => {
            const numberOfColumns = 2;
            const columns = [{ fields: [{ colspan: 1 } as FormFieldModel, { colspan: 3 } as FormFieldModel] }];

            const width = component.getSectionColumnWidth(numberOfColumns, columns, 0);
            expect(width).toBe('100');
        });
    });
});
