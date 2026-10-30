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

import type { FormModel } from '../components/widgets/core/form.model';
import type { FormFieldModel } from '../components/widgets/core/form-field.model';
import type { FormGenerationIdentity, FormRendererIdentity, FormResetResult, FormWriteContext } from './form-state.interface';
import { hasFormStateBinding, isFormStateCurrent } from './form-state-binding.model';
import { withSilentFormConstruction } from './form-state-construction.model';

interface FormMutationBoundary {
    cancelled: Promise<void>;
    release: () => void;
}

interface FormMutationOwner {
    readonly context: FormWriteContext;
    readonly cancelled: Promise<void>;
    readonly cancel: () => void;
}

interface PendingFormMutation {
    readonly context: FormWriteContext;
    readonly result: Promise<FormResetResult>;
}

const mutations = new WeakMap<FormModel, FormMutationOwner>();
const mutationWrites = new WeakSet<FormFieldModel>();
const pendingMutations = new WeakMap<FormModel, PendingFormMutation>();

const unavailableResult = (context: FormWriteContext): FormResetResult => ({ context, status: 'unavailable', items: [] });

const failedResult = (context: FormWriteContext): FormResetResult => ({ context, status: context.isCurrent() ? 'failed' : 'unavailable', items: [] });

const canBeginFormMutation = (context: FormWriteContext): boolean =>
    !mutations.has(context.form) && context.isCurrent() && hasFormStateBinding(context.form, context.renderer, context.generation);

const releaseFormMutation = (owner: FormMutationOwner): void => {
    if (mutations.get(owner.context.form) === owner) {
        mutations.delete(owner.context.form);
    }
};

const forgetPendingMutation = (entry: PendingFormMutation): void => {
    if (pendingMutations.get(entry.context.form) === entry) {
        pendingMutations.delete(entry.context.form);
    }
};

const trackPendingMutation = (context: FormWriteContext, boundary: FormMutationBoundary, work: Promise<FormResetResult>): PendingFormMutation => {
    const cancelledResult = boundary.cancelled.then(() => unavailableResult(context));
    const result = Promise.race([work, cancelledResult]).finally(() => {
        boundary.release();
        forgetPendingMutation(entry);
    });
    const entry: PendingFormMutation = { context, result };
    pendingMutations.set(context.form, entry);
    return entry;
};

const withMutationWritePermission = (field: FormFieldModel, write: () => void): void => {
    const alreadyPermitted = mutationWrites.has(field);
    mutationWrites.add(field);
    try {
        write();
    } finally {
        if (!alreadyPermitted) {
            mutationWrites.delete(field);
        }
    }
};

/**
 * Acquires an exact-model reset boundary without changing authored editability.
 *
 * @param context Current reset ownership
 * @returns Cancellation and release handles, or undefined while already owned
 */
export function beginFormMutation(context: FormWriteContext): { cancelled: Promise<void>; release: () => void } | undefined {
    if (!canBeginFormMutation(context)) {
        return undefined;
    }
    let cancel: () => void;
    const cancelled = new Promise<void>((resolve) => (cancel = resolve));
    const owner: FormMutationOwner = { context, cancelled, cancel };
    mutations.set(context.form, owner);
    return { cancelled, release: () => releaseFormMutation(owner) };
}

/**
 * Hands an error to a reporter without letting a reporter that throws or rejects break the operation being reported.
 *
 * @param reportError Error reporter
 * @param error Error to report
 */
export function reportFormError(reportError: (error: unknown) => void, error: unknown): void {
    try {
        Promise.resolve(reportError(error)).catch(() => undefined);
    } catch {
        return;
    }
}

/**
 * Coalesces concurrent resets and releases only their own terminal boundary.
 *
 * @param context Exact reset invocation
 * @param reset Reset work under the acquired cancellation boundary
 * @param reportError Receives a failure thrown or rejected by the reset work
 * @returns Shared terminal result for concurrent calls in this invocation
 */
export function runFormMutation(
    context: FormWriteContext,
    reset: (cancelled: Promise<void>) => Promise<FormResetResult>,
    reportError: (error: unknown) => void = (error) => console.error(error)
): Promise<FormResetResult> {
    const pending = pendingMutations.get(context.form);
    if (pending?.context === context && isFormMutating(context.form)) {
        return pending.result;
    }
    const boundary = beginFormMutation(context);
    if (!boundary) {
        return Promise.resolve(unavailableResult(context));
    }
    let resolveWork: (result: FormResetResult) => void;
    const work = new Promise<FormResetResult>((resolve) => (resolveWork = resolve));
    const entry = trackPendingMutation(context, boundary, work);
    const fail = (error: unknown) => {
        reportFormError(reportError, error);
        resolveWork(failedResult(context));
    };
    new Promise<FormResetResult>((resolve) => resolve(reset(boundary.cancelled))).then(resolveWork, fail);
    return entry.result;
}

/**
 * Cancels a reset wait when its renderer is invalidated.
 *
 * @param form Exact model being invalidated
 * @param renderer Invalidated renderer
 * @param generation Invalidated mount generation
 */
export function cancelFormMutation(form: FormModel, renderer: FormRendererIdentity, generation: FormGenerationIdentity): void {
    const owner = mutations.get(form);
    if (owner?.context.renderer === renderer && owner.context.generation === generation) {
        mutations.delete(form);
        owner.cancel();
    }
}

/**
 * Checks whether an exact model currently has a reset owner.
 *
 * @param form Exact model
 * @returns Whether ordinary writes and submission are blocked
 */
export function isFormMutating(form: FormModel): boolean {
    return !!form && mutations.has(form);
}

/**
 * Checks ordinary setter permission independently of rule invocation metadata.
 *
 * @param field Exact field
 * @returns Whether a setter is permitted
 */
export function canWriteFormField(field: FormFieldModel): boolean {
    return !isFormMutating(field?.form) || mutationWrites.has(field);
}

/**
 * Permits only completion of an already-begun upload in its current reset.
 *
 * @param field Exact pending upload field
 * @param context Reset owner
 * @param write Completion projection
 */
export function withFormMutationWrite(field: FormFieldModel, context: FormWriteContext, write: () => void): void {
    if (mutations.get(field.form)?.context !== context || !isFormStateCurrent(field, context)) {
        return;
    }
    withMutationWritePermission(field, () => withSilentFormConstruction(field.form, write));
}
