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
import { BooleanCellComponent } from './boolean-cell.component';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';

describe('BooleanCellComponent', () => {
    let component: BooleanCellComponent;
    let fixture: ComponentFixture<BooleanCellComponent>;
    let valueEl: HTMLElement;

    const renderAndGetResult = async (value: any) => {
        component.value$.next(value);
        fixture.detectChanges();
        return valueEl.textContent.trim();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BooleanCellComponent]
        });
        fixture = TestBed.createComponent(BooleanCellComponent);
        component = fixture.componentInstance;
        valueEl = fixture.nativeElement.querySelector('span');
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

        it('should setup initial value', () => {
            component.column = dataTableAdapter.getColumns()[0];
            component.row = dataTableAdapter.getRows()[0];
            component.data = dataTableAdapter;

            fixture.detectChanges();

            expect(nextSpy).toHaveBeenCalledOnceWith(rowData.value);
        });

        it('should NOT setup initial value', () => {
            fixture.detectChanges();

            expect(nextSpy).not.toHaveBeenCalled();
        });
    });

    describe('UI', () => {
        describe('should render "true" inside cell when', () => {
            it('boolean value is true', async () => {
                const result = await renderAndGetResult(true);
                expect(result).toBe('true');
            });

            it('exact string is provided', async () => {
                const result = await renderAndGetResult('true');
                expect(result).toBe('true');
            });
        });

        describe('should render "false" inside cell when', () => {
            it('boolean value is false', async () => {
                const result = await renderAndGetResult(false);
                expect(result).toBe('false');
            });

            it('exact string is provided', async () => {
                const result = await renderAndGetResult('false');
                expect(result).toBe('false');
            });
        });

        describe('should NOT render value inside cell in case of', () => {
            it('invalid string', async () => {
                const result = await renderAndGetResult('tru');
                expect(result).toBe('');
            });

            it('number', async () => {
                const result = await renderAndGetResult(0);
                expect(result).toBe('');
            });

            it('object', async () => {
                const result = await renderAndGetResult({});
                expect(result).toBe('');
            });

            it('null', async () => {
                const result = await renderAndGetResult(null);
                expect(result).toBe('');
            });

            it('undefined', async () => {
                const result = await renderAndGetResult(undefined);
                expect(result).toBe('');
            });

            it('empty string', async () => {
                const result = await renderAndGetResult('');
                expect(result).toBe('');
            });

            it('NaN', async () => {
                const result = await renderAndGetResult(NaN);
                expect(result).toBe('');
            });
        });
    });
});
