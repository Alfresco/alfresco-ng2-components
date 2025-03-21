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

import { DropdownEditorComponent } from './editors/dropdown/dropdown.editor';
import { AmountEditorComponent } from './editors/amount/amount.editor';
import { BooleanEditorComponent } from './editors/boolean/boolean.editor';
import { DateEditorComponent } from './editors/date/date.editor';
import { RowEditorComponent } from './editors/row-editor/row.editor';
import { TextEditorComponent } from './editors/text/text.editor';
import { DateTimeEditorComponent } from './editors/datetime/datetime.editor';
import { DynamicTableWidgetComponent } from './dynamic-table.widget';

export * from './editors/dropdown/dropdown.editor';
export * from './editors/amount/amount.editor';
export * from './editors/boolean/boolean.editor';
export * from './editors/date/date.editor';
export * from './editors/datetime/datetime.editor';
export * from './editors/row-editor/row.editor';
export * from './editors/text/text.editor';
export * from './editors/models/dynamic-table-row.model';
export * from './dynamic-table.widget';

export const DYNAMIC_TABLE_WIDGET_DIRECTIVES = [
    DynamicTableWidgetComponent,
    DropdownEditorComponent,
    AmountEditorComponent,
    BooleanEditorComponent,
    DateEditorComponent,
    DateTimeEditorComponent,
    RowEditorComponent,
    TextEditorComponent
] as const;
