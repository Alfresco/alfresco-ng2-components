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

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { LOCALE_AMOUNTS } from '../../../state/field-metadata';
import { SignalAmountInputControlComponent } from '../../controls/amount-input-control.component';
import { SignalLeftLabelComponent } from '../left-label/left-label.component';
import { SignalFormWidget } from '../signal-form-widget';

/**
 * Edits an amount, shown for the user's locale when the field's `LOCALE_AMOUNTS` is on.
 */
@Component({
    selector: 'adf-signal-amount-widget',
    templateUrl: './amount-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, TranslatePipe, SignalAmountInputControlComponent, SignalLeftLabelComponent]
})
export class SignalAmountWidgetComponent extends SignalFormWidget<string | number | null> {
    protected readonly localeAmounts = computed(() => this.field()().metadata(LOCALE_AMOUNTS)?.() ?? false);
}
