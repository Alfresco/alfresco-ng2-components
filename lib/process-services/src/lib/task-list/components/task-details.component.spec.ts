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

import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import {
    FormModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    setupTestBed,
    LogService,
    CommentModel
} from '@alfresco/adf-core';
import { TaskDetailsModel } from '../models/task-details.model';
import {
    noDataMock,
    taskDetailsMock,
    taskFormMock,
    tasksMock,
    taskDetailsWithOutAssigneeMock
} from '../../mock';
import { TaskListService } from './../services/tasklist.service';
import { TaskDetailsComponent } from './task-details.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TaskService } from '../../form/services/task.service';
import { TaskFormService } from '../../form/services/task-form.service';
import { TaskCommentsService } from '../../task-comments/services/task-comments.service';
import { UserProcessModel } from '../../common/models/user-process.model';
import { PeopleProcessService } from '../../common/services/people-process.service';

const fakeUser = new UserProcessModel({
    id: 'fake-id',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

const fakeTaskAssignResponse = new TaskDetailsModel({
    id: 'fake-id',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

describe('TaskDetailsComponent', () => {

    let taskListService: TaskListService;
    let taskService: TaskService;
    let taskFormService: TaskFormService;
    let component: TaskDetailsComponent;
    let fixture: ComponentFixture<TaskDetailsComponent>;
    let getTaskDetailsSpy: jasmine.Spy;
    let getTasksSpy: jasmine.Spy;
    let assignTaskSpy: jasmine.Spy;
    let logService: LogService;
    let taskCommentsService: TaskCommentsService;
    let peopleProcessService: PeopleProcessService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        logService = TestBed.inject(LogService);
        peopleProcessService = TestBed.inject(PeopleProcessService);

        spyOn(peopleProcessService, 'getCurrentUserInfo').and.returnValue(of(<any>{ email: 'fake-email' }));

        taskListService = TestBed.inject(TaskListService);
        spyOn(taskListService, 'getTaskChecklist').and.returnValue(of(noDataMock));

        taskService = TestBed.inject(TaskService);
        taskFormService = TestBed.inject(TaskFormService);

        getTaskDetailsSpy = spyOn(taskListService, 'getTaskDetails').and.returnValue(of(taskDetailsMock));
        spyOn(taskFormService, 'getTaskForm').and.returnValue(of(taskFormMock));
        taskDetailsMock.processDefinitionId = null;
        spyOn(taskService, 'getTask').and.returnValue(of(taskDetailsMock));

        getTasksSpy = spyOn(taskListService, 'getTasks').and.returnValue(of(tasksMock));
        assignTaskSpy = spyOn(taskListService, 'assignTask').and.returnValue(of(fakeTaskAssignResponse));
        taskCommentsService = TestBed.inject(TaskCommentsService);

        spyOn(taskCommentsService, 'get').and.returnValue(of([
            new CommentModel({ message: 'Test1', created: Date.now(), createdBy: { firstName: 'Admin', lastName: 'User' } }),
            new CommentModel({ message: 'Test2', created: Date.now(), createdBy: { firstName: 'Admin', lastName: 'User' } }),
            new CommentModel({ message: 'Test3', created: Date.now(), createdBy: { firstName: 'Admin', lastName: 'User' } })
        ]));

        fixture = TestBed.createComponent(TaskDetailsComponent);
        peopleProcessService = TestBed.inject(PeopleProcessService);
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

    it('should send a claim task event when a task is claimed', async () => {
        await component.claimedTask.subscribe((taskId) => {
            expect(taskId).toBe('FAKE-TASK-CLAIM');
        });
        component.onClaimAction('FAKE-TASK-CLAIM');
    });

    it('should send a unclaim task event when a task is unclaimed', async () => {
        const taskUnclaimedSpy = spyOn(component.unClaimedTask, 'emit');
        component.onUnclaimAction('FAKE-TASK-UNCLAIM');

        expect(taskUnclaimedSpy).toHaveBeenCalledWith('FAKE-TASK-UNCLAIM');
    });

    it('should set a placeholder message when taskId not initialised', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
    });

    it('should display a form when the task has an associated form', fakeAsync(() => {
        component.taskId = '123';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('adf-form'))).not.toBeNull();
    }));

    it('should display a form in readonly when the task has an associated form and readOnlyForm is true', fakeAsync(() => {
        component.readOnlyForm = true;
        component.taskId = '123';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('adf-form'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('.adf-readonly-form'))).not.toBeNull();
    }));

    it('should not display a form when the task does not have an associated form', async () => {
        component.taskId = '123';
        taskDetailsMock.formKey = undefined;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.debugElement.query(By.css('adf-form'))).toBeNull();
    });

    it('should display the claim message when the task is not assigned', async () => {
        component.taskDetails = taskDetailsWithOutAssigneeMock;
        fixture.detectChanges();
        await fixture.whenStable();
        const claimMessage = fixture.nativeElement.querySelector('#claim-message-id');

        expect(claimMessage).toBeTruthy();
        expect(claimMessage.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.CLAIM');
    });

    it('should not display the claim message when the task is assigned', fakeAsync(() => {
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

        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        it('should fetch new task details when taskId changed', () => {
            component.ngOnChanges({ taskId: change });
            expect(getTaskDetailsSpy).toHaveBeenCalledWith('456');
        });

        it('should set a placeholder message when taskId changed to null', () => {
            component.ngOnChanges({ taskId: nullChange });
            fixture.detectChanges();
            expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
        });
    });

    describe('Form events', () => {

        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        afterEach(() => {
            const overlayContainers = window.document.querySelectorAll('.cdk-overlay-container');

            overlayContainers.forEach((overlayContainer) => {
                overlayContainer.innerHTML = '';
            });
        });

        it('should emit a save event when form saved', () => {
            const emitSpy: jasmine.Spy = spyOn(component.formSaved, 'emit');
            component.onFormSaved(new FormModel());
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should emit a outcome execution event when form outcome executed', () => {
            const emitSpy: jasmine.Spy = spyOn(component.executeOutcome, 'emit');
            component.onFormExecuteOutcome(new FormOutcomeEvent(new FormOutcomeModel(new FormModel())));
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should emit a complete event when form completed', () => {
            const emitSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
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
            const emitSpy: jasmine.Spy = spyOn(component.error, 'emit');
            getTasksSpy.and.returnValue(throwError({}));
            component.onComplete();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should NOT load next task when form completed if showNextTask is false', () => {
            component.showNextTask = false;
            component.onComplete();
            expect(getTasksSpy).not.toHaveBeenCalled();
        });

        it('should emit a complete event when complete button clicked and task completed', () => {
            const emitSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            component.onComplete();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should call service to load next task when complete button clicked', () => {
            component.onComplete();
            expect(getTasksSpy).toHaveBeenCalled();
        });

        it('should emit a load event when form loaded', () => {
            const emitSpy: jasmine.Spy = spyOn(component.formLoaded, 'emit');
            component.onFormLoaded(new FormModel());
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should emit an error event when form error occurs', () => {
            const emitSpy: jasmine.Spy = spyOn(component.error, 'emit');
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
            const emitSpy: jasmine.Spy = spyOn(component.taskCreated, 'emit');
            const mockTask = new TaskDetailsModel(taskDetailsMock);
            component.onChecklistTaskCreated(mockTask);
            expect(emitSpy).toHaveBeenCalled();
        });
   });

    describe('Comments', () => {

        it('should comments be readonly if the task is complete and no user are involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(true);
        });

        it('should comments be readonly if the task is complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(true);
        });

        it('should comments NOT be readonly if the task is NOT complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = null;

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(false);
        });

        it('should comments NOT be readonly if the task is complete and user are involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect((component.activitiComments as any).readOnly).toBe(false);
        });

        it('should comments be present if showComments is true', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskDetailsModel(taskDetailsMock);

            fixture.detectChanges();
            expect(component.activitiComments).toBeDefined();
        });

        it('should comments NOT be present if showComments is false', () => {
            component.showComments = false;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
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

        it('should return an observable with user search results', async () => {
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

            await component.peopleSearch.subscribe((users) => {
                expect(users.length).toBe(2);
                expect(users[0].firstName).toBe('fake-test-1');
                expect(users[0].lastName).toBe('fake-last-1');
                expect(users[0].email).toBe('fake-test-1@test.com');
                expect(users[0].id).toBe(1);
            });
            component.searchUser('fake-search-word');
        });

        it('should return an empty list for not valid search', async () => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of([]));

            await component.peopleSearch.subscribe((users) => {
                expect(users.length).toBe(0);
            });
            component.searchUser('fake-search-word');
        });

        it('should log error message when search fails', async () => {
            const logServiceErrorSpy = spyOn(logService, 'error');

            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(throwError('fake-error'));
            component.searchUser('fake-search');

            expect(logServiceErrorSpy).toHaveBeenCalledWith('Could not load users');
        });

        it('should assign task to user', () => {
            component.assignTaskToUser(fakeUser);
            expect(assignTaskSpy).toHaveBeenCalled();
        });
    });
});
