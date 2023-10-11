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
            expect(component.value).toBe(null);
        });
    });

    describe('UI', () => {
        describe('should render "true" inside cell when', () => {
            it('boolean value is true', () => {
                component.value$.next(true);
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeTruthy();
                expect(booleanCell.textContent.trim()).toBe('true');
            });

            it('exact string is provided', () => {
                component.value$.next('true');
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeTruthy();
                expect(booleanCell.textContent.trim()).toBe('true');
            });
        });

        describe('should render "false" inside cell when', () => {
            it('boolean value is false', () => {
                component.value$.next(false);
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeTruthy();
                expect(booleanCell.textContent.trim()).toBe('false');
            });

            it('exact string is provided', () => {
                component.value$.next('false');
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeTruthy();
                expect(booleanCell.textContent.trim()).toBe('false');
            });
        });

        describe('should NOT render value inside cell in case of', () => {
            it('number', () => {
                component.value$.next(0);
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeFalsy();
            });

            it('object', () => {
                component.value$.next({});
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeFalsy();
            });

            it('null', () => {
                component.value$.next(null);
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeFalsy();
            });

            it('undefined', () => {
                component.value$.next(undefined);
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeFalsy();
            });

            it('empty string', () => {
                component.value$.next('');
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeFalsy();
            });

            it('NaN', () => {
                component.value$.next(NaN);
                fixture.detectChanges();

                const booleanCell = getBooleanCell();

                expect(booleanCell).toBeFalsy();
            });
        });
    });
});
