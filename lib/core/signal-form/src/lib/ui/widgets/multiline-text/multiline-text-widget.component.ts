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

import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { SignalLeftLabelComponent } from '../left-label/left-label.component';
import { SignalFormWidget } from '../signal-form-widget';

@Component({
    selector: 'adf-signal-multiline-text-widget',
    templateUrl: './multiline-text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, MatFormFieldModule, MatInputModule, TextFieldModule, TranslatePipe, SignalLeftLabelComponent]
})
export class SignalMultilineTextWidgetComponent extends SignalFormWidget<string> {
    protected readonly length = computed(() => `${this.field()().value() ?? ''}`.length);
}
