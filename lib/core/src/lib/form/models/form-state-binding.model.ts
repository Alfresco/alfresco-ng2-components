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
import type { FormGenerationIdentity, FormRendererIdentity, FormStateMount, FormWriteContext } from './form-state.interface';

export interface FormRendererBinding {
    readonly renderer: FormRendererIdentity;
    readonly generation: FormGenerationIdentity;
}

const rendererBindings = new WeakMap<FormModel, FormRendererBinding>();

const matchesBinding = (binding: FormRendererBinding | undefined, renderer: FormRendererIdentity, generation: FormGenerationIdentity): boolean =>
    binding?.renderer === renderer && binding?.generation === generation;

/**
 * Reads the renderer generation currently bound to an exact model.
 *
 * @param form Exact model
 * @returns The current binding, or undefined while unbound
 */
export function getFormStateBinding(form: FormModel): FormRendererBinding | undefined {
    return rendererBindings.get(form);
}

/**
 * Records the renderer generation that now owns an exact model.
 *
 * @param form Exact model
 * @param binding Renderer and generation identities
 */
export function setFormStateBinding(form: FormModel, binding: FormRendererBinding): void {
    rendererBindings.set(form, binding);
}

/**
 * Forgets the renderer generation bound to an exact model.
 *
 * @param form Exact model
 */
export function deleteFormStateBinding(form: FormModel): void {
    rendererBindings.delete(form);
}

/**
 * Checks an exact model's current renderer and generation binding.
 *
 * @param form Exact model
 * @param renderer Renderer identity
 * @param generation Generation identity
 * @returns Whether the supplied binding is current
 */
export function hasFormStateBinding(form: FormModel, renderer: FormRendererIdentity, generation: FormGenerationIdentity): boolean {
    return matchesBinding(rendererBindings.get(form), renderer, generation);
}

/**
 * Captures a widget's exact binding before it subscribes to state changes.
 *
 * @param field Mounted field
 * @returns The mount binding, or undefined outside a bound generation
 */
export function captureFormStateMount(field: FormFieldModel): FormStateMount | undefined {
    const binding = rendererBindings.get(field.form);
    if (!binding) {
        return undefined;
    }
    return { form: field.form, field, renderer: binding.renderer, generation: binding.generation };
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
    return mount?.field === field && mount.form === field.form && matchesBinding(binding, mount.renderer, mount.generation);
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
    return context?.form === field.form && matchesBinding(binding, context.renderer, context.generation) && context.isCurrent();
}
