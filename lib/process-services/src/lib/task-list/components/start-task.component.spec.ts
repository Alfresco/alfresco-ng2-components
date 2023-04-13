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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, LogService } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { TaskListService } from '../services/tasklist.service';
import { StartTaskComponent } from './start-task.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { taskDetailsMock } from '../../mock/task/task-details.mock';
import { TaskDetailsModel } from '../models/task-details.model';
import { TranslateModule } from '@ngx-translate/core';

describe('StartTaskComponent', () => {

    let component: StartTaskComponent;
    let fixture: ComponentFixture<StartTaskComponent>;
    let service: TaskListService;
    let logService: LogService;
    let element: HTMLElement;
    let getFormListSpy: jasmine.Spy;
    let createNewTaskSpy: jasmine.Spy;
    let logSpy: jasmine.Spy;

    const fakeForms$ = [
        {
            id: 123,
            name: 'Display Data'
        },
        {
            id: 1111,
            name: 'Employee Info'
        }
    ];

    const testUser = { id: 1001, firstName: 'fakeName', email: 'fake@app.activiti.com' };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StartTaskComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        service = TestBed.inject(TaskListService);
        logService = TestBed.inject(LogService);

        getFormListSpy = spyOn(service, 'getFormList').and.returnValue(of(fakeForms$));

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should fetch fake form on init', () => {
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.forms$).toBeDefined();
        expect(getFormListSpy).toHaveBeenCalled();
    });

    describe('create task', () => {

        beforeEach(() => {
            createNewTaskSpy = spyOn(service, 'createNewTask').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: null,
                    assignee: null
                } as any
            ));
        });

        it('should create new task when start is clicked', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('task');
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalled();
        });

        it('should send on success event when the task is started', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: null,
                assignee: null
            });
        });

        it('should send on success event when only name is given', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.appId = 42;
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalled();
        });

        it('should not emit success event when data not present', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskDetailsModel = new TaskDetailsModel(null);
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(createNewTaskSpy).not.toHaveBeenCalled();
            expect(successSpy).not.toHaveBeenCalled();
        });
    });

    describe('attach form', () => {
        beforeEach(() => {
            spyOn(service, 'createNewTask').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: null,
                    assignee: null
                } as any
            ));
        });

        it('should attach form to the task when a form is selected', () => {
            spyOn(service, 'attachFormToATask').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: 1204,
                    assignee: null
                }
            ));
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: null
            });
        });

        it('should not attach form to the task when a no form is selected', () => {
            spyOn(service, 'attachFormToATask').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: null,
                    assignee: null
                }
            ));
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(null);
            component.appId = 42;
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: null,
                assignee: null
            });
        });
    });

    describe('assign user', () => {
        beforeEach(() => {
            spyOn(service, 'createNewTask').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: null,
                    assignee: null
                } as any
            ));
            spyOn(service, 'attachFormToATask').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: 1204,
                    assignee: null
                }
            ));
            spyOn(service, 'assignTaskByUserId').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: 1204,
                    assignee: testUser
                } as any
            ));
        });

        it('should assign task when an assignee is selected', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.assigneeId = testUser.id;
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: testUser
            });
        });

        it('should assign task with id of selected user assigned', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.getAssigneeId(testUser.id);
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: testUser
            });
        });

        it('should not assign task when no assignee is selected', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.assigneeId = null;
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: null
            });
        });
    });

    it('should not attach a form when a form id is not selected', () => {
        const attachFormToATask = spyOn(service, 'attachFormToATask').and.returnValue(of([]));
        spyOn(service, 'createNewTask').and.returnValue(of(new TaskDetailsModel({ id: 'task-id'})));
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        const createTaskButton = element.querySelector<HTMLElement>('#button-start');
        fixture.detectChanges();
        createTaskButton.click();
        expect(attachFormToATask).not.toHaveBeenCalled();
    });

    it('should show start task button', () => {
        fixture.detectChanges();
        expect(element.querySelector('#button-start')).toBeDefined();
        expect(element.querySelector('#button-start')).not.toBeNull();
        expect(element.querySelector('#button-start').textContent).toContain('ADF_TASK_LIST.START_TASK.FORM.ACTION.START');
    });

    it('should render start task button with primary color', () => {
        fixture.detectChanges();
        expect(element.querySelector('#button-start').classList.contains('mat-primary')).toBeTruthy();
    });

    it('should render task buttons with uppercase text', () => {
        fixture.detectChanges();

        const startButton = element.querySelector<HTMLButtonElement>('#button-start');
        expect(startButton.classList.contains('adf-uppercase')).toBeTruthy();

        const cancelButton = element.querySelector<HTMLButtonElement>('#button-cancel');
        expect(cancelButton.classList.contains('adf-uppercase')).toBeTruthy();
    });

    it('should not emit TaskDetails OnCancel', () => {
        const emitSpy = spyOn(component.cancel, 'emit');
        component.onCancel();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should disable start button if name is empty', () => {
        component.taskForm.controls['name'].setValue('');
        fixture.detectChanges();
        const createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeTruthy();
    });

    it('should cancel start task on cancel button click', () => {
        const emitSpy = spyOn(component.cancel, 'emit');
        const cancelTaskButton = element.querySelector<HTMLElement>('#button-cancel');
        fixture.detectChanges();
        cancelTaskButton.click();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should enable start button if name is filled out', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        const createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeFalsy();
    });

    it('should define the select options for Forms', () => {
        component.forms$ = service.getFormList();
        fixture.detectChanges();
        const selectElement = fixture.nativeElement.querySelector('#form_label');
        expect(selectElement.innerHTML).toContain('ADF_TASK_LIST.START_TASK.FORM.LABEL.FORM');
    });

    it('should get formatted fullname', () => {
        const testUser1 = { id: 1001, firstName: 'Wilbur', lastName: 'Adams', email: 'wilbur@app.activiti.com' };
        const testUser2 = { id: 1002, firstName: '', lastName: 'Adams', email: 'adams@app.activiti.com' };
        const testUser3 = { id: 1003, firstName: 'Wilbur', lastName: '', email: 'wilbur@app.activiti.com' };
        const testUser4 = { id: 1004, firstName: '', lastName: '', email: 'test@app.activiti.com' };

        const testFullName1 = component.getDisplayUser(testUser1.firstName, testUser1.lastName, ' ');
        const testFullName2 = component.getDisplayUser(testUser2.firstName, testUser2.lastName, ' ');
        const testFullName3 = component.getDisplayUser(testUser3.firstName, testUser3.lastName, ' ');
        const testFullName4 = component.getDisplayUser(testUser4.firstName, testUser4.lastName, ' ');

        expect(testFullName1.trim()).toBe('Wilbur Adams');
        expect(testFullName2.trim()).toBe('Adams');
        expect(testFullName3.trim()).toBe('Wilbur');
        expect(testFullName4.trim()).toBe('');
    });

    it('should emit error when there is an error while creating task', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        const errorSpy = spyOn(component.error, 'emit');
        spyOn(service, 'createNewTask').and.returnValue(throwError({}));
        const createTaskButton = element.querySelector<HTMLElement>('#button-start');
        fixture.detectChanges();
        createTaskButton.click();
        expect(errorSpy).toHaveBeenCalled();
    });

    it('should emit error when task name exceeds maximum length', () => {
        component.maxTaskNameLength = 2;
        component.ngOnInit();
        fixture.detectChanges();
        const name = component.taskForm.controls['name'];
        name.setValue('task');
        fixture.detectChanges();
        expect(name.valid).toBeFalsy();
        name.setValue('ta');
        fixture.detectChanges();
        expect(name.valid).toBeTruthy();
    });

    it('should emit error when task name field is empty', () => {
        fixture.detectChanges();
        const name = component.taskForm.controls['name'];
        name.setValue('');
        fixture.detectChanges();
        expect(name.valid).toBeFalsy();
        name.setValue('task');
        fixture.detectChanges();
        expect(name.valid).toBeTruthy();
    });

    it('should call logService when task name exceeds maximum length', () => {
        logSpy = spyOn(logService, 'log').and.callThrough();
        component.maxTaskNameLength = 300;
        component.ngOnInit();
        fixture.detectChanges();
        expect(logSpy).toHaveBeenCalled();
    });

    it('should emit error when description have only white spaces', () => {
        fixture.detectChanges();
        const description = component.taskForm.controls['description'];
        description.setValue('     ');
        fixture.detectChanges();
        expect(description.valid).toBeFalsy();
        description.setValue('');
        fixture.detectChanges();
        expect(description.valid).toBeTruthy();
    });
});
