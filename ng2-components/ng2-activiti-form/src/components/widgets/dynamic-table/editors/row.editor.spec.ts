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

import { RowEditorComponent } from './row.editor';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn, DynamicRowValidationSummary } from './../../core/index';

describe('RowEditorComponent', () => {

    let component: RowEditorComponent;

    beforeEach(() => {
        component = new RowEditorComponent();
        component.table = new DynamicTableModel(null);
        component.row =  <DynamicTableRow> {};
        component.column = <DynamicTableColumn> {};
    });

    it('should be valid upon init', () => {
        expect(component.validationSummary.isValid).toBeTruthy();
        expect(component.validationSummary.text).toBeNull();
    });

    it('should emit [cancel] event', (done) => {
        component.cancel.subscribe(e => {
            expect(e.table).toBe(component.table);
            expect(e.row).toBe(component.row);
            expect(e.column).toBe(component.column);
            done();
        });
        component.onCancelChanges();
    });

    it('should validate row on save', () => {
        spyOn(component.table, 'validateRow').and.callThrough();
        component.onSaveChanges();
        expect(component.table.validateRow).toHaveBeenCalledWith(component.row);
    });

    it('should emit [save] event', (done) => {
        spyOn(component.table, 'validateRow').and.returnValue(
            <DynamicRowValidationSummary> { isValid: true, text: null }
        );
        component.save.subscribe(e => {
            expect(e.table).toBe(component.table);
            expect(e.row).toBe(component.row);
            expect(e.column).toBe(component.column);
            done();
        });
        component.onSaveChanges();
    });

    it('should not emit [save] event for invalid row', () => {
        spyOn(component.table, 'validateRow').and.returnValue(
            <DynamicRowValidationSummary> { isValid: false, text: 'error' }
        );
        let raised = false;
        component.save.subscribe(e => raised = true);
        component.onSaveChanges();
        expect(raised).toBeFalsy();
    });

});
