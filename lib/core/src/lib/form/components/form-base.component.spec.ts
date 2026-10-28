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

import { FormOutcomeNotFoundError } from '../errors/form-outcome-not-found.error';
import { FormBaseComponent } from './form-base.component';
import { FormFieldModel, FormModel, FormOutcomeModel } from './widgets';
import { FormOutcomeExecutionUnavailableError } from '../errors/form-outcome-execution-unavailable.error';
import { beginFormMutation, bindFormState } from '../models/form-state.model';

class TestFormComponent extends FormBaseComponent {
    completeTaskForm = jasmine.createSpy('completeTaskForm');
    onRefreshClicked = jasmine.createSpy('onRefreshClicked');
    saveTaskForm = jasmine.createSpy('saveTaskForm');
    protected onTaskSaved = jasmine.createSpy('onTaskSaved');
    protected storeFormAsMetadata = jasmine.createSpy('storeFormAsMetadata');
    protected onExecuteOutcome = jasmine.createSpy('onExecuteOutcome').and.returnValue(true);
}

describe('FormBaseComponent', () => {
    let component: TestFormComponent;
    let target: FormOutcomeModel;

    beforeEach(() => {
        component = new TestFormComponent();
        component.form = new FormModel({ id: 'form', fields: [], outcomes: [{ id: 'approve', name: 'Approve' }] });
        target = component.form.outcomes.find((outcome) => outcome.id === 'approve');
        target.isVisible = false;
    });

    for (const [id, name, isSystem] of [
        [FormModel.SAVE_OUTCOME, FormOutcomeModel.SAVE_ACTION, true],
        [FormModel.COMPLETE_OUTCOME, FormOutcomeModel.COMPLETE_ACTION, true],
        [FormModel.START_PROCESS_OUTCOME, FormOutcomeModel.START_PROCESS_ACTION, true],
        [FormBaseComponent.CUSTOM_OUTCOME_ID, 'Metadata', true],
        ['configured', 'Custom name', false]
    ] as const) {
        it(`should retain ordinary ${id} routing when execution mode is absent`, () => {
            const outcome = new FormOutcomeModel(component.form, { id, name, isSystem });
            expect(component.onOutcomeClicked(outcome)).toBeTrue();
            if (id === FormModel.SAVE_OUTCOME) {
                expect(component.saveTaskForm).toHaveBeenCalledTimes(1);
            } else if (id === FormBaseComponent.CUSTOM_OUTCOME_ID) {
                expect(component['onTaskSaved']).toHaveBeenCalledOnceWith(component.form);
                expect(component['storeFormAsMetadata']).toHaveBeenCalledTimes(1);
            } else {
                expect(component.completeTaskForm).toHaveBeenCalledTimes(1);
            }
        });

        it(`should block rules-only ${id} before lifecycle or button state mutation`, () => {
            const outcome = new FormOutcomeModel(component.form, { id, name, isSystem, executionMode: 'rules-only' });
            const errors = spyOn(component.error, 'emit');
            expect(component.onOutcomeClicked(outcome)).toBeFalse();
            expect(component['onExecuteOutcome']).toHaveBeenCalledOnceWith(outcome);
            expect(errors).toHaveBeenCalledOnceWith(jasmine.any(FormOutcomeExecutionUnavailableError));
            const error = errors.calls.mostRecent().args[0] as FormOutcomeExecutionUnavailableError;
            expect(error.outcome).toBe(outcome);
            expect(error.status).toBe('unavailable');
            expect(component.saveTaskForm).not.toHaveBeenCalled();
            expect(component.completeTaskForm).not.toHaveBeenCalled();
            expect(component['onTaskSaved']).not.toHaveBeenCalled();
            expect(component['storeFormAsMetadata']).not.toHaveBeenCalled();
            expect(component.disableSaveButton).toBeFalse();
            expect(component.disableCompleteButton).toBeFalse();
        });
    }

    it('should disable outcome buttons and ignore outcome clicks when the form is being reset', () => {
        const context = {
            form: component.form,
            renderer: {},
            generation: {},
            invocation: {},
            documentVersion: '1',
            outcomeId: 'clear',
            isCurrent: () => true
        };
        bindFormState(component.form, context.renderer, context.generation);
        const errors = spyOn(component.error, 'emit');
        const boundary = beginFormMutation(context);
        let enabledWhileResetting: boolean;
        let clickedWhileResetting: boolean;

        try {
            enabledWhileResetting = component.isOutcomeButtonEnabled(target);
            clickedWhileResetting = component.onOutcomeClicked(target);
        } finally {
            boundary.release();
        }

        expect(enabledWhileResetting).toBeFalse();
        expect(clickedWhileResetting).toBeFalse();
        expect(component['onExecuteOutcome']).not.toHaveBeenCalled();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
        expect(errors).not.toHaveBeenCalled();
        expect(component.isOutcomeButtonEnabled(target)).toBeTrue();
    });

    it('should disable a rules-only outcome but keep an ordinary outcome enabled when the component is read only', () => {
        const rulesOnly = new FormOutcomeModel(component.form, { id: 'clear', name: 'Clear', executionMode: 'rules-only', skipValidation: true });
        const ordinary = new FormOutcomeModel(component.form, { id: 'ordinary', name: 'Ordinary', skipValidation: true });
        expect(component.isOutcomeButtonEnabled(rulesOnly)).toBeTrue();

        component.readOnly = true;

        expect(component.isOutcomeButtonEnabled(rulesOnly)).toBeFalse();
        expect(component.isOutcomeButtonEnabled(ordinary)).toBeTrue();
    });

    it('should fail closed for unsupported mode while preserving existing button locks', () => {
        const outcome = new FormOutcomeModel(component.form, { id: 'unknown', name: 'Save', executionMode: null });
        component.disableSaveButton = true;
        component.disableCompleteButton = true;
        const errors = spyOn(component.error, 'emit');
        expect(component.onOutcomeClicked(outcome)).toBeFalse();
        expect(component['onExecuteOutcome']).not.toHaveBeenCalled();
        expect(errors).toHaveBeenCalledOnceWith(jasmine.any(FormOutcomeExecutionUnavailableError));
        expect(component.disableSaveButton).toBeTrue();
        expect(component.disableCompleteButton).toBeTrue();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should preserve a real observer veto without reporting unavailable execution', () => {
        const outcome = new FormOutcomeModel(component.form, { id: 'clear', name: 'Clear', executionMode: 'rules-only' });
        component['onExecuteOutcome'].and.returnValue(false);
        const errors = spyOn(component.error, 'emit');
        expect(component.onOutcomeClicked(outcome)).toBeFalse();
        expect(errors).not.toHaveBeenCalled();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    for (const unavailable of ['readonly', 'invalid', 'disabled', 'unsupported'] as const) {
        it(`should report requested ${unavailable} nonordinary execution without fallback or lock mutation`, () => {
            const outcome = new FormOutcomeModel(component.form, {
                id: 'requested-id',
                name: unavailable === 'disabled' ? FormOutcomeModel.SAVE_ACTION : 'Configured name',
                executionMode: unavailable === 'unsupported' ? null : 'rules-only'
            });
            component.form.outcomes = [outcome];
            component.disableCompleteButton = true;
            component.disableSaveButton = unavailable === 'disabled';
            if (unavailable === 'readonly' || unavailable === 'unsupported') {
                component.form.readOnly = true;
            }
            if (unavailable === 'invalid') {
                component.form.fieldsCache = [jasmine.createSpyObj('FormFieldModel', { validate: false }, { isVisible: true })];
                component.form.isValid = true;
            }
            const errors = spyOn(component.error, 'emit');
            expect(component.onOutcomeRequested(outcome.id)).toBeFalse();
            expect(errors).toHaveBeenCalledOnceWith(jasmine.any(FormOutcomeExecutionUnavailableError));
            expect((errors.calls.mostRecent().args[0] as FormOutcomeExecutionUnavailableError).outcome).toBe(outcome);
            expect(component['onExecuteOutcome']).not.toHaveBeenCalled();
            expect(component.completeTaskForm).not.toHaveBeenCalled();
            expect(component.saveTaskForm).not.toHaveBeenCalled();
            expect(component.disableCompleteButton).toBeTrue();
            expect(component.disableSaveButton).toBe(unavailable === 'disabled');
            if (unavailable === 'invalid') {
                expect(component.form.isValid).toBeFalse();
                expect(component.form.showAllValidationErrors).toBeTrue();
            }
        });
    }

    it('should observe a valid requested rules-only target once while its runtime remains unavailable', () => {
        const outcome = new FormOutcomeModel(component.form, { id: 'rules', name: 'Configured name', executionMode: 'rules-only' });
        component.form.outcomes = [outcome];
        const validate = spyOn(component.form, 'validateForm').and.callThrough();
        expect(component.onOutcomeRequested(outcome.id)).toBeFalse();
        expect(validate).toHaveBeenCalledTimes(1);
        expect(component['onExecuteOutcome']).toHaveBeenCalledOnceWith(outcome);
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should execute a rule-hidden outcome using its stable id', () => {
        expect(component.isOutcomeButtonVisible(target, false)).toBeFalse();
        expect(component.onOutcomeRequested('approve')).toBeTrue();
        expect(component.completeTaskForm).toHaveBeenCalledOnceWith(target.name, target.id);
    });

    it('should validate the latest field requirements before executing an outcome', () => {
        const field = {
            required: false,
            value: '',
            isVisible: true,
            validate: () => !field.required || !!field.value
        } as FormFieldModel;
        component.form.fieldsCache = [field];
        component.form.validateForm();
        field.required = true;
        component.form.isValid = true;

        expect(component.onOutcomeRequested('approve')).toBeFalse();
        expect(component.form.showAllValidationErrors).toBeTrue();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should report a typed error when the configured outcome no longer exists', () => {
        const errorSpy = spyOn(component.error, 'emit');

        expect(component.onOutcomeRequested('deleted')).toBeFalse();
        expect(errorSpy).toHaveBeenCalledOnceWith(jasmine.any(FormOutcomeNotFoundError));
    });

    it('should preserve submission state when the configured outcome no longer exists', () => {
        component.disableSaveButton = true;
        component.disableCompleteButton = true;

        component.onOutcomeRequested('deleted');

        expect(component.disableSaveButton).toBeTrue();
        expect(component.disableCompleteButton).toBeTrue();
    });

    it('should not execute a target outcome when the form is invalid', () => {
        component.form.fieldsCache = [jasmine.createSpyObj('FormFieldModel', { validate: false }, { isVisible: true })];

        expect(component.onOutcomeRequested('approve')).toBeFalse();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should show validation errors when the requested outcome requires a valid form', () => {
        component.form.fieldsCache = [jasmine.createSpyObj('FormFieldModel', { validate: false }, { isVisible: true })];

        component.onOutcomeRequested('approve');

        expect(component.form.showAllValidationErrors).toBeTrue();
    });

    it('should execute a validation-skipping outcome without showing validation errors', () => {
        component.form.isValid = false;
        target.skipValidation = true;
        const validateFormSpy = spyOn(component.form, 'validateForm');

        expect(component.onOutcomeRequested('approve')).toBeTrue();
        expect(validateFormSpy).not.toHaveBeenCalled();
        expect(component.form.showAllValidationErrors).toBeFalse();
        expect(component.completeTaskForm).toHaveBeenCalledOnceWith(target.name, target.id);
    });

    it('should not execute a disabled validation-skipping complete outcome', () => {
        target = new FormOutcomeModel(component.form, {
            id: 'approve',
            name: FormOutcomeModel.COMPLETE_ACTION,
            skipValidation: true,
            isSystem: true
        });
        component.form.outcomes = [target];
        component.disableCompleteButton = true;

        expect(component.onOutcomeRequested('approve')).toBeFalse();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should not execute a disabled validation-skipping save outcome', () => {
        target = new FormOutcomeModel(component.form, {
            id: 'approve',
            name: FormOutcomeModel.SAVE_ACTION,
            skipValidation: true,
            isSystem: true
        });
        component.form.outcomes = [target];
        component.disableSaveButton = true;

        expect(component.onOutcomeRequested('approve')).toBeFalse();
        expect(component.saveTaskForm).not.toHaveBeenCalled();
    });

    it('should not execute a disabled validation-skipping start process outcome', () => {
        target = new FormOutcomeModel(component.form, {
            id: 'approve',
            name: FormOutcomeModel.START_PROCESS_ACTION,
            skipValidation: true,
            isSystem: true
        });
        component.form.outcomes = [target];
        component.disableStartProcessButton = true;

        expect(component.onOutcomeRequested('approve')).toBeFalse();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should save an invalid form without validation', () => {
        target = new FormOutcomeModel(component.form, {
            id: FormModel.SAVE_OUTCOME,
            name: FormOutcomeModel.SAVE_ACTION,
            isSystem: true
        });
        component.form.outcomes = [target];
        component.form.isValid = false;
        const validateFormSpy = spyOn(component.form, 'validateForm');

        expect(component.onOutcomeRequested(FormModel.SAVE_OUTCOME)).toBeTrue();
        expect(validateFormSpy).not.toHaveBeenCalled();
        expect(component.saveTaskForm).toHaveBeenCalledTimes(1);
    });

    it('should route a target outcome through the lifecycle exactly once', () => {
        expect(component.onOutcomeRequested('approve')).toBeTrue();
        expect(component.completeTaskForm).toHaveBeenCalledTimes(1);
    });

    it('should not execute a requested outcome when the form is read-only', () => {
        component.form.readOnly = true;

        const validateFormSpy = spyOn(component.form, 'validateForm');

        expect(component.onOutcomeRequested('approve')).toBeFalse();
        expect(validateFormSpy).not.toHaveBeenCalled();
        expect(component.form.showAllValidationErrors).toBeFalse();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });
});
