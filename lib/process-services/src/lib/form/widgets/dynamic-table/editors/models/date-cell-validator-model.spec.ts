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

import { DateCellValidator } from './date-cell-validator-model';
import { DynamicTableColumn } from './dynamic-table-column.model';
import { DynamicTableRow } from './dynamic-table-row.model';
import { DynamicRowValidationSummary } from './dynamic-row-validation-summary.model';

describe('DateCellValidator', () => {
    let validator: DateCellValidator;

    beforeEach(() => {
        validator = new DateCellValidator();
    });

    it('should require column to validate', () => {
        expect(validator.isSupported(null)).toBeFalse();
    });

    it('should support only editable columns', () => {
        const readonly = { editable: false, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        expect(validator.isSupported(readonly)).toBeFalse();

        const editable =  { editable: true, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        expect(validator.isSupported(editable)).toBeTrue();
    });

    it('should support only date column type', () => {
        const date = { editable: true, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        expect(validator.isSupported(date)).toBeTrue();

        const unsupported = { editable: true, type: 'unknown' } as DynamicTableColumn;
        expect(validator.isSupported(unsupported)).toBeFalse();
    });

    it('should skip validating unsupported columns', () => {
        const column = { editable: true, type: 'unknown' } as DynamicTableColumn;
        const row = {} as DynamicTableRow;

        expect(validator.validate(row, column)).toBeTrue();
    });

    it('should reject when required column has no value', () => {
        const column = { id: 'col1', required: true,  editable: true, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        const row = { value: { col1: null } } as DynamicTableRow;

        expect(validator.validate(row, column)).toBeFalse();
    });

    it('should approve when optional column has no value', () => {
        const column = { id: 'col1', required: false, editable: true, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        const row = { value: { col1: null } } as DynamicTableRow;

        expect(validator.validate(row, column)).toBeTrue();
    });

    it('should approve the valid datetime value', () => {
        const column = { id: 'col1', required: true, editable: true, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        const row = { value: { col1: '2023-10-12T10:59:24.773Z' } } as DynamicTableRow;

        expect(validator.validate(row, column)).toBeTrue();
    });

    it('should reject invalid datetime value', () => {
        const column = { id: 'col1', required: true, editable: true, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        const row = { value: { col1: '!2023-10-12T10:59:24.773Z' } } as DynamicTableRow;

        expect(validator.validate(row, column)).toBeFalse();
    });

    it('should update validation summary of rejection', () => {
        const column = { id: 'col1', name: 'created_on', required: true, editable: true, type: DateCellValidator.DATE_TYPE } as DynamicTableColumn;
        const row = { value: { col1: '!2023-10-12T10:59:24.773Z' } } as DynamicTableRow;
        const summary = new DynamicRowValidationSummary();

        expect(validator.validate(row, column, summary)).toBeFalse();
        expect(summary.isValid).toBeFalse();
        expect(summary.message).toBe(`Invalid 'created_on' format.`);
    });
});
