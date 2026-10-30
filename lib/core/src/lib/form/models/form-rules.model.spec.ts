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

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormModel } from '../components/widgets';
import { FormEvent, FormRulesEvent } from '../events';
import { FormService } from '../services/form.service';
import {
    ByPassFormRuleManager,
    FORM_RULES_MANAGER,
    FormInvocationCoordinator,
    FormInvocationProvider,
    FormRulesManager,
    formRulesManagerFactory
} from './form-rules.model';
import { bindFormState, FormInvocationRequest, FormResetResult, FormWriteContext, isFormMutating, runFormMutation } from './form-state.model';

class CustomRuleManager extends FormRulesManager<any> {
    getRules(): any {
        return null;
    }

    handleRuleEvent(): void {
        return;
    }
}

describe('FormInvocationCoordinator', () => {
    const flushPromises = (): Promise<void> => new Promise((resolve) => setTimeout(resolve));
    let reportError: jasmine.Spy<(error: unknown) => void>;
    const create = () => {
        const form = new FormModel({ id: 'model', version: 1 });
        const renderer = {};
        const generation = {};
        bindFormState(form, renderer, generation);
        return new FormInvocationCoordinator({ form, renderer, generation, documentVersion: '1', isLive: () => true, reportError });
    };

    beforeEach(() => {
        reportError = jasmine.createSpy('reportError');
    });

    it('should acquire the reset boundary synchronously before the provider can write again', async () => {
        const form = new FormModel({ id: 'model', version: 1, fields: [{ id: 'text', type: 'text', value: 'authored' }] });
        const renderer = {};
        const generation = {};
        bindFormState(form, renderer, generation);
        const coordinator = new FormInvocationCoordinator({ form, renderer, generation, documentVersion: '1', isLive: () => true });
        let finish: (result: FormResetResult) => void;
        let request: FormInvocationRequest;
        const provider: FormInvocationProvider = {
            enabled: true,
            execute: (value) => {
                request = value;
                const result = value.reset();
                expect(isFormMutating(form)).toBeTrue();
                form.changeFieldValue('text', 'blocked in same turn', value);
                expect(form.values.text).toBe('authored');
                return result;
            }
        };
        coordinator.dispatch(
            'clear',
            provider,
            (context) => runFormMutation(context, () => new Promise((resolve) => (finish = resolve))),
            () => undefined
        );
        await flushPromises();
        finish({ context: request, status: 'complete', items: [] });
        await flushPromises();
        expect(isFormMutating(form)).toBeFalse();
    });

    for (const resetFailure of ['throw', 'reject'] as const) {
        it(`should normalize an unawaited reset ${resetFailure} without unhandled rejection`, async () => {
            const coordinator = create();
            const notify = jasmine.createSpy('notify');
            let resetResult: FormResetResult;
            const provider: FormInvocationProvider = {
                enabled: true,
                execute: async (request) => {
                    request.reset().then((result) => (resetResult = result));
                    await Promise.resolve();
                    await Promise.resolve();
                    await Promise.resolve();
                    return { context: request, status: 'complete', items: [] };
                }
            };
            const failure = new Error('reset failed');
            coordinator.dispatch(
                'clear',
                provider,
                () => {
                    if (resetFailure === 'throw') {
                        throw failure;
                    }
                    return Promise.reject(failure);
                },
                notify
            );
            await flushPromises();
            expect(resetResult.status).toBe('failed');
            expect(notify).toHaveBeenCalledTimes(1);
            expect(reportError).toHaveBeenCalledOnceWith(failure);
        });
    }

    it('should preserve execution status and cleanup when the terminal observer throws', async () => {
        const coordinator = create();
        const notify = jasmine.createSpy('notify').and.throwError('observer failed');
        const provider: FormInvocationProvider = {
            enabled: true,
            execute: (request) => Promise.resolve({ context: request, status: 'partial', items: [] })
        };
        const reset = (context: FormWriteContext) => Promise.resolve({ context, status: 'complete' as const, items: [] });
        let result: FormResetResult;
        coordinator.dispatch('clear', provider, reset, notify).then((value) => (result = value));
        await flushPromises();
        expect(result.status).toBe('partial');
        expect(notify).toHaveBeenCalledTimes(1);
        expect(reportError).toHaveBeenCalledOnceWith(jasmine.objectContaining({ message: 'observer failed' }));
        coordinator.dispatch('clear', provider, reset, notify);
        await flushPromises();
        expect(notify).toHaveBeenCalledTimes(2);
        expect(reportError).toHaveBeenCalledTimes(2);
    });

    for (const failure of ['reset', 'provider', 'observer'] as const) {
        it(`should resolve one terminal result when the ${failure} fails and the reporter throws`, async () => {
            reportError.and.throwError('reporter');
            const coordinator = create();
            const failureError = new Error(failure);
            const notify = jasmine.createSpy('notify').and.callFake(() => {
                if (failure === 'observer') {
                    throw failureError;
                }
            });
            const provider: FormInvocationProvider = {
                enabled: true,
                execute: (request) => (failure === 'provider' ? Promise.reject(failureError) : request.reset())
            };
            const reset = (context: FormWriteContext) => {
                if (failure === 'reset') {
                    throw failureError;
                }
                return Promise.resolve({ context, status: 'complete' as const, items: [] });
            };

            const result = await coordinator.dispatch('clear', provider, reset, notify);

            expect(result.status).toBe(failure === 'observer' ? 'complete' : 'failed');
            expect(notify).toHaveBeenCalledOnceWith(result);
            expect(reportError).toHaveBeenCalledOnceWith(failureError);
        });
    }

    it('should not execute the provider when the invocation is cancelled before it starts', async () => {
        const coordinator = create();
        const notify = jasmine.createSpy('notify');
        const provider = { enabled: true, execute: jasmine.createSpy('execute') };
        let result: FormResetResult;
        coordinator.dispatch('clear', provider, jasmine.createSpy('reset'), notify).then((value) => (result = value));
        coordinator.cancel();
        await flushPromises();
        expect(provider.execute).not.toHaveBeenCalled();
        expect(result.status).toBe('unavailable');
        expect(notify).not.toHaveBeenCalled();
    });

    it('should return unavailable for reset and provider outcomes that settle after cancellation', async () => {
        const coordinator = create();
        const notify = jasmine.createSpy('notify');
        const resets: { resolve: (result: FormResetResult) => void; reject: (error: Error) => void }[] = [];
        let request: FormInvocationRequest;
        let failProvider: (error: Error) => void;
        const provider: FormInvocationProvider = {
            enabled: true,
            execute: (value) => {
                request = value;
                return new Promise<FormResetResult>((_, reject) => (failProvider = reject));
            }
        };
        let result: FormResetResult;
        coordinator
            .dispatch('clear', provider, () => new Promise<FormResetResult>((resolve, reject) => resets.push({ resolve, reject })), notify)
            .then((value) => (result = value));
        await flushPromises();
        const settled: FormResetResult[] = [];
        request.reset().then((value) => settled.push(value));
        request.reset().then((value) => settled.push(value));
        coordinator.cancel();
        resets[0].resolve({ context: request, status: 'complete', items: [] });
        const resetFailure = new Error('reset failed');
        const providerFailure = new Error('provider failed');
        resets[1].reject(resetFailure);
        failProvider(providerFailure);
        await flushPromises();
        expect(settled.map((value) => value.status)).toEqual(['unavailable', 'unavailable']);
        expect(result.status).toBe('unavailable');
        expect(notify).not.toHaveBeenCalled();
        expect(reportError.calls.allArgs()).toEqual([[resetFailure], [providerFailure]]);
    });

    it('should invalidate retained requests when their provider becomes disabled', async () => {
        const coordinator = create();
        const notify = jasmine.createSpy('notify');
        const reset = jasmine.createSpy('reset');
        let request: FormInvocationRequest;
        let finish: (result: FormResetResult) => void;
        const provider = {
            enabled: true,
            execute: (value: FormInvocationRequest) => {
                request = value;
                return new Promise<FormResetResult>((resolve) => (finish = resolve));
            }
        };
        coordinator.dispatch('clear', provider, reset, notify);
        await flushPromises();
        provider.enabled = false;
        expect(request.isCurrent()).toBeFalse();
        request.reset();
        finish({ context: request, status: 'complete', items: [] });
        await flushPromises();
        expect(reset).not.toHaveBeenCalled();
        expect(notify).toHaveBeenCalledOnceWith(jasmine.objectContaining({ status: 'unavailable' }));
    });
});

