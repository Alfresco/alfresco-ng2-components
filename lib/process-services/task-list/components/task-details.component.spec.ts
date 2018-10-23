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
import { of, throwError } from 'rxjs';

import {
    FormModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    FormService,
    setupTestBed,
    BpmUserService
} from '@alfresco/adf-core';
import { CommentProcessService, LogService, AuthenticationService } from '@alfresco/adf-core';

import { UserProcessModel } from '@alfresco/adf-core';
import { TaskDetailsModel } from '../models/task-details.model';
import {
    noDataMock,
    taskDetailsMock,
    standaloneTaskWithForm,
    standaloneTaskWithoutForm,
    taskFormMock,
    tasksMock,
    taskDetailsWithOutAssigneeMock
} from '../../mock';
import { TaskListService } from './../services/tasklist.service';
import { TaskDetailsComponent } from './task-details.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { PeopleProcessService } from '@alfresco/adf-core';

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
    let getTasksSpy: jasmine.Spy;
    let assignTaskSpy: jasmine.Spy;
    let completeTaskSpy: jasmine.Spy;
    let logService: LogService;
    let commentProcessService: CommentProcessService;
    let peopleProcessService: PeopleProcessService;
    let authService: AuthenticationService;

    setupTestBed({
        imports: [
            ProcessTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        logService = TestBed.get(LogService);

        const userService: BpmUserService = TestBed.get(BpmUserService);
        spyOn(userService, 'getCurrentUserInfo').and.returnValue(of({}));

        service = TestBed.get(TaskListService);
        spyOn(service, 'getTaskChecklist').and.returnValue(of(noDataMock));

        formService = TestBed.get(FormService);

        getTaskDetailsSpy = spyOn(service, 'getTaskDetails').and.returnValue(of(taskDetailsMock));
        spyOn(formService, 'getTaskForm').and.returnValue(of(taskFormMock));
        taskDetailsMock.processDefinitionId = null;
        spyOn(formService, 'getTask').and.returnValue(of(taskDetailsMock));

        getTasksSpy = spyOn(service, 'getTasks').and.returnValue(of(tasksMock));
        assignTaskSpy = spyOn(service, 'assignTask').and.returnValue(of(fakeUser));
        completeTaskSpy = spyOn(service, 'completeTask').and.returnValue(of({}));
        commentProcessService = TestBed.get(CommentProcessService);

        authService = TestBed.get(AuthenticationService);
        spyOn(authService, 'getBpmLoggedUser').and.returnValue(of({ email: 'fake-email' }));

        spyOn(commentProcessService, 'getTaskComments').and.returnValue(of([
            { message: 'Test1', created: Date.now(), createdBy: { firstName: 'Admin', lastName: 'User' } },
            { message: 'Test2', created: Date.now(), createdBy: { firstName: 'Admin', lastName: 'User' } },
            { message: 'Test3', created: Date.now(), createdBy: { firstName: 'Admin', lastName: 'User' } }
        ]));

        fixture = TestBed.createComponent(TaskDetailsComponent);
        peopleProcessService = TestBed.get(PeopleProcessService);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        getTaskDetailsSpy.calls.reset();
        fixture.destroy();
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

    it('should send a claim task event when a task is claimed', async(() => {
        component.claimedTask.subscribe((taskId) => {
            expect(taskId).toBe('FAKE-TASK-CLAIM');
        });
        component.onClaimAction('FAKE-TASK-CLAIM');
    }));

    it('should send a unclaim task event when a task is unclaimed', async(() => {
        component.claimedTask.subscribe((taskId) => {
            expect(taskId).toBe('FAKE-TASK-UNCLAIM');
        });
        component.onUnclaimAction('FAKE-TASK-UNCLAIM');
    }));

    it('should set a placeholder message when taskId not initialised', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
    });

    it('shoud display a form when the task has an associated form', (done) => {
        component.taskId = '123';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('adf-form'))).not.toBeNull();
            done();
        });
    });

    it('shoud display a form in readonly when the task has an associated form and readOnlyForm is true', (done) => {
        component.readOnlyForm = true;
        component.taskId = '123';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('adf-form'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('.adf-readonly-form'))).not.toBeNull();
            done();
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

    it('should display task standalone component when the task does not have an associated form', async(() => {
        component.taskId = '123';
        getTaskDetailsSpy.and.returnValue(of(standaloneTaskWithoutForm));

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.isStandaloneTaskWithoutForm()).toBeTruthy();
            expect(fixture.debugElement.query(By.css('adf-task-standalone'))).not.toBeNull();
        });
    }));

    it('should not display task standalone component when the task has a form', async(() => {
        component.taskId = '123';
        getTaskDetailsSpy.and.returnValue(of(standaloneTaskWithForm));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.isStandaloneTaskWithForm()).toBeTruthy();
            expect(fixture.debugElement.query(By.css('adf-task-standalone'))).toBeDefined();
            expect(fixture.debugElement.query(By.css('adf-task-standalone'))).not.toBeNull();
        });
    }));

    it('should display the AttachFormComponent when standaloneTaskWithForm and click on attach button', async(() => {
        component.taskId = '123';
        getTaskDetailsSpy.and.returnValue(of(standaloneTaskWithForm));
        fixture.detectChanges();
        component.onShowAttachForm();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.isStandaloneTaskWithForm()).toBeTruthy();
            expect(fixture.debugElement.query(By.css('adf-attach-form'))).toBeDefined();
        });
    }));

    it('should display the claim message when the task is not assigned', async(() => {
        component.taskDetails = taskDetailsWithOutAssigneeMock;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const claimMessage = fixture.nativeElement.querySelector('#claim-message-id');
            expect(claimMessage).toBeDefined();
            expect(claimMessage.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.CLAIM');
        });
    }));

    it('should not display the claim message when the task is assigned', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const claimMessage = fixture.nativeElement.querySelector('#claim-message-id');
            expect(claimMessage).toBeNull();
        });
    }));

    describe('change detection', () => {

        let change;
        let nullChange;

        beforeEach(() => {
            change = new SimpleChange('123', '456', true);
            nullChange = new SimpleChange('123', null, true);
        });

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

        it('should NOT fetch new task details when empty changeset made', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.ngOnChanges({});
                expect(getTaskDetailsSpy).not.toHaveBeenCalled();
            });
        }));

        it('should NOT fetch new task details when taskId changed to null', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.ngOnChanges({ 'taskId': nullChange });
                expect(getTaskDetailsSpy).not.toHaveBeenCalled();
            });
        }));

        it('should set a placeholder message when taskId changed to null', () => {
            component.ngOnChanges({ 'taskId': nullChange });
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
            getTasksSpy.and.returnValue(of([]));
            component.onComplete();
            fixture.detectChanges();
            expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
        });

        it('should emit an error event if an error occurs fetching the next task', () => {
            let emitSpy: jasmine.Spy = spyOn(component.error, 'emit');
            getTasksSpy.and.returnValue(throwError({}));
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
            component.ngOnChanges({ 'taskId': new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(true);
        });

        it('should comments be readonly if the task is complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ 'taskId': new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(true);
        });

        it('should comments NOT be readonly if the task is NOT complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ 'taskId': new SimpleChange('123', '456', true) });
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = null;

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(false);
        });

        it('should comments NOT be readonly if the task is complete and user are involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ 'taskId': new SimpleChange('123', '456', true) });
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(false);
        });

        it('should comments be present if showComments is true', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ 'taskId': new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);

            fixture.detectChanges();
            expect(component.activitiComments).toBeDefined();
        });

        it('should comments NOT be present if showComments is false', () => {
            component.showComments = false;
            component.ngOnChanges({ 'taskId': new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);

            fixture.detectChanges();
            expect(component.activitiComments).not.toBeDefined();
        });
    });

    describe('assign task to user', () => {

        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        it('should return an observable with user search results', (done) => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of([{
                id: 1,
                firstName: 'fake-test-1',
                lastName: 'fake-last-1',
                email: 'fake-test-1@test.com'
            }, {
                id: 2,
                firstName: 'fake-test-2',
                lastName: 'fake-last-2',
                email: 'fake-test-2@test.com'
            }]));

            component.peopleSearch.subscribe((users) => {
                expect(users.length).toBe(2);
                expect(users[0].firstName).toBe('fake-test-1');
                expect(users[0].lastName).toBe('fake-last-1');
                expect(users[0].email).toBe('fake-test-1@test.com');
                expect(users[0].id).toBe(1);
                done();
            });
            component.searchUser('fake-search-word');
        });

        it('should return an empty list for not valid search', (done) => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of([]));

            component.peopleSearch.subscribe((users) => {
                expect(users.length).toBe(0);
                done();
            });
            component.searchUser('fake-search-word');
        });

        it('should log error message when search fails', async(() => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(throwError(''));

            component.peopleSearch.subscribe(() => {
                expect(logService.error).toHaveBeenCalledWith('Could not load users');
            });
            component.searchUser('fake-search');
        }));

        it('should assign task to user', () => {
            component.assignTaskToUser(fakeUser);
            expect(assignTaskSpy).toHaveBeenCalled();
        });
    });

});
