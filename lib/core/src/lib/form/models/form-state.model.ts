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
import type { FormModel } from '../components/widgets/core/form.model';
import type { FormFieldModel } from '../components/widgets/core/form-field.model';

export interface FormWriteContext {
    readonly form: FormModel;
    readonly renderer: object;
    readonly generation: object;
    readonly invocation: object;
    readonly documentVersion: string;
    readonly outcomeId: string;
    readonly isCurrent: () => boolean;
}

export interface FormStateMount {
    readonly form: FormModel;
    readonly field: FormFieldModel;
    readonly renderer: object;
    readonly generation: object;
}

export interface AuthoredDefault {
    readonly hasValue: boolean;
    readonly value: unknown;
    readonly selectLoggedUser: boolean;
}

const authoredDefaults = new WeakMap<object, AuthoredDefault>();

const cloneAuthoredValue = (value: unknown, ancestors = new WeakSet<object>()): unknown => {
    if (value instanceof Date) {
        return new Date(value.getTime());
    }
    if (value && typeof value === 'object') {
        if (ancestors.has(value)) {
            return undefined;
        }
        ancestors.add(value);
        const cloned = Array.isArray(value)
            ? value.map((entry) => cloneAuthoredValue(entry, ancestors))
            : Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneAuthoredValue(entry, ancestors)]));
        ancestors.delete(value);
        return cloned;
    }
    return value;
};

const authoredDefinitions = new WeakMap<object, Record<string, unknown>>();

/**
 * Captures immutable definition and repeatable template data before hydration.
 *
 * @param definition First-seen field definition
 * @returns Detached captured definition
 */
export function captureAuthoredDefinition(definition: Record<string, unknown>): Record<string, unknown> {
    if (!authoredDefinitions.has(definition)) {
        const captured = cloneAuthoredValue(definition) as Record<string, unknown>;
        const fields = definition.fields;
        if (fields && typeof fields === 'object') {
            captured.fields = Object.fromEntries(
                Object.entries(fields).map(([key, entries]) => [
                    key,
                    Array.isArray(entries) ? entries.map((entry) => captureAuthoredDefinition(entry)) : entries
                ])
            );
        }
        authoredDefinitions.set(definition, captured);
        captureAuthoredDefault(definition);
    }
    return cloneAuthoredValue(authoredDefinitions.get(definition)) as Record<string, unknown>;
}

export type FormResetStatus = 'complete' | 'partial' | 'failed' | 'unavailable';

export interface FormResetItemResult {
    readonly field: FormFieldModel;
    readonly fieldId: string;
    readonly status: 'applied' | 'skipped' | 'failed';
    readonly reason?:
        'unsupported-category' | 'contextual-default-unavailable' | 'content-policy-unavailable' | 'reset-shape-retained' | 'application-failed';
    readonly content?: readonly {
        readonly nodeId?: string;
        readonly status: 'deleted' | 'detached' | 'retained' | 'restored-default';
        readonly reason?: string;
    }[];
}

export interface FormResetResult {
    readonly context: FormWriteContext;
    readonly status: FormResetStatus;
    readonly items: readonly FormResetItemResult[];
}

export type FormContextualDefaultResolver = (field: FormFieldModel, context: FormWriteContext) => unknown | Promise<unknown>;

export interface FormResetOptions {
    readonly resolveContextualDefault?: FormContextualDefaultResolver;
    readonly handledFields?: ReadonlySet<FormFieldModel>;
    readonly editableFields?: ReadonlySet<FormFieldModel>;
}

export interface FormResetCapability {
    readonly reset: () => Promise<FormResetResult>;
}

export interface FormInvocationRequest extends FormWriteContext, FormResetCapability {}

export interface FormStateCommit {
    readonly field: FormFieldModel;
    readonly context: FormWriteContext;
}

/**
 * Captures the first-seen definition value and contextual intent before hydration.
 *
 * @param definition Original field definition object
 * @returns A detached authored snapshot
 */
export function captureAuthoredDefault(definition: Record<string, unknown>): AuthoredDefault {
    if (!authoredDefaults.has(definition)) {
        authoredDefaults.set(definition, {
            hasValue: Object.prototype.hasOwnProperty.call(definition, 'value'),
            value: cloneAuthoredValue(definition.value),
            selectLoggedUser: definition.selectLoggedUser === true
        });
    }
    const captured = authoredDefaults.get(definition);
    return { ...captured, value: cloneAuthoredValue(captured.value) };
}

/**
 * Reads immutable authored intent for a live field's original definition.
 *
 * @param field Live field
 * @returns A detached first-seen authored snapshot
 */
export function getAuthoredDefault(field: FormFieldModel): AuthoredDefault {
    return captureAuthoredDefault(field.json);
}

const rendererBindings = new WeakMap<FormModel, { renderer: object; generation: object }>();
const writes = new WeakMap<FormFieldModel, FormWriteContext>();
const mutations = new WeakMap<FormModel, { context: FormWriteContext; cancelled: Promise<void>; cancel: () => void }>();
const mutationWrites = new WeakSet<FormFieldModel>();
const pendingMutations = new WeakMap<FormModel, { context: FormWriteContext; result: Promise<FormResetResult> }>();
const silentConstruction = new WeakSet<FormModel>();
export const formStateCommits = new Subject<FormStateCommit>();

/**
 * Acquires an exact-model reset boundary without changing authored editability.
 *
 * @param context Current reset ownership
 * @returns Cancellation and release handles, or undefined while already owned
 */
