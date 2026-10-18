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

import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * A field label shown to the left of the field, when the form asks for left labels. Its id is `<target>-label`, for
 * controls that can't be the target of a `<label for>` and point at it with `aria-labelledby`.
 */
@Component({
    selector: 'adf-signal-left-label',
    template: `<label class="adf-label adf-signal-form-left-label" [id]="labelId()" [attr.for]="target()"
        >{{ text() }}
        @if (required()) {
            <span class="adf-asterisk" aria-hidden="true">*</span>
        }
    </label>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalLeftLabelComponent {
    readonly target = input.required<string>();
    readonly text = input('');
    readonly required = input(false, { transform: booleanAttribute });

    readonly labelId = computed(() => `${this.target()}-label`);
}
