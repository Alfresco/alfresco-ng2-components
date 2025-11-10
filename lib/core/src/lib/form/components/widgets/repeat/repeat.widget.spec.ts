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
import { ContainerModel } from '../core/container.model';
import { FormFieldModel } from '../core/form-field.model';
import { RepeatWidgetComponent } from './repeat.widget';
import { FormModel } from '../core';
import { UnitTestingUtils } from '../../../../testing';

describe('RepeatWidgetComponent', () => {
    let component: RepeatWidgetComponent;
    let fixture: ComponentFixture<RepeatWidgetComponent>;
    let testingUtils: UnitTestingUtils;

    /**
     *
     * @param initialNumberOfRows initial number of rows
     * @param maxNumberOfRows maximum number of rows
     * @param allowInitialRowsDelete should allow deleting rows
     * @returns repeatable section json based on params
     */
    function getFormFieldJson(initialNumberOfRows: number = 2, maxNumberOfRows?: number, allowInitialRowsDelete: boolean = true) {
        return {
            id: 'RepeatableSection0tbw2y',
            name: 'Repeatable Section',
            type: 'repeatable-section',
            tab: null,
            params: {
                initialNumberOfRows,
                allowInitialRowsDelete,
                maxNumberOfRows
            },
            numberOfColumns: 2,
            fields: {
                '1': [
                    {
                        id: 'Text0wwp7n',
                        name: 'Text',
                        type: 'text',
                        readOnly: false,
                        required: false,
                        colspan: 1,
                        rowspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        regexPattern: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                '2': [
                    {
                        id: 'Integer0rzkwq',
                        name: 'Integer',
                        type: 'integer',
                        readOnly: false,
                        colspan: 1,
                        rowspan: 1,
                        placeholder: null,
                        minValue: null,
                        maxValue: null,
                        required: false,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        };
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepeatWidgetComponent]
        });

        fixture = TestBed.createComponent(RepeatWidgetComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    describe('is editor', () => {
        it('should NOT display add row button or row limit', () => {
            component.element = new ContainerModel(new FormFieldModel(new FormModel(), getFormFieldJson()));

            fixture.detectChanges();

            expect(testingUtils.getByCSS('button.adf-container-widget-row-action')).toBeFalsy();
            expect(testingUtils.getByCSS('span.adf-container-widget-row-action')).toBeFalsy();
        });
    });

    describe('is NOT editor', () => {
        beforeEach(() => {
            component.isEditor = false;
        });

        it('should display add row button if no limit is defined', () => {
            component.element = new ContainerModel(new FormFieldModel(new FormModel(), getFormFieldJson()));

            fixture.detectChanges();

            expect(testingUtils.getByCSS('button.adf-container-widget-row-action')).toBeTruthy();
            expect(testingUtils.getByCSS('span.adf-container-widget-row-action')).toBeFalsy();
        });

        it('should display add row button if limit is defined but not reached', () => {
            component.element = new ContainerModel(new FormFieldModel(new FormModel(), getFormFieldJson(2, 3)));

            fixture.detectChanges();

            expect(testingUtils.getByCSS('button.adf-container-widget-row-action')).toBeTruthy();
            expect(testingUtils.getByCSS('span.adf-container-widget-row-action')).toBeFalsy();
        });

        it('should NOT display add row button if limit is defined and reached', () => {
            component.element = new ContainerModel(new FormFieldModel(new FormModel(), getFormFieldJson(2, 2)));
            spyOn(component, 'getAddedRowsCount').and.returnValue(1);

            fixture.detectChanges();

            expect(testingUtils.getByCSS('button.adf-container-widget-row-action')).toBeFalsy();
            expect(testingUtils.getByCSS('span.adf-container-widget-row-action')).toBeTruthy();
        });

        it('should display row limit if limit has been reached', () => {
            component.element = new ContainerModel(new FormFieldModel(new FormModel(), getFormFieldJson(2, 2)));
            spyOn(component, 'getAddedRowsCount').and.returnValue(1);

            fixture.detectChanges();

            expect(testingUtils.getByCSS('span.adf-container-widget-row-action')).toBeTruthy();
            expect(testingUtils.getByCSS('span.adf-container-widget-row-action').nativeElement.textContent.trim()).toBe(
                'FORM.FIELD.REPEATABLE_SECTION.ROW_LIMIT_REACHED'
            );
        });

        it('should add row when add row button is clicked', () => {
            component.element = new ContainerModel(new FormFieldModel(new FormModel(), getFormFieldJson()));
            spyOn(component, 'addRow').and.callThrough();

            fixture.detectChanges();

            testingUtils.clickByCSS('button.adf-container-widget-row-action');
            expect(component.addRow).toHaveBeenCalled();
        });
    });
});
