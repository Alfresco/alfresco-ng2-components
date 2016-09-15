/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { it, describe, expect } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { SimpleChange } from '@angular/core';
import { ActivitiForm } from './activiti-form.component';
import { FormModel, FormOutcomeModel, FormFieldModel, FormOutcomeEvent } from './widgets/index';
import { FormService } from './../services/form.service';
import { WidgetVisibilityService } from './../services/widget-visibility.service';
// import { ContainerWidget } from './widgets/container/container.widget';

describe('ActivitiForm', () => {

    let componentHandler: any;
    let formService: FormService;
    let formComponent: ActivitiForm;
    let visibilityService:  WidgetVisibilityService;

    beforeEach(() => {
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        visibilityService =  jasmine.createSpyObj('WidgetVisibilityService', [
            'updateVisibilityForForm', 'getTaskProcessVariableModelsForTask'
        ]);
        window['componentHandler'] = componentHandler;

        formService = new FormService(null, null);
        formComponent = new ActivitiForm(formService, visibilityService, null, null);
    });

    it('should upgrade MDL content on view checked', () => {
        formComponent.ngAfterViewChecked();
        expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();
    });

    it('should setup MDL content only if component handler available', () => {
        expect(formComponent.setupMaterialComponents()).toBeTruthy();

        window['componentHandler'] = null;
        expect(formComponent.setupMaterialComponents()).toBeFalsy();
    });

    it('should start loading form on init', () => {
        spyOn(formComponent, 'loadForm').and.stub();
        formComponent.ngOnInit();
        expect(formComponent.loadForm).toHaveBeenCalled();
    });

    it('should check form', () => {
        expect(formComponent.hasForm()).toBeFalsy();
        formComponent.form = new FormModel();
        expect(formComponent.hasForm()).toBeTruthy();
    });

    it('should allow title if task name available', () => {
        let formModel = new FormModel();
        formComponent.form = formModel;

        expect(formComponent.showTitle).toBeTruthy();
        expect(formModel.taskName).toBe(FormModel.UNSET_TASK_NAME);
        expect(formComponent.isTitleEnabled()).toBeTruthy();

        // override property as it's the readonly one
        Object.defineProperty(formModel, 'taskName', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: null
        });

        expect(formComponent.isTitleEnabled()).toBeFalsy();
    });

    it('should not allow title', () => {
        let formModel = new FormModel();

        formComponent.form = formModel;
        formComponent.showTitle = false;

        expect(formModel.taskName).toBe(FormModel.UNSET_TASK_NAME);
        expect(formComponent.isTitleEnabled()).toBeFalsy();
    });

    it('should not enable outcome button when model missing', () => {
        expect(formComponent.isOutcomeButtonVisible(null)).toBeFalsy();
    });

    it('should enable custom outcome buttons', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: 'action1', name: 'Action 1' });
        expect(formComponent.isOutcomeButtonVisible(outcome)).toBeTruthy();
    });


    it('should allow controlling [complete] button visibility', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome)).toBeTruthy();

        formComponent.showSaveButton = false;
        expect(formComponent.isOutcomeButtonVisible(outcome)).toBeFalsy();
    });

    it('should allow controlling [save] button visibility', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.COMPLETE_ACTION });

        formComponent.showCompleteButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome)).toBeTruthy();

        formComponent.showCompleteButton = false;
        expect(formComponent.isOutcomeButtonVisible(outcome)).toBeFalsy();
    });

    it('should load form on refresh', () => {
        spyOn(formComponent, 'loadForm').and.stub();

        formComponent.onRefreshClicked();
        expect(formComponent.loadForm).toHaveBeenCalled();
    });

    it('should get form by task id on load', () => {
        spyOn(formComponent, 'getFormByTaskId').and.stub();
        const taskId = '123';

        formComponent.taskId = taskId;
        formComponent.loadForm();

        expect(formComponent.getFormByTaskId).toHaveBeenCalledWith(taskId);
        expect(visibilityService.getTaskProcessVariableModelsForTask).toHaveBeenCalledWith(taskId);
    });

    it('should get form definition by form id on load', () => {
        spyOn(formComponent, 'getFormDefinitionByFormId').and.stub();
        const formId = '123';

        formComponent.formId = formId;
        formComponent.loadForm();

        expect(formComponent.getFormDefinitionByFormId).toHaveBeenCalledWith(formId);
    });

    it('should get form definition by form name on load', () => {
        spyOn(formComponent, 'getFormDefinitionByFormName').and.stub();
        const formName = '<form>';

        formComponent.formName = formName;
        formComponent.loadForm();

        expect(formComponent.getFormDefinitionByFormName).toHaveBeenCalledWith(formName);
    });

    it('should reload form by task id on binding changes', () => {
        spyOn(formComponent, 'getFormByTaskId').and.stub();
        const taskId = '<task id>';

        let change = new SimpleChange(null, taskId);
        formComponent.ngOnChanges({ 'taskId': change });

        expect(formComponent.getFormByTaskId).toHaveBeenCalledWith(taskId);
    });

    it('should reload form definition by form id on binding changes', () => {
        spyOn(formComponent, 'getFormDefinitionByFormId').and.stub();
        const formId = '123';

        let change = new SimpleChange(null, formId);
        formComponent.ngOnChanges({ 'formId': change });

        expect(formComponent.getFormDefinitionByFormId).toHaveBeenCalledWith(formId);
    });

    it('should reload form definition by name on binding changes', () => {
        spyOn(formComponent, 'getFormDefinitionByFormName').and.stub();
        const formName = '<form>';

        let change = new SimpleChange(null, formName);
        formComponent.ngOnChanges({ 'formName': change });

        expect(formComponent.getFormDefinitionByFormName).toHaveBeenCalledWith(formName);
    });

    it('should not get form on load', () => {
        spyOn(formComponent, 'getFormByTaskId').and.stub();
        spyOn(formComponent, 'getFormDefinitionByFormId').and.stub();
        spyOn(formComponent, 'getFormDefinitionByFormName').and.stub();

        formComponent.taskId = null;
        formComponent.formId = null;
        formComponent.formName = null;
        formComponent.loadForm();

        expect(formComponent.getFormByTaskId).not.toHaveBeenCalled();
        expect(formComponent.getFormDefinitionByFormId).not.toHaveBeenCalled();
        expect(formComponent.getFormDefinitionByFormName).not.toHaveBeenCalled();
    });

    it('should not reload form on binding changes', () => {
        spyOn(formComponent, 'getFormByTaskId').and.stub();
        spyOn(formComponent, 'getFormDefinitionByFormId').and.stub();
        spyOn(formComponent, 'getFormDefinitionByFormName').and.stub();

        formComponent.ngOnChanges({ 'tag': new SimpleChange(null, 'hello world')});

        expect(formComponent.getFormByTaskId).not.toHaveBeenCalled();
        expect(formComponent.getFormDefinitionByFormId).not.toHaveBeenCalled();
        expect(formComponent.getFormDefinitionByFormName).not.toHaveBeenCalled();
    });

    it('should complete form on custom outcome click', () => {
        let formModel = new FormModel();
        let outcomeName = 'Custom Action';
        let outcome = new FormOutcomeModel(formModel, { id: 'custom1', name: outcomeName });

        let saved = false;
        formComponent.form = formModel;
        formComponent.formSaved.subscribe(v => saved = true);
        spyOn(formComponent, 'completeTaskForm').and.stub();

        let result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(saved).toBeTruthy();
        expect(formComponent.completeTaskForm).toHaveBeenCalledWith(outcomeName);
    });

    it('should save form on [save] outcome click', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, {
            id: ActivitiForm.SAVE_OUTCOME_ID,
            name: 'Save',
            isSystem: true
        });

        formComponent.form = formModel;
        spyOn(formComponent, 'saveTaskForm').and.stub();

        let result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(formComponent.saveTaskForm).toHaveBeenCalled();
    });

    it('should complete form on [complete] outcome click', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, {
            id: ActivitiForm.COMPLETE_OUTCOME_ID,
            name: 'Complete',
            isSystem: true
        });

        formComponent.form = formModel;
        spyOn(formComponent, 'completeTaskForm').and.stub();

        let result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(formComponent.completeTaskForm).toHaveBeenCalled();
    });

    it('should emit form saved event on custom outcome click', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, {
            id: ActivitiForm.CUSTOM_OUTCOME_ID,
            name: 'Custom',
            isSystem: true
        });

        let saved = false;
        formComponent.form = formModel;
        formComponent.formSaved.subscribe(v => saved = true);

        let result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(saved).toBeTruthy();
    });

    it('should do nothing when clicking outcome for readonly form', () => {
        let formModel = new FormModel();
        const outcomeName = 'Custom Action';
        let outcome = new FormOutcomeModel(formModel, { id: 'custom1', name: outcomeName });

        formComponent.form = formModel;
        spyOn(formComponent, 'completeTaskForm').and.stub();

        expect(formComponent.onOutcomeClicked(outcome)).toBeTruthy();
        formComponent.readOnly = true;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should require outcome model when clicking outcome', () => {
        formComponent.form = new FormModel();
        formComponent.readOnly = false;
        expect(formComponent.onOutcomeClicked(null)).toBeFalsy();
    });

    it('should require loaded form when clicking outcome', () => {
        let formModel = new FormModel();
        const outcomeName = 'Custom Action';
        let outcome = new FormOutcomeModel(formModel, { id: 'custom1', name: outcomeName });

        formComponent.readOnly = false;
        formComponent.form = null;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should not execute unknown system outcome', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: 'unknown', name: 'Unknown', isSystem: true });

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should require custom action name to complete form', () => {
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: 'custom' });

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();

        outcome = new FormOutcomeModel(formModel, { id: 'custom', name: 'Custom' });
        spyOn(formComponent, 'completeTaskForm').and.stub();
        expect(formComponent.onOutcomeClicked(outcome)).toBeTruthy();
    });

    it('should fetch and parse form by task id', () => {
        spyOn(formService, 'getTaskForm').and.callFake((taskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: taskId });
                observer.complete();
            });
        });

        const taskId = '456';
        let loaded = false;
        formComponent.formLoaded.subscribe(() => loaded = true);

        expect(formComponent.form).toBeUndefined();
        formComponent.getFormByTaskId(taskId);

        expect(loaded).toBeTruthy();
        expect(formService.getTaskForm).toHaveBeenCalledWith(taskId);
        expect(formComponent.form).toBeDefined();
        expect(formComponent.form.taskId).toBe(taskId);
    });

    it('should handle error when getting form by task id', () => {
        const error = 'Some error';

        spyOn(formComponent, 'handleError').and.stub();
        spyOn(formService, 'getTaskForm').and.callFake((taskId) => {
            return Observable.throw(error);
        });

        formComponent.getFormByTaskId('123');
        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should apply readonly state when getting form by task id', () => {
        spyOn(formService, 'getTaskForm').and.callFake((taskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: taskId });
                observer.complete();
            });
        });

        formComponent.readOnly = true;
        formComponent.getFormByTaskId('123');

        expect(formComponent.form).toBeDefined();
        expect(formComponent.form.readOnly).toBe(true);
    });

    it('should fetch and parse form definition by id', () => {
        spyOn(formService, 'getFormDefinitionById').and.callFake((formId) => {
            return Observable.create(observer => {
                observer.next({ id: formId });
                observer.complete();
            });
        });

        const formId = '456';
        let loaded = false;
        formComponent.formLoaded.subscribe(() => loaded = true);

        expect(formComponent.form).toBeUndefined();
        formComponent.getFormDefinitionByFormId(formId);

        expect(loaded).toBeTruthy();
        expect(formService.getFormDefinitionById).toHaveBeenCalledWith(formId);
        expect(formComponent.form).toBeDefined();
        expect(formComponent.form.id).toBe(formId);
    });

    it('should handle error when getting form by definition id', () => {
        const error = 'Some error';

        spyOn(formComponent, 'handleError').and.stub();
        spyOn(formService, 'getFormDefinitionById').and.callFake(() => Observable.throw(error));

        formComponent.getFormDefinitionByFormId('123');
        expect(formService.getFormDefinitionById).toHaveBeenCalledWith('123');
        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should fetch and parse form definition by form name', () => {
        spyOn(formService, 'getFormDefinitionByName').and.callFake((formName) => {
            return Observable.create(observer => {
                observer.next(formName);
                observer.complete();
            });
        });

        spyOn(formService, 'getFormDefinitionById').and.callFake((formName) => {
            return Observable.create(observer => {
                observer.next({ name: formName });
                observer.complete();
            });
        });

        const formName = '<form>';
        let loaded = false;
        formComponent.formLoaded.subscribe(() => loaded = true);

        expect(formComponent.form).toBeUndefined();
        formComponent.getFormDefinitionByFormName(formName);

        expect(loaded).toBeTruthy();
        expect(formService.getFormDefinitionByName).toHaveBeenCalledWith(formName);
        expect(formComponent.form).toBeDefined();
        expect(formComponent.form.name).toBe(formName);
    });

    it('should save task form and raise corresponding event', () => {
        spyOn(formService, 'saveTaskForm').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        let saved = false;
        let savedForm = null;
        formComponent.formSaved.subscribe(form => {
            saved = true;
            savedForm = form;
        });

        let formModel = new FormModel({
            taskId: '123',
            fields: [
                { id: 'field1' },
                { id: 'field2' }
            ]
        });
        formComponent.form = formModel;
        formComponent.saveTaskForm();

        expect(formService.saveTaskForm).toHaveBeenCalledWith(formModel.taskId, formModel.values);
        expect(saved).toBeTruthy();
        expect(savedForm).toEqual(formModel);
    });

    it('should handle error during form save', () => {
        const error = 'Error';
        spyOn(formService, 'saveTaskForm').and.callFake(() => Observable.throw(error));
        spyOn(formComponent, 'handleError').and.stub();

        formComponent.form = new FormModel({ taskId: '123' });
        formComponent.saveTaskForm();

        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should require form with task id to save', () => {
        spyOn(formService, 'saveTaskForm').and.stub();

        formComponent.form = null;
        formComponent.saveTaskForm();

        formComponent.form = new FormModel();
        formComponent.saveTaskForm();

        expect(formService.saveTaskForm).not.toHaveBeenCalled();
    });

    it('should require form with task id to complete', () => {
        spyOn(formService, 'completeTaskForm').and.stub();

        formComponent.form = null;
        formComponent.completeTaskForm('save');

        formComponent.form = new FormModel();
        formComponent.completeTaskForm('complete');

        expect(formService.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should log error to console by default', () => {
        const error = 'Error';
        spyOn(console, 'log').and.stub();
        formComponent.handleError(error);
        expect(console.log).toHaveBeenCalledWith(error);
    });

    it('should complete form form and raise corresponding event', () => {
        spyOn(formService, 'completeTaskForm').and.callFake(() => {
             return Observable.create(observer => {
                 observer.next();
                 observer.complete();
             });
        });

        const outcome = 'complete';
        let completed = false;
        formComponent.formCompleted.subscribe(() => completed = true);

        let formModel = new FormModel({
            taskId: '123',
            fields: [
                { id: 'field1' },
                { id: 'field2' }
            ]
        });

        formComponent.form = formModel;
        formComponent.completeTaskForm(outcome);

        expect(formService.completeTaskForm).toHaveBeenCalledWith(formModel.taskId, formModel.values, outcome);
        expect(completed).toBeTruthy();
    });

    it('should require json to parse form', () => {
        expect(formComponent.parseForm(null)).toBeNull();
    });

    it('should parse form from json', () => {
        let form = formComponent.parseForm({
            id: '<id>',
            fields: [
                { id: 'field1' }
            ]
        });

        expect(form).toBeDefined();
        expect(form.id).toBe('<id>');
        expect(form.fields.length).toBe(1);
        expect(form.fields[0].id).toBe('field1');
    });

    it('should provide outcomes for form definition', () => {
        spyOn(formComponent, 'getFormDefinitionOutcomes').and.callThrough();

        let form = formComponent.parseForm({ id: '<id>' });
        expect(formComponent.getFormDefinitionOutcomes).toHaveBeenCalledWith(form);
    });

    /*
    it('should update the visibility when the container raise the change event', (valueChanged) => {
        spyOn(formComponent, 'checkVisibility').and.callThrough();
        let widget = new ContainerWidget();
        let fakeForm = new FormModel();
        let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
        widget.formValueChanged.subscribe(field => { valueChanged(); });
        widget.fieldChanged(fakeField);

        expect(formComponent.checkVisibility).toHaveBeenCalledWith(fakeField);
    });
    */

    it('should prevent default outcome execution', () => {

        let outcome = new FormOutcomeModel(new FormModel(), {
            id: ActivitiForm.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        formComponent.form = new FormModel();
        formComponent.executeOutcome.subscribe((event: FormOutcomeEvent) => {
            expect(event.outcome).toBe(outcome);
            event.preventDefault();
            expect(event.defaultPrevented).toBeTruthy();
        });

        let result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeFalsy();
    });

    it('should not prevent default outcome execution', () => {
        let outcome = new FormOutcomeModel(new FormModel(), {
            id: ActivitiForm.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        formComponent.form = new FormModel();
        formComponent.executeOutcome.subscribe((event: FormOutcomeEvent) => {
            expect(event.outcome).toBe(outcome);
            expect(event.defaultPrevented).toBeFalsy();
        });

        spyOn(formComponent, 'completeTaskForm').and.callThrough();

        let result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();

        expect(formComponent.completeTaskForm).toHaveBeenCalledWith(outcome.name);
    });

    it('should check visibility only if field with form provided', () => {

        formComponent.checkVisibility(null);
        expect(visibilityService.updateVisibilityForForm).not.toHaveBeenCalled();

        let field = new FormFieldModel(null);
        formComponent.checkVisibility(field);
        expect(visibilityService.updateVisibilityForForm).not.toHaveBeenCalled();

        field = new FormFieldModel(new FormModel());
        formComponent.checkVisibility(field);
        expect(visibilityService.updateVisibilityForForm).toHaveBeenCalledWith(field.form);
    });

});
