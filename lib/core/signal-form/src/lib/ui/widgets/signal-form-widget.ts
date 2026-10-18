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

/** The errors that only show once a field is touched, so an empty form does not start out invalid on screen. */
const MISSING_VALUE_ERRORS: ReadonlySet<string> = new Set(['required', 'dropdown']);

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

    /** Whether the label is shown to the left of the field, as the form asks. */
    protected readonly leftLabel = computed(() => this.form().definition.leftLabels);

    protected readonly fieldRequired = computed(() => this.field()().required());

    /**
     * Whether the field shows its error: once it is touched, or when the form shows all errors. Errors other than a
     * missing value show at once, as today, so a pre-filled value that breaks its rules is reported straight away.
     */
    protected readonly showError = computed(() => {
        const state = this.field()();
        if (!state.invalid()) {
            return false;
        }
        return state.touched() || this.form().allErrorsShown() || state.errors().some(({ kind }) => !MISSING_VALUE_ERRORS.has(kind));
    });

    protected readonly error = computed((): FieldErrorMessage | null => {
        const [first] = this.field()().errors();
        if (!first) {
            return null;
        }
        return first.message ? { key: first.message } : fieldErrorMessage(first.kind, this.definition());
    });

    /** The error to show, `null` while none is shown: what the input controls take. */
    protected readonly shownError = computed(() => (this.showError() ? this.error() : null));

    protected readonly errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.shownError() !== null };
}
