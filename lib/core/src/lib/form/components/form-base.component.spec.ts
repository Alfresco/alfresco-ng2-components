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

    it('should execute a rule-hidden outcome using its stable id', () => {
        expect(component.isOutcomeButtonVisible(target, false)).toBeFalse();
        expect(component.onOutcomeRequested('approve')).toBeTrue();
        expect(component.completeTaskForm).toHaveBeenCalledOnceWith(target.name, target.id);
    });

    it('should validate the latest field requirements before executing an outcome', () => {
        const field = {
            required: false,
            value: '',
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
        component.form.fieldsCache = [jasmine.createSpyObj('FormFieldModel', { validate: false })];

        expect(component.onOutcomeRequested('approve')).toBeFalse();
        expect(component.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should show validation errors when the requested outcome requires a valid form', () => {
        component.form.fieldsCache = [jasmine.createSpyObj('FormFieldModel', { validate: false })];

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
