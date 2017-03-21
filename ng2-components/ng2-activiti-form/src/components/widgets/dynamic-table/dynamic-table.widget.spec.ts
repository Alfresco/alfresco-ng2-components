/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LogServiceMock } from 'ng2-alfresco-core';
import { DynamicTableWidget } from './dynamic-table.widget';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn } from './dynamic-table.widget.model';
import { FormModel, FormFieldTypes, FormFieldModel } from './../core/index';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';

describe('DynamicTableWidget', () => {

    let widget: DynamicTableWidget;
    let table: DynamicTableModel;
    let visibilityService: WidgetVisibilityService;
    let logService: LogServiceMock;

    beforeEach(() => {
        logService = new LogServiceMock();
        const field = new FormFieldModel(new FormModel());
        table = new DynamicTableModel(field);
        visibilityService = new WidgetVisibilityService(null, logService);
        widget = new DynamicTableWidget(null, visibilityService, logService);
        widget.content = table;
    });

    it('should select row on click', () => {
        let row = <DynamicTableRow> { selected: false };
        widget.onRowClicked(row);

        expect(row.selected).toBeTruthy();
        expect(widget.content.selectedRow).toBe(row);
    });

    it('should requre table to select clicked row', () => {
        let row = <DynamicTableRow> { selected: false };
        widget.content = null;
        widget.onRowClicked(row);

        expect(row.selected).toBeFalsy();
    });

    it('should reset selected row', () => {
        let row = <DynamicTableRow> { selected: false };
        widget.content.rows.push(row);
        widget.content.selectedRow = row;
        expect(widget.content.selectedRow).toBe(row);
        expect(row.selected).toBeTruthy();

        widget.onRowClicked(null);
        expect(widget.content.selectedRow).toBeNull();
        expect(row.selected).toBeFalsy();
    });

    it('should check selection', () => {
        let row = <DynamicTableRow> { selected: false };
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
        let row1 = <DynamicTableRow> {};
        let row2 = <DynamicTableRow> {};
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
        let row1 = <DynamicTableRow> {};
        let row2 = <DynamicTableRow> {};
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
        let row = <DynamicTableRow> {};
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

        let row = <DynamicTableRow> { value: true };
        widget.content.selectedRow = row;

        expect(widget.editSelection()).toBeTruthy();
        expect(widget.editMode).toBeTruthy();
        expect(widget.editRow).not.toBeNull();
        expect(widget.editRow.value).toEqual(row.value);
    });

    it('should copy row', () => {
        let row = <DynamicTableRow> { value: { opt: { key: '1', value: 1 } } };
        let copy = widget.copyRow(row);
        expect(copy.value).toEqual(row.value);
    });

    it('should require table to retrieve cell value', () => {
        widget.content = null;
        expect(widget.getCellValue(null, null)).toBeNull();
    });

    it('should retrieve cell value', () => {
        const value = '<value>';
        let row = <DynamicTableRow> { value: { key: value } };
        let column = <DynamicTableColumn> { id: 'key' };

        expect(widget.getCellValue(row, column)).toBe(value);
    });

    it('should save changes and add new row', () => {
        let row = <DynamicTableRow> { isNew: true, value: { key: 'value' } };
        widget.editMode = true;
        widget.editRow = row;

        widget.onSaveChanges();

        expect(row.isNew).toBeFalsy();
        expect(widget.content.selectedRow).toBeNull();
        expect(widget.content.rows.length).toBe(1);
        expect(widget.content.rows[0].value).toEqual(row.value);
    });

    it('should save changes and update row', () => {
        let row = <DynamicTableRow> { isNew: false, value: { key: 'value' } };
        widget.editMode = true;
        widget.editRow = row;
        widget.content.selectedRow = row;

        widget.onSaveChanges();
        expect(widget.content.selectedRow.value).toEqual(row.value);
    });

    it('should require table to save changes', () => {
        spyOn(logService, 'error').and.stub();
        widget.editMode = true;
        widget.content = null;
        widget.onSaveChanges();

        expect(widget.editMode).toBeFalsy();
        expect(logService.error).toHaveBeenCalledWith(widget.ERROR_MODEL_NOT_FOUND);
    });

    it('should cancel changes', () => {
        widget.editMode = true;
        widget.editRow = <DynamicTableRow> {};
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
        let form = new FormModel();
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.DYNAMIC_TABLE,
            required: true,
            value: null
        });
        widget.content = new DynamicTableModel(field);

        expect(widget.content.field.validate()).toBeFalsy();
        expect(widget.isValid()).toBe(widget.content.field.isValid);
        expect(widget.content.field.isValid).toBeFalsy();

        widget.content.field.value = [{}];

        expect(widget.content.field.validate()).toBeTruthy();
        expect(widget.isValid()).toBe(widget.content.field.isValid);
        expect(widget.content.field.isValid).toBeTruthy();

    });

    it('should prepend default currency for amount columns', () => {
        let row = <DynamicTableRow> { value: { key: '100' } };
        let column = <DynamicTableColumn> { id: 'key', type: 'Amount' };
        let actual = widget.getCellValue(row, column);
        expect(actual).toBe('$ 100');
    });

    it('should prepend custom currency for amount columns', () => {
        let row = <DynamicTableRow> { value: { key: '100' } };
        let column = <DynamicTableColumn> { id: 'key', type: 'Amount', amountCurrency: 'GBP' };
        let actual = widget.getCellValue(row, column);
        expect(actual).toBe('GBP 100');
    });
});
