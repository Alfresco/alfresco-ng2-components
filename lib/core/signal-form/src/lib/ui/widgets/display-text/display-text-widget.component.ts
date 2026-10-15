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
import { ADF_DISPLAY_TEXT_SETTINGS, ADF_TYPED_VALUE_FORMATTING_ENABLED } from '@alfresco/adf-core';
import { stringifyValue } from '../../../display/field-display-value';
import { injectSetting } from '../../inject-setting';
import { SignalFormWidget } from '../signal-form-widget';

/**
 * Shows a read-only text. With `ADF_DISPLAY_TEXT_SETTINGS.enableExpressionEvaluation`, its `${field.<id>}` and
 * `${variable.<name>}` expressions follow the current values; with `ADF_TYPED_VALUE_FORMATTING_ENABLED`, options,
 * people and groups are shown by name.
 */
@Component({
    selector: 'adf-signal-display-text-widget',
    templateUrl: './display-text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslatePipe]
})
export class SignalDisplayTextWidgetComponent extends SignalFormWidget<unknown> {
    private readonly expressionsEnabled = injectSetting(ADF_DISPLAY_TEXT_SETTINGS, (settings) => settings?.enableExpressionEvaluation ?? false);
    private readonly formattingEnabled = injectSetting(ADF_TYPED_VALUE_FORMATTING_ENABLED, (enabled) => enabled ?? false);

    protected readonly text = computed(() => {
        const value = this.field()().value();
        if (this.expressionsEnabled() && typeof value === 'string') {
            return this.form().resolveText(value, { formatValues: this.formattingEnabled() });
        }
        return stringifyValue(value);
    });
}
