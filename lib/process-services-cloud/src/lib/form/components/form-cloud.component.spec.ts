/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @typescript-eslint/naming-convention */

import { VersionCompatibilityService, AlfrescoApiService } from '@alfresco/adf-content-services';
import {
    ContentLinkModel,
    CoreModule,
    FormFieldModel,
    FormFieldTypes,
    FormModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    FormRenderingService,
    FormService,
    UploadWidgetContentLinkModel,
    WidgetVisibilityService,
    provideTranslations,
    AuthModule,
    FormFieldEvent
} from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { ESCAPE } from '@angular/cdk/keycodes';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, ComponentFactoryResolver, Injector, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { FormCloudModule } from '../form-cloud.module';
import {
    cloudFormMock,
    conditionalUploadWidgetsMock,
    emptyFormRepresentationJSON,
    fakeCloudForm,
    fakeMetadataForm,
    multilingualForm,
    formDefinitionThreeColumnMock
} from '../mocks/cloud-form.mock';
import { FormCloudRepresentation } from '../models/form-cloud-representation.model';
import { FormCloudService } from '../services/form-cloud.service';
import { DisplayModeService } from '../services/display-mode.service';
import { FormCloudComponent } from './form-cloud.component';
import { MatButtonHarness } from '@angular/material/button/testing';
import { FormCloudDisplayMode } from '../../services/form-fields.interfaces';
import { CloudFormRenderingService } from './cloud-form-rendering.service';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { ProcessServicesCloudModule } from '../../process-services-cloud.module';

const mockOauth2Auth: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    },
    isEcmLoggedIn: jasmine.createSpy('isEcmLoggedIn'),
    reply: jasmine.createSpy('reply')
};

