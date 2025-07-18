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
import { FormFieldModel, FormFieldTypes, FormModel, FormService } from '@alfresco/adf-core';
import { DynamicTableColumn } from './editors/models/dynamic-table-column.model';
import { DynamicTableRow } from './editors/models/dynamic-table-row.model';
import { DynamicTableWidgetComponent } from './dynamic-table.widget';
import { DynamicTableModel } from './editors/models/dynamic-table.widget.model';

const fakeFormField = {
    id: 'fake-dynamic-table',
    name: 'fake-label',
    value: [{ 1: 1, 2: 2, 3: 4 }],
    required: false,
    readOnly: false,
    overrideId: false,
    colspan: 1,
    placeholder: null,
    minLength: 0,
    maxLength: 0,
    params: {
        existingColspan: 1,
        maxColspan: 1
    },
    sizeX: 2,
    sizeY: 2,
    row: -1,
    col: -1,
    columnDefinitions: [
        {
            id: 1,
            name: 1,
            type: 'String',
            visible: true
        },
        {
            id: 2,
            name: 2,
            type: 'String',
            visible: true
        },
        {
            id: 3,
            name: 3,
            type: 'String',
            visible: true
        }
    ]
};

describe('DynamicTableWidgetComponent', () => {
    let widget: DynamicTableWidgetComponent;
    let fixture: ComponentFixture<DynamicTableWidgetComponent>;
    let element: HTMLElement;
    let table: DynamicTableModel;
    let formService: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DynamicTableWidgetComponent]
        });
        const field = new FormFieldModel(new FormModel());
        formService = TestBed.inject(FormService);
        table = new DynamicTableModel(field, formService);
        const changeDetectorSpy = jasmine.createSpyObj('cd', ['detectChanges']);
        const nativeElementSpy = jasmine.createSpyObj('nativeElement', ['querySelector']);
        changeDetectorSpy.nativeElement = nativeElementSpy;
        const elementRefSpy = jasmine.createSpyObj('elementRef', ['']);
        elementRefSpy.nativeElement = nativeElementSpy;

        fixture = TestBed.createComponent(DynamicTableWidgetComponent);
        element = fixture.nativeElement;
        widget = fixture.componentInstance;
        widget.content = table;
        widget.field = field;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should select row on click', () => {
        const row = { selected: false } as DynamicTableRow;
        widget.onRowClicked(row);

        expect(row.selected).toBeTruthy();
        expect(widget.content.selectedRow).toBe(row);
    });

    it('should require table to select clicked row', () => {
        const row = { selected: false } as DynamicTableRow;
        widget.content = null;
        widget.onRowClicked(row);

        expect(row.selected).toBeFalsy();
    });

    it('should set readOnly to true when field type is readonly', () => {
        widget.field.type = 'readonly';
        widget.ngOnInit();
        expect(widget.readOnly).toBeTrue();
    });

    it('should reset selected row', () => {
        const row = { selected: false } as DynamicTableRow;
        widget.content.rows.push(row);
        widget.content.selectedRow = row;
        expect(widget.content.selectedRow).toBe(row);
        expect(row.selected).toBeTruthy();

        widget.onRowClicked(null);
        expect(widget.content.selectedRow).toBeNull();
        expect(row.selected).toBeFalsy();
    });

    it('should check selection', () => {
        const row = { selected: false } as DynamicTableRow;
        widget.content.rows.push(row);
        widget.content.selectedRow = row;
        expect(widget.hasSelection()).toBeTruthy();

        widget.content.selectedRow = null;
        expect(widget.hasSelection()).toBeFalsy();

        widget.content = null;
        expect(widget.hasSelection()).toBeFalsy();
    });

    it('should require table to move selection up', () => {
        widget.content = null;
        expect(widget.moveSelectionUp()).toBeFalsy();
    });

    it('should move selection up', () => {
        const row1 = {} as DynamicTableRow;
        const row2 = {} as DynamicTableRow;
        widget.content.rows.push(...[row1, row2]);
        widget.content.selectedRow = row2;

        expect(widget.moveSelectionUp()).toBeTruthy();
        expect(widget.content.rows.indexOf(row2)).toBe(0);
    });

    it('should require table to move selection down', () => {
        widget.content = null;
        expect(widget.moveSelectionDown()).toBeFalsy();
    });

    it('should move selection down', () => {
        const row1 = {} as DynamicTableRow;
        const row2 = {} as DynamicTableRow;
        widget.content.rows.push(...[row1, row2]);
        widget.content.selectedRow = row1;

        expect(widget.moveSelectionDown()).toBeTruthy();
        expect(widget.content.rows.indexOf(row1)).toBe(1);
    });

    it('should require table to delete selection', () => {
        widget.content = null;
        expect(widget.deleteSelection()).toBeFalsy();
    });

    it('should delete selected row', () => {
        const row = {} as DynamicTableRow;
        widget.content.rows.push(row);
        widget.content.selectedRow = row;
        widget.deleteSelection();
        expect(widget.content.rows.length).toBe(0);
    });

    it('should require table to add new row', () => {
        widget.content = null;
        expect(widget.addNewRow()).toBeFalsy();
    });

    it('should start editing new row', () => {
        expect(widget.editMode).toBeFalsy();
        expect(widget.editRow).toBeNull();

        expect(widget.addNewRow()).toBeTruthy();
        expect(widget.editRow).not.toBeNull();
        expect(widget.editMode).toBeTruthy();
    });

    it('should require table to edit selected row', () => {
        widget.content = null;
        expect(widget.editSelection()).toBeFalsy();
    });

    it('should start editing selected row', () => {
        expect(widget.editMode).toBeFalsy();
        expect(widget.editRow).toBeFalsy();

        const row = { value: true } as DynamicTableRow;
        widget.content.selectedRow = row;

        expect(widget.editSelection()).toBeTruthy();
        expect(widget.editMode).toBeTruthy();
        expect(widget.editRow).not.toBeNull();
        expect(widget.editRow.value).toEqual(row.value);
    });

    it('should copy row', () => {
        const row = { value: { opt: { key: '1', value: 1 } } } as DynamicTableRow;
        const copy = widget.copyRow(row);
        expect(copy.value).toEqual(row.value);
    });

    it('should require table to retrieve cell value', () => {
        widget.content = null;
        expect(widget.getCellValue(null, null)).toBeNull();
    });

    it('should retrieve cell value', () => {
        const value = '<value>';
        const row = { value: { key: value } } as DynamicTableRow;
        const column = { id: 'key' } as DynamicTableColumn;

        expect(widget.getCellValue(row, column)).toBe(value);
    });

    it('should save changes and add new row', () => {
        const row = { isNew: true, value: { key: 'value' } } as DynamicTableRow;
        widget.editMode = true;
        widget.editRow = row;

        widget.onSaveChanges();

        expect(row.isNew).toBeFalsy();
        expect(widget.content.selectedRow).toBeNull();
        expect(widget.content.rows.length).toBe(1);
        expect(widget.content.rows[0].value).toEqual(row.value);
    });

    it('should save changes and update row', () => {
        const row = { isNew: false, value: { key: 'value' } } as DynamicTableRow;
        widget.editMode = true;
        widget.editRow = row;
        widget.content.selectedRow = row;

        widget.onSaveChanges();
        expect(widget.content.selectedRow.value).toEqual(row.value);
    });

    it('should require table to save changes', () => {
        widget.editMode = true;
        widget.content = null;
        widget.onSaveChanges();

        expect(widget.editMode).toBeFalsy();
    });

    it('should cancel changes', () => {
        widget.editMode = true;
        widget.editRow = {} as DynamicTableRow;
        widget.onCancelChanges();

        expect(widget.editMode).toBeFalsy();
        expect(widget.editRow).toBeNull();
    });

    it('should be valid by default', () => {
        widget.content.field = null;
        expect(widget.isValid()).toBeTruthy();

        widget.content = null;
        expect(widget.isValid()).toBeTruthy();
    });

    it('should take validation state from underlying field', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.DYNAMIC_TABLE,
            required: true,
            value: null
        });
        widget.content = new DynamicTableModel(field, formService);

        expect(widget.content.field.validate()).toBeFalsy();
        expect(widget.isValid()).toBe(widget.content.field.isValid);
        expect(widget.content.field.isValid).toBeFalsy();

        widget.content.field.value = [{}];

        expect(widget.content.field.validate()).toBeTruthy();
        expect(widget.isValid()).toBe(widget.content.field.isValid);
        expect(widget.content.field.isValid).toBeTruthy();
    });

    it('should prepend default currency for amount columns', () => {
        const row = { value: { key: '100' } } as DynamicTableRow;
        const column = { id: 'key', type: 'Amount' } as DynamicTableColumn;
        const actual = widget.getCellValue(row, column);
        expect(actual).toBe('$ 100');
    });

    it('should prepend custom currency for amount columns', () => {
        const row = { value: { key: '100' } } as DynamicTableRow;
        const column = { id: 'key', type: 'Amount', amountCurrency: 'GBP' } as DynamicTableColumn;
        const actual = widget.getCellValue(row, column);
        expect(actual).toBe('GBP 100');
    });

    describe('when template is ready', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), fakeFormField);
            widget.field.type = FormFieldTypes.DYNAMIC_TABLE;

            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should select a row when press space bar', async () => {
            const rowElement = element.querySelector('#fake-dynamic-table-row-0');

            expect(element.querySelector('#dynamic-table-fake-dynamic-table')).not.toBeNull();
            expect(rowElement).not.toBeNull();
            expect(rowElement.className).not.toContain('adf-dynamic-table-widget__row-selected');

            const event: any = new Event('keyup');
            event.keyCode = 32;
            rowElement.dispatchEvent(event);

            fixture.detectChanges();
            await fixture.whenStable();

            const selectedRow = element.querySelector('#fake-dynamic-table-row-0');
            expect(selectedRow.className).toContain('adf-dynamic-table-widget__row-selected');
        });

        it('should focus on add button when a new row is saved', async () => {
            const addNewRowButton = element.querySelector<HTMLButtonElement>('#fake-dynamic-table-add-row');

            expect(element.querySelector('#dynamic-table-fake-dynamic-table')).not.toBeNull();
            expect(addNewRowButton).not.toBeNull();

            widget.addNewRow();
            widget.onSaveChanges();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(document.activeElement.id).toBe('fake-dynamic-table-add-row');
        });
    });
});
