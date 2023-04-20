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

import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CoreModule } from '@alfresco/adf-core';
import { RowEditorComponent } from './editors/row-editor/row.editor';
import { DynamicTableWidgetComponent } from './dynamic-table.widget';
import { DropdownEditorComponent } from './editors/dropdown/dropdown.editor';
import { DateTimeEditorComponent } from './editors/datetime/datetime.editor';
import { DateEditorComponent } from './editors/date/date.editor';
import { BooleanEditorComponent } from './editors/boolean/boolean.editor';
import { AmountEditorComponent } from './editors/amount/amount.editor';
import { TextEditorComponent } from './editors/text/text.editor';

@NgModule({
    imports: [
        CoreModule,
        MaterialModule
    ],
    declarations: [
        AmountEditorComponent,
        BooleanEditorComponent,
        DateEditorComponent,
        DateTimeEditorComponent,
        DropdownEditorComponent,
        RowEditorComponent,
        DynamicTableWidgetComponent,
        TextEditorComponent
    ],
    exports: [
        DynamicTableWidgetComponent,
        RowEditorComponent
    ]
})
export class DynamicTableModule {
}
