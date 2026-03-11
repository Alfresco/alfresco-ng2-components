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

import { UnknownWidgetComponent } from './unknown/unknown.widget';

import { AmountWidgetComponent } from './amount/amount.widget';
import { CheckboxWidgetComponent } from './checkbox/checkbox.widget';
import { DateWidgetComponent } from './date/date.widget';
import { DisplayTextWidgetComponent } from './display-text/display-text.widget';
import { ErrorWidgetComponent } from './error/error.component';
import { HyperlinkWidgetComponent } from './hyperlink/hyperlink.widget';
import { MultilineTextWidgetComponentComponent } from './multiline-text/multiline-text.widget';
import { NumberWidgetComponent } from './number/number.widget';
import { InputMaskDirective } from './text/text-mask.component';
import { TextWidgetComponent } from './text/text.widget';
import { DateTimeWidgetComponent } from './date-time/date-time.widget';
import { JsonWidgetComponent } from './json/json.widget';
import { BaseViewerWidgetComponent } from './base-viewer/base-viewer.widget';
import { DecimalWidgetComponent } from './decimal/decimal.component';
import { ButtonWidgetComponent } from './button/button.widget';

// core
export * from './widget.component';
export * from './reactive-widget.interface';
export * from './base-display-text/base-display-text.widget';
export * from './core';

// primitives
export * from './unknown/unknown.widget';
export * from './text/text.widget';
export * from './number/number.widget';
export * from './decimal/decimal.component';
export * from './checkbox/checkbox.widget';
export * from './multiline-text/multiline-text.widget';
export * from './hyperlink/hyperlink.widget';
export * from './date/date.widget';
export * from './amount/amount.widget';
export * from './error/error.component';
export * from './date-time/date-time.widget';
export * from './json/json.widget';
export * from './base-viewer/base-viewer.widget';
export * from './text/text-mask.component';
export * from './button/button.widget';

// widgets with schema
export * from './display-text';
export * from './header';
export * from './repeat/repeat.widget';

export const WIDGET_DIRECTIVES = [
    UnknownWidgetComponent,
    TextWidgetComponent,
    NumberWidgetComponent,
    DecimalWidgetComponent,
    CheckboxWidgetComponent,
    MultilineTextWidgetComponentComponent,
    HyperlinkWidgetComponent,
    DisplayTextWidgetComponent,
    DateWidgetComponent,
    AmountWidgetComponent,
    ErrorWidgetComponent,
    DateTimeWidgetComponent,
    JsonWidgetComponent,
    BaseViewerWidgetComponent,
    ButtonWidgetComponent
] as const;

export const MASK_DIRECTIVE = [InputMaskDirective] as const;
