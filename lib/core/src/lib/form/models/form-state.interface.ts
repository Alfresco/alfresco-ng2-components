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

export type FormRendererIdentity = object;

export type FormGenerationIdentity = object;

export type FormInvocationIdentity = object;

export type FormErrorReporter = (error: unknown) => void;

export interface FormWriteContext {
    readonly form: FormModel;
    readonly renderer: FormRendererIdentity;
    readonly generation: FormGenerationIdentity;
    readonly invocation: FormInvocationIdentity;
    readonly documentVersion: string;
    readonly outcomeId: string;
    readonly isCurrent: () => boolean;
}

export interface FormStateMount {
    readonly form: FormModel;
    readonly field: FormFieldModel;
    readonly renderer: FormRendererIdentity;
    readonly generation: FormGenerationIdentity;
}

export interface AuthoredDefault {
    readonly hasValue: boolean;
    readonly value: unknown;
    readonly selectLoggedUser: boolean;
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
