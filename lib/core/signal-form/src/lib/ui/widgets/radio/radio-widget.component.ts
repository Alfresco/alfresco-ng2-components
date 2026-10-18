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
import { MatRadioModule } from '@angular/material/radio';
import { TranslatePipe } from '@ngx-translate/core';
import { SignalFormWidget } from '../signal-form-widget';
import { SignalFieldErrorComponent } from '../field-error/field-error.component';

@Component({
    selector: 'adf-signal-radio-widget',
    templateUrl: './radio-widget.component.html',
    styleUrl: './radio-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, MatRadioModule, TranslatePipe, SignalFieldErrorComponent]
})
export class SignalRadioWidgetComponent extends SignalFormWidget {}
