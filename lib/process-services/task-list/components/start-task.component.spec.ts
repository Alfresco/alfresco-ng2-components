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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, LogService } from '@alfresco/adf-core';
import { of, throwError, Observable } from 'rxjs';
import { TaskListService } from '../services/tasklist.service';
import { StartTaskComponent } from './start-task.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { taskDetailsMock } from '../../mock/task/task-details.mock';
import { TaskDetailsModel } from '../models/task-details.model';

describe('StartTaskComponent', () => {

    let component: StartTaskComponent;
    let fixture: ComponentFixture<StartTaskComponent>;
    let service: TaskListService;
    let logService: LogService;
    let element: HTMLElement;
    let getFormListSpy: jasmine.Spy;
    let createNewTaskSpy: jasmine.Spy;
    let logSpy: jasmine.Spy;
    let fakeForms$ = [
        {
            id: 123,
            name: 'Display Data'
        },
        {
            id: 1111,
            name: 'Employee Info'
        }
    ];

    let testUser = { id: 1001, firstName: 'fakeName', email: 'fake@app.activiti.com' };

    setupTestBed({
        imports: [ProcessTestingModule]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(StartTaskComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        service = TestBed.get(TaskListService);
        logService = TestBed.get(LogService);
        getFormListSpy = spyOn(service, 'getFormList').and.returnValue(Observable.create(observer => {
            observer.next(fakeForms$);
            observer.complete();
        }));

        fixture.detectChanges();
    }));

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should create instance of StartTaskComponent', () => {
        expect(component instanceof StartTaskComponent).toBe(true, 'should create StartTaskComponent');
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
                }
            ));
        });

        it('should create new task when start is clicked', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('task');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalled();
        });

        it('should send on success event when the task is started', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: null,
                assignee: null
            });
        });

        it('should send on success event when only name is given', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.appId = 42;
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalled();
        });

        it('should not emit success event when data not present', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskDetailsModel = new TaskDetailsModel(null);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
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
                }
            ));
            spyOn(service, 'attachFormToATask').and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: 1204,
                    assignee: null
                }
            ));
        });

        it('should attach form to the task when a form is selected', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: null
            });
        });

        it('should not attach form to the task when a no form is selected', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(null);
            component.appId = 42;
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
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
                }
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
                }
            ));
        });

        it('should assign task when an assignee is selected', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            component.assigneeId = testUser.id;
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: testUser
            });
        });

        it('should assign task with id of selected user assigned', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.getAssigneeId(testUser.id);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalledWith({
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: testUser
            });
        });

        it('should not assign task when no assignee is selected', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['formKey'].setValue(1204);
            component.appId = 42;
            component.assigneeId = null;
            component.taskDetailsModel = new TaskDetailsModel(taskDetailsMock);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
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
        let attachFormToATask = spyOn(service, 'attachFormToATask').and.returnValue([]);
        spyOn(service, 'createNewTask').and.callFake(
            function() {
                return new Observable(observer => {
                    observer.next({ id: 'task-id'});
                    observer.complete();
                });
            });
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
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

    it('should not emit TaskDetails OnCancel', () => {
        let emitSpy = spyOn(component.cancel, 'emit');
        component.onCancel();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should disable start button if name is empty', () => {
        component.taskForm.controls['name'].setValue('');
        fixture.detectChanges();
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeTruthy();
    });

    it('should cancel start task on cancel button click', () => {
        let emitSpy = spyOn(component.cancel, 'emit');
        let cancelTaskButton = <HTMLElement> element.querySelector('#button-cancel');
        fixture.detectChanges();
        cancelTaskButton.click();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should enable start button if name is filled out', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeFalsy();
    });

    it('should define the select options for Forms', () => {
        component.forms$ = service.getFormList();
        fixture.detectChanges();
        let selectElement = fixture.nativeElement.querySelector('#form_id');
        expect(selectElement.innerHTML).toContain('ADF_TASK_LIST.START_TASK.FORM.LABEL.FORM');
    });

    it('should get formatted fullname', () => {
        let testUser1 = { 'id': 1001, 'firstName': 'Wilbur', 'lastName': 'Adams', 'email': 'wilbur@app.activiti.com' };
        let testUser2 = { 'id': 1002, 'firstName': '', 'lastName': 'Adams', 'email': 'adams@app.activiti.com' };
        let testUser3 = { 'id': 1003, 'firstName': 'Wilbur', 'lastName': '', 'email': 'wilbur@app.activiti.com' };
        let testUser4 = { 'id': 1004, 'firstName': '', 'lastName': '', 'email': 'test@app.activiti.com' };

        let testFullName1 = component.getDisplayUser(testUser1.firstName, testUser1.lastName, ' ');
        let testFullName2 = component.getDisplayUser(testUser2.firstName, testUser2.lastName, ' ');
        let testFullName3 = component.getDisplayUser(testUser3.firstName, testUser3.lastName, ' ');
        let testFullName4 = component.getDisplayUser(testUser4.firstName, testUser4.lastName, ' ');

        expect(testFullName1.trim()).toBe('Wilbur Adams');
        expect(testFullName2.trim()).toBe('Adams');
        expect(testFullName3.trim()).toBe('Wilbur');
        expect(testFullName4.trim()).toBe('');
    });

    it('should emit error when there is an error while creating task', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        let errorSpy = spyOn(component.error, 'emit');
        spyOn(service, 'createNewTask').and.returnValue(throwError({}));
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        fixture.detectChanges();
        createTaskButton.click();
        expect(errorSpy).toHaveBeenCalled();
    });

    it('should emit error when task name exceeds maximum length', () => {
        component.maxTaskNameLength = 2;
        component.ngOnInit();
        fixture.detectChanges();
        let name = component.taskForm.controls['name'];
        name.setValue('task');
        fixture.detectChanges();
        expect(name.valid).toBeFalsy();
        name.setValue('ta');
        fixture.detectChanges();
        expect(name.valid).toBeTruthy();
    });

    it('should emit error when task name field is empty', () => {
        fixture.detectChanges();
        let name = component.taskForm.controls['name'];
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
});
