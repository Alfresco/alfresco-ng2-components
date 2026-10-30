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
import {
    FormErrorReporter,
    FormGenerationIdentity,
    FormInvocationIdentity,
    FormInvocationRequest,
    FormRendererIdentity,
    FormResetResult,
    FormWriteContext,
    hasFormStateBinding,
    reportFormError
} from './form-state.model';

export type FormInvocationResult = FormResetResult;

export interface FormInvocationProvider {
    readonly enabled: boolean;
    execute(request: FormInvocationRequest): Promise<FormInvocationResult>;
}

export type FormResetHandler = (context: FormWriteContext) => Promise<FormResetResult>;

export type FormInvocationObserver = (result: FormInvocationResult) => void;

export interface FormInvocationScope {
    readonly form: FormModel;
    readonly renderer: FormRendererIdentity;
    readonly generation: FormGenerationIdentity;
    readonly documentVersion: string;
    readonly isLive: () => boolean;
    readonly reportError?: FormErrorReporter;
}

interface FormInvocationAttempt {
    readonly invocation: FormInvocationIdentity;
    readonly context: FormWriteContext;
    readonly provider: FormInvocationProvider | undefined;
    readonly reset: FormResetHandler | undefined;
    readonly notify: FormInvocationObserver;
}

const unavailableResult = (context: FormWriteContext): FormInvocationResult => ({ context, status: 'unavailable', items: [] });

export class FormInvocationCoordinator {
    private activeInvocation?: FormInvocationIdentity;
    private pending?: Promise<FormInvocationResult>;
    private readonly reportError: FormErrorReporter;

    constructor(private readonly scope: FormInvocationScope) {
        const { reportError = (error: unknown) => console.error(error) } = scope;
        this.reportError = reportError;
    }

    cancel(): void {
        this.activeInvocation = undefined;
        this.pending = undefined;
    }

    dispatch(
        outcomeId: string,
        provider: FormInvocationProvider | undefined,
        reset: FormResetHandler | undefined,
        notify: FormInvocationObserver
    ): Promise<FormInvocationResult> {
        if (this.pending !== undefined) {
            return this.pending;
        }
        const invocation: FormInvocationIdentity = {};
        this.activeInvocation = invocation;
        const context = this.createContext(outcomeId, invocation, provider);
        const attempt: FormInvocationAttempt = { invocation, context, provider, reset, notify };
        if (!this.canExecute(attempt)) {
            return this.settleUnavailable(attempt);
        }
        this.pending = this.execute(attempt);
        return this.pending;
    }

    private createContext(outcomeId: string, invocation: FormInvocationIdentity, provider: FormInvocationProvider | undefined): FormWriteContext {
        const { form, renderer, generation, documentVersion } = this.scope;
        return {
            form,
            renderer,
            generation,
            invocation,
            documentVersion,
            outcomeId,
            isCurrent: () => this.isOwned(invocation) && provider?.enabled === true
        };
    }

    private isOwned(invocation: FormInvocationIdentity): boolean {
        const { form, renderer, generation } = this.scope;
        return this.activeInvocation === invocation && this.scope.isLive() && hasFormStateBinding(form, renderer, generation);
    }

    private canExecute({ context, provider, reset }: FormInvocationAttempt): boolean {
        return context.isCurrent() && !!provider?.enabled && typeof provider.execute === 'function' && typeof reset === 'function';
    }

    private settleUnavailable(attempt: FormInvocationAttempt): Promise<FormInvocationResult> {
        const result = unavailableResult(attempt.context);
        if (this.isOwned(attempt.invocation)) {
            this.notifyObserver(result, attempt.notify);
        }
        if (this.activeInvocation === attempt.invocation) {
            this.activeInvocation = undefined;
        }
        return Promise.resolve(result);
    }

    private execute(attempt: FormInvocationAttempt): Promise<FormInvocationResult> {
        const request: FormInvocationRequest = { ...attempt.context, reset: () => this.runReset(attempt) };
        return Promise.resolve()
            .then(() => this.runProvider(attempt, request))
            .then(
                (result) => this.acceptProviderResult(attempt, result),
                (error) => this.reportFailure(attempt.context, error)
            )
            .then((result) => this.deliver(attempt, result))
            .finally(() => this.release(attempt.invocation));
    }

    private runProvider(
        { context, provider }: FormInvocationAttempt,
        request: FormInvocationRequest
    ): FormInvocationResult | Promise<FormInvocationResult> {
        if (!context.isCurrent() || !provider.enabled) {
            return unavailableResult(context);
        }
        return provider.execute(request);
    }

    private acceptProviderResult({ context, provider }: FormInvocationAttempt, result: FormInvocationResult): FormInvocationResult {
        if (!context.isCurrent() || !provider.enabled) {
            return unavailableResult(context);
        }
        return { ...result, context };
    }

    private runReset({ context, provider, reset }: FormInvocationAttempt): Promise<FormResetResult> {
        if (!context.isCurrent() || !provider?.enabled || typeof reset !== 'function') {
            return Promise.resolve(unavailableResult(context));
        }
        return new Promise<FormResetResult>((resolve) => resolve(reset(context))).then(
            (resetResult) => this.acceptResetResult(context, resetResult),
            (error) => this.reportFailure(context, error)
        );
    }

    private acceptResetResult(context: FormWriteContext, result: FormResetResult): FormResetResult {
        if (!context.isCurrent()) {
            return unavailableResult(context);
        }
        return { ...result, context };
    }

    private reportFailure(context: FormWriteContext, error: unknown): FormInvocationResult {
        reportFormError(this.reportError, error);
        if (!context.isCurrent()) {
            return unavailableResult(context);
        }
        return { context, status: 'failed', items: [] };
    }

    private deliver(attempt: FormInvocationAttempt, result: FormInvocationResult): FormInvocationResult {
        if (!this.isOwned(attempt.invocation)) {
            return result;
        }
        return this.notifyObserver(result, attempt.notify);
    }

    private notifyObserver(result: FormInvocationResult, notify: FormInvocationObserver): FormInvocationResult {
        try {
            notify(result);
        } catch (error) {
            reportFormError(this.reportError, error);
        }
        return result;
    }

    private release(invocation: FormInvocationIdentity): void {
        if (this.activeInvocation === invocation) {
            this.activeInvocation = undefined;
            this.pending = undefined;
        }
    }
}
