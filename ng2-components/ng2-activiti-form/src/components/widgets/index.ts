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

import { TabsWidget } from './tabs/tabs.widget';
import { ContainerWidget } from './container/container.widget';

import { TextWidget } from './text/text.widget';
import { NumberWidget } from './number/number.widget';
import { CheckboxWidget } from './checkbox/checkbox.widget';
import { MultilineTextWidget } from './multiline-text/multiline-text.widget';
import { DropdownWidget } from './dropdown/dropdown.widget';
import { HyperlinkWidget } from './hyperlink/hyperlink.widget';
import { RadioButtonsWidget } from './radio-buttons/radio-buttons.widget';
import { DisplayValueWidget } from './display-value/display-value.widget';
import { DisplayTextWidget } from './display-text/display-text.widget';
import { UploadWidget } from './upload/upload.widget';
import { AttachWidget } from './attach/attach.widget';
import { TypeaheadWidget } from './typeahead/typeahead.widget';
import { FunctionalGroupWidget } from './functional-group/functional-group.widget';
import { PeopleWidget } from './people/people.widget';
import { DateWidget } from './date/date.widget';
import { AmountWidget } from './amount/amount.widget';

// core
export * from './widget.component';
export * from './core/index';

// containers
export * from './tabs/tabs.widget';
export * from './container/container.widget';

// primitives
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

export const WIDGET_DIRECTIVES: any[] = [
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
    AmountWidget
];
