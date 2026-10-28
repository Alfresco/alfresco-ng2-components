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

import { TestBed } from '@angular/core/testing';
import { FormModel } from '../components/widgets/core/form.model';
import { FormFieldModel } from '../components/widgets/core/form-field.model';
import { FormService } from '../services/form.service';
import {
    bindFormState,
    canWriteFormField,
    captureAuthoredDefinition,
    currentFormWrite,
    FormResetResult,
    FormWriteContext,
    getAuthoredDefault,
    isFormMutating,
    runFormMutation,
    withFormMutationWrite,
    withFormWrite
} from './form-state.model';

describe('FormStateModel', () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormService);
    });

    function createForm(): FormModel {
        return new FormModel({ id: 'form', fields: [{ id: 'text', type: 'text', value: 'authored' }] }, undefined, false, service);
    }

    function bind(form: FormModel, isCurrent: () => boolean = () => true): FormWriteContext {
        const context = { form, renderer: {}, generation: {}, invocation: {}, documentVersion: '1', outcomeId: 'clear', isCurrent };
        bindFormState(form, context.renderer, context.generation);
        return context;
    }

    function result(context: FormWriteContext): FormResetResult {
        return { context, status: 'complete', items: [] };
    }

    describe('getAuthoredDefault', () => {
        it('should return a detached first-seen snapshot when the definition is mutated after capture', () => {
            for (const value of [undefined, null, false, 0, '', [{ id: 'authored' }]]) {
                const definition: Record<string, unknown> = { id: 'field', type: 'people', value, selectLoggedUser: true };
                const field = new FormFieldModel(new FormModel(), definition);
                const first = getAuthoredDefault(field);
                definition.value = 'task';
                definition.selectLoggedUser = false;
                if (Array.isArray(first.value)) {
                    first.value[0].id = 'mutated';
                }
                expect(getAuthoredDefault(field)).toEqual({ hasValue: true, value, selectLoggedUser: true });
            }
        });

        it('should report no authored value when the definition has no own value', () => {
            const field = new FormFieldModel(new FormModel(), { id: 'missing', type: 'people', selectLoggedUser: true });
            expect(getAuthoredDefault(field)).toEqual({ hasValue: false, value: undefined, selectLoggedUser: true });
        });
    });

    describe('captureAuthoredDefinition', () => {
        it('should keep non-array column entries and drop cyclic references when capturing a definition', () => {
            const cyclic: Record<string, unknown> = { id: 'cyclic' };
            cyclic.self = cyclic;
            const definition = { id: 'section', fields: { 1: 'not-an-array' }, params: cyclic };
            const captured = captureAuthoredDefinition(definition);
            expect(captured.fields).toEqual({ 1: 'not-an-array' });
            expect(captured.params).toEqual({ id: 'cyclic', self: undefined });
        });
    });

    describe('withFormWrite', () => {
        it('should restore the outer write context when a nested write throws', () => {
            const form = createForm();
            const field = form.getFieldById('text');
            const context = bind(form);
            const nested = { ...context, invocation: {} };
            withFormWrite(field, context, () => {
                expect(currentFormWrite(field)).toBe(context);
                expect(() =>
                    withFormWrite(field, nested, () => {
                        throw new Error('setter');
                    })
                ).toThrowError('setter');
                expect(currentFormWrite(field)).toBe(context);
            });
            expect(currentFormWrite(field)).toBeUndefined();
        });

        it('should clear the write context for a nested unmarked write and restore it for the caller', () => {
            const form = createForm();
            const field = form.getFieldById('text');
            const context = bind(form);
            const contexts: FormWriteContext[] = [];
            const restored: FormWriteContext[] = [];
            const subscription = service.formFieldValueChanged.subscribe((event) => {
                contexts.push(event.writeContext);
                if (event.field.value === 'marked') {
                    form.changeFieldValue('text', 'unmarked');
                    restored.push(currentFormWrite(field));
                }
            });
            try {
                form.changeFieldValue('text', 'marked', context);
            } finally {
                subscription.unsubscribe();
            }
            expect(contexts).toEqual([context, undefined]);
            expect(restored).toEqual([context]);
            expect(currentFormWrite(field)).toBeUndefined();
        });

        it('should skip the write when the context is no longer current', () => {
            const form = createForm();
            const context = bind(form, () => false);
            const write = jasmine.createSpy('write');
            withFormWrite(form.getFieldById('text'), context, write);
            expect(write).not.toHaveBeenCalled();
        });
    });

    describe('runFormMutation', () => {
        it('should share the pending result when the same invocation runs again', async () => {
            const context = bind(createForm());
            let finish: (value: FormResetResult) => void;
            const reset = jasmine.createSpy('reset').and.returnValue(new Promise<FormResetResult>((resolve) => (finish = resolve)));
            const first = runFormMutation(context, reset);
            const second = runFormMutation(context, reset);
            expect(second).toBe(first);
            expect(isFormMutating(context.form)).toBeTrue();
            finish(result(context));
            expect(await first).toEqual(result(context));
            expect(reset).toHaveBeenCalledTimes(1);
            expect(isFormMutating(context.form)).toBeFalse();
        });

        it('should return unavailable when another invocation owns the form', async () => {
            const context = bind(createForm());
            const pending = runFormMutation(context, () => new Promise<FormResetResult>(() => undefined));
            const other = { ...context, invocation: {} };
            expect(await runFormMutation(other, () => Promise.resolve(result(other)))).toEqual({ context: other, status: 'unavailable', items: [] });
            bindFormState(context.form, {}, {});
            expect((await pending).status).toBe('unavailable');
        });

        it('should return failed when the reset throws synchronously', async () => {
            const context = bind(createForm());
            const failure = new Error('reset');
            const reportError = jasmine.createSpy('reportError');
            const outcome = await runFormMutation(
                context,
                () => {
                    throw failure;
                },
                reportError
            );
            expect(outcome).toEqual({ context, status: 'failed', items: [] });
            expect(reportError).toHaveBeenCalledOnceWith(failure);
        });

        it('should return unavailable when the reset rejects after the invocation became stale', async () => {
            let current = true;
            const context = bind(createForm(), () => current);
            const failure = new Error('reset');
            const reportError = jasmine.createSpy('reportError');
            const outcome = await runFormMutation(
                context,
                () => {
                    current = false;
                    return Promise.reject(failure);
                },
                reportError
            );
            expect(outcome).toEqual({ context, status: 'unavailable', items: [] });
            expect(reportError).toHaveBeenCalledOnceWith(failure);
        });
    });

    describe('withFormMutationWrite', () => {
        it('should permit a field setter only inside the write when the reset owner completes it', async () => {
            const form = createForm();
            const field = form.getFieldById('text');
            const context = bind(form);
            let finish: (value: FormResetResult) => void;
            const pending = runFormMutation(context, () => new Promise<FormResetResult>((resolve) => (finish = resolve)));
            expect(canWriteFormField(field)).toBeFalse();
            withFormMutationWrite(field, context, () => {
                expect(canWriteFormField(field)).toBeTrue();
                withFormMutationWrite(field, context, () => (field.value = 'uploaded'));
                expect(canWriteFormField(field)).toBeTrue();
            });
            expect(canWriteFormField(field)).toBeFalse();
            expect(field.value).toBe('uploaded');
            finish(result(context));
            await pending;
        });

        it('should skip the write when the context does not own the reset', () => {
            const form = createForm();
            const write = jasmine.createSpy('write');
            withFormMutationWrite(form.getFieldById('text'), bind(form), write);
            expect(write).not.toHaveBeenCalled();
        });
    });
});