describe('FormCloudComponent', () => {
    let formCloudService: FormCloudService;
    let fixture: ComponentFixture<FormCloudComponent>;
    let formComponent: FormCloudComponent;
    let matDialog: MatDialog;
    let visibilityService: WidgetVisibilityService;
    let formRenderingService: CloudFormRenderingService;
    let displayModeService: DisplayModeService;
    let documentRootLoader: HarnessLoader;

    @Component({
        selector: 'adf-cloud-custom-widget',
        template: '<div></div>'
    })
    // eslint-disable-next-line @angular-eslint/component-class-suffix
    class CustomWidget {
        typeId = 'CustomWidget';
    }

    const buildWidget = (type: string, injector: Injector): any => {
        const resolver = formRenderingService.getComponentTypeResolver(type);
        const widgetType = resolver(null);

        const factoryResolver: ComponentFactoryResolver = TestBed.inject(ComponentFactoryResolver);
        const factory = factoryResolver.resolveComponentFactory(widgetType);
        const componentRef = factory.create(injector);

        return componentRef.instance;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProcessServiceCloudTestingModule],
            providers: [
                {
                    provide: VersionCompatibilityService,
                    useValue: {}
                },
                { provide: FormRenderingService, useClass: CloudFormRenderingService }
            ]
        });
        const apiService = TestBed.inject(AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue(mockOauth2Auth);

        formRenderingService = TestBed.inject(CloudFormRenderingService);
        formCloudService = TestBed.inject(FormCloudService);
        displayModeService = TestBed.inject(DisplayModeService);

        matDialog = TestBed.inject(MatDialog);

        visibilityService = TestBed.inject(WidgetVisibilityService);
        spyOn(visibilityService, 'refreshVisibility').and.callThrough();

        fixture = TestBed.createComponent(FormCloudComponent);
        formComponent = fixture.componentInstance;
        documentRootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        fixture.detectChanges();
    });

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

    it('should show a valid validation icon in case showValidationIcon is true', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;

        expect(formComponent.showValidationIcon).toBeTruthy();
        fixture.detectChanges();
        const validationSection = fixture.debugElement.query(By.css('.adf-form-validation-button'));
        expect(validationSection).not.toBeNull();
        const validationIcon = fixture.debugElement.query(By.css('#adf-valid-form-icon'));
        expect(validationIcon.nativeElement.innerText).toEqual('check_circle');
    });

    it('should show a error icon in case showValidationIcon is true and form invalid', () => {
        const formModel = new FormModel();
        formModel.isValid = false;
        formComponent.form = formModel;

        expect(formComponent.showValidationIcon).toBeTruthy();
        fixture.detectChanges();
        const validationSection = fixture.debugElement.query(By.css('.adf-form-validation-button'));
        expect(validationSection).not.toBeNull();
        const validationIcon = fixture.debugElement.query(By.css('#adf-invalid-form-icon'));
        expect(validationIcon.nativeElement.innerText).toEqual('error');
    });

    it('should not show any validation icon in case showValidationIcon is false', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        formComponent.showValidationIcon = false;

        fixture.detectChanges();
        const validationSection = fixture.debugElement.query(By.css('.adf-form-validation-button'));
        expect(validationSection).toBeNull();
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
        const outcome = new FormOutcomeModel(formModel, { id: 'action1', name: 'Action 1' });
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should allow controlling [complete] button visibility', () => {
        const formModel = new FormModel();
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();

        formComponent.showSaveButton = false;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show only [complete] button with readOnly form ', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, { id: '$complete', name: FormOutcomeModel.COMPLETE_ACTION });

        formComponent.showCompleteButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeTruthy();
    });

    it('should not show [save] button with readOnly form ', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonVisible(outcome, formComponent.form.readOnly)).toBeFalsy();
    });

    it('should show [custom-outcome] button with readOnly form and selected custom-outcome', () => {
        const formModel = new FormModel({ selectedOutcome: 'custom-outcome' });
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
        const formModel = new FormModel();
        formModel.readOnly = false;
        formComponent.form = formModel;
        const outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.COMPLETE_ACTION });

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
        spyOn(formCloudService, 'getTaskForm').and.callFake(
            (currentTaskId) =>
                new Observable((observer) => {
                    observer.next({ formRepresentation: { taskId: currentTaskId } });
                    observer.complete();
                })
        );

        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));
        spyOn(formCloudService, 'getTask').and.callFake(
            (currentTaskId) =>
                new Observable((observer) => {
                    observer.next({ formRepresentation: { taskId: currentTaskId } } as any);
                    observer.complete();
                })
        );
        const taskId = '123';
        const appName = 'test-app';

        formComponent.appName = appName;
        formComponent.taskId = taskId;
        formComponent.loadForm();

        expect(formCloudService.getTaskVariables).toHaveBeenCalledWith(appName, taskId);
    });

    it('should not get task variables and form if task id is not specified', () => {
        spyOn(formCloudService, 'getTaskForm').and.callFake(
            (currentTaskId) =>
                new Observable((observer) => {
                    observer.next({ taskId: currentTaskId });
                    observer.complete();
                })
        );

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
        spyOn(formCloudService, 'getForm').and.returnValue(of({ formRepresentation: {} } as any));
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
        formComponent.ngOnChanges({ taskId: change });

        expect(formComponent.getFormByTaskId).toHaveBeenCalledWith(appName, taskId, 1);
    });

    it('should reload form definition by form id on binding changes', () => {
        spyOn(formComponent, 'getFormById').and.stub();
        const formId = '123';
        const appName = 'test-app';

        formComponent.appName = appName;
        formComponent.appVersion = 1;
        const change = new SimpleChange(null, formId, true);
        formComponent.ngOnChanges({ formId: change });

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

        formComponent.ngOnChanges({ tag: new SimpleChange(null, 'hello world', false) });

        expect(formComponent.getFormByTaskId).not.toHaveBeenCalled();
        expect(formComponent.getFormById).not.toHaveBeenCalled();
    });

    it('should complete form on custom outcome click', () => {
        const formModel = new FormModel();
        const outcomeName = 'Custom Action';
        const outcome = new FormOutcomeModel(formModel, { id: 'custom1', name: outcomeName });

        let saved = false;
        formComponent.form = formModel;
        formComponent.formSaved.subscribe(() => (saved = true));
        spyOn(formComponent, 'completeTaskForm').and.stub();

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(saved).toBeFalse();
        expect(formComponent.completeTaskForm).toHaveBeenCalledWith(outcomeName);
    });

    it('should save form on [save] outcome click', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, {
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
        const outcome = new FormOutcomeModel(formModel, {
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
        const outcome = new FormOutcomeModel(formModel, {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom',
            isSystem: true
        });

        let saved = false;
        formComponent.form = formModel;
        formComponent.formSaved.subscribe(() => (saved = true));

        const result = formComponent.onOutcomeClicked(outcome);
        expect(result).toBeTruthy();
        expect(saved).toBeTruthy();
    });

    it('should do nothing when clicking outcome for readonly form', () => {
        const formModel = new FormModel();
        const outcomeName = 'Custom Action';
        const outcome = new FormOutcomeModel(formModel, { id: 'custom1', name: outcomeName });

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
        const outcome = new FormOutcomeModel(formModel, { id: 'custom1', name: outcomeName });

        formComponent.readOnly = false;
        formComponent.form = null;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should not execute unknown system outcome', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, { id: 'unknown', name: 'Unknown', isSystem: true });

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();
    });

    it('should require custom action name to complete form', () => {
        const formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: 'custom' });

        formComponent.form = formModel;
        expect(formComponent.onOutcomeClicked(outcome)).toBeFalsy();

        outcome = new FormOutcomeModel(formModel, { id: 'custom', name: 'Custom' });
        spyOn(formComponent, 'completeTaskForm').and.stub();
        expect(formComponent.onOutcomeClicked(outcome)).toBeTruthy();
    });

    it('should fetch and parse form by task id', (done) => {
        const appName = 'test-app';
        const taskId = '456';

        spyOn(formCloudService, 'getTask').and.returnValue(of({}));
        spyOn(formCloudService, 'getTaskVariables').and.returnValue(of([]));
        spyOn(formCloudService, 'getTaskForm').and.returnValue(of({ taskId, selectedOutcome: 'custom-outcome' }));

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
        spyOn(formCloudService, 'getTaskForm').and.callFake(() => throwError(error));

        formComponent.getFormByTaskId('test-app', '123').then(() => {
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

    it('should fetch and parse form definition by id and also set the process variables when data is provided and no process variables are present', (done) => {
        spyOn(formCloudService, 'getForm').and.returnValue(of(fakeCloudForm));

        const appName = 'test-app';
        const formId = 'form-de8895be-d0d7-4434-beef-559b15305d72';
        const variables: TaskVariableCloud[] = [
            new TaskVariableCloud({ name: 'var1', value: 'value1' }),
            new TaskVariableCloud({ name: 'var2', value: 'value2' })
        ];
        formComponent.formLoaded.subscribe(() => {
            expect(formComponent.form).toBeDefined();
            expect(formComponent.form.id).toBe(formId);
            expect(formComponent.form.processVariables).toEqual(variables as any);
            done();
        });

        formComponent.appName = appName;
        formComponent.formId = formId;
        formComponent.data = variables;
        formComponent.loadForm();
    });

    it('should handle error when getting form by definition id', () => {
        const error = 'Some error';

        spyOn(formComponent, 'handleError').and.stub();
        spyOn(formCloudService, 'getForm').and.callFake(() => throwError(error));

        formComponent.getFormById('test-app', '123');
        expect(formComponent.handleError).toHaveBeenCalledWith(error);
    });

    it('should be able to accept form data after the form has been already loaded once', (done) => {
        spyOn(formCloudService, 'getForm').and.returnValue(of(fakeCloudForm));
        formComponent.getFormById('test-app', '123');

        formComponent.formLoaded.subscribe((form) => {
            expect(form).not.toBe(null);
            done();
        });

        const formValues: any[] = [];
        const change = new SimpleChange(null, formValues, false);
        formComponent.data = formValues;
        formComponent.ngOnChanges({ data: change });
    });

    it('should save task form and raise corresponding event', () => {
        spyOn(formCloudService, 'saveTaskForm').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next();
                    observer.complete();
                })
        );

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
            taskId,
            fields: [{ id: 'field1' }, { id: 'field2' }]
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
            taskId,
            fields: [{ id: 'field1' }, { id: 'field2' }]
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
        spyOn(formCloudService, 'completeTaskForm').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next();
                    observer.complete();
                })
        );

        const outcome = 'complete';
        let completed = false;
        formComponent.formCompleted.subscribe(() => (completed = true));

        const taskId = '123-223';
        const appVersion = 1;
        const appName = 'test-app';
        const processInstanceId = '333-444';

        const formModel = new FormModel({
            id: '23',
            taskId,
            fields: [{ id: 'field1' }, { id: 'field2' }]
        });

        formComponent.appVersion = appVersion;
        formComponent.form = formModel;
        formComponent.taskId = taskId;
        formComponent.appName = appName;
        formComponent.processInstanceId = processInstanceId;
        formComponent.completeTaskForm(outcome);

        expect(formCloudService.completeTaskForm).toHaveBeenCalledWith(
            appName,
            formModel.taskId,
            processInstanceId,
            formModel.id,
            formModel.values,
            outcome,
            appVersion
        );
        expect(completed).toBeTruthy();
    });

    it('should open confirmation dialog on complete task', async () => {
        formComponent.form = new FormModel({
            confirmMessage: {
                show: true,
                message: 'Are you sure you want to submit the form?'
            }
        });

        formComponent.completeTaskForm();
        let dialogs = await documentRootLoader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toBe(1);

        await dialogs[0].close();
        dialogs = await documentRootLoader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toBe(0);
    });

    it('should submit form when user confirms', () => {
        spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
        fixture.detectChanges();

        const formModel = new FormModel({
            confirmMessage: {
                show: true,
                message: 'Are you sure you want to submit the form?'
            }
        } as any);
        formComponent.form = formModel;
        formComponent.taskId = 'id';
        formComponent.appName = 'appName';

        spyOn(formComponent['formCloudService'], 'completeTaskForm').and.returnValue(of(formModel as any));
        formComponent.completeTaskForm('complete');

        expect(formComponent['formCloudService'].completeTaskForm).toHaveBeenCalled();
    });

    it('should not confirm form if user rejects', () => {
        const outcome = 'complete';
        spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);

        const formModel = new FormModel({
            confirmMessage: {
                show: true,
                message: 'Are you sure you want to submit the form?'
            }
        });

        formComponent.form = formModel;
        spyOn(formComponent['formCloudService'], 'completeTaskForm');

        formComponent.completeTaskForm(outcome);

        expect(matDialog.open).toHaveBeenCalled();
        expect(formComponent['formCloudService'].completeTaskForm).not.toHaveBeenCalled();
    });

    it('should require json to parse form', () => {
        expect(formComponent.parseForm(null)).toBeNull();
    });

    it('should parse form from json', () => {
        const form = formComponent.parseForm({
            id: '1',
            fields: [{ id: 'field1', type: FormFieldTypes.CONTAINER }]
        });

        expect(form).toBeDefined();
        expect(form.id).toBe('1');
        expect(form.fields.length).toBe(1);
        expect(form.fields[0].id).toBe('field1');
    });

    it('should prevent default outcome execution', () => {
        const outcome = new FormOutcomeModel(new FormModel(), {
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
        const outcome = new FormOutcomeModel(new FormModel(), {
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

        field = new FormFieldModel(new FormModel());
        formComponent.checkVisibility(field);
        expect(visibilityService.refreshVisibility).toHaveBeenCalledWith(field.form);
    });

    it('should disable outcome buttons for readonly form', () => {
        const formModel = new FormModel();
        formModel.readOnly = true;
        formComponent.form = formModel;

        const outcome = new FormOutcomeModel(new FormModel(), {
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

    it('should save outcome button be enabled when the form is invalid', () => {
        const formModel = new FormModel(cloudFormMock);
        formComponent.form = formModel;
        formModel.isValid = false;

        const saveOutcome = formComponent.form.outcomes.find((outcome) => outcome.name === FormOutcomeModel.SAVE_ACTION);
        expect(formComponent.isOutcomeButtonEnabled(saveOutcome)).toBeTruthy();
    });

    it('should enable outcome with skip validation property, even if the form is not valid', () => {
        const formModel = new FormModel(cloudFormMock);
        formComponent.form = formModel;
        formModel.isValid = false;

        const customOutcome = new FormOutcomeModel(new FormModel(), {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom',
            skipValidation: true
        });

        expect(formComponent.isOutcomeButtonEnabled(customOutcome)).toBeTruthy();
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

    it('should raise [executeOutcome] event for formService', async () => {
        spyOn(formComponent.executeOutcome, 'emit');

        const outcome = new FormOutcomeModel(new FormModel(), {
            id: FormCloudComponent.CUSTOM_OUTCOME_ID,
            name: 'Custom'
        });

        formComponent.form = new FormModel();
        formComponent.onOutcomeClicked(outcome);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(formComponent.executeOutcome.emit).toHaveBeenCalledTimes(1);
    });

    it('should refresh form values when data is changed', (done) => {
        formComponent.form = new FormModel(JSON.parse(JSON.stringify(cloudFormMock)));
        formComponent.formCloudRepresentationJSON = new FormCloudRepresentation(JSON.parse(JSON.stringify(cloudFormMock)));
        let formFields = formComponent.form.getFormFields();

        let labelField = formFields.find((field) => field.id === 'text1');
        let radioField = formFields.find((field) => field.id === 'number1');
        expect(labelField.value).toBeNull();
        expect(radioField.value).toBeNull();

        const formValues: any[] = [
            { name: 'text1', value: 'test' },
            { name: 'number1', value: 99 }
        ];

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

        formComponent.ngOnChanges({ data: change });
    });

    it('should work with empty form JSON representaiton when refreashing form', () => {
        formComponent.form = new FormModel(JSON.parse(JSON.stringify(cloudFormMock)));
        formComponent.formCloudRepresentationJSON = undefined;

        const formValues: any[] = [
            { name: 'text1', value: 'test' },
            { name: 'number1', value: 99 }
        ];
        const change = new SimpleChange(null, formValues, false);

        expect(() => formComponent.ngOnChanges({ data: change })).not.toThrow();
    });

    it('should refresh radio buttons value when id is given to data', () => {
        formComponent.form = new FormModel(JSON.parse(JSON.stringify(cloudFormMock)));
        formComponent.formCloudRepresentationJSON = new FormCloudRepresentation(JSON.parse(JSON.stringify(cloudFormMock)));
        let formFields = formComponent.form.getFormFields();
        let radioFieldById = formFields.find((field) => field.id === 'radiobuttons1');

        const formValues: any[] = [{ name: 'radiobuttons1', value: 'option_2' }];
        const change = new SimpleChange(null, formValues, false);
        formComponent.data = formValues;
        formComponent.ngOnChanges({ data: change });

        formFields = formComponent.form.getFormFields();
        radioFieldById = formFields.find((field) => field.id === 'radiobuttons1');
        expect(radioFieldById.value).toBe('option_2');
    });

    it('should disable complete & save buttons on [complete] outcome click', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, {
            id: FormCloudComponent.COMPLETE_OUTCOME_ID,
            name: 'COMPLETE',
            isSystem: true
        });
        formComponent.form = formModel;

        formComponent.onOutcomeClicked(outcome);

        expect(formComponent.disableSaveButton).toBeTrue();
        expect(formComponent.disableCompleteButton).toBeTrue();
    });

    it('should ENABLE complete & save buttons when something goes wrong during completion process', (done) => {
        const errorMessage = 'Something went wrong.';
        spyOn(formCloudService, 'completeTaskForm').and.callFake(() => throwError(errorMessage));

        formCloudService
            .completeTaskForm(
                'test-app',
                '123',
                '333-444',
                '123',
                {
                    pfx_property_one: 'testValue',
                    pfx_property_two: true,
                    pfx_property_three: 'opt_1',
                    pfx_property_four: 'option_2',
                    pfx_property_five: 'orange',
                    pfx_property_none: 'no_form_field'
                },
                'Complete',
                123
            )
            .subscribe({
                next: () => done.fail('expected an error, not data'),
                error: (error) => {
                    expect(error).toBe(errorMessage);
                    expect(formComponent.disableSaveButton).toBeFalse();
                    expect(formComponent.disableCompleteButton).toBeFalse();
                    done();
                }
            });
    });

    it('should render header and three text field columns', () => {
        const formModel = formCloudService.parseForm(formDefinitionThreeColumnMock);
        formComponent.form = formModel;
        fixture.detectChanges();

        const columns = fixture.debugElement.queryAll(By.css('.adf-grid-list-single-column'));

        expect(columns.length).toEqual(3);
        columns.forEach((column) => expect(column.styles.width).toEqual('33.3333%'));
        columns.forEach((column) => {
            const input = column.query(By.css('input[matinput]'));
            expect(input.attributes.type).toEqual('text');
        });

        const header = fixture.debugElement.query(By.css('#container-header'));
        expect(header.nativeElement.innerText).toEqual('Header');

        expect(formComponent.showTitle).toBeTruthy();
    });

    it('should disable save button on [save] outcome click', () => {
        const formModel = new FormModel();
        const outcome = new FormOutcomeModel(formModel, {
            id: FormCloudComponent.SAVE_OUTCOME_ID,
            name: 'SAVE',
            isSystem: true
        });
        formComponent.form = formModel;

        formComponent.onOutcomeClicked(outcome);

        expect(formComponent.disableSaveButton).toBeTrue();
    });

    describe('form validations', () => {
        it('should be able to set visibility conditions for Attach File widget', async () => {
            spyOn(formCloudService, 'getForm').and.returnValue(of(conditionalUploadWidgetsMock));
            const formId = '123';
            const appName = 'test-app';
            formComponent.formId = formId;
            formComponent.appVersion = 1;

            formComponent.ngOnChanges({ appName: new SimpleChange(null, appName, true) });
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

        it('should be able to set visibility conditions for Outcomes', async () => {
            spyOn(formCloudService, 'getForm').and.returnValue(of(conditionalUploadWidgetsMock));
            const formId = '123';
            const appName = 'test-app';
            formComponent.formId = formId;
            formComponent.appVersion = 1;

            formComponent.ngOnChanges({ appName: new SimpleChange(null, appName, true) });
            expect(formCloudService.getForm).toHaveBeenCalledWith(appName, formId, 1);

            fixture.detectChanges();
            let outcome = fixture.debugElement.query(By.css(`#adf-form-custom_outcome`));
            expect(outcome).toBeNull();

            const inputElement = fixture.debugElement.query(By.css('[id="field-Text0xlk8n-container"] input'));
            inputElement.nativeElement.value = 'hi';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            outcome = fixture.debugElement.query(By.css(`#adf-form-custom_outcome`));
            expect(outcome.nativeElement.innerText).toEqual('CUSTOM OUTCOME');
        });
    });

    describe('Full screen', async () => {
        let displayModeOnSpy: jasmine.Spy;
        let displayModeOffSpy: jasmine.Spy;

        /**
         * Helper function for loading the form in the tests
         *
         * @param form The form model to be loaded
         */
        async function loadForm(form?: any): Promise<void> {
            formComponent.ngOnChanges({
                form: { currentValue: formComponent.parseForm(form || {}), firstChange: true, isFirstChange: () => true, previousValue: undefined }
            });
            await fixture.whenStable();
            fixture.detectChanges();
        }

        beforeEach(async () => {
            displayModeOnSpy = spyOn(formComponent.displayModeOn, 'emit').and.stub();
            displayModeOffSpy = spyOn(formComponent.displayModeOff, 'emit').and.stub();
            spyOn(displayModeService, 'getDefaultDisplayModeConfigurations').and.callFake(
                () => DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS
            );

            formComponent.taskId = 'any';
            formComponent.appName = 'any';
            formComponent.showRefreshButton = false;
            formComponent.showTitle = false;
            formComponent.showValidationIcon = false;

            await loadForm();

            displayModeOnSpy.calls.reset();
            displayModeOffSpy.calls.reset();
        });

        it('should emit display mode turned on wit the inline configuration', async () => {
            await loadForm();

            expect(displayModeOnSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[0]);
        });

        it('should not be in fullScreen mode by default', () => {
            const fullScreenModeContainer = fixture.debugElement.query(By.css('.adf-cloud-form-container.adf-cloud-form-fullscreen-container'));
            const inlineModeContainer = fixture.debugElement.query(By.css('.adf-cloud-form-container.adf-cloud-form-inline-container'));
            expect(fullScreenModeContainer).toBeNull();
            expect(inlineModeContainer).not.toBeNull();
        });

        it('should be in fullScreen mode if it is forced', async () => {
            await loadForm({ displayMode: FormCloudDisplayMode.fullScreen });

            const fullScreenModeContainer = fixture.debugElement.query(By.css('.adf-cloud-form-container.adf-cloud-form-fullscreen-container'));
            const inlineModeContainer = fixture.debugElement.query(By.css('.adf-cloud-form-container.adf-cloud-form-inline-container'));
            expect(fullScreenModeContainer).not.toBeNull();
            expect(inlineModeContainer).toBeNull();
        });

        it('should display full screen button on header when header is displayed an not in fullScreen mode', () => {
            formComponent.showTitle = true;
            fixture.detectChanges();

            const fullScreenButton = fixture.debugElement.query(By.css('.adf-cloud-form-fullscreen-button'));
            expect(fullScreenButton).not.toBeNull();
        });

        it('should set fullScreen mode on clicking on the full screen button', async () => {
            formComponent.showTitle = true;
            fixture.detectChanges();

            const fullScreenButton = await documentRootLoader.getHarness(
                MatButtonHarness.with({ selector: `[data-automation-id="adf-cloud-form-fullscreen-button"]` })
            );
            await fullScreenButton.click();

            await fixture.whenStable();

            expect(formComponent.displayMode).toBe(FormCloudDisplayMode.fullScreen);
            expect(displayModeOffSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[0]);
            expect(displayModeOnSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);
        });

        it('should not display full screen button on header when header is displayed but in fullScreen mode', async () => {
            formComponent.showTitle = true;
            await loadForm({ displayMode: FormCloudDisplayMode.fullScreen });

            const fullScreenButton = fixture.debugElement.query(By.css('.adf-cloud-form-fullscreen-button'));
            expect(fullScreenButton).toBeNull();
        });

        it('should not display full screen button when header is not displayed', () => {
            const fullScreenButton = fixture.debugElement.query(By.css('.adf-cloud-form-fullscreen-button'));
            expect(fullScreenButton).toBeNull();
        });

        it('should not set the styles for the card', () => {
            const fullScreenCard = fixture.debugElement.query(By.css('.adf-cloud-form-content-card-fullscreen'));
            expect(fullScreenCard).toBeNull();
        });

        it('should set fullScreen mode from the form service notification', () => {
            DisplayModeService.changeDisplayMode({ displayMode: FormCloudDisplayMode.fullScreen, id: formComponent.id });

            expect(displayModeOffSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[0]);
            expect(displayModeOnSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);
            expect(formComponent.displayMode).toBe(FormCloudDisplayMode.fullScreen);

            displayModeOnSpy.calls.reset();
            displayModeOffSpy.calls.reset();

            DisplayModeService.changeDisplayMode({ displayMode: FormCloudDisplayMode.inline, id: formComponent.id });

            expect(displayModeOffSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);
            expect(displayModeOnSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[0]);
            expect(formComponent.displayMode).toBe(FormCloudDisplayMode.inline);
        });

        it('should not change the display mode when the notification change is from a different id', () => {
            DisplayModeService.changeDisplayMode({ displayMode: FormCloudDisplayMode.fullScreen, id: formComponent.id });

            expect(formComponent.displayMode).toBe(FormCloudDisplayMode.fullScreen);
            expect(displayModeOffSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[0]);
            expect(displayModeOnSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);

            displayModeOnSpy.calls.reset();
            displayModeOffSpy.calls.reset();

            DisplayModeService.changeDisplayMode({ displayMode: FormCloudDisplayMode.inline, id: 'otherId' });
            expect(displayModeOffSpy).not.toHaveBeenCalled();
            expect(displayModeOnSpy).not.toHaveBeenCalled();

            expect(formComponent.displayMode).toBe(FormCloudDisplayMode.fullScreen);
        });

        describe('fullScreen Mode', () => {
            beforeEach(async () => {
                await loadForm({ displayMode: FormCloudDisplayMode.fullScreen });
            });

            it('should emit display mode turned on with the fullScreen configuration', () => {
                expect(displayModeOnSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);
            });

            it('should display the toolbar with the nameless task title when the task name is not provided and toolbar is enabled', () => {
                const cloudFormToolbarDisplayName: HTMLSpanElement =
                    fixture.debugElement.nativeElement.querySelector('.adf-cloud-form__display-name');
                expect(cloudFormToolbarDisplayName).not.toBeNull();
                expect(cloudFormToolbarDisplayName.textContent.trim()).toEqual('Nameless task');
            });

            it('should display the toolbar with the task title when the task name is provided and toolbar is enabled', async () => {
                const taskName = 'task-name';

                await loadForm({ displayMode: FormCloudDisplayMode.fullScreen, taskName });

                const cloudFormToolbarDisplayName: HTMLSpanElement =
                    fixture.debugElement.nativeElement.querySelector('.adf-cloud-form__display-name');
                expect(cloudFormToolbarDisplayName).not.toBeNull();
                expect(cloudFormToolbarDisplayName.textContent.trim()).toEqual(taskName);
            });

            it('should not display the toolbar with the task title when the toolbar option is disabled', async () => {
                formComponent.displayModeConfigurations = [
                    {
                        displayMode: FormCloudDisplayMode.fullScreen,
                        options: {
                            onCompleteTask: () => {},
                            onDisplayModeOff: () => {},
                            onDisplayModeOn: () => {},
                            onSaveTask: () => {},
                            displayToolbar: false
                        }
                    }
                ];

                await loadForm({ displayMode: FormCloudDisplayMode.fullScreen });

                const cloudFormToolbar: HTMLSpanElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-form-toolbar');
                expect(cloudFormToolbar).toBeNull();
            });

            it('should set the styles for the card', () => {
                const fullScreenCard = fixture.debugElement.query(By.css('.adf-cloud-form-content-card-fullscreen'));
                expect(fullScreenCard).not.toBeNull();
            });

            it('should close fullScreen when close button is clicked', async () => {
                displayModeOnSpy.calls.reset();
                displayModeOffSpy.calls.reset();

                const closeButton = await documentRootLoader.getHarness(
                    MatButtonHarness.with({ selector: `[data-automation-id="adf-cloud-form-close-button"]` })
                );
                await closeButton.click();

                await fixture.whenStable();
                fixture.detectChanges();

                expect(formComponent.displayMode).toEqual(FormCloudDisplayMode.inline);
                expect(displayModeOffSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);
                expect(displayModeOnSpy).toHaveBeenCalledWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[0]);
            });

            it('should close fullScreen when completing the task', () => {
                const formRenderingServiceOnCompleteTaskSpy = spyOn(displayModeService, 'onCompleteTask').and.callThrough();
                const onCompleteTaskSpy = spyOn(
                    DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1].options,
                    'onCompleteTask'
                ).and.callThrough();
                const formRenderingServiceChangeDisplayModeSpy = spyOn(DisplayModeService, 'changeDisplayMode').and.callThrough();

                displayModeOnSpy.calls.reset();
                displayModeOffSpy.calls.reset();

                formComponent.completeTaskForm();

                expect(formRenderingServiceOnCompleteTaskSpy).toHaveBeenCalledOnceWith(
                    formComponent.id,
                    FormCloudDisplayMode.fullScreen,
                    DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS
                );
                expect(onCompleteTaskSpy).toHaveBeenCalledOnceWith(formComponent.id);
                expect(formRenderingServiceChangeDisplayModeSpy).toHaveBeenCalledOnceWith({
                    id: formComponent.id,
                    displayMode: FormCloudDisplayMode.inline
                });
                expect(displayModeOffSpy).toHaveBeenCalledOnceWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);
                expect(displayModeOnSpy).toHaveBeenCalledOnceWith(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[0]);
                expect(formComponent.displayMode).toBe(FormCloudDisplayMode.inline);
            });
        });
    });
});

describe('Multilingual Form', () => {
    let translateService: TranslateService;
    let formCloudService: FormCloudService;
    let formComponent: FormCloudComponent;
    let fixture: ComponentFixture<FormCloudComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AuthModule.forRoot({ useHash: true }),
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                CoreModule.forRoot(),
                ProcessServicesCloudModule.forRoot()
            ],
            providers: [provideTranslations('app', 'resources')]
        });
        translateService = TestBed.inject(TranslateService);
        formCloudService = TestBed.inject(FormCloudService);

        fixture = TestBed.createComponent(FormCloudComponent);
        formComponent = fixture.componentInstance;
        formComponent.form = formComponent.parseForm(fakeMetadataForm);
        fixture.detectChanges();
    });

    it('should  translate form labels on language change', async () => {
        spyOn(formCloudService, 'getForm').and.returnValue(of(multilingualForm));
        const formId = '123';
        const appName = 'test-app';
        formComponent.formId = formId;
        formComponent.appVersion = 1;

        formComponent.ngOnChanges({ appName: new SimpleChange(null, appName, true) });
        expect(formCloudService.getForm).toHaveBeenCalledWith(appName, formId, 1);

        await translateService.use('fr').toPromise();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(getLabelValue('textField')).toEqual('Champ de texte');
        expect(getLabelValue('fildUploadField')).toEqual('Téléchargement de fichiers');
        expect(getLabelValue('dateField')).toEqual('Champ de date (D-M-YYYY)');
        expect(getLabelValue('amountField')).toEqual('Champ Montant');

        await translateService.use('en').toPromise();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(getLabelValue('textField')).toEqual('Text field');
        expect(getLabelValue('fildUploadField')).toEqual('File Upload');
        expect(getLabelValue('dateField')).toEqual('Date field (D-M-YYYY)');
        expect(getLabelValue('amountField')).toEqual('Amount field');
    });

    const getLabelValue = (containerId: string): string => {
        const label = fixture.debugElement.nativeElement.querySelector(`[id="field-${containerId}-container"] label`);
        return label.innerText;
    };
});

