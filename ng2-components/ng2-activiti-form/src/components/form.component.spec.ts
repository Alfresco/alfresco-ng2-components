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

import { SimpleChange } from '@angular/core';
import { LogService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { fakeForm } from '../assets/form.component.mock';
import { FormService } from './../services/form.service';
import { NodeService } from './../services/node.service';
import { WidgetVisibilityService } from './../services/widget-visibility.service';
import { FormComponent } from './form.component';
import { FormFieldModel, FormFieldTypes, FormModel, FormOutcomeEvent, FormOutcomeModel } from './widgets/index';

describe('FormComponent', () => {

    let componentHandler: any;
    let formService: FormService;
    let formComponent: FormComponent;
    let visibilityService: WidgetVisibilityService;
    let nodeService: NodeService;
    let logService: LogService;

    beforeEach(() => {
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;

        logService = new LogService();
        visibilityService = new WidgetVisibilityService(null, logService);
        spyOn(visibilityService, 'refreshVisibility').and.stub();
        formService = new FormService(null, null, logService);
        nodeService = new NodeService(null);
        formComponent = new FormComponent(formService, visibilityService, null, nodeService);
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
        expect(formComponent.isOutcomeButtonVisible(null, false)).toBeFalsy();
    });

    it('should enable custom outcome buttons', () => {
        let formModel = new FormModel();
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: 'action1', name: 'Action 1' });
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should allow controlling [complete] button visibility', () => {
        let formModel = new FormModel();
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        formComponent.showSaveButton = false;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show only [complete] button with readOnly form ', () => {
        let formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$complete', name: FormOutcomeModel.COMPLETE_ACTION });

        formComponent.showCompleteButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should not show [save] button with readOnly form ', () => {
        let formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show [custom-outcome] button with readOnly form and selected custom-outcome', () => {
        let formModel = new FormModel({ selectedOutcome: 'custom-outcome' });
        formModel.readOnly = true;
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$customoutome', name: 'custom-outcome' });

        formComponent.showCompleteButton = true;
        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        outcome = new FormOutcomeModel(formModel, { id: '$customoutome2', name: 'custom-outcome2' });
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should allow controlling [save] button visibility', () => {
        let formModel = new FormModel();
        formModel.readOnly = false;
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.COMPLETE_ACTION });

        formComponent.showCompleteButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        formComponent.showCompleteButton = false;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
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
    });

    it('should get process variable if is a process task', () => {
        spyOn(formService, 'getTaskForm').and.callFake((currentTaskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: currentTaskId });
                observer.complete();
            });
        });

        spyOn(visibilityService, 'getTaskProcessVariable').and.returnValue(Observable.of({}));
        spyOn(formService, 'getTask').and.callFake((currentTaskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: currentTaskId, processDefinitionId: '10201' });
                observer.complete();
            });
        });
        const taskId = '123';

        formComponent.taskId = taskId;
        formComponent.loadForm();

        expect(visibilityService.getTaskProcessVariable).toHaveBeenCalledWith(taskId);
    });

    it('should not get process variable if is not a process task', () => {
        spyOn(formService, 'getTaskForm').and.callFake((currentTaskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: currentTaskId });
                observer.complete();
            });
        });

        spyOn(visibilityService, 'getTaskProcessVariable').and.returnValue(Observable.of({}));
        spyOn(formService, 'getTask').and.callFake((currentTaskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: currentTaskId, processDefinitionId: 'null' });
                observer.complete();
            });
        });
        const taskId = '123';

        formComponent.taskId = taskId;
        formComponent.loadForm();

        expect(visibilityService.getTaskProcessVariable).toHaveBeenCalledWith(taskId);
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

        let change = new SimpleChange(null, taskId, true);
        formComponent.ngOnChanges({ 'taskId': change });

        expect(formComponent.getFormByTaskId).toHaveBeenCalledWith(taskId);
    });

    it('should reload form definition by form id on binding changes', () => {
        spyOn(formComponent, 'getFormDefinitionByFormId').and.stub();
        const formId = '123';

        let change = new SimpleChange(null, formId, true);
        formComponent.ngOnChanges({ 'formId': change });

        expect(formComponent.getFormDefinitionByFormId).toHaveBeenCalledWith(formId);
    });

    it('should reload form definition by name on binding changes', () => {
        spyOn(formComponent, 'getFormDefinitionByFormName').and.stub();
        const formName = '<form>';

        let change = new SimpleChange(null, formName, true);
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

        formComponent.ngOnChanges({ 'tag': new SimpleChange(null, 'hello world', true) });

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
            id: FormComponent.SAVE_OUTCOME_ID,
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
            id: FormComponent.COMPLETE_OUTCOME_ID,
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
            id: FormComponent.CUSTOM_OUTCOME_ID,
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

    it('should fetch and parse form by task id', (done) => {
        spyOn(formService, 'getTask').and.returnValue(Observable.of({}));
        spyOn(formService, 'getTaskForm').and.callFake((currentTaskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: currentTaskId });
                observer.complete();
            });
        });

        const taskId = '456';
        formComponent.formLoaded.subscribe(() => {
            expect(formService.getTaskForm).toHaveBeenCalledWith(taskId);
            expect(formComponent.form).toBeDefined();
            expect(formComponent.form.taskId).toBe(taskId);
            done();
        });

        expect(formComponent.form).toBeUndefined();
        formComponent.getFormByTaskId(taskId);
    });

    it('should handle error when getting form by task id', (done) => {
        const error = 'Some error';

        spyOn(formService, 'getTask').and.returnValue(Observable.of({}));
        spyOn(formComponent, 'handleError').and.stub();
        spyOn(formService, 'getTaskForm').and.callFake((taskId) => {
            return Observable.throw(error);
        });

        formComponent.getFormByTaskId('123').then(_ => {
            expect(formComponent.handleError).toHaveBeenCalledWith(error);
            done();
        });
    });

    it('should apply readonly state when getting form by task id', (done) => {
        spyOn(formService, 'getTask').and.returnValue(Observable.of({}));
        spyOn(formService, 'getTaskForm').and.callFake((taskId) => {
            return Observable.create(observer => {
                observer.next({ taskId: taskId });
                observer.complete();
            });
        });

        formComponent.readOnly = true;
        formComponent.getFormByTaskId('123').then(_ => {
            expect(formComponent.form).toBeDefined();
            expect(formComponent.form.readOnly).toBe(true);
            done();
        });
    });

    it('should fetch and parse form definition by id', () => {
        spyOn(formService, 'getFormDefinitionById').and.callFake((currentFormId) => {
            return Observable.create(observer => {
                observer.next({ id: currentFormId });
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
        spyOn(formService, 'getFormDefinitionByName').and.callFake((currentFormName) => {
            return Observable.create(observer => {
                observer.next(currentFormName);
                observer.complete();
            });
        });

        spyOn(formService, 'getFormDefinitionById').and.callFake((currentFormName) => {
            return Observable.create(observer => {
                observer.next({ name: currentFormName });
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
                { id: 'field1', type: FormFieldTypes.CONTAINER }
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
     let widget = new ContainerWidgetComponent();
     let fakeForm = new FormModel();
     let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
     widget.formValueChanged.subscribe(field => { valueChanged(); });
     widget.fieldChanged(fakeField);

     expect(formComponent.checkVisibility).toHaveBeenCalledWith(fakeField);
     });
     */

    it('should prevent default outcome execution', () => {

        let outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
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
            id: FormComponent.CUSTOM_OUTCOME_ID,
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
        expect(visibilityService.refreshVisibility).not.toHaveBeenCalled();

        let field = new FormFieldModel(null);
        formComponent.checkVisibility(field);
        expect(visibilityService.refreshVisibility).not.toHaveBeenCalled();

        field = new FormFieldModel(new FormModel());
        formComponent.checkVisibility(field);
        expect(visibilityService.refreshVisibility).toHaveBeenCalledWith(field.form);
    });

    it('should load form for ecm node', () => {
        let metadata = {};
        spyOn(nodeService, 'getNodeMetadata').and.returnValue(
            Observable.create(observer => {
                observer.next({ metadata: metadata });
                observer.complete();
            })
        );
        spyOn(formComponent, 'loadFormFromActiviti').and.stub();

        const nodeId = '<id>';
        let change = new SimpleChange(null, nodeId, false);
        formComponent.ngOnChanges({'nodeId' : change});

        expect(nodeService.getNodeMetadata).toHaveBeenCalledWith(nodeId);
        expect(formComponent.loadFormFromActiviti).toHaveBeenCalled();
        expect(formComponent.data).toBe(metadata);
    });

    it('should disable outcome buttons for readonly form', () => {
        let formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;

        let outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeFalsy();
    });

    it('should require outcome to eval button state', () => {
        formComponent.form = new FormModel();
        expect(formComponent.isOutcomeButtonEnabled(null)).toBeFalsy();
    });

    it('should always enable save outcome for writeable form', () => {
        let formModel = new FormModel();
        let field = new FormFieldModel(formModel, {
            type: 'text',
            value: null,
            required: true
        });

        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeFalsy();

        let outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.SAVE_OUTCOME_ID,
            name: FormOutcomeModel.SAVE_ACTION
        });

        formComponent.readOnly = true;
        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeTruthy();
    });

    it('should disable oucome buttons for invalid form', () => {
        let formModel = new FormModel();
        let field = new FormFieldModel(formModel, {
            type: 'text',
            value: null,
            required: true
        });

        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeFalsy();

        let outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeFalsy();
    });

    it('should disable complete outcome button when disableCompleteButton is true', () => {
        let formModel = new FormModel();
        formComponent.form = formModel;
        formComponent.disableCompleteButton = true;

        expect(formModel.isValid).toBeTruthy();
        let completeOutcome = formComponent.form.outcomes.find(outcome => outcome.name === FormOutcomeModel.COMPLETE_ACTION);

        expect(formComponent.isOutcomeButtonEnabled(completeOutcome)).toBeFalsy();
    });

    it('should raise [executeOutcome] event for formService', (done) => {
        formService.executeOutcome.subscribe(() => {
            done();
        });

        let outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        formComponent.form = new FormModel();
        formComponent.onOutcomeClicked(outcome);
    });

    it('should refresh form values when data is changed', () => {
        formComponent.form = new FormModel(fakeForm);
        let formFields = formComponent.form.getFormFields();

        let labelField = formFields.find(field => field.id === 'label');
        let radioField = formFields.find(field => field.id === 'raduio');
        expect(labelField.value).toBe('empty');
        expect(radioField.value).toBeNull();

        let formValues: any = {};
        formValues.label = {
            id: 'option_1',
            name: 'test1'
        };
        formValues.raduio = { id: 'option_1', name: 'Option 1' };
        let change = new SimpleChange(null, formValues, false);
        formComponent.data = formValues;
        formComponent.ngOnChanges({ 'data': change });

        formFields = formComponent.form.getFormFields();
        labelField = formFields.find(field => field.id === 'label');
        radioField = formFields.find(field => field.id === 'raduio');
        expect(labelField.value).toBe('option_1');
        expect(radioField.value).toBe('option_1');
    });
});