describe('Form Rules', () => {
    let injector: Injector;
    const customRuleManager = new CustomRuleManager(null);
    let formService: FormService;

    describe('Injection token provided', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: FORM_RULES_MANAGER,
                        useValue: customRuleManager
                    }
                ]
            });
            injector = TestBed.inject(Injector);
            formService = TestBed.inject(FormService);
        });

        it('factory function should not return bypass service', () => {
            spyOn(customRuleManager, 'destroy');
            spyOn(customRuleManager, 'initialize');
            const rulesManager = formRulesManagerFactory<any>(injector);

            expect(rulesManager instanceof CustomRuleManager).toBeTruthy();

            rulesManager.destroy();
            expect(customRuleManager.destroy).toHaveBeenCalled();
            rulesManager.initialize(null);
            expect(customRuleManager.initialize).toHaveBeenCalled();
        });

        it('should send the form loaded event when initialized', () => {
            const rulesManager = new CustomRuleManager(formService);
            const getRulesSpy = spyOn(rulesManager, 'getRules').and.returnValue({});
            const handleRuleEventSpy = spyOn(rulesManager, 'handleRuleEvent');
            const formModel = new FormModel({ id: 'mock' }, {}, false);
            const formEvent = new FormEvent(formModel);
            const event = new FormRulesEvent('formLoaded', formEvent);

            rulesManager.initialize(formModel);

            expect(getRulesSpy).toHaveBeenCalled();
            expect(handleRuleEventSpy).toHaveBeenCalledWith(event, {});
        });

        it('should not receive the form event when event has no form', () => {
            const rulesManager = new CustomRuleManager(formService);
            spyOn(rulesManager, 'getRules').and.returnValue({});
            const handleRuleEventSpy = spyOn(rulesManager, 'handleRuleEvent');
            const formModel = new FormModel({ id: 'mock' }, {}, false);
            const formEvent = new FormEvent(new FormModel(null));
            const event = new FormRulesEvent('formLoaded', formEvent);

            rulesManager.initialize(formModel);

            formService.formRulesEvent.next(event);

            expect(handleRuleEventSpy).not.toHaveBeenCalledWith(event, jasmine.anything());
        });
    });

    describe('Injection token not provided', () => {
        let formModel: FormModel;
        let rulesManager: FormRulesManager<any>;
        let getRulesSpy: jasmine.Spy;

        beforeEach(() => {
            injector = TestBed.inject(Injector);
            rulesManager = formRulesManagerFactory(injector);
            getRulesSpy = spyOn(rulesManager as any, 'getRules');
        });

        it('factory function should return bypass service', () => {
            expect(rulesManager instanceof ByPassFormRuleManager).toBeTruthy();
        });

        it('should get rules when form is not readonly', () => {
            formModel = new FormModel({}, {}, false);

            rulesManager.initialize(formModel);

            expect(getRulesSpy).toHaveBeenCalled();
        });

        it('should not get rules when form is readonly', () => {
            formModel = new FormModel({}, {}, true);

            rulesManager.initialize(formModel);

            expect(getRulesSpy).not.toHaveBeenCalled();
        });
    });
});
