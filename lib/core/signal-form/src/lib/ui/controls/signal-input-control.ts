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

import { afterRenderEffect, booleanAttribute, computed, Directive, input, model, viewChildren } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { FieldErrorMessage } from '../widgets/field-error-message';

/**
 * The base of the input controls the widgets bind with `[formField]`: a Signal Forms custom control
 * (`FormValueControl`) around a Material input whose shown text isn't the value itself (a datepicker, a mask, a
 * locale-formatted amount). `[formField]` keeps the value, touched, disabled, read-only and required state in sync;
 * the widget gives the label and the error to show. The control never reads the field, only its own inputs.
 */
@Directive()
export abstract class SignalInputControl<TValue> implements FormValueControl<TValue> {
    readonly value = model.required<TValue>();
    readonly touched = model(false);
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly required = input(false, { transform: booleanAttribute });

    readonly inputId = input.required<string>();
    readonly label = input<string>();
    readonly labelAutomationId = input<string>();
    readonly placeholder = input('');
    readonly tooltip = input('');
    /** The error to show, `null` while none is shown. */
    readonly error = input<FieldErrorMessage | null>(null);

    protected readonly locked = computed(() => this.disabled() || this.readonly());
    protected readonly errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.error() !== null };

    private readonly matInputs = viewChildren(MatInput);

    constructor() {
        afterRenderEffect({
            write: () => {
                this.error();
                this.matInputs().forEach((matInput) => matInput.updateErrorState());
            }
        });
    }

    protected markTouched(): void {
        this.touched.set(true);
    }
}
