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

import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { ActivitiFormModule, FormModel, FormOutcomeEvent, FormOutcomeModel, FormService } from 'ng2-activiti-form';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';

import { TaskDetailsModel } from '../models/task-details.model';
import { noDataMock, taskDetailsMock, taskFormMock, tasksMock } from './../assets/task-details.mock';
import { PeopleService } from './../services/people.service';
import { TaskListService } from './../services/tasklist.service';
import { TaskDetailsComponent } from './task-details.component';

describe('TaskDetailsComponent', () => {

    let componentHandler: any;
    let service: TaskListService;
    let formService: FormService;
    let component: TaskDetailsComponent;
    let fixture: ComponentFixture<TaskDetailsComponent>;
    let getTaskDetailsSpy: jasmine.Spy;
    let getFormSpy: jasmine.Spy;
    let getTasksSpy: jasmine.Spy;
    let getFormTaskSpy: jasmine.Spy;
    let completeTaskSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ActivitiFormModule.forRoot()
            ],
            declarations: [
                TaskDetailsComponent
            ],
            providers: [
                TaskListService,
                PeopleService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService.translate, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(TaskDetailsComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(TaskListService);
        formService = fixture.debugElement.injector.get(FormService);

        getTaskDetailsSpy = spyOn(service, 'getTaskDetails').and.returnValue(Observable.of(taskDetailsMock));
        getFormSpy = spyOn(formService, 'getTaskForm').and.returnValue(Observable.of(taskFormMock));
        taskDetailsMock.processDefinitionId = null;
        getFormTaskSpy = spyOn(formService, 'getTask').and.returnValue(Observable.of(taskDetailsMock));

        getTasksSpy = spyOn(service, 'getTasks').and.returnValue(Observable.of(tasksMock));
        completeTaskSpy = spyOn(service, 'completeTask').and.returnValue(Observable.of({}));
        spyOn(service, 'getComments').and.returnValue(Observable.of(noDataMock));
        spyOn(service, 'getTaskChecklist').and.returnValue(Observable.of(noDataMock));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should load task details when taskId specified', () => {
        component.taskId = '123';
        fixture.detectChanges();
        expect(getTaskDetailsSpy).toHaveBeenCalled();
    });

    it('should not load task details when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getTaskDetailsSpy).not.toHaveBeenCalled();
    });

    it('should set a placeholder message when taskId not initialised', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.innerText).toBe('TASK_DETAILS.MESSAGES.NONE');
    });

    it('shoud display a form when the task has an associated form', () => {
        component.taskId = '123';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('adf-form'))).not.toBeNull();
        });
    });

    it('should not display a form when the task does not have an associated form', async(() => {
        component.taskId = '123';
        taskDetailsMock.formKey = undefined;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('adf-form'))).toBeNull();
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getTaskDetailsSpy.calls.reset();
            });
        }));

        it('should fetch new task details when taskId changed', () => {
            component.ngOnChanges({ 'taskId': change });
            expect(getTaskDetailsSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new task details when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getTaskDetailsSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new task details when taskId changed to null', () => {
            component.ngOnChanges({ 'taskId': nullChange });
            expect(getTaskDetailsSpy).not.toHaveBeenCalled();
        });

        it('should set a placeholder message when taskId changed to null', () => {
            component.ngOnChanges({ 'taskId': nullChange });
            fixture.detectChanges();
            expect(fixture.nativeElement.innerText).toBe('TASK_DETAILS.MESSAGES.NONE');
        });
    });

    describe('Form events', () => {

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should emit a save event when form saved', () => {
            let emitSpy: jasmine.Spy = spyOn(component.formSaved, 'emit');
            component.onFormSaved(new FormModel());
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should emit a outcome execution event when form outcome executed', () => {
            let emitSpy: jasmine.Spy = spyOn(component.executeOutcome, 'emit');
            component.onFormExecuteOutcome(new FormOutcomeEvent(new FormOutcomeModel(new FormModel())));
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should emit a complete event when form completed', () => {
            let emitSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            component.onFormCompleted(new FormModel());
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should load next task when form completed', () => {
            component.onComplete();
            expect(getTasksSpy).toHaveBeenCalled();
        });

        it('should show placeholder message if there is no next task', () => {
            getTasksSpy.and.returnValue(Observable.of(noDataMock));
            component.onComplete();
            fixture.detectChanges();
            expect(fixture.nativeElement.innerText).toBe('TASK_DETAILS.MESSAGES.NONE');
        });

        it('should emit an error event if an error occurs fetching the next task', () => {
            let emitSpy: jasmine.Spy = spyOn(component.onError, 'emit');
            getTasksSpy.and.returnValue(Observable.throw({}));
            component.onComplete();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should NOT load next task when form completed if showNextTask is false', () => {
            component.showNextTask = false;
            component.onComplete();
            expect(getTasksSpy).not.toHaveBeenCalled();
        });

        it('should call service to complete task when complete button clicked', () => {
            component.onComplete();
            expect(completeTaskSpy).toHaveBeenCalled();
        });

        it('should emit a complete event when complete button clicked and task completed', () => {
            let emitSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            component.onComplete();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should call service to load next task when complete button clicked', () => {
            component.onComplete();
            expect(getTasksSpy).toHaveBeenCalled();
        });

        it('should emit a load event when form loaded', () => {
            let emitSpy: jasmine.Spy = spyOn(component.formLoaded, 'emit');
            component.onFormLoaded(new FormModel());
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should emit an error event when form error occurs', () => {
            let emitSpy: jasmine.Spy = spyOn(component.onError, 'emit');
            component.onFormError({});
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should display a dialog to the user when a form error occurs', () => {
            let dialogEl = fixture.debugElement.query(By.css('.error-dialog')).nativeElement;
            let showSpy: jasmine.Spy = spyOn(dialogEl, 'showModal');
            component.onFormError({});
            expect(showSpy).toHaveBeenCalled();
        });

        it('should close error dialog when close button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.error-dialog')).nativeElement;
            let closeSpy: jasmine.Spy = spyOn(dialogEl, 'close');
            component.onFormError({});
            component.closeErrorDialog();
            expect(closeSpy).toHaveBeenCalled();
        });

        it('should emit a task created event when checklist task is created', () => {
            let emitSpy: jasmine.Spy = spyOn(component.taskCreated, 'emit');
            let mockTask = new TaskDetailsModel(taskDetailsMock);
            component.onChecklistTaskCreated(mockTask);
            expect(emitSpy).toHaveBeenCalled();
        });

    });

});
