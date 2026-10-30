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

import { Subject } from 'rxjs';
import type { FormFieldModel } from '../components/widgets/core/form-field.model';
import type { FormStateCommit, FormWriteContext } from './form-state.interface';
import { isFormStateCurrent } from './form-state-binding.model';
import { withSilentFormConstruction } from './form-state-construction.model';

const writes = new WeakMap<FormFieldModel, FormWriteContext>();
export const formStateCommits = new Subject<FormStateCommit>();

const markFormWrite = (field: FormFieldModel, context: FormWriteContext | undefined): void => {
    if (context) {
        writes.set(field, context);
    } else {
        writes.delete(field);
    }
};

const restoreCommittedValue = (field: FormFieldModel, value: unknown, repeatableDefinition?: Record<string, unknown>): void => {
    field.restoreRuntimeValue(value, repeatableDefinition);
    if (repeatableDefinition) {
        field.form.onRepeatableSectionChanged();
    }
};

/**
 * Returns synchronous setter ownership for the exact field.
 *
 * @param field Exact field
 * @returns Active synchronous context
 */
export function currentFormWrite(field: FormFieldModel): FormWriteContext | undefined {
    return writes.get(field);
}

/**
 * Scopes setter ownership and restores the previous marker after nested writes.
 *
 * @param field Exact field
 * @param context Optional invocation context
 * @param write Synchronous setter
 */
export function withFormWrite(field: FormFieldModel, context: FormWriteContext | undefined, write: () => void): void {
    if (context && !isFormStateCurrent(field, context)) {
        return;
    }
    const previous = writes.get(field);
    markFormWrite(field, context);
    try {
        write();
    } finally {
        markFormWrite(field, previous);
    }
}

/**
 * Commits a runtime value without synthesizing a field edit notification.
 *
 * @param field Exact field
 * @param value Committed runtime value
 * @param context Invocation context
 * @param repeatableDefinition Captured definition used only for repeatable reconstruction
 * @returns Whether the value was committed
 */
export function commitFormState(
    field: FormFieldModel,
    value: unknown,
    context: FormWriteContext,
    repeatableDefinition?: Record<string, unknown>
): boolean {
    if (!isFormStateCurrent(field, context)) {
        return false;
    }
    withSilentFormConstruction(field.form, () => restoreCommittedValue(field, value, repeatableDefinition));
    field.form.validateField(field);
    formStateCommits.next({ field, context });
    return true;
}
