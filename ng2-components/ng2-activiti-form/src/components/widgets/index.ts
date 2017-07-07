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

import { ContainerWidget } from './container/container.widget';
import { TabsWidget } from './tabs/tabs.widget';
import { UnknownWidget } from './unknown/unknown.widget';

import { AmountWidget } from './amount/amount.widget';
import { AttachWidget } from './attach/attach.widget';
import { CheckboxWidget } from './checkbox/checkbox.widget';
import { DateWidget } from './date/date.widget';
import { DisplayTextWidget } from './display-text/display-text.widget';
import { DisplayValueWidget } from './display-value/display-value.widget';
import { DropdownWidget } from './dropdown/dropdown.widget';
import { DynamicTableWidget } from './dynamic-table/dynamic-table.widget';
import { BooleanEditorComponent } from './dynamic-table/editors/boolean/boolean.editor';
import { DateEditorComponent } from './dynamic-table/editors/date/date.editor';
import { DropdownEditorComponent } from './dynamic-table/editors/dropdown/dropdown.editor';
import { RowEditorComponent } from './dynamic-table/editors/row.editor';
import { TextEditorComponent } from './dynamic-table/editors/text/text.editor';
import { FunctionalGroupWidget } from './functional-group/functional-group.widget';
import { HyperlinkWidget } from './hyperlink/hyperlink.widget';
import { MultilineTextWidget } from './multiline-text/multiline-text.widget';
import { NumberWidget } from './number/number.widget';
import { PeopleWidget } from './people/people.widget';
import { RadioButtonsWidget } from './radio-buttons/radio-buttons.widget';
import { InputMaskDirective } from './text/text-mask.component';
import { TextWidget } from './text/text.widget';
import { TypeaheadWidget } from './typeahead/typeahead.widget';
import { UploadWidget } from './upload/upload.widget';

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
export * from './display-value/display-value.widget';
export * from './display-text/display-text.widget';
export * from './upload/upload.widget';
export * from './attach/attach.widget';
export * from './typeahead/typeahead.widget';
export * from './functional-group/functional-group.widget';
export * from './people/people.widget';
export * from './date/date.widget';
export * from './amount/amount.widget';
export * from './dynamic-table/dynamic-table.widget';

// editors (dynamic table)
export * from './dynamic-table/editors/row.editor';
export * from './dynamic-table/editors/date/date.editor';
export * from './dynamic-table/editors/dropdown/dropdown.editor';
export * from './dynamic-table/editors/boolean/boolean.editor';
export * from './dynamic-table/editors/text/text.editor';
export * from './text/text-mask.component';

export const WIDGET_DIRECTIVES: any[] = [
    UnknownWidget,
    TabsWidget,
    ContainerWidget,
    TextWidget,
    NumberWidget,
    CheckboxWidget,
    MultilineTextWidget,
    DropdownWidget,
    HyperlinkWidget,
    RadioButtonsWidget,
    DisplayValueWidget,
    DisplayTextWidget,
    UploadWidget,
    AttachWidget,
    TypeaheadWidget,
    FunctionalGroupWidget,
    PeopleWidget,
    DateWidget,
    AmountWidget,

    DynamicTableWidget,
    DateEditorComponent,
    DropdownEditorComponent,
    BooleanEditorComponent,
    TextEditorComponent,
    RowEditorComponent
];

export const MASK_DIRECTIVE: any[] = [
    InputMaskDirective
];
