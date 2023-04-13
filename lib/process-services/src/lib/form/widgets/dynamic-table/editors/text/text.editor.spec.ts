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

import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { TextEditorComponent } from './text.editor';

describe('TextEditorComponent', () => {

    let editor: TextEditorComponent;

    beforeEach(() => {
        editor = new TextEditorComponent();
    });

    it('should update row value on change', () => {
        const row = { value: {} } as DynamicTableRow;
        const column = { id: 'key' } as DynamicTableColumn;

        const value = '<value>';
        const event = { target: { value } };

        editor.onValueChanged(row, column, event);
        expect(row.value[column.id]).toBe(value);
    });
});
