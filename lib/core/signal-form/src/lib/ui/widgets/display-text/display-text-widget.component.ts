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
import { TranslatePipe } from '@ngx-translate/core';
import { stringifyValue } from '../../../display/field-display-value';
import { TYPED_VALUE_FORMATTING } from '../../../state/field-metadata';
import { SignalFormWidget } from '../signal-form-widget';

/**
 * Shows a read-only text whose `${field.<id>}` and `${variable.<name>}` expressions follow the current values. With
 * the field's `TYPED_VALUE_FORMATTING`, options, people and groups are shown by name.
 */
@Component({
    selector: 'adf-signal-display-text-widget',
    templateUrl: './display-text-widget.component.html',
    styleUrl: './display-text-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslatePipe]
})
export class SignalDisplayTextWidgetComponent extends SignalFormWidget<unknown> {
    protected readonly text = computed(() => {
        const state = this.field()();
        const value = state.value();
        const formatValues = state.metadata(TYPED_VALUE_FORMATTING)?.() ?? false;
        if (typeof value === 'string') {
            return this.form().resolveText(value, { formatValues });
        }
        return formatValues ? this.form().displayValue(this.definition(), value) : stringifyValue(value);
    });
}
