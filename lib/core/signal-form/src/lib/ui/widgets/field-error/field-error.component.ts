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

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FieldErrorMessage } from '../field-error-message';

/**
 * A field's error message with today's error icon, for the error slot of every widget.
 */
@Component({
    selector: 'adf-signal-field-error',
    template: `<mat-icon class="adf-error-icon" aria-hidden="true">error_outline</mat-icon
        ><span class="adf-error-text">{{ message().key | translate: message().params }}</span>`,
    styleUrl: './field-error.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule, TranslatePipe]
})
export class SignalFieldErrorComponent {
    readonly message = input.required<FieldErrorMessage>();
}
