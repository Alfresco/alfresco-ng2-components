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
import { DataTableCellComponent } from './datatable-cell.component';
import { DataRow } from '../../data/data-row.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataTableService } from '../../services/datatable.service';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { mockCarsData, mockCarsSchemaDefinition } from '../mocks/datatable.mock';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('DataTableCellComponent', () => {
    let component: DataTableCellComponent;
    let fixture: ComponentFixture<DataTableCellComponent>;
    let dataTableService: DataTableService;
    let testingUtils: UnitTestingUtils;

    const renderTextCell = (value: string, tooltip: string) => {
        component.value$ = new BehaviorSubject<string>(value);
        component.tooltip = tooltip;

        fixture.detectChanges();
    };

    const checkDisplayedText = (expectedText: string) => {
        const displayedText = testingUtils.getByCSS('span').nativeElement.textContent.trim();

        expect(displayedText).toBeTruthy();
        expect(displayedText).toBe(expectedText);
    };

    const checkDisplayedTooltip = (expectedTooltip: string) => {
        const displayedTooltip = testingUtils.getByCSS('span').nativeElement.title;

        expect(displayedTooltip).toBeTruthy();
        expect(displayedTooltip).toBe(expectedTooltip);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataTableCellComponent],
            providers: [DataTableService]
        });

        fixture = TestBed.createComponent(DataTableCellComponent);
        component = fixture.componentInstance;
        dataTableService = TestBed.inject(DataTableService);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    it('should display text and tooltip', () => {
        const row: DataRow = {
            id: '1',
            isSelected: false,
            hasValue: () => true,
            getValue: () => 'hello world',
            obj: 'Initial Value',
            cache: []
        };

        component.row = row;

        renderTextCell('hello world', 'hello world tooltip');

        checkDisplayedText('hello world');
        checkDisplayedTooltip('hello world tooltip');
    });

    it('should update row obj value on data changes', () => {
        const row: DataRow = {
            id: '1',
            isSelected: false,
            hasValue: () => true,
            getValue: () => 'hello world',
            obj: 'Initial Value',
            cache: []
        };

        component.data = new ObjectDataTableAdapter(mockCarsData, mockCarsSchemaDefinition);
        component.column = { key: 'car_name', type: 'text' };
        component.row = row;

        fixture.detectChanges();
        dataTableService.rowUpdate.next({ id: '1', obj: 'New Value' });

        expect(component.row.obj).toBe('New Value');
    });

    it('should truncate display text and not truncate tooltip if configured on column', () => {
        const row: DataRow = {
            id: '1',
            isSelected: false,
            hasValue: () => true,
            getValue: () => 'hello world',
            obj: 'Initial Value',
            cache: []
        };

        component.data = new ObjectDataTableAdapter(mockCarsData, mockCarsSchemaDefinition);
        component.column = { key: 'car_name', type: 'text', maxTextLength: 10 };
        component.row = row;

        fixture.detectChanges();

        checkDisplayedText('hello worl...');
        checkDisplayedTooltip('hello world');
    });
});
