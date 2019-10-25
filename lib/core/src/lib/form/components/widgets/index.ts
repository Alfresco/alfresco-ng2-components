/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ContainerWidgetComponent } from './container/container.widget';
import { TabsWidgetComponent } from './tabs/tabs.widget';
import { UnknownWidgetComponent } from './unknown/unknown.widget';

import { AmountWidgetComponent } from './amount/amount.widget';
import { CheckboxWidgetComponent } from './checkbox/checkbox.widget';
import { DateWidgetComponent } from './date/date.widget';
import { DisplayTextWidgetComponent } from './display-text/display-text.widget';
import { DocumentWidgetComponent } from './document/document.widget';
import { DropdownWidgetComponent } from './dropdown/dropdown.widget';
import { DynamicTableWidgetComponent } from './dynamic-table/dynamic-table.widget';
import { BooleanEditorComponent } from './dynamic-table/editors/boolean/boolean.editor';
import { DateEditorComponent } from './dynamic-table/editors/date/date.editor';
import { DateTimeEditorComponent } from './dynamic-table/editors/datetime/datetime.editor';
import { DropdownEditorComponent } from './dynamic-table/editors/dropdown/dropdown.editor';
import { RowEditorComponent } from './dynamic-table/editors/row.editor';
import { TextEditorComponent } from './dynamic-table/editors/text/text.editor';
import { ErrorWidgetComponent } from './error/error.component';
import { FunctionalGroupWidgetComponent } from './functional-group/functional-group.widget';
import { HyperlinkWidgetComponent } from './hyperlink/hyperlink.widget';
import { MultilineTextWidgetComponentComponent } from './multiline-text/multiline-text.widget';
import { NumberWidgetComponent } from './number/number.widget';
import { PeopleWidgetComponent } from './people/people.widget';
import { RadioButtonsWidgetComponent } from './radio-buttons/radio-buttons.widget';
import { InputMaskDirective } from './text/text-mask.component';
import { TextWidgetComponent } from './text/text.widget';
import { TypeaheadWidgetComponent } from './typeahead/typeahead.widget';
import { UploadWidgetComponent } from './upload/upload.widget';
import { DateTimeWidgetComponent } from './date-time/date-time.widget';
import { JsonWidgetComponent } from './json/json.widget';

// core
export * from './widget.component';
export * from './core/index';

// containers
export * from './tabs/tabs.widget';
export * from './container/container.widget';

// primitives
export * from './unknown/unknown.widget';
export * from './text/text.widget';
export * from './number/number.widget';
export * from './checkbox/checkbox.widget';
export * from './multiline-text/multiline-text.widget';
export * from './dropdown/dropdown.widget';
export * from './hyperlink/hyperlink.widget';
export * from './radio-buttons/radio-buttons.widget';
export * from './display-text/display-text.widget';
export * from './upload/upload.widget';
export * from './typeahead/typeahead.widget';
export * from './functional-group/functional-group.widget';
export * from './people/people.widget';
export * from './date/date.widget';
export * from './amount/amount.widget';
export * from './dynamic-table/dynamic-table.widget';
export * from './error/error.component';
export * from './document/document.widget';
export * from './date-time/date-time.widget';
export * from './json/json.widget';

// editors (dynamic table)
export * from './dynamic-table/dynamic-table.widget.model';
export * from './dynamic-table/editors/row.editor';
export * from './dynamic-table/editors/date/date.editor';
export * from './dynamic-table/editors/dropdown/dropdown.editor';
export * from './dynamic-table/editors/boolean/boolean.editor';
export * from './dynamic-table/editors/text/text.editor';
export * from './dynamic-table/editors/datetime/datetime.editor';
export * from './text/text-mask.component';

export const WIDGET_DIRECTIVES: any[] = [
    UnknownWidgetComponent,
    TabsWidgetComponent,
    ContainerWidgetComponent,
    TextWidgetComponent,
    NumberWidgetComponent,
    CheckboxWidgetComponent,
    MultilineTextWidgetComponentComponent,
    DropdownWidgetComponent,
    HyperlinkWidgetComponent,
    RadioButtonsWidgetComponent,
    DisplayTextWidgetComponent,
    UploadWidgetComponent,
    TypeaheadWidgetComponent,
    FunctionalGroupWidgetComponent,
    PeopleWidgetComponent,
    DateWidgetComponent,
    AmountWidgetComponent,
    DynamicTableWidgetComponent,
    DateEditorComponent,
    DropdownEditorComponent,
    BooleanEditorComponent,
    TextEditorComponent,
    RowEditorComponent,
    ErrorWidgetComponent,
    DocumentWidgetComponent,
    DateTimeWidgetComponent,
    DateTimeEditorComponent,
    JsonWidgetComponent
];

export const MASK_DIRECTIVE: any[] = [
    InputMaskDirective
];
