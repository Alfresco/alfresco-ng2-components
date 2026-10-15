/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { SignalFormWidget } from '../signal-form-widget';

@Component({
    selector: 'adf-signal-text-widget',
    templateUrl: './text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, MatFormFieldModule, MatInputModule, TranslatePipe]
})
export class SignalTextWidgetComponent extends SignalFormWidget<string> {
    protected readonly widgetClass: string = 'adf-text-widget';
    protected readonly labelAutomationId: string = 'adf-text-widget-label';
}

@Component({
    selector: 'adf-signal-integer-widget',
    templateUrl: './text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, MatFormFieldModule, MatInputModule, TranslatePipe]
})
export class SignalIntegerWidgetComponent extends SignalTextWidgetComponent {
    protected override readonly widgetClass: string = 'adf-number-widget';
    protected override readonly labelAutomationId: string = 'adf-number-widget-label';
}

@Component({
    selector: 'adf-signal-decimal-widget',
    templateUrl: './text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, MatFormFieldModule, MatInputModule, TranslatePipe]
})
export class SignalDecimalWidgetComponent extends SignalTextWidgetComponent {
    protected override readonly widgetClass: string = 'adf-decimal-widget';
    protected override readonly labelAutomationId: string = 'adf-decimal-widget-label';
}
