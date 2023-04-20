/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    SimpleChange,
    ComponentFactoryResolver,
    Injector,
    NgModule,
    Component,
    ViewChild,
    DebugElement
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { TaskRepresentation } from '@alfresco/js-api';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import {
    FormFieldModel, FormFieldTypes, FormModel, FormOutcomeEvent, FormOutcomeModel,
    FormService, WidgetVisibilityService, ContainerModel, fakeForm, setupTestBed
} from '@alfresco/adf-core';
import{ NodeMetadata, NodesApiService } from '@alfresco/adf-content-services';
import { FormComponent } from './form.component';
import { ProcessFormRenderingService } from './process-form-rendering.service';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TaskFormService } from './services/task-form.service';
import { TaskService } from './services/task.service';
import { EditorService } from './services/editor.service';
import { ModelService } from './services/model.service';

describe('FormComponent', () => {

    let fixture: ComponentFixture<FormComponent>;
    let formComponent: FormComponent;

    let formService: FormService;
    let visibilityService: WidgetVisibilityService;
    let taskFormService: TaskFormService;
    let taskService: TaskService;
    let editorService: EditorService;
    let modelService: ModelService;
    let nodeService: NodesApiService;
    let formRenderingService: ProcessFormRenderingService;

    @Component({
        selector: 'adf-custom-widget',
        template: '<div></div>'
    })
        // eslint-disable-next-line @angular-eslint/component-class-suffix
    class CustomWidget {
        typeId = 'CustomWidget';
    }

    @NgModule({
        declarations: [CustomWidget],
        exports: [CustomWidget]
    })
    class CustomUploadModule {
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule,
            CustomUploadModule
        ]
    });

    const buildWidget = (type: string, injector: Injector): any => {
        const resolver = formRenderingService.getComponentTypeResolver(type);
        const widgetType = resolver(null);

        const factoryResolver: ComponentFactoryResolver = TestBed.inject(ComponentFactoryResolver);
        const factory = factoryResolver.resolveComponentFactory(widgetType);
        const componentRef = factory.create(injector);

        return componentRef.instance;
    };

    beforeEach(() => {
        visibilityService = TestBed.inject(WidgetVisibilityService);
        spyOn(visibilityService, 'refreshVisibility').and.stub();

        nodeService = TestBed.inject(NodesApiService);
        formService = TestBed.inject(FormService);
        taskService = TestBed.inject(TaskService);
        taskFormService = TestBed.inject(TaskFormService);
        editorService = TestBed.inject(EditorService);
        modelService = TestBed.inject(ModelService);
        formRenderingService = TestBed.inject(ProcessFormRenderingService);

        fixture = TestBed.createComponent(FormComponent);
        formComponent = fixture.componentInstance;
    });

    it('should register custom [upload] widget', () => {
        const widget = buildWidget('upload', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('AttachFileWidgetComponent');
    });

    it('should register custom [select-folder] widget', () => {
        const widget = buildWidget('select-folder', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('AttachFolderWidgetComponent');
    });

    it('should allow to replace custom [upload] widget', () => {
        formRenderingService.setComponentTypeResolver('upload', () => CustomWidget, true);

        const widget = buildWidget('upload', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('CustomWidget');
    });

    it('should allow to replace custom [select-folder] widget', () => {
        formRenderingService.setComponentTypeResolver('select-folder', () => CustomWidget, true);

        const widget = buildWidget('select-folder', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('CustomWidget');
    });

    it('should check form', () => {
        expect(formComponent.hasForm()).toBeFalsy();
        formComponent.form = new FormModel();
        expect(formComponent.hasForm()).toBeTruthy();
    });

    it('should allow title if task name available', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;

        expect(formComponent.showTitle).toBeTruthy();
        expect(formModel.taskName).toBe(FormModel.UNSET_TASK_NAME);
        expect(formComponent.isTitleEnabled()).toBeTruthy();

        formComponent.form = null;

        expect(formComponent.isTitleEnabled()).toBeFalsy();
    });

    it('should not allow title', () => {
        const formModel = new FormModel();

        formComponent.form = formModel;
        formComponent.showTitle = false;

        expect(formModel.taskName).toBe(FormModel.UNSET_TASK_NAME);
        expect(formComponent.isTitleEnabled()).toBeFalsy();
    });

    it('should return primary color for complete button', () => {
        expect(formComponent.getColorForOutcome('COMPLETE')).toBe('primary');
    });

    it('should not enable outcome button when model missing', () => {
        expect(formComponent.isOutcomeButtonVisible(null, false)).toBeFalsy();
    });

    it('should enable custom outcome buttons', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, {id: 'action1', name: 'Action 1'});
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should allow controlling [complete] button visibility', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, {id: '$save', name: FormOutcomeModel.SAVE_ACTION});

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        formComponent.showSaveButton = false;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show only [complete] button with readOnly form ', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, {id: '$complete', name: FormOutcomeModel.COMPLETE_ACTION});

        formComponent.showCompleteButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should not show [save] button with readOnly form ', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, {id: '$save', name: FormOutcomeModel.SAVE_ACTION});

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show [custom-outcome] button with readOnly form and selected custom-outcome', () => {
        const formModel = new FormModel({selectedOutcome: 'custom-outcome'});
        formModel.readOnly = true;
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(formModel, {id: '$customoutome', name: 'custom-outcome'});

        formComponent.showCompleteButton = true;
        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        outcome = new FormOutcomeModel(formModel, {id: '$customoutome2', name: 'custom-outcome2'});
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should allow controlling [save] button visibility', () => {
        const formModel = new FormModel();
        formModel.readOnly = false;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, {id: '$save', name: FormOutcomeModel.COMPLETE_ACTION});

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

    it('should get form definition by form id on load', () => {
        spyOn(formComponent, 'getFormDefinitionByFormId').and.stub();
        const formId = 123;

        formComponent.formId = formId;
        formComponent.loadForm();

        expect(formComponent.getFormDefinitionByFormId).toHaveBeenCalledWith(formId);
    });

    it('should refresh visibility when the form is loaded', () => {
        spyOn(editorService, 'getFormDefinitionById').and.returnValue(of(JSON.parse(JSON.stringify(fakeForm))));
        const formId = 123;

        formComponent.formId = formId;
        formComponent.loadForm();

        expect(editorService.getFormDefinitionById).toHaveBeenCalledWith(formId);
        expect(visibilityService.refreshVisibility).toHaveBeenCalled();
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

        const change = new SimpleChange(null, taskId, true);
        formComponent.ngOnChanges({taskId: change});

        expect(formComponent.getFormByTaskId).toHaveBeenCalledWith(taskId);
    });

    it('should reload form definition by form id on binding changes', () => {
        spyOn(formComponent, 'getFormDefinitionByFormId').and.stub();
        const formId = '123';

        const change = new SimpleChange(null, formId, true);
        formComponent.ngOnChanges({formId: change});

        expect(formComponent.getFormDefinitionByFormId).toHaveBeenCalledWith(formId);
    });

    it('should reload form definition by name on binding changes', () => {
        spyOn(formComponent, 'getFormDefinitionByFormName').and.stub();
        const formName = '<form>';

        const change = new SimpleChange(null, formName, true);
        formComponent.ngOnChanges({formName: change});

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

        formComponent.ngOnChanges({tag: new SimpleChange(null, 'hello world', true)});

        expect(formComponent.getFormByTaskId).not.toHaveBeenCalled();
        expect(formComponent.getFormDefinitionByFormId).not.toHaveBeenCalled();
        expect(formComponent.getFormDefinitionByFormName).not.toHaveBeenCalled();
    });

    it('should complete form on custom outcome click', () => {
        const formModel = new FormModel();
        const outcomeName = 'Custom Action';
        const outcome = new FormOutcomeModel(formModel, {id: 'custom1', name: outcomeName});

        let saved = false;
        formComponent.form = formModel;
        formComponent.formSaved.subscribe(() => saved = true);
        spyOn(formComponent, 'completeTaskForm').and.stub();

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(saved).toBeFalse();
        expect(formComponent.completeTaskForm).toHaveBeenCalledWith(outcomeName);
    });

    it('should save form on [save] outcome click', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, {
            id: FormComponent.SAVE_OUTCOME_ID,
            name: 'Save',
            isSystem: true
        });

        formComponent.form = formModel;
        spyOn(formComponent, 'saveTaskForm').and.stub();

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(formComponent.saveTaskForm).toHaveBeenCalled();
    });

    it('should complete form on [complete] outcome click', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, {
            id: FormComponent.COMPLETE_OUTCOME_ID,
            name: 'Complete',
            isSystem: true
        });

        formComponent.form = formModel;
        spyOn(formComponent, 'completeTaskForm').and.stub();

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(formComponent.completeTaskForm).toHaveBeenCalled();
    });

    it('should emit form saved event on custom outcome click', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom',
            isSystem: true
        });

        let saved = false;
        formComponent.form = formModel;
        formComponent.formSaved.subscribe(() => saved = true);

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(saved).toBeTruthy();
    });

    it('should do nothing when clicking outcome for readonly form', () => {
        const formModel = new FormModel();
        const outcomeName = 'Custom Action';
        const outcome = new FormOutcomeModel(formModel, {id: 'custom1', name: outcomeName});

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
        const formModel = new FormModel();
        const outcomeName = 'Custom Action';
        const outcome = new FormOutcomeModel(formModel, {id: 'custom1', name: outcomeName});

        formComponent.readOnly = false;
        formComponent.form = null;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should not execute unknown system outcome', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, {id: 'unknown', name: 'Unknown', isSystem: true});

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should require custom action name to complete form', () => {
        const formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, {id: 'custom'});

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();

        outcome = new FormOutcomeModel(formModel, {id: 'custom', name: 'Custom'});
        spyOn(formComponent, 'completeTaskForm').and.stub();
        expect(formComponent.onOutcomeClicked(outcome)).toBeTruthy();
    });

    it('should fetch and parse form by task id', (done) => {
        spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
        spyOn(taskFormService, 'getTaskForm').and.callFake((currentTaskId) => new Observable((observer) => {
            observer.next({taskId: currentTaskId});
            observer.complete();
        }));

        const taskId = '456';
        formComponent.formLoaded.subscribe(() => {
            expect(taskFormService.getTaskForm).toHaveBeenCalledWith(taskId);
            expect(formComponent.form).toBeDefined();
            expect(formComponent.form.taskId).toBe(taskId);
            done();
        });

        expect(formComponent.form).toBeUndefined();
        formComponent.getFormByTaskId(taskId);
    });

    it('should handle error when getting form by task id', (done) => {
        const error = 'Some error';

        spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
        spyOn(formComponent, 'handleError').and.stub();
        spyOn(taskFormService, 'getTaskForm').and.callFake(() => throwError(error));

        formComponent.getFormByTaskId('123').then((_) => {
            expect(formComponent.handleError).toHaveBeenCalledWith(error);
            done();
        });
    });

    it('should apply readonly state when getting form by task id', (done) => {
        spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
        spyOn(taskFormService, 'getTaskForm').and.callFake((taskId) => new Observable((observer) => {
            observer.next({taskId});
            observer.complete();
        }));

        formComponent.readOnly = true;
        formComponent.getFormByTaskId('123').then((_) => {
            expect(formComponent.form).toBeDefined();
            expect(formComponent.form.readOnly).toBe(true);
            done();
        });
    });

    it('should fetch and parse form definition by id', () => {
        spyOn(editorService, 'getFormDefinitionById').and.callFake((currentFormId) => new Observable((observer) => {
            observer.next({id: currentFormId});
            observer.complete();
        }));

        const formId = 456;
        let loaded = false;
        formComponent.formLoaded.subscribe(() => loaded = true);

        expect(formComponent.form).toBeUndefined();
        formComponent.getFormDefinitionByFormId(formId);

        expect(loaded).toBeTruthy();
        expect(formComponent.form).toBeDefined();
        expect(formComponent.form.id).toBe(formId);
    });

    it('should handle error when getting form by definition id', () => {
        const error = 'Some error';

        spyOn(formComponent, 'handleError').and.stub();
        spyOn(editorService, 'getFormDefinitionById').and.callFake(() => throwError(error));

        formComponent.getFormDefinitionByFormId(123);
        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should fetch and parse form definition by form name', () => {
        spyOn(modelService, 'getFormDefinitionByName').and.callFake((currentFormName) => new Observable((observer) => {
            observer.next(currentFormName);
            observer.complete();
        }));

        spyOn(editorService, 'getFormDefinitionById').and.callFake((currentFormName) => new Observable((observer) => {
            observer.next({name: currentFormName});
            observer.complete();
        }));

        const formName = '<form>';
        let loaded = false;
        formComponent.formLoaded.subscribe(() => loaded = true);

        expect(formComponent.form).toBeUndefined();
        formComponent.getFormDefinitionByFormName(formName);

        expect(loaded).toBeTruthy();
        expect(modelService.getFormDefinitionByName).toHaveBeenCalledWith(formName);
        expect(formComponent.form).toBeDefined();
        expect(formComponent.form.name).toBe(formName);
    });

    it('should save task form and raise corresponding event', () => {
        spyOn(taskFormService, 'saveTaskForm').and.callFake(() => new Observable((observer) => {
            observer.next();
            observer.complete();
        }));

        let saved = false;
        let savedForm = null;
        formComponent.formSaved.subscribe((form) => {
            saved = true;
            savedForm = form;
        });

        const formModel = new FormModel({
            taskId: '123',
            fields: [
                {id: 'field1'},
                {id: 'field2'}
            ]
        });
        formComponent.form = formModel;
        formComponent.saveTaskForm();

        expect(taskFormService.saveTaskForm).toHaveBeenCalledWith(formModel.taskId, formModel.values);
        expect(saved).toBeTruthy();
        expect(savedForm).toEqual(formModel);
    });

    it('should handle error during form save', () => {
        const error = 'Error';
        spyOn(taskFormService, 'saveTaskForm').and.callFake(() => throwError(error));
        spyOn(formComponent, 'handleError').and.stub();

        formComponent.form = new FormModel({taskId: '123'});
        formComponent.saveTaskForm();

        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should require form with task id to save', () => {
        spyOn(taskFormService, 'saveTaskForm').and.stub();

        formComponent.form = null;
        formComponent.saveTaskForm();

        formComponent.form = new FormModel();
        formComponent.saveTaskForm();

        expect(taskFormService.saveTaskForm).not.toHaveBeenCalled();
    });

    it('should require form with task id to complete', () => {
        spyOn(taskFormService, 'completeTaskForm').and.stub();

        formComponent.form = null;
        formComponent.completeTaskForm('save');

        formComponent.form = new FormModel();
        formComponent.completeTaskForm('complete');

        expect(taskFormService.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should complete form and raise corresponding event', () => {
        spyOn(taskFormService, 'completeTaskForm').and.callFake(() => new Observable((observer) => {
            observer.next();
            observer.complete();
        }));

        const outcome = 'complete';
        let completed = false;
        formComponent.formCompleted.subscribe(() => completed = true);

        const formModel = new FormModel({
            taskId: '123',
            fields: [
                {id: 'field1'},
                {id: 'field2'}
            ]
        });

        formComponent.form = formModel;
        formComponent.completeTaskForm(outcome);

        expect(taskFormService.completeTaskForm).toHaveBeenCalledWith(formModel.taskId, formModel.values, outcome);
        expect(completed).toBeTruthy();
    });

    it('should require json to parse form', () => {
        expect(formComponent.parseForm(null)).toBeNull();
    });

    it('should parse form from json', () => {
        const form = formComponent.parseForm({
            id: 1,
            fields: [
                {id: 'field1', type: FormFieldTypes.CONTAINER}
            ]
        });

        expect(form).toBeDefined();
        expect(form.id).toBe(1);
        expect(form.fields.length).toBe(1);
        expect(form.fields[0].id).toBe('field1');
    });

    it('should provide outcomes for form definition', () => {
        spyOn(formComponent, 'getFormDefinitionOutcomes').and.callThrough();

        const form = formComponent.parseForm({id: 1});
        expect(formComponent.getFormDefinitionOutcomes).toHaveBeenCalledWith(form);
    });

    it('should prevent default outcome execution', () => {

        const outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        formComponent.form = new FormModel();
        formComponent.executeOutcome.subscribe((event: FormOutcomeEvent) => {
            expect(event.outcome).toBe(outcome);
            event.preventDefault();
            expect(event.defaultPrevented).toBeTruthy();
        });

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeFalsy();
    });

    it('should not prevent default outcome execution', () => {
        const outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        formComponent.form = new FormModel();
        formComponent.executeOutcome.subscribe((event: FormOutcomeEvent) => {
            expect(event.outcome).toBe(outcome);
            expect(event.defaultPrevented).toBeFalsy();
        });

        spyOn(formComponent, 'completeTaskForm').and.callThrough();

        const result = formComponent.onOutcomeClicked(outcome);
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
        const metadata = {};
        spyOn(nodeService, 'getNodeMetadata').and.returnValue(
            of(new NodeMetadata(metadata, null))
        );
        spyOn(formComponent, 'loadFormFromActiviti').and.stub();

        const nodeId = '<id>';
        const change = new SimpleChange(null, nodeId, false);
        formComponent.ngOnChanges({nodeId: change});

        expect(nodeService.getNodeMetadata).toHaveBeenCalledWith(nodeId);
        expect(formComponent.loadFormFromActiviti).toHaveBeenCalled();
        expect(formComponent.data).toBe(metadata);
    });

    it('should disable custom outcome buttons for readonly form', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;

        const outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeFalsy();
    });

    it('should require outcome to eval button state', () => {
        formComponent.form = new FormModel();
        expect(formComponent.isOutcomeButtonEnabled(null)).toBeFalsy();
    });

    it('should disable outcome buttons for invalid form', () => {
        const formModel = new FormModel();
        const field = new FormFieldModel(formModel, {
            type: 'text',
            value: null,
            required: true
        });

        const containerModel = new ContainerModel(field);
        formModel.fields.push(containerModel);
        formModel.fieldsCache = [field];
        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeFalsy();

        const outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeFalsy();
    });

    it('should disable complete outcome button when disableCompleteButton is true', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        formComponent.disableCompleteButton = true;

        const field = new FormFieldModel(formModel, {
            type: 'text',
            value: 'text',
            required: true
        });

        const containerModel = new ContainerModel(field);
        formModel.fields.push(containerModel);
        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeTruthy();

        const completeOutcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.COMPLETE_OUTCOME_ID,
            name: FormOutcomeModel.COMPLETE_ACTION
        });

        expect(formModel.isValid).toBeTruthy();

        expect(formComponent.isOutcomeButtonEnabled(completeOutcome)).toBeFalsy();
    });

    it('should disable save outcome button when form is valid and readOnly', () => {
        const formModel = new FormModel();

        const field = new FormFieldModel(formModel, {
            type: 'text',
            value: 'text',
            required: true
        });

        const containerModel = new ContainerModel(field);
        formModel.fields.push(containerModel);
        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeTruthy();

        const saveOutcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.SAVE_OUTCOME_ID,
            name: FormOutcomeModel.SAVE_ACTION
        });

        formComponent.form.readOnly = true;
        expect(formComponent.isOutcomeButtonEnabled(saveOutcome)).toBeFalsy();
    });

    it('should enable save outcome button when form is valid and not readOnly', () => {
        const formModel = new FormModel();

        const field = new FormFieldModel(formModel, {
            type: 'text',
            value: 'text',
            required: true
        });

        const containerModel = new ContainerModel(field);
        formModel.fields.push(containerModel);
        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeTruthy();

        const saveOutcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.SAVE_OUTCOME_ID,
            name: FormOutcomeModel.SAVE_ACTION
        });

        formComponent.form.readOnly = false;
        expect(formComponent.isOutcomeButtonEnabled(saveOutcome)).toBeTruthy();
    });

    it('should disable save outcome button when disableSaveButton is true', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        formComponent.disableSaveButton = true;

        const saveOutcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.SAVE_OUTCOME_ID,
            name: FormOutcomeModel.SAVE_ACTION
        });

        expect(formComponent.isOutcomeButtonEnabled(saveOutcome)).toBeFalsy();
    });

    it('should save outcome button be enabled when the form is invalid', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;

        const field = new FormFieldModel(formModel, {
            type: 'text',
            value: null,
            required: true
        });

        const containerModel = new ContainerModel(field);
        formModel.fields.push(containerModel);
        formModel.fieldsCache = [field];
        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeFalsy();

        const saveOutcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.SAVE_OUTCOME_ID,
            name: FormOutcomeModel.SAVE_ACTION
        });

        expect(formComponent.isOutcomeButtonEnabled(saveOutcome)).toBeTruthy();
    });

    it('should disable start process outcome button when disableStartProcessButton is true', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        formComponent.disableStartProcessButton = true;

        const field = new FormFieldModel(formModel, {
            type: 'text',
            value: 'text',
            required: true
        });

        const containerModel = new ContainerModel(field);
        formModel.fields.push(containerModel);
        formComponent.form = formModel;
        formModel.onFormFieldChanged(field);

        expect(formModel.isValid).toBeTruthy();

        const startProcessOutcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.START_PROCESS_OUTCOME_ID,
            name: FormOutcomeModel.START_PROCESS_ACTION
        });

        expect(formComponent.isOutcomeButtonEnabled(startProcessOutcome)).toBeFalsy();
    });

    it('should raise [executeOutcome] event for formService', () => {
        const executeOutcomeSpy = spyOn(formService.executeOutcome, 'next');
        const outcome = new FormOutcomeModel(new FormModel(), {
            id: FormComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });
        const expectedEmittedOutcome = new FormOutcomeEvent(outcome);

        formComponent.form = new FormModel();
        formComponent.onOutcomeClicked(outcome);

        expect(executeOutcomeSpy).toHaveBeenCalledWith(expectedEmittedOutcome);
    });

    it('should refresh form values when data is changed', () => {
        formComponent.form = new FormModel(JSON.parse(JSON.stringify(fakeForm)));
        let formFields = formComponent.form.getFormFields();

        let dropdownField = formFields.find((field) => field.id === 'dropdownId');
        let radioField = formFields.find((field) => field.id === 'radio');
        expect(dropdownField.value).toBe('empty');
        expect(radioField.value).toBeNull();

        const formValues: any = {};
        formValues.dropdownId = {
            id: 'option_2',
            name: 'test2'
        };
        formValues.radio = {id: 'option_2', name: 'Option 2'};
        const change = new SimpleChange(null, formValues, false);
        formComponent.data = formValues;
        formComponent.ngOnChanges({data: change});

        formFields = formComponent.form.getFormFields();
        dropdownField = formFields.find((field) => field.id === 'dropdownId');
        radioField = formFields.find((field) => field.id === 'radio');

        expect(dropdownField.value.id).toBe('option_2');
        expect(dropdownField.value.name).toBe('test2');
        expect(radioField.value).toBe('option_2');
    });

    it('should refresh radio buttons value when id is given to data', () => {
        formComponent.form = new FormModel(JSON.parse(JSON.stringify(fakeForm)));
        let formFields = formComponent.form.getFormFields();
        let radioFieldById = formFields.find((field) => field.id === 'radio');

        const formValues: any = {};
        formValues.radio = 'option_3';
        const change = new SimpleChange(null, formValues, false);
        formComponent.data = formValues;
        formComponent.ngOnChanges({data: change});

        formFields = formComponent.form.getFormFields();
        radioFieldById = formFields.find((field) => field.id === 'radio');
        expect(radioFieldById.value).toBe('option_3');
    });
});

