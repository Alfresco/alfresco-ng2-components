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
import { MatButtonModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FormModule, FormModel, FormOutcomeEvent, FormOutcomeModel, FormService } from '@adf/process-services';
import { AppConfigService, CommentProcessService, CoreModule, LogService, TranslationService } from 'ng2-alfresco-core';

import { PeopleProcessService, UserProcessModel } from 'ng2-alfresco-core';
import { AppConfigServiceMock } from '../assets/app-config.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';
import { TaskDetailsModel } from '../models/task-details.model';
import { noDataMock, taskDetailsMock, taskFormMock, tasksMock } from './../assets/task-details.mock';
import { TaskListService } from './../services/tasklist.service';
import { PeopleSearchComponent } from './people-search.component';
import { TaskDetailsComponent } from './task-details.component';

declare let jasmine: any;

const fakeUser: UserProcessModel = new UserProcessModel({
    id: 'fake-id',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

describe('TaskDetailsComponent', () => {

    let service: TaskListService;
    let formService: FormService;
    let component: TaskDetailsComponent;
    let fixture: ComponentFixture<TaskDetailsComponent>;
    let getTaskDetailsSpy: jasmine.Spy;
    let getFormSpy: jasmine.Spy;
    let getTasksSpy: jasmine.Spy;
    let assignTaskSpy: jasmine.Spy;
    let getFormTaskSpy: jasmine.Spy;
    let completeTaskSpy: jasmine.Spy;
    let logService: LogService;
    let commentProcessService: CommentProcessService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                FormModule,
                MatButtonModule,
                MatInputModule
            ],
            declarations: [
                TaskDetailsComponent,
                PeopleSearchComponent
            ],
            providers: [
                TaskListService,
                PeopleProcessService,
                {provide: TranslationService, useClass: TranslationMock},
                {provide: AppConfigService, useClass: AppConfigServiceMock},
                CommentProcessService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        logService = TestBed.get(LogService);

    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(TaskDetailsComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(TaskListService);
        formService = fixture.debugElement.injector.get(FormService);
        commentProcessService = TestBed.get(CommentProcessService);

        getTaskDetailsSpy = spyOn(service, 'getTaskDetails').and.returnValue(Observable.of(taskDetailsMock));
        getFormSpy = spyOn(formService, 'getTaskForm').and.returnValue(Observable.of(taskFormMock));
        taskDetailsMock.processDefinitionId = null;
        getFormTaskSpy = spyOn(formService, 'getTask').and.returnValue(Observable.of(taskDetailsMock));

        getTasksSpy = spyOn(service, 'getTasks').and.returnValue(Observable.of(tasksMock));
        assignTaskSpy = spyOn(service, 'assignTask').and.returnValue(Observable.of(fakeUser));
        completeTaskSpy = spyOn(service, 'completeTask').and.returnValue(Observable.of({}));
        spyOn(commentProcessService, 'getTaskComments').and.returnValue(Observable.of(noDataMock));
        spyOn(service, 'getTaskChecklist').and.returnValue(Observable.of(noDataMock));

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
        expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
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
            component.ngOnChanges({'taskId': change});
            expect(getTaskDetailsSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new task details when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getTaskDetailsSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new task details when taskId changed to null', () => {
            component.ngOnChanges({'taskId': nullChange});
            expect(getTaskDetailsSpy).not.toHaveBeenCalled();
        });

        it('should set a placeholder message when taskId changed to null', () => {
            component.ngOnChanges({'taskId': nullChange});
            fixture.detectChanges();
            expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
        });
    });

    describe('Form events', () => {

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        afterEach(() => {
            const overlayContainers = <any> window.document.querySelectorAll('.cdk-overlay-container');

            overlayContainers.forEach((overlayContainer) => {
                overlayContainer.innerHTML = '';
            });
        });

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
            expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
        });

        it('should emit an error event if an error occurs fetching the next task', () => {
            let emitSpy: jasmine.Spy = spyOn(component.error, 'emit');
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
            let emitSpy: jasmine.Spy = spyOn(component.error, 'emit');
            component.onFormError({});
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should display a dialog to the user when a form error occurs', () => {
            let dialogEl = window.document.querySelector('mat-dialog-content');
            expect(dialogEl).toBeNull();

            component.onFormError({});
            fixture.detectChanges();

            dialogEl = window.document.querySelector('mat-dialog-content');
            expect(dialogEl).not.toBeNull();
        });

        it('should emit a task created event when checklist task is created', () => {
            let emitSpy: jasmine.Spy = spyOn(component.taskCreated, 'emit');
            let mockTask = new TaskDetailsModel(taskDetailsMock);
            component.onChecklistTaskCreated(mockTask);
            expect(emitSpy).toHaveBeenCalled();
        });

    });

    describe('Comments', () => {

        it('should comments be readonly if the task is complete and no user are involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({'taskId': new SimpleChange('123', '456', true)});
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activiticomments as any).nativeElement.readOnly).toBe(true);
        });

        it('should comments be readonly if the task is complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({'taskId': new SimpleChange('123', '456', true)});
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activiticomments as any).nativeElement.readOnly).toBe(true);
        });

        it('should comments NOT be readonly if the task is NOT complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({'taskId': new SimpleChange('123', '456', true)});
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = null;

            fixture.detectChanges();
            expect((component.activiticomments as any).nativeElement.readOnly).toBe(false);
        });

        it('should comments NOT be readonly if the task is complete and user are involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({'taskId': new SimpleChange('123', '456', true)});
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activiticomments as any).nativeElement.readOnly).toBe(false);
        });

        it('should comments be present if showComments is true', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({'taskId': new SimpleChange('123', '456', true)});
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);

            fixture.detectChanges();
            expect(component.activiticomments).toBeDefined();
        });

        it('should comments NOT be present if showComments is false', () => {
            component.showComments = false;
            component.ngOnChanges({'taskId': new SimpleChange('123', '456', true)});
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);

            fixture.detectChanges();
            expect(component.activiticomments).not.toBeDefined();
        });
    });

    describe('assign task to user', () => {

        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should return an observable with user search results', (done) => {
            component.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(2);
                expect(users[0].firstName).toBe('fake-test-1');
                expect(users[0].lastName).toBe('fake-last-1');
                expect(users[0].email).toBe('fake-test-1@test.com');
                expect(users[0].id).toBe(1);
                done();
            });
            component.searchUser('fake-search-word');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    data: [{
                        id: 1,
                        firstName: 'fake-test-1',
                        lastName: 'fake-last-1',
                        email: 'fake-test-1@test.com'
                    }, {
                        id: 2,
                        firstName: 'fake-test-2',
                        lastName: 'fake-last-2',
                        email: 'fake-test-2@test.com'
                    }]
                }
            });
        });

        it('should return an empty list for not valid search', (done) => {
            component.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(0);
                done();
            });
            component.searchUser('fake-search-word');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {}
            });
        });

        it('should log error message when search fails', async(() => {
            component.peopleSearch$.subscribe(() => {
                expect(logService.error).toHaveBeenCalledWith('Could not load users');
            });
            component.searchUser('fake-search');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        }));

        it('should assign task to user', () => {
            component.assignTaskToUser(fakeUser);
            expect(assignTaskSpy).toHaveBeenCalled();
        });
    });

});