export function beginFormMutation(context: FormWriteContext): { cancelled: Promise<void>; release: () => void } | undefined {
    if (mutations.has(context.form) || !context.isCurrent() || !hasFormStateBinding(context.form, context.renderer, context.generation)) {
        return undefined;
    }
    let cancel: () => void;
    const cancelled = new Promise<void>((resolve) => (cancel = resolve));
    const owner = { context, cancelled, cancel };
    mutations.set(context.form, owner);
    return {
        cancelled,
        release: () => {
            if (mutations.get(context.form) === owner) {
                mutations.delete(context.form);
            }
        }
    };
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
        return Promise.resolve({ context, status: 'unavailable', items: [] });
    }
    const entry = { context, result: undefined as Promise<FormResetResult> };
    let resolveWork: (result: FormResetResult) => void;
    const work = new Promise<FormResetResult>((resolve) => (resolveWork = resolve));
    entry.result = Promise.race([work, boundary.cancelled.then((): FormResetResult => ({ context, status: 'unavailable', items: [] }))]).finally(
        () => {
            boundary.release();
            if (pendingMutations.get(context.form) === entry) {
                pendingMutations.delete(context.form);
            }
        }
    );
    pendingMutations.set(context.form, entry);
    const failed = (): FormResetResult => ({ context, status: context.isCurrent() ? 'failed' : 'unavailable', items: [] });
    const fail = (error: unknown) => {
        reportFormError(reportError, error);
        resolveWork(failed());
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
export function cancelFormMutation(form: FormModel, renderer: object, generation: object): void {
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
    const alreadyPermitted = mutationWrites.has(field);
    const alreadySilent = silentConstruction.has(field.form);
    mutationWrites.add(field);
    silentConstruction.add(field.form);
    try {
        write();
    } finally {
        if (!alreadyPermitted) {
            mutationWrites.delete(field);
        }
        if (!alreadySilent) {
            silentConstruction.delete(field.form);
        }
    }
}

/**
 * Checks whether nested field constructors belong to a silent state commit.
 *
 * @param form Exact model
 * @returns Whether constructor notifications must remain silent
 */
export function isFormStateConstructionSilent(form: FormModel): boolean {
    return silentConstruction.has(form);
}

/**
 * Binds a renderer generation to its exact model.
 *
 * @param form Exact model
 * @param renderer Renderer identity
 * @param generation Generation identity
 */
export function bindFormState(form: FormModel, renderer: object, generation: object): void {
    const previous = rendererBindings.get(form);
    if (previous && (previous.renderer !== renderer || previous.generation !== generation)) {
        cancelFormMutation(form, previous.renderer, previous.generation);
    }
    rendererBindings.set(form, { renderer, generation });
}

/**
 * Releases only the matching renderer mount binding.
 *
 * @param form Exact model
 * @param renderer Renderer identity
 * @param generation Generation identity
 */
export function unbindFormState(form: FormModel, renderer: object, generation: object): void {
    if (hasFormStateBinding(form, renderer, generation)) {
        cancelFormMutation(form, renderer, generation);
        rendererBindings.delete(form);
    }
}

/**
 * Captures a widget's exact binding before it subscribes to state changes.
 *
 * @param field Mounted field
 * @returns The mount binding, or undefined outside a bound generation
 */
export function captureFormStateMount(field: FormFieldModel): FormStateMount | undefined {
    const binding = rendererBindings.get(field.form);
    return binding ? { form: field.form, field, renderer: binding.renderer, generation: binding.generation } : undefined;
}

/**
 * Checks whether the mounted field still belongs to its original generation.
 *
 * @param field Current widget field
 * @param mount Original mount snapshot
 * @returns Whether the mount can consume current changes
 */
export function isFormStateMountCurrent(field: FormFieldModel, mount: FormStateMount): boolean {
    const binding = rendererBindings.get(field.form);
    return mount?.field === field && mount.form === field.form && binding?.renderer === mount.renderer && binding?.generation === mount.generation;
}

/**
 * Checks invocation ownership against both current state and the widget mount.
 *
 * @param field Current widget field
 * @param context Invocation context
 * @param mount Original mount snapshot
 * @returns Whether this mount can project the invocation's value
 */
export function isFormStateProjectionCurrent(field: FormFieldModel, context: FormWriteContext, mount: FormStateMount): boolean {
    return (
        isFormStateMountCurrent(field, mount) &&
        mount.renderer === context.renderer &&
        mount.generation === context.generation &&
        isFormStateCurrent(field, context)
    );
}

/**
 * Checks the exact model, renderer generation and invocation validity.
 *
 * @param field Exact field
 * @param context Invocation context
 * @returns Whether the invocation can mutate the field
 */
export function isFormStateCurrent(field: FormFieldModel, context: FormWriteContext): boolean {
    const binding = rendererBindings.get(field.form);
    return (
        context?.form === field.form && binding?.renderer === context.renderer && binding?.generation === context.generation && context.isCurrent()
    );
}

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
    if (context) {
        writes.set(field, context);
    } else {
        writes.delete(field);
    }
    try {
        write();
    } finally {
        if (previous) {
            writes.set(field, previous);
        } else {
            writes.delete(field);
        }
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
    const alreadySilent = silentConstruction.has(field.form);
    silentConstruction.add(field.form);
    try {
        field.restoreRuntimeValue(value, repeatableDefinition);
        if (repeatableDefinition) {
            field.form.onRepeatableSectionChanged();
        }
    } finally {
        if (!alreadySilent) {
            silentConstruction.delete(field.form);
        }
    }
    field.form.validateField(field);
    formStateCommits.next({ field, context });
    return true;
}

/**
 * Checks an exact model's current renderer and generation binding.
 *
 * @param form Exact model
 * @param renderer Renderer identity
 * @param generation Generation identity
 * @returns Whether the supplied binding is current
 */
export function hasFormStateBinding(form: FormModel, renderer: object, generation: object): boolean {
    const binding = rendererBindings.get(form);
    return binding?.renderer === renderer && binding?.generation === generation;
}
