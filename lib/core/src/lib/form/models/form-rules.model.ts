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

import { InjectionToken, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormEvent } from '../events';
import { FormRulesEvent } from '../events/form-rules.event';
import { FormModel, FormService } from '../public-api';
import { FormInvocationRequest, FormResetResult, FormWriteContext, hasFormStateBinding, reportFormError } from './form-state.model';

export type FormInvocationResult = FormResetResult;

export interface FormInvocationProvider {
    readonly enabled: boolean;
    execute(request: FormInvocationRequest): Promise<FormInvocationResult>;
}

export class FormInvocationCoordinator {
    private activeInvocation?: object;
    private pending?: Promise<FormInvocationResult>;

    constructor(
        private readonly form: FormModel,
        private readonly renderer: object,
        private readonly generation: object,
        private readonly documentVersion: string,
        private readonly isLive: () => boolean,
        private readonly reportError: (error: unknown) => void = (error) => console.error(error)
    ) {}

    cancel(): void {
        this.activeInvocation = undefined;
        this.pending = undefined;
    }

    dispatch(
        outcomeId: string,
        provider: FormInvocationProvider | undefined,
        reset: ((context: FormWriteContext) => Promise<FormResetResult>) | undefined,
        notify: (result: FormInvocationResult) => void
    ): Promise<FormInvocationResult> {
        if (this.pending) {
            return this.pending;
        }
        const invocation = {};
        this.activeInvocation = invocation;
        const isOwned = () => this.activeInvocation === invocation && this.isLive() && hasFormStateBinding(this.form, this.renderer, this.generation);
        const context: FormWriteContext = {
            form: this.form,
            renderer: this.renderer,
            generation: this.generation,
            invocation,
            documentVersion: this.documentVersion,
            outcomeId,
            isCurrent: () => isOwned() && provider?.enabled === true
        };
        const unavailable = (): FormInvocationResult => ({ context, status: 'unavailable', items: [] });
        const request: FormInvocationRequest = {
            ...context,
            reset: () => {
                if (!context.isCurrent() || !provider?.enabled || typeof reset !== 'function') {
                    return Promise.resolve(unavailable());
                }
                let result: Promise<FormResetResult>;
                try {
                    result = reset(context);
                } catch (error) {
                    reportFormError(this.reportError, error);
                    result = Promise.resolve({ context, status: 'failed', items: [] });
                }
                return Promise.resolve(result).then(
                    (resetResult) => (context.isCurrent() ? { ...resetResult, context } : unavailable()),
                    (error) => {
                        reportFormError(this.reportError, error);
                        return context.isCurrent() ? { context, status: 'failed' as const, items: [] } : unavailable();
                    }
                );
            }
        };
        if (!context.isCurrent() || !provider?.enabled || typeof provider.execute !== 'function' || typeof reset !== 'function') {
            const result = unavailable();
            if (isOwned()) {
                this.notify(result, notify);
            }
            if (this.activeInvocation === invocation) {
                this.activeInvocation = undefined;
            }
            return Promise.resolve(result);
        }
        this.pending = Promise.resolve()
            .then(() => (context.isCurrent() && provider.enabled ? provider.execute(request) : unavailable()))
            .then(
                (result) => (context.isCurrent() && provider.enabled ? { ...result, context } : unavailable()),
                (error) => {
                    reportFormError(this.reportError, error);
                    return context.isCurrent() ? { context, status: 'failed' as const, items: [] } : unavailable();
                }
            )
            .then((result) => {
                if (isOwned()) {
                    return this.notify(result, notify);
                }
                return result;
            })
            .finally(() => {
                if (this.activeInvocation === invocation) {
                    this.activeInvocation = undefined;
                    this.pending = undefined;
                }
            });
        return this.pending;
    }

    private notify(result: FormInvocationResult, notify: (result: FormInvocationResult) => void): FormInvocationResult {
        try {
            notify(result);
            return result;
        } catch (error) {
            reportFormError(this.reportError, error);
            return result;
        }
    }
}

export const FORM_RULES_MANAGER = new InjectionToken<FormRulesManager<any>>('form.rule.manager');

/**
 * A factory for forms rule manager
 *
 * @param injector Angular injector
 * @returns FormsRuleManager instance
 */
export function formRulesManagerFactory<T>(injector: Injector): FormRulesManager<T> {
    try {
        return injector.get(FORM_RULES_MANAGER);
    } catch {
        return new ByPassFormRuleManager<T>(null);
    }
}

export abstract class FormRulesManager<T> {
    rulesOnlyProvider?: FormInvocationProvider;
    constructor(protected formService: FormService) {}

    protected formModel: FormModel;
    protected onDestroy$ = new Subject<boolean>();
    private initialized = false;

    initialize(formModel: FormModel) {
        if (this.initialized) {
            this.destroy();
            this.onDestroy$ = new Subject<boolean>();
        }

        this.formModel = formModel;

        if (!this.formModel.readOnly) {
            const rules = this.getRules();

            if (rules) {
                this.formService.formRulesEvent
                    .pipe(
                        filter((event) => !!event?.form?.id && event.form.id === this.formModel?.id),
                        takeUntil(this.onDestroy$)
                    )
                    .subscribe((event) => {
                        this.handleRuleEvent(event, rules);
                    });

                const onFormLoadedEvent = new FormEvent(this.formModel);
                const formRules = new FormRulesEvent('formLoaded', onFormLoadedEvent);
                this.formService.formRulesEvent.next(formRules);
            }
        }

        this.initialized = true;
    }

    protected abstract getRules(): T;
    protected abstract handleRuleEvent(event: FormRulesEvent, rules: T): void;

    destroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}

export class ByPassFormRuleManager<T> extends FormRulesManager<T> {
    protected getRules(): T {
        return null;
    }

    protected handleRuleEvent(): void {
        return;
    }
}
