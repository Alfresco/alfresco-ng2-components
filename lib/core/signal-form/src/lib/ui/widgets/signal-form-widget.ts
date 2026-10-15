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

import { computed, Directive, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { ErrorStateMatcher } from '@angular/material/core';
import { FieldDefinition } from '../../definition/form-definition.model';
import type { SignalForm } from '../../state/signal-form';
import { FieldErrorMessage, fieldErrorMessage } from './field-error-message';

/**
 * The contract every form widget implements. The field outlet gives it the form, the field's Signal Forms node
 * and its definition; the widget binds `[formField]` on its own input, which also applies the field's read-only and disabled
 * state, and shows the field's first error once the field is touched.
 */
@Directive()
export abstract class SignalFormWidget<TValue = unknown> {
    readonly form = input.required<SignalForm>();
    readonly field = input.required<FieldTree<TValue>>();
    readonly definition = input.required<FieldDefinition>();
    readonly elementId = input<string>();

    protected readonly inputId = computed(() => this.elementId() ?? this.definition().id);

    protected readonly readOnly = computed(() => this.field()().readonly());

    protected readonly showError = computed(() => {
        const state = this.field()();
        return state.invalid() && state.touched();
    });

    protected readonly error = computed((): FieldErrorMessage | null => {
        const [first] = this.field()().errors();
        return first ? fieldErrorMessage(first.kind, this.definition()) : null;
    });

    protected readonly errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.showError() };
}
