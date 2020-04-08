/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, SimpleChange, NgModule, Injector, ComponentFactoryResolver } from '@angular/core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import {
    AppConfigService,
    CoreModule,
    FormFieldModel,
    FormFieldTypes,
    FormModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    setupTestBed,
    TRANSLATION_PROVIDER,
    WidgetVisibilityService
} from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { FormCloudService } from '../services/form-cloud.service';
import { FormCloudComponent } from './form-cloud.component';
import {
    cloudFormMock,
    conditionalUploadWidgetsMock,
    emptyFormRepresentationJSON,
    fakeCloudForm,
    multilingualForm
} from '../mocks/cloud-form.mock';
import { FormCloudRepresentation } from '../models/form-cloud-representation.model';
import { FormCloudModule } from '../form-cloud.module';
import { TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CloudFormRenderingService } from './cloud-form-rendering.service';

describe('FormCloudComponent', () => {
    let formCloudService: FormCloudService;
    let fixture: ComponentFixture<FormCloudComponent>;
    let formComponent: FormCloudComponent;
    let visibilityService: WidgetVisibilityService;
    let formRenderingService: CloudFormRenderingService;
    let translateService: TranslateService;

    @Component({
        selector: 'adf-cloud-custom-widget',
        template: '<div></div>'
    })
    class CustomWidget {
        typeId = 'CustomWidget';
    }

    @NgModule({
        declarations: [CustomWidget],
        exports: [CustomWidget],
        entryComponents: [CustomWidget]
    })
    class CustomUploadModule {}

    function buildWidget(type: string, injector: Injector): any {
        const resolver = formRenderingService.getComponentTypeResolver(type);
        const widgetType = resolver(null);

        const factoryResolver: ComponentFactoryResolver = TestBed.get(ComponentFactoryResolver);
        const factory = factoryResolver.resolveComponentFactory(widgetType);
        const componentRef = factory.create(injector);

        return componentRef.instance;
    }

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot(),
            FormCloudModule,
            CustomUploadModule
        ],
        providers: [
            {
                provide: TRANSLATION_PROVIDER,
                multi: true,
                useValue: {
                    name: 'app',
                    source: 'resources'
                }
            }
        ]
    });

    beforeEach(async(() => {
        formRenderingService = TestBed.get(CloudFormRenderingService);
        formCloudService = TestBed.get(FormCloudService);

        translateService = TestBed.get(TranslateService);

        visibilityService = TestBed.get(WidgetVisibilityService);
        spyOn(visibilityService, 'refreshVisibility').and.callThrough();

        const appConfigService = TestBed.get(AppConfigService);
        spyOn(appConfigService, 'get').and.returnValue([]);

        fixture = TestBed.createComponent(FormCloudComponent);
        formComponent = fixture.componentInstance;
        fixture.detectChanges();
   }));

    it('should register custom [upload] widget', () => {
        const widget = buildWidget('upload', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('AttachFileCloudWidgetComponent');
    });

    it('should allow to replace custom [upload] widget', () => {
        formRenderingService.setComponentTypeResolver('upload', () => CustomWidget, true);

        const widget = buildWidget('upload', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('CustomWidget');
    });

    it('should register custom [dropdown] widget', () => {
        const widget = buildWidget('dropdown', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('DropdownCloudWidgetComponent');
    });

    it('should allow to replace custom [dropdown] widget', () => {
        formRenderingService.setComponentTypeResolver('dropdown', () => CustomWidget, true);

        const widget = buildWidget('dropdown', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('CustomWidget');
    });

    it('should register custom [date] widget', () => {
        const widget = buildWidget('date', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('DateCloudWidgetComponent');
    });

    it('should allow to replace custom [date] widget', () => {
        formRenderingService.setComponentTypeResolver('date', () => CustomWidget, true);

        const widget = buildWidget('date', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('CustomWidget');
    });

    it('should register custom [people] widget', () => {
        const widget = buildWidget('people', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('PeopleCloudWidgetComponent');
    });

    it('should allow to replace custom [people] widget', () => {
        formRenderingService.setComponentTypeResolver('people', () => CustomWidget, true);

        const widget = buildWidget('people', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('CustomWidget');
    });

    it('should register custom [functional-group] widget', () => {
        const widget = buildWidget('functional-group', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('GroupCloudWidgetComponent');
    });

    it('should allow to replace custom [functional-group] widget', () => {
        formRenderingService.setComponentTypeResolver('functional-group', () => CustomWidget, true);

        const widget = buildWidget('functional-group', fixture.componentRef.injector);
        expect(widget['typeId']).toBe('CustomWidget');
    });

    it('should check form', () => {
        expect(formComponent.hasForm()).toBeFalsy();
        formComponent.form = new FormModel();
        expect(formComponent.hasForm()).toBeTruthy();
    });

    it('should allow title if showTitle is true', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;

        expect(formComponent.showTitle).toBeTruthy();
        expect(formComponent.isTitleEnabled()).toBeTruthy();
   });

    it('should not allow title if showTitle is false', () => {
        const formModel = new FormModel();

        formComponent.form = formModel;
        formComponent.showTitle = false;

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
        const outcome = new FormOutcomeModel(<any> formModel, { id: 'action1', name: 'Action 1' });
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should allow controlling [complete] button visibility', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(<any> formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        formComponent.showSaveButton = false;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show only [complete] button with readOnly form ', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(<any> formModel, { id: '$complete', name: FormOutcomeModel.COMPLETE_ACTION });

        formComponent.showCompleteButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should not show [save] button with readOnly form ', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(<any> formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show [custom-outcome] button with readOnly form and selected custom-outcome', () => {
        const formModel = new FormModel({ selectedOutcome: 'custom-outcome' });
        formModel.readOnly = true;
        formComponent.form = formModel;
        let outcome = new FormOutcomeModel(<any> formModel, { id: '$customoutome', name: 'custom-outcome' });

        formComponent.showCompleteButton = true;
        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        outcome = new FormOutcomeModel(<any> formModel, { id: '$customoutome2', name: 'custom-outcome2' });
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should allow controlling [save] button visibility', () => {
        const formModel = new FormModel();
        formModel.readOnly = false;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(<any> formModel, { id: '$save', name: FormOutcomeModel.COMPLETE_ACTION });

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

    it('should get task variables if a task form is rendered', () => {
        spyOn(formCloudService, 'getTaskForm').and.callFake((currentTaskId) => {
            return new Observable((observer) => {
                observer.next({ formRepresentation: { taskId: currentTaskId } });
                observer.complete();
            });
        });

        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));
        spyOn(formCloudService, 'getTask').and.callFake((currentTaskId) => {
            return new Observable((observer) => {
                observer.next({ formRepresentation: { taskId: currentTaskId } });
                observer.complete();
            });
        });
        const taskId = '123';
        const appName = 'test-app';

        formComponent.appName = appName;
        formComponent.taskId = taskId;
        formComponent.loadForm();

        expect(formCloudService.getTaskVariables).toHaveBeenCalledWith(appName, taskId);
    });

    it('should not get task variables and form if task id is not specified', () => {
        spyOn(formCloudService, 'getTaskForm').and.callFake((currentTaskId) => {
            return new Observable((observer) => {
                observer.next({ taskId: currentTaskId });
                observer.complete();
            });
        });

        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));

        formComponent.appName = 'test-app';
        formComponent.taskId = null;
        formComponent.loadForm();

        expect(formCloudService.getTaskForm).not.toHaveBeenCalled();
        expect(formCloudService.getTaskVariables).not.toHaveBeenCalled();
    });

    it('should get form definition by form id on load', () => {
        spyOn(formComponent, 'getFormById').and.stub();

        const formId = '123';
        const appName = 'test-app';

        formComponent.appName = appName;
        formComponent.formId = formId;
        formComponent.appVersion = 1;
        formComponent.loadForm();

        expect(formComponent.getFormById).toHaveBeenCalledWith(appName, formId, 1);
    });

    it('should refresh visibility when the form is loaded', () => {
        spyOn(formCloudService, 'getForm').and.returnValue(of({ formRepresentation: {} }));
        const formId = '123';
        const appName = 'test-app';

        formComponent.appName = appName;
        formComponent.formId = formId;
        formComponent.appVersion = 1;
        formComponent.loadForm();

        expect(formCloudService.getForm).toHaveBeenCalledWith(appName, formId, 1);
        expect(visibilityService.refreshVisibility).toHaveBeenCalled();
    });

    it('should reload form by task id on binding changes', () => {
        spyOn(formComponent, 'getFormByTaskId').and.stub();
        const taskId = '<task id>';

        const appName = 'test-app';
        formComponent.appName = appName;
        formComponent.appVersion = 1;
        const change = new SimpleChange(null, taskId, true);
        formComponent.ngOnChanges({ 'taskId': change });

        expect(formComponent.getFormByTaskId).toHaveBeenCalledWith(appName, taskId, 1);
    });

    it('should call the process storage to retrieve the folder with only the taskId', fakeAsync(() => {
        spyOn(formCloudService, 'getTaskForm').and.returnValue(of(cloudFormMock));
        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));
        spyOn(formCloudService, 'getProcessStorageFolderTask')
            .and.returnValue( of({nodeId : '123', path: '/a/path/type', type: 'fakeType'}));
        const taskId = '<task id>';
        const appName = 'test-app';
        formComponent.appName = appName;
        formComponent.taskId = taskId;

        const change = new SimpleChange(null, appName, true);
        formComponent.ngOnChanges({ 'appName': change });
        tick();

        expect(formCloudService.getProcessStorageFolderTask).toHaveBeenCalledWith(appName, taskId, undefined);
        expect(formComponent.form.nodeId).toBe('123');
        expect(formComponent.form.contentHost).toBe('/a/path/type');
    }));

    it('should call the process storage to retrieve the folder with taskId and processInstanceId', fakeAsync(() => {
        spyOn(formCloudService, 'getTaskForm').and.returnValue(of(cloudFormMock));
        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));
        spyOn(formCloudService, 'getProcessStorageFolderTask')
            .and.returnValue( of({nodeId : '123', path: '/a/path/type', type: 'fakeType'}));
        const taskId = '<task id>';
        const processInstanceId = 'i-am-the-process-instance-id';
        const appName = 'test-app';
        formComponent.appName = appName;
        formComponent.taskId = taskId;
        formComponent.processInstanceId = processInstanceId;

        const change = new SimpleChange(null, 'new-app-name', true);
        formComponent.ngOnChanges({ 'appName': change });
        tick();
        expect(formCloudService.getProcessStorageFolderTask).toHaveBeenCalledWith(appName, taskId, processInstanceId);
        expect(formComponent.form.nodeId).toBe('123');
        expect(formComponent.form.contentHost).toBe('/a/path/type');
    }));

    it('should reload form definition by form id on binding changes', () => {
        spyOn(formComponent, 'getFormById').and.stub();
        const formId = '123';
        const appName = 'test-app';

        formComponent.appName = appName;
        formComponent.appVersion = 1;
        const change = new SimpleChange(null, formId, true);
        formComponent.ngOnChanges({ 'formId': change });

        expect(formComponent.getFormById).toHaveBeenCalledWith(appName, formId, 1);
    });

    it('should not get form on load', () => {
        spyOn(formComponent, 'getFormByTaskId').and.stub();
        spyOn(formComponent, 'getFormById').and.stub();

        formComponent.taskId = null;
        formComponent.formId = null;
        formComponent.loadForm();

        expect(formComponent.getFormByTaskId).not.toHaveBeenCalled();
        expect(formComponent.getFormById).not.toHaveBeenCalled();
    });

    it('should not reload form on unrelated binding changes', () => {
        spyOn(formComponent, 'getFormByTaskId').and.stub();
        spyOn(formComponent, 'getFormById').and.stub();

        formComponent.ngOnChanges({ 'tag': new SimpleChange(null, 'hello world', false) });

        expect(formComponent.getFormByTaskId).not.toHaveBeenCalled();
        expect(formComponent.getFormById).not.toHaveBeenCalled();
    });

    it('should complete form on custom outcome click', () => {
        const formModel = new FormModel();
        const outcomeName = 'Custom Action';
        const outcome = new FormOutcomeModel(<any> formModel, { id: 'custom1', name: outcomeName });

        let saved = false;
        formComponent.form = formModel;
        formComponent.formSaved.subscribe(() => saved = true);
        spyOn(formComponent, 'completeTaskForm').and.stub();

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(saved).toBeTruthy();
        expect(formComponent.completeTaskForm).toHaveBeenCalledWith(outcomeName);
    });

    it('should save form on [save] outcome click', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(<any> formModel, {
            id: FormCloudComponent.SAVE_OUTCOME_ID,
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
        const outcome = new FormOutcomeModel(<any> formModel, {
            id: FormCloudComponent.COMPLETE_OUTCOME_ID,
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
        const outcome = new FormOutcomeModel(<any> formModel, {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
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
        const outcome = new FormOutcomeModel(<any> formModel, { id: 'custom1', name: outcomeName });

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
        const outcome = new FormOutcomeModel(<any> formModel, { id: 'custom1', name: outcomeName });

        formComponent.readOnly = false;
        formComponent.form = null;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should not execute unknown system outcome', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(<any> formModel, { id: 'unknown', name: 'Unknown', isSystem: true });

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should require custom action name to complete form', () => {
        const formModel = new FormModel();
        let outcome = new FormOutcomeModel(<any> formModel, { id: 'custom' });

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();

        outcome = new FormOutcomeModel(<any> formModel, { id: 'custom', name: 'Custom' });
        spyOn(formComponent, 'completeTaskForm').and.stub();
        expect(formComponent.onOutcomeClicked(outcome)).toBeTruthy();
    });

    it('should fetch and parse form by task id', (done) => {
        const appName = 'test-app';
        const taskId = '456';

        spyOn(formCloudService, 'getTask').and.returnValue(of({}));
        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));
        spyOn(formCloudService, 'getTaskForm').and.returnValue(of({ taskId: taskId, selectedOutcome: 'custom-outcome' }));

        formComponent.formLoaded.subscribe(() => {
            expect(formCloudService.getTaskForm).toHaveBeenCalledWith(appName, taskId, 1);
            expect(formComponent.form).toBeDefined();
            expect(formComponent.form.taskId).toBe(taskId);
            done();
        });

        formComponent.appName = appName;
        formComponent.taskId = taskId;
        formComponent.appVersion = 1;
        formComponent.loadForm();
    });

    it('should handle error when getting form by task id', (done) => {
        const error = 'Some error';

        spyOn(formCloudService, 'getTask').and.returnValue(of({}));
        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));
        spyOn(formComponent, 'handleError').and.stub();
        spyOn(formCloudService, 'getTaskForm').and.callFake(() => {
            return throwError(error);
        });

        formComponent.getFormByTaskId('test-app', '123').then((_) => {
            expect(formComponent.handleError).toHaveBeenCalledWith(error);
            done();
        });
    });

    it('should fetch and parse form definition by id', (done) => {
        spyOn(formCloudService, 'getForm').and.returnValue(of(fakeCloudForm));

        const appName = 'test-app';
        const formId = 'form-de8895be-d0d7-4434-beef-559b15305d72';
        formComponent.formLoaded.subscribe(() => {
            expect(formComponent.form).toBeDefined();
            expect(formComponent.form.id).toBe(formId);
            done();
        });

        formComponent.appName = appName;
        formComponent.formId = formId;
        formComponent.loadForm();
    });

    it('should handle error when getting form by definition id', () => {
        const error = 'Some error';

        spyOn(formComponent, 'handleError').and.stub();
        spyOn(formCloudService, 'getForm').and.callFake(() => throwError(error));

        formComponent.getFormById('test-app', '123');
        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should save task form and raise corresponding event', () => {
        spyOn(formCloudService, 'saveTaskForm').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        let saved = false;
        let savedForm = null;
        formComponent.formSaved.subscribe((form) => {
            saved = true;
            savedForm = form;
        });

        const taskId = '123-223';
        const appName = 'test-app';
        const processInstanceId = '333-444';

        const formModel = new FormModel({
            id: '23',
            taskId: taskId,
            fields: [
                { id: 'field1' },
                { id: 'field2' }
            ]
        });
        formComponent.form = formModel;
        formComponent.taskId = taskId;
        formComponent.appName = appName;
        formComponent.processInstanceId = processInstanceId;

        formComponent.saveTaskForm();

        expect(formCloudService.saveTaskForm).toHaveBeenCalledWith(appName, formModel.taskId, processInstanceId, formModel.id, formModel.values);
        expect(saved).toBeTruthy();
        expect(savedForm).toEqual(formModel);
    });

    it('should handle error during form save', () => {
        const error = 'Error';
        spyOn(formCloudService, 'saveTaskForm').and.callFake(() => throwError(error));
        spyOn(formComponent, 'handleError').and.stub();

        const taskId = '123-223';
        const appName = 'test-app';
        const formModel = new FormModel({
            id: '23',
            taskId: taskId,
            fields: [
                { id: 'field1' },
                { id: 'field2' }
            ]
        });
        formComponent.form = formModel;
        formComponent.taskId = taskId;
        formComponent.appName = appName;

        formComponent.saveTaskForm();

        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should require form with appName and taskId to save', () => {
        spyOn(formCloudService, 'saveTaskForm').and.stub();

        formComponent.form = null;
        formComponent.saveTaskForm();

        formComponent.form = new FormModel();

        formComponent.appName = 'test-app';
        formComponent.saveTaskForm();

        formComponent.appName = null;
        formComponent.taskId = '123';
        formComponent.saveTaskForm();

        expect(formCloudService.saveTaskForm).not.toHaveBeenCalled();
    });

    it('should require form with appName and taskId to complete', () => {
        spyOn(formCloudService, 'completeTaskForm').and.stub();

        formComponent.form = null;
        formComponent.completeTaskForm('save');

        formComponent.form = new FormModel();
        formComponent.appName = 'test-app';
        formComponent.completeTaskForm('complete');

        formComponent.appName = null;
        formComponent.taskId = '123';
        formComponent.completeTaskForm('complete');

        expect(formCloudService.completeTaskForm).not.toHaveBeenCalled();
    });

    it('should complete form and raise corresponding event', () => {
        spyOn(formCloudService, 'completeTaskForm').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        const outcome = 'complete';
        let completed = false;
        formComponent.formCompleted.subscribe(() => completed = true);

        const taskId = '123-223';
        const appVersion = 1;
        const appName = 'test-app';
        const processInstanceId = '333-444';

        const formModel = new FormModel({
            id: '23',
            taskId: taskId,
            fields: [
                { id: 'field1' },
                { id: 'field2' }
            ]
        });

        formComponent.appVersion = appVersion;
        formComponent.form = formModel;
        formComponent.taskId = taskId;
        formComponent.appName = appName;
        formComponent.processInstanceId = processInstanceId;
        formComponent.completeTaskForm(outcome);

        expect(formCloudService.completeTaskForm).toHaveBeenCalledWith(appName, formModel.taskId, processInstanceId, formModel.id, formModel.values, outcome, appVersion);
        expect(completed).toBeTruthy();
    });

    it('should require json to parse form', () => {
        expect(formComponent.parseForm(null)).toBeNull();
    });

    it('should parse form from json', () => {
        const form = formComponent.parseForm({
            id: '1',
            fields: [
                { id: 'field1', type: FormFieldTypes.CONTAINER }
            ]
        });

        expect(form).toBeDefined();
        expect(form.id).toBe('1');
        expect(form.fields.length).toBe(1);
        expect(form.fields[0].id).toBe('field1');
    });

    it('should prevent default outcome execution', () => {

        const outcome = new FormOutcomeModel(<any> new FormModel(), {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
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
        const outcome = new FormOutcomeModel(<any> new FormModel(), {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
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

        field = new FormFieldModel(<any> new FormModel());
        formComponent.checkVisibility(field);
        expect(visibilityService.refreshVisibility).toHaveBeenCalledWith(field.form);
    });

    it('should disable outcome buttons for readonly form', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;

        const outcome = new FormOutcomeModel(<any> new FormModel(), {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeFalsy();
    });

    it('should require outcome to eval button state', () => {
        formComponent.form = new FormModel();
        expect(formComponent.isOutcomeButtonEnabled(null)).toBeFalsy();
    });

    it('should disable complete outcome button when disableCompleteButton is true', () => {
        const formModel = new FormModel(cloudFormMock);
        formComponent.form = formModel;
        formComponent.disableCompleteButton = true;

        expect(formModel.isValid).toBeTruthy();
        expect(formComponent.form.hasOutcomes()).toBe(true);
        const completeOutcome = formComponent.form.outcomes.find((outcome) => outcome.name === FormOutcomeModel.COMPLETE_ACTION);

        expect(formComponent.isOutcomeButtonEnabled(completeOutcome)).toBeFalsy();

        formComponent.disableCompleteButton = false;
        expect(formComponent.isOutcomeButtonEnabled(completeOutcome)).toBeTruthy();
    });

    it('should complete outcome button be present when the form is empty', async () => {
        formComponent.form = formComponent.parseForm(emptyFormRepresentationJSON);
        expect(formComponent.form.isValid).toBeTruthy();
        const completeOutcome = formComponent.form.outcomes.find((outcome) => outcome.name === FormOutcomeModel.COMPLETE_ACTION);
        expect(formComponent.isOutcomeButtonEnabled(completeOutcome)).toBeTruthy();
    });

    it('should disable save outcome button when disableSaveButton is true', () => {
        const formModel = new FormModel(cloudFormMock);
        formComponent.form = formModel;
        formComponent.disableSaveButton = true;

        expect(formModel.isValid).toBeTruthy();
        expect(formComponent.form.hasOutcomes()).toBe(true);
        const saveOutcome = formComponent.form.outcomes.find((outcome) => outcome.name === FormOutcomeModel.SAVE_ACTION);

        expect(formComponent.isOutcomeButtonEnabled(saveOutcome)).toBeFalsy();

        formComponent.disableSaveButton = false;
        expect(formComponent.isOutcomeButtonEnabled(saveOutcome)).toBeTruthy();
    });

    it('should disable start process outcome button when disableStartProcessButton is true', () => {
        const formModel = new FormModel(cloudFormMock);
        formComponent.form = formModel;
        formComponent.disableStartProcessButton = true;

        expect(formModel.isValid).toBeTruthy();
        expect(formComponent.form.hasOutcomes()).toBe(true);
        const startProcessOutcome = formComponent.form.outcomes.find((outcome) => outcome.name === FormOutcomeModel.START_PROCESS_ACTION);

        expect(formComponent.isOutcomeButtonEnabled(startProcessOutcome)).toBeFalsy();

        formComponent.disableStartProcessButton = false;
        expect(formComponent.isOutcomeButtonEnabled(startProcessOutcome)).toBeTruthy();
    });

    it('should raise [executeOutcome] event for formService', (done) => {
        formComponent.executeOutcome.subscribe(() => {
            done();
        });

        const outcome = new FormOutcomeModel(<any> new FormModel(), {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        formComponent.form = new FormModel();
        formComponent.onOutcomeClicked(outcome);
    });

    it('should refresh form values when data is changed', (done) => {
        formComponent.form = new FormModel(JSON.parse(JSON.stringify(cloudFormMock)));
        formComponent.formCloudRepresentationJSON = new FormCloudRepresentation(JSON.parse(JSON.stringify(cloudFormMock)));
        let formFields = formComponent.form.getFormFields();

        let labelField = formFields.find((field) => field.id === 'text1');
        let radioField = formFields.find((field) => field.id === 'number1');
        expect(labelField.value).toBeNull();
        expect(radioField.value).toBeNull();

        const formValues: any[] = [{ name: 'text1', value: 'test' }, { name: 'number1', value: 99 }];

        const change = new SimpleChange(null, formValues, false);
        formComponent.data = formValues;

        formComponent.formLoaded.subscribe((form) => {
            formFields = form.getFormFields();
            labelField = formFields.find((field) => field.id === 'text1');
            radioField = formFields.find((field) => field.id === 'number1');
            expect(labelField.value).toBe('test');
            expect(radioField.value).toBe(99);

            done();
        });

        formComponent.ngOnChanges({ 'data': change });
   });

    it('should refresh radio buttons value when id is given to data', () => {
        formComponent.form = new FormModel(JSON.parse(JSON.stringify(cloudFormMock)));
        formComponent.formCloudRepresentationJSON = new FormCloudRepresentation(JSON.parse(JSON.stringify(cloudFormMock)));
        let formFields = formComponent.form.getFormFields();
        let radioFieldById = formFields.find((field) => field.id === 'radiobuttons1');

        const formValues: any[] = [{ name: 'radiobuttons1', value: 'option_2' }];
        const change = new SimpleChange(null, formValues, false);
        formComponent.data = formValues;
        formComponent.ngOnChanges({ 'data': change });

        formFields = formComponent.form.getFormFields();
        radioFieldById = formFields.find((field) => field.id === 'radiobuttons1');
        expect(radioFieldById.value).toBe('option_2');
    });

    describe('form validations', () => {
        it('should be able to set visibility conditions for Attach File widget', async () => {
            spyOn(formCloudService, 'getForm').and.returnValue(of(conditionalUploadWidgetsMock));
            const formId = '123';
            const appName = 'test-app';
            formComponent.formId = formId;
            formComponent.appVersion = 1;

            formComponent.ngOnChanges({ 'appName': new SimpleChange(null, appName, true) });
            expect(formCloudService.getForm).toHaveBeenCalledWith(appName, formId, 1);

            fixture.detectChanges();
            const inputElement = fixture.debugElement.query(By.css('[id="field-Text0xlk8n-container"] input'));
            inputElement.nativeElement.value = 'Attach';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            const container = '[id="field-Attachfile0h9fr1-container"]';
            const uploadElement = fixture.debugElement.query(By.css(container));
            expect(uploadElement).toBeDefined();
            const label = fixture.debugElement.query(By.css(`${container} label`));
            expect(label.nativeElement.innerText).toEqual('Attach file');
        });
    });

    describe('Multilingual Form', () => {
        it('should  translate form labels  on language change',  async () => {
            spyOn(formCloudService, 'getForm').and.returnValue(of(multilingualForm));
            const formId = '123';
            const appName = 'test-app';
            formComponent.formId = formId;
            formComponent.appVersion = 1;

            formComponent.ngOnChanges({ 'appName': new SimpleChange(null, appName, true) });
            expect(formCloudService.getForm).toHaveBeenCalledWith(appName, formId, 1);

            fixture.detectChanges();
            expect(getLabelValue('textField')).toEqual('Text field');
            expect(getLabelValue('fildUploadField')).toEqual('File Upload');
            expect(getLabelValue('dateField')).toEqual('Date field (D-M-YYYY)');
            expect(getLabelValue('amountField')).toEqual('Amount field');

            expect(translateService.getLangs()).toEqual(['en', '']);
            fixture.ngZone.run(() => translateService.use('fr'));

            await fixture.whenStable();
            fixture.detectChanges();

            expect(translateService.getLangs()).toEqual(['en', '', 'fr']);
            expect(getLabelValue('textField')).toEqual('Champ de texte');
            expect(getLabelValue('fildUploadField')).toEqual('Téléchargement de fichiers');
            expect(getLabelValue('dateField')).toEqual('Champ de date (D-M-YYYY)');
            expect(getLabelValue('amountField')).toEqual('Champ Montant');
        });

        function getLabelValue(containerId: string): string {
            const label = fixture.debugElement.nativeElement.querySelector(`[id="field-${containerId}-container"] label`);
            return label.innerText;
        }
    });
});

@Component({
    selector: 'adf-cloud-form-with-custom-outcomes',
    template: `
    <adf-cloud-form #adfCloudForm>
        <adf-cloud-form-custom-outcomes>
            <button mat-button id="adf-custom-outcome-1" (click)="onButtonClick()">
            CUSTOM-BUTTON-1
            </button>
            <button mat-button id="adf-custom-outcome-2" (click)="onButtonClick()">
                CUSTOM-BUTTON-2
            </button>
        </adf-cloud-form-custom-outcomes>
    </adf-cloud-form>`
})

class FormCloudWithCustomOutComesComponent {

    onButtonClick() { }
}

describe('FormCloudWithCustomOutComesComponent', () => {

    let fixture: ComponentFixture<FormCloudWithCustomOutComesComponent>;
    let component: FormCloudWithCustomOutComesComponent;
    let debugElement: DebugElement;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule],
        declarations: [FormCloudWithCustomOutComesComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormCloudWithCustomOutComesComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to inject custom outcomes and click on custom outcomes', () => {
        fixture.detectChanges();
        const cancelSpy = spyOn(component, 'onButtonClick').and.callThrough();
        const cancelBtn = debugElement.query(By.css('#adf-custom-outcome-1'));
        cancelBtn.nativeElement.click();
        expect(cancelSpy).toHaveBeenCalled();
        expect(cancelBtn.nativeElement.innerText).toBe('CUSTOM-BUTTON-1');
    });
});
