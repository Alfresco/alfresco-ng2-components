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
import { dateFieldRange } from '../../../validation/field-validation';
import { SignalDateTimeInputControlComponent } from '../../controls/date-time-input-control.component';
import { SignalFormWidget } from '../signal-form-widget';

/**
 * Edits a datetime field, day and time, within its range.
 */
@Component({
    selector: 'adf-signal-date-time-widget',
    templateUrl: './date-time-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, TranslatePipe, SignalDateTimeInputControlComponent]
})
export class SignalDateTimeWidgetComponent extends SignalFormWidget<Date | null> {
    protected readonly range = computed(() => dateFieldRange(this.definition()));
}