@Component({
    selector: 'adf-form-with-custom-outcomes',
    template: `
        <adf-form #adfForm>
            <adf-form-custom-outcomes>
                <button mat-button id="adf-custom-outcome-1" (click)="onCustomButtonOneClick()">
                    CUSTOM-BUTTON-1
                </button>
                <button mat-button id="adf-custom-outcome-2" (click)="onCustomButtonTwoClick()">
                    CUSTOM-BUTTON-2
                </button>
            </adf-form-custom-outcomes>
        </adf-form>`
})

class FormWithCustomOutComesComponent {

    @ViewChild('adfForm', {static: true})
    adfForm: FormComponent;

    onCustomButtonOneClick() {
    }

    onCustomButtonTwoClick() {
    }
}

describe('FormWithCustomOutComesComponent', () => {

    let fixture: ComponentFixture<FormWithCustomOutComesComponent>;
    let customComponent: FormWithCustomOutComesComponent;
    let debugElement: DebugElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [FormWithCustomOutComesComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormWithCustomOutComesComponent);
        customComponent = fixture.componentInstance;
        debugElement = fixture.debugElement;
        const formRepresentation = {
            fields: [
                {id: 'container1'}
            ],
            outcomes: [
                {id: 'outcome-1', name: 'outcome 1'}
            ]
        };

        const form = new FormModel(formRepresentation);
        customComponent.adfForm.form = form;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to inject custom outcomes and click on custom outcomes', () => {
        const onCustomButtonOneSpy = spyOn(customComponent, 'onCustomButtonOneClick').and.callThrough();
        const buttonOneBtn = debugElement.query(By.css('#adf-custom-outcome-1'));
        const buttonTwoBtn = debugElement.query(By.css('#adf-custom-outcome-2'));

        expect(buttonOneBtn).not.toBeNull();
        expect(buttonTwoBtn).not.toBeNull();

        buttonOneBtn.nativeElement.click();

        expect(onCustomButtonOneSpy).toHaveBeenCalled();
        expect(buttonOneBtn.nativeElement.innerText).toBe('CUSTOM-BUTTON-1');
        expect(buttonTwoBtn.nativeElement.innerText).toBe('CUSTOM-BUTTON-2');
    });
});
