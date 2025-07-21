/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { FormModel, FormOutcomeEvent, FormOutcomeModel, CommentModel, User, ADF_COMMENTS_SERVICE, CommentsService } from '@alfresco/adf-core';
import { noDataMock, taskDetailsMock, taskFormMock, tasksMock, taskDetailsWithOutAssigneeMock } from '../../../testing/mock';
import { TaskListService } from '../../services/tasklist.service';
import { TaskDetailsComponent } from './task-details.component';
import { TaskService } from '../../../form/services/task.service';
import { TaskFormService } from '../../../form/services/task-form.service';
import { PeopleProcessService } from '../../../services/people-process.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { LightUserRepresentation, TaskRepresentation } from '@alfresco/js-api';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

const fakeUser: LightUserRepresentation = {
    id: 0,
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
};

const fakeTaskAssignResponse: any = {
    id: 'fake-id',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
};

describe('TaskDetailsComponent', () => {
    let taskFormService: TaskFormService;
    let component: TaskDetailsComponent;
    let fixture: ComponentFixture<TaskDetailsComponent>;
    let loader: HarnessLoader;
    let getTaskDetailsSpy: jasmine.Spy;
    let getTasksSpy: jasmine.Spy;
    let assignTaskSpy: jasmine.Spy;
    let getWorkflowUsersSpy: jasmine.Spy;
    let taskCommentsService: CommentsService;
    let peopleProcessService: PeopleProcessService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaskDetailsComponent],
            providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
        });
        peopleProcessService = TestBed.inject(PeopleProcessService);
        spyOn(peopleProcessService, 'getCurrentUserInfo').and.returnValue(of({ email: 'fake-email' } as any));
        getWorkflowUsersSpy = spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of([]));

        const taskListService = TestBed.inject(TaskListService);
        spyOn(taskListService, 'getTaskChecklist').and.returnValue(of(noDataMock));

        const taskService = TestBed.inject(TaskService);
        taskFormService = TestBed.inject(TaskFormService);

        getTaskDetailsSpy = spyOn(taskListService, 'getTaskDetails').and.returnValue(of(taskDetailsMock));
        spyOn(taskFormService, 'getTaskForm').and.returnValue(of(taskFormMock));
        taskDetailsMock.processDefinitionId = null;
        spyOn(taskService, 'getTask').and.returnValue(of(taskDetailsMock));

        getTasksSpy = spyOn(taskListService, 'getTasks').and.returnValue(of(tasksMock));
        assignTaskSpy = spyOn(taskListService, 'assignTask').and.returnValue(of(fakeTaskAssignResponse));

        fixture = TestBed.createComponent(TaskDetailsComponent);
        taskCommentsService = fixture.debugElement.injector.get<CommentsService>(ADF_COMMENTS_SERVICE);

        spyOn(taskCommentsService, 'get').and.returnValue(
            of([
                new CommentModel({ message: 'Test1', created: new Date(), createdBy: new User({ firstName: 'Admin', lastName: 'User' }) }),
                new CommentModel({ message: 'Test2', created: new Date(), createdBy: new User({ firstName: 'Admin', lastName: 'User' }) }),
                new CommentModel({ message: 'Test3', created: new Date(), createdBy: new User({ firstName: 'Admin', lastName: 'User' }) })
            ])
        );

        component = fixture.componentInstance;
        component.showComments = false;
        loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    });

    afterEach(() => {
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

    it('should send a claim task event when a task is claimed', () => {
        let lastValue: string;
        component.claimedTask.subscribe((taskId) => (lastValue = taskId));
        component.onClaimAction('FAKE-TASK-CLAIM');
        expect(lastValue).toBe('FAKE-TASK-CLAIM');
    });

    it('should send a unclaim task event when a task is unclaimed', () => {
        const taskUnclaimedSpy = spyOn(component.unClaimedTask, 'emit');
        component.onUnclaimAction('FAKE-TASK-UNCLAIM');

        expect(taskUnclaimedSpy).toHaveBeenCalledWith('FAKE-TASK-UNCLAIM');
    });

    it('should set a placeholder message when taskId not initialised', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.MESSAGES.NONE');
    });

    it('should display a form when the task has an associated form', () => {
        component.taskId = '123';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('adf-form'))).not.toBeNull();
    });

    it('should display a form in readonly when the task has an associated form and readOnlyForm is true', () => {
        component.readOnlyForm = true;
        component.taskId = '123';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('adf-form'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('.adf-readonly-form'))).not.toBeNull();
    });

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

        it('should display a dialog to the user when a form error occurs', async () => {
            const dialogEl = await loader.getHarnessOrNull(MatDialogHarness);
            expect(dialogEl).toBeNull();

            component.onFormError({});

            await loader.getHarness(MatDialogHarness);
        });

        it('should emit a task created event when checklist task is created', () => {
            const emitSpy: jasmine.Spy = spyOn(component.taskCreated, 'emit');
            const mockTask = new TaskRepresentation(taskDetailsMock);
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
            component.taskDetails = new TaskRepresentation(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect(component.isReadOnlyComment()).toBe(true);
        });

        it('should comments be readonly if the task is complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskRepresentation(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect(component.isReadOnlyComment()).toBe(true);
        });

        it('should comments NOT be readonly if the task is NOT complete and user are NOT involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskRepresentation(taskDetailsMock);
            component.taskDetails.endDate = null;

            fixture.detectChanges();
            expect(component.isReadOnlyComment()).toBe(false);
        });

        it('should comments NOT be readonly if the task is complete and user are involved', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [fakeUser];
            component.taskDetails = new TaskRepresentation(taskDetailsMock);
            component.taskDetails.endDate = new Date('2017-10-03T17:03:57.311+0000');

            fixture.detectChanges();
            expect(component.isReadOnlyComment()).toBe(false);
        });

        it('should comments be present if showComments is true', () => {
            component.showComments = true;
            component.showHeaderContent = true;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskRepresentation(taskDetailsMock);

            fixture.detectChanges();
            expect(component.showComments).toBe(true);
        });

        it('should comments NOT be present if showComments is false', () => {
            component.showComments = false;
            component.ngOnChanges({ taskId: new SimpleChange('123', '456', true) });
            component.taskPeople = [];
            component.taskDetails = new TaskRepresentation(taskDetailsMock);

            fixture.detectChanges();
            expect(component.showComments).toBeFalse();
        });
    });

    describe('assign task to user', () => {
        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        it('should return an observable with user search results', () => {
            getWorkflowUsersSpy.and.returnValue(
                of([
                    {
                        id: 1,
                        firstName: 'fake-test-1',
                        lastName: 'fake-last-1',
                        email: 'fake-test-1@test.com',
                        avatarId: '1'
                    },
                    {
                        id: 2,
                        firstName: 'fake-test-2',
                        lastName: 'fake-last-2',
                        email: 'fake-test-2@test.com',
                        avatarId: '2'
                    }
                ])
            );

            let lastValue: LightUserRepresentation[];
            component.peopleSearch.subscribe((users) => (lastValue = users));
            component.searchUser('fake-search-word');

            expect(lastValue.length).toBe(2);
            expect(lastValue[0].firstName).toBe('fake-test-1');
            expect(lastValue[0].lastName).toBe('fake-last-1');
            expect(lastValue[0].email).toBe('fake-test-1@test.com');
            expect(lastValue[0].id).toBe(1);
        });

        it('should return an empty list for not valid search', () => {
            getWorkflowUsersSpy.and.returnValue(of([]));

            let lastValue: LightUserRepresentation[];
            component.peopleSearch.subscribe((users) => (lastValue = users));
            component.searchUser('fake-search-word');

            expect(lastValue.length).toBe(0);
        });

        it('should assign task to user', async () => {
            component.assignTaskToUser(fakeUser);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(assignTaskSpy).toHaveBeenCalled();
        });
    });
});
