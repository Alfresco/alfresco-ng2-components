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
import { BooleanCellComponent } from './boolean-cell.component';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';

describe('BooleanCellComponent', () => {
    let component: BooleanCellComponent;
    let fixture: ComponentFixture<BooleanCellComponent>;
    const getBooleanCell = () => fixture.debugElement.nativeElement.querySelector('span');
    const renderAndCheckResult = (value: any, expectedOccurrence: boolean, expectedLabel?: string) => {
        component.value$.next(value);
        fixture.detectChanges();

        const booleanCell = getBooleanCell();

        expectedOccurrence ? expect(booleanCell).toBeTruthy() : expect(booleanCell).toBeFalsy();
        if (expectedLabel) {
            expect(booleanCell.textContent.trim()).toBe(expectedLabel);
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BooleanCellComponent]
        });
        fixture = TestBed.createComponent(BooleanCellComponent);
        component = fixture.componentInstance;
    });

    describe('Initialization', () => {
        let rowData: any;
        let columnData: any;
        let dataTableAdapter: ObjectDataTableAdapter;
        let nextSpy: jasmine.Spy;

        beforeEach(() => {
            rowData = {
                id: '1',
                value: false
            };
            columnData = { type: 'boolean', key: 'value' };
            dataTableAdapter = new ObjectDataTableAdapter([rowData], [new ObjectDataColumn(columnData)]);
            nextSpy = spyOn(component.value$, 'next');
        });

        it('should setup inital value', () => {
            component.column = dataTableAdapter.getColumns()[0];
            component.row = dataTableAdapter.getRows()[0];
            component.data = dataTableAdapter;

            fixture.detectChanges();

            expect(nextSpy).toHaveBeenCalledOnceWith(rowData.value);
        });

        it('should NOT setup inital value', () => {
            fixture.detectChanges();

            expect(nextSpy).not.toHaveBeenCalled();
        });
    });

    describe('UI', () => {
        describe('should render "true" inside cell when', () => {
            it('boolean value is true', () => {
                renderAndCheckResult(true, true, 'true');
            });

            it('exact string is provided', () => {
                renderAndCheckResult('true', true, 'true');
            });
        });

        describe('should render "false" inside cell when', () => {
            it('boolean value is false', () => {
                renderAndCheckResult(false, true, 'false');
            });

            it('exact string is provided', () => {
                renderAndCheckResult('false', true, 'false');
            });
        });

        describe('should NOT render value inside cell in case of', () => {
            it('invalid string', () => {
                renderAndCheckResult('tru', false);
            });

            it('number', () => {
                renderAndCheckResult(0, false);
            });

            it('object', () => {
                renderAndCheckResult({}, false);
            });

            it('null', () => {
                renderAndCheckResult(null, false);
            });

            it('undefined', () => {
                renderAndCheckResult(undefined, false);
            });

            it('empty string', () => {
                renderAndCheckResult('', false);
            });

            it('NaN', () => {
                renderAndCheckResult(NaN, false);
            });
        });
    });
});
