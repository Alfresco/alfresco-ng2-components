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

import {
    FormFieldModel,
    FormModel,
    FormService,
    CoreTestingModule,
    setupTestBed
} from '@alfresco/adf-core';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { RowEditorComponent } from './row.editor';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicRowValidationSummary } from '../models/dynamic-row-validation-summary.model';

describe('RowEditorComponent', () => {

    let component: RowEditorComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        component = new RowEditorComponent();
        const field = new FormFieldModel(new FormModel());
        component.table = new DynamicTableModel(field, new FormService());
        component.row = {} as DynamicTableRow;
        component.column = {} as DynamicTableColumn;
    });

    it('should be valid upon init', () => {
        expect(component.validationSummary.isValid).toBeTruthy();
        expect(component.validationSummary.message).toBe('');
    });

    it('should emit [cancel] event', (done) => {
        component.cancel.subscribe((e) => {
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
            new DynamicRowValidationSummary({isValid: true, message: null})
        );
        component.save.subscribe((event) => {
            expect(event.table).toBe(component.table);
            expect(event.row).toBe(component.row);
            expect(event.column).toBe(component.column);
            done();
        });
        component.onSaveChanges();
    });

    it('should not emit [save] event for invalid row', () => {
        spyOn(component.table, 'validateRow').and.returnValue(
            new DynamicRowValidationSummary({isValid: false, message: 'error'})
        );
        let raised = false;
        component.save.subscribe(() => raised = true);
        component.onSaveChanges();
        expect(raised).toBeFalsy();
    });
});
