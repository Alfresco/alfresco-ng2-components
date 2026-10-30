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

import { computed, ErrorHandler } from '@angular/core';
import { NotificationService } from '../../notifications/services/notification.service';
import { FormInvocationObserver, FormResetHandler } from '../models/form-invocation-coordinator.model';
import {
    ByPassFormRuleManager,
    FormInvocationCoordinator,
    FormInvocationProvider,
    FormInvocationResult,
    FormRulesManager
} from '../models/form-rules.model';
import {
    bindFormState,
    cancelFormMutation,
    FormGenerationIdentity,
    FormWriteContext,
    isFormMutating,
    reportFormError,
    runFormMutation,
    unbindFormState
} from '../models/form-state.model';
import { FormModel, FormOutcomeModel } from './widgets';

export interface FormRendererInvocationHost {
    readonly formDefinition: FormModel;
    readonly readOnly: boolean;
    readonly documentVersion: () => string | number | undefined;
}

export interface FormRendererInvocationServices {
    readonly rulesManager: FormRulesManager<unknown>;
    readonly notificationService: NotificationService;
    readonly errorHandler: ErrorHandler;
}

export interface RulesOnlyOutcomeDispatch {
    readonly outcome: FormOutcomeModel;
    readonly notify: FormInvocationObserver;
    readonly isHostCurrent: () => boolean;
    readonly resetCapability?: FormResetHandler;
}

interface InvocationTarget {
    readonly form: FormModel;
    readonly generation: FormGenerationIdentity;
    readonly documentVersion: string;
    readonly isHostCurrent: () => boolean;
}

const parseDocumentVersion = (value: unknown): string | undefined => {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
    }
    return undefined;
};

export class FormRendererInvocationLifecycle {
    readonly explicitDocumentVersion = computed(() => parseDocumentVersion(this.host.documentVersion()));

    private generation: FormGenerationIdentity = {};
    private coordinator?: FormInvocationCoordinator;
    private invocationVersion?: string;
    private observedDocumentVersion?: string;
    private destroyed = false;
    private readonly reportError = (error: unknown): void => this.services.errorHandler.handleError(error);

    private get currentDocumentVersion(): string | undefined {
        return this.explicitDocumentVersion() ?? parseDocumentVersion(this.host.formDefinition?.json?.version);
    }

    constructor(
        private readonly host: FormRendererInvocationHost,
        private readonly services: FormRendererInvocationServices
    ) {}

    rebind(previous: FormModel | undefined, next: FormModel | undefined): void {
        this.cancel();
        if (previous) {
            unbindFormState(previous, this.host, this.generation);
        }
        this.generation = {};
        if (next) {
            bindFormState(next, this.host, this.generation);
        }
    }

    cancel(): void {
        if (this.host.formDefinition) {
            cancelFormMutation(this.host.formDefinition, this.host, this.generation);
        }
        this.coordinator?.cancel();
        this.coordinator = undefined;
        this.invocationVersion = undefined;
    }

    cancelForReadOnly(): void {
        const resetInterrupted = !!this.host.formDefinition && isFormMutating(this.host.formDefinition);
        this.cancel();
        if (resetInterrupted) {
            this.notifyOutcomeFailure();
        }
    }

    observeDocumentVersion(version: string | undefined): void {
        if (version !== this.observedDocumentVersion) {
            this.observedDocumentVersion = version;
            this.cancel();
        }
    }

    destroy(): void {
        this.destroyed = true;
        this.cancel();
        if (this.host.formDefinition) {
            unbindFormState(this.host.formDefinition, this.host, this.generation);
        }
    }

    dispatch(request: RulesOnlyOutcomeDispatch): boolean {
        const form = this.host.formDefinition;
        const documentVersion = this.currentDocumentVersion;
        if (!this.canDispatch(form, request)) {
            return false;
        }
        if (documentVersion === undefined) {
            this.notifyOutcomeFailure();
            return false;
        }
        const coordinator = this.prepareCoordinator({ form, generation: this.generation, documentVersion, isHostCurrent: request.isHostCurrent });
        void coordinator.dispatch(request.outcome.id, this.rulesOnlyProvider(), this.resetHandler(form, request.resetCapability), (result) =>
            this.notifyResult(result, request.notify)
        );
        return true;
    }

    private canDispatch(form: FormModel, { outcome, isHostCurrent }: RulesOnlyOutcomeDispatch): boolean {
        return !this.destroyed && !this.host.readOnly && !!form && !form.readOnly && outcome.form === form && isHostCurrent();
    }

    private prepareCoordinator(target: InvocationTarget): FormInvocationCoordinator {
        this.observedDocumentVersion = this.explicitDocumentVersion();
        if (this.invocationVersion !== target.documentVersion) {
            this.cancel();
            this.invocationVersion = target.documentVersion;
        }
        this.coordinator ??= new FormInvocationCoordinator({
            form: target.form,
            renderer: this.host,
            generation: target.generation,
            documentVersion: target.documentVersion,
            isLive: () => this.isLive(target),
            reportError: this.reportError
        });
        return this.coordinator;
    }

    private isLive({ form, generation, documentVersion, isHostCurrent }: InvocationTarget): boolean {
        return (
            !this.destroyed &&
            !this.host.readOnly &&
            !form.readOnly &&
            this.host.formDefinition === form &&
            this.generation === generation &&
            this.currentDocumentVersion === documentVersion &&
            isHostCurrent()
        );
    }

    private rulesOnlyProvider(): FormInvocationProvider | undefined {
        const { rulesManager } = this.services;
        if (rulesManager instanceof ByPassFormRuleManager) {
            return undefined;
        }
        return rulesManager.rulesOnlyProvider;
    }

    private resetHandler(form: FormModel, resetCapability?: FormResetHandler): FormResetHandler | undefined {
        if (typeof form.resetToDefaults !== 'function') {
            return undefined;
        }
        return resetCapability ?? ((context: FormWriteContext) => this.resetToDefaults(form, context));
    }

    private resetToDefaults(form: FormModel, context: FormWriteContext): Promise<FormInvocationResult> {
        return runFormMutation(context, () => form.resetToDefaults(context, { editableFields: form.captureResetEditability() }), this.reportError);
    }

    private notifyResult(result: FormInvocationResult, notify: FormInvocationObserver): void {
        if (result.status !== 'complete') {
            this.notifyOutcomeFailure();
        }
        notify(result);
    }

    private notifyOutcomeFailure(): void {
        try {
            this.services.notificationService.showError('FORM.OUTCOME_EXECUTION_FAILED');
        } catch (error) {
            reportFormError(this.reportError, error);
        }
    }
}
