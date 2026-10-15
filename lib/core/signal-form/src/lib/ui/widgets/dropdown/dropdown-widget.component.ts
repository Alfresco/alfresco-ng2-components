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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { FieldOption } from '../../../definition/form-definition.model';
import { SignalFormWidget } from '../signal-form-widget';

@Component({
    selector: 'adf-signal-dropdown-widget',
    templateUrl: './dropdown-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField, MatFormFieldModule, MatSelectModule, TranslatePipe]
})
export class SignalDropdownWidgetComponent extends SignalFormWidget {
    protected readonly options = computed(() => this.definition().options.map((option) => ({ ...option })));
    protected readonly sameOption = (left: FieldOption | string | null, right: FieldOption | string | null): boolean =>
        optionId(left) === optionId(right);
}

const optionId = (value: FieldOption | string | null): string | null => {
    if (typeof value === 'string') {
        return value;
    }
    return value ? value.id : null;
};