describe('retrieve metadata on submit', () => {
    let formComponent: FormCloudComponent;
    let fixture: ComponentFixture<FormCloudComponent>;
    let formService: FormService;

    const fakeNodeWithProperties = {
        id: 'fake-properties',
        name: 'fake-properties-name',
        content: {
            mimeType: 'application/pdf'
        },
        properties: {
            'pfx:property_one': 'testValue',
            'pfx:property_two': true
        }
    } as Node;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AuthModule.forRoot({ useHash: true }), NoopAnimationsModule, TranslateModule.forRoot(), CoreModule.forRoot(), FormCloudModule],
            providers: [
                provideTranslations('app', 'resources'),
                {
                    provide: VersionCompatibilityService,
                    useValue: {}
                }
            ]
        });
        const apiService = TestBed.inject(AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue(mockOauth2Auth);

        formService = TestBed.inject(FormService);

        fixture = TestBed.createComponent(FormCloudComponent);
        formComponent = fixture.componentInstance;
        formComponent.form = formComponent.parseForm(fakeMetadataForm);
        fixture.detectChanges();
    });

    it('should set values when updateFormValuesRequested is updated', async () => {
        formComponent.form.values['pfx_property_three'] = {};
        formComponent.form.values['pfx_property_four'] = 'empty';
        formComponent.form.values['pfx_property_five'] = 'green';

        const addValuesNotPresent = spyOn<any>(formComponent.form, 'addValuesNotPresent').and.callThrough();
        const formDataRefreshed = spyOn<any>(formComponent.formDataRefreshed, 'emit').and.callThrough();

        const values = {
            pfx_property_one: 'testValue',
            pfx_property_two: true,
            pfx_property_three: 'opt_1',
            pfx_property_four: 'option_2',
            pfx_property_five: 'orange',
            pfx_property_none: 'no_form_field'
        };

        formService.updateFormValuesRequested.next(values);

        expect(addValuesNotPresent).toHaveBeenCalledWith(values);
        expect(formComponent.form.values['pfx_property_one']).toBe('testValue');
        expect(formComponent.form.values['pfx_property_two']).toBe(true);
        expect(formComponent.form.values['pfx_property_three']).toEqual({ id: 'opt_1', name: 'Option 1' });
        expect(formComponent.form.values['pfx_property_four']).toEqual({ id: 'option_2', name: 'Option: 2' });
        expect(formComponent.form.values['pfx_property_five']).toEqual('green');
        expect(formDataRefreshed).toHaveBeenCalled();
    });

    it('should call setNodeIdValueForViewersLinkedToUploadWidget when content is UploadWidgetContentLinkModel', async () => {
        const uploadWidgetContentLinkModel = new UploadWidgetContentLinkModel(fakeNodeWithProperties, 'attach-file-alfresco');

        const setNodeIdValueForViewersLinkedToUploadWidget = spyOn<any>(
            formComponent.form,
            'setNodeIdValueForViewersLinkedToUploadWidget'
        ).and.callThrough();
        const formDataRefreshed = spyOn<any>(formComponent.formDataRefreshed, 'emit').and.callThrough();
        const formContentClicked = spyOn<any>(formComponent.formContentClicked, 'emit').and.callThrough();

        formService.formContentClicked.next(uploadWidgetContentLinkModel);

        expect(setNodeIdValueForViewersLinkedToUploadWidget).toHaveBeenCalledWith(uploadWidgetContentLinkModel);
        expect(formDataRefreshed).toHaveBeenCalled();
        expect(formContentClicked).not.toHaveBeenCalled();
    });

    it('should not call setNodeIdValueForViewersLinkedToUploadWidget when content is not UploadWidgetContentLinkModel', async () => {
        const contentLinkModel = new ContentLinkModel(fakeNodeWithProperties);

        const setNodeIdValueForViewersLinkedToUploadWidget = spyOn<any>(
            formComponent.form,
            'setNodeIdValueForViewersLinkedToUploadWidget'
        ).and.callThrough();
        const formDataRefreshed = spyOn<any>(formComponent.formDataRefreshed, 'emit').and.callThrough();
        const formContentClicked = spyOn<any>(formComponent.formContentClicked, 'emit').and.callThrough();

        formService.formContentClicked.next(contentLinkModel);

        expect(setNodeIdValueForViewersLinkedToUploadWidget).not.toHaveBeenCalled();
        expect(formDataRefreshed).not.toHaveBeenCalled();
        expect(formContentClicked).toHaveBeenCalledWith(contentLinkModel);
    });

    it('should stop propagation on keydown event', () => {
        const escapeKeyboardEvent = new KeyboardEvent('keydown', { key: ESCAPE.toString() });
        const stopPropagationSpy = spyOn(escapeKeyboardEvent, 'stopPropagation');

        fixture.debugElement.triggerEventHandler('keydown', escapeKeyboardEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should enable save button when form field value changed', () => {
        formComponent.disableSaveButton = true;

        formService.formFieldValueChanged.next({} as FormFieldEvent);

        expect(formComponent.disableSaveButton).toBeFalse();
    });
});
