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
import type { FormGenerationIdentity, FormRendererIdentity } from './form-state.interface';
import { deleteFormStateBinding, getFormStateBinding, hasFormStateBinding, setFormStateBinding } from './form-state-binding.model';
import { cancelFormMutation } from './form-mutation.model';

export type {
    AuthoredDefault,
    FormContextualDefaultResolver,
    FormErrorReporter,
    FormGenerationIdentity,
    FormInvocationIdentity,
    FormInvocationRequest,
    FormRendererIdentity,
    FormResetCapability,
    FormResetItemResult,
    FormResetOptions,
    FormResetResult,
    FormResetStatus,
    FormStateCommit,
    FormStateMount,
    FormWriteContext
} from './form-state.interface';
export { captureAuthoredDefault, captureAuthoredDefinition, getAuthoredDefault } from './form-authored-state.model';
export {
    captureFormStateMount,
    hasFormStateBinding,
    isFormStateCurrent,
    isFormStateMountCurrent,
    isFormStateProjectionCurrent
} from './form-state-binding.model';
export { isFormStateConstructionSilent } from './form-state-construction.model';
export {
    beginFormMutation,
    cancelFormMutation,
    canWriteFormField,
    isFormMutating,
    reportFormError,
    runFormMutation,
    withFormMutationWrite
} from './form-mutation.model';
export { commitFormState, currentFormWrite, formStateCommits, withFormWrite } from './form-state-write.model';

/**
 * Binds a renderer generation to its exact model.
 *
 * @param form Exact model
 * @param renderer Renderer identity
 * @param generation Generation identity
 */
export function bindFormState(form: FormModel, renderer: FormRendererIdentity, generation: FormGenerationIdentity): void {
    const previous = getFormStateBinding(form);
    if (previous && (previous.renderer !== renderer || previous.generation !== generation)) {
        cancelFormMutation(form, previous.renderer, previous.generation);
    }
    setFormStateBinding(form, { renderer, generation });
}

/**
 * Releases only the matching renderer mount binding.
 *
 * @param form Exact model
 * @param renderer Renderer identity
 * @param generation Generation identity
 */
export function unbindFormState(form: FormModel, renderer: FormRendererIdentity, generation: FormGenerationIdentity): void {
    if (hasFormStateBinding(form, renderer, generation)) {
        cancelFormMutation(form, renderer, generation);
        deleteFormStateBinding(form);
    }
}
