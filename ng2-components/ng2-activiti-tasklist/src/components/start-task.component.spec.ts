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
import { MdButtonModule, MdDatepickerModule, MdGridListModule, MdIconModule, MdInputModule, MdNativeDateModule, MdSelectModule } from '@angular/material';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { StartTaskModel } from '../models/start-task.model';
import { PeopleService } from '../services/people.service';
import { TaskListService } from '../services/tasklist.service';
import { startTaskMock } from './../assets/start-task.mock';
import { StartTaskComponent } from './start-task.component';

describe('StartTaskComponent', () => {

    let component: StartTaskComponent;
    let fixture: ComponentFixture<StartTaskComponent>;
    let service: TaskListService;
    let peopleService: PeopleService;
    let element: HTMLElement;
    let getFormlistSpy: jasmine.Spy;
    let getWorkflowUsersSpy: jasmine.Spy;
    let createNewTaskSpy: jasmine.Spy;
    let attachFormSpy: jasmine.Spy;
    let assignUserSpy: jasmine.Spy;
    let fakeForms =    [
        {
            id: 123,
           name: 'Display Data'
        },
       {
            id: 1111,
           name: 'Employee Info'
        }
    ];
    let testUser = {id: 1001, firstName: 'fakeName', email: 'fake@app.activiti.com'};
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                MdInputModule,
                MdIconModule,
                MdButtonModule,
                MdDatepickerModule,
                MdGridListModule,
                MdNativeDateModule,
                MdSelectModule
            ],
            declarations: [
                StartTaskComponent
            ],
            providers: [
                TaskListService,
                PeopleService
            ]
        }).compileComponents().then(() => {
            let translateService = TestBed.get(AlfrescoTranslationService);
            spyOn(translateService, 'addTranslationFolder').and.stub();
            spyOn(translateService.translate, 'get').and.callFake((key) => { return Observable.of(key); });

            fixture = TestBed.createComponent(StartTaskComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;

            service = fixture.debugElement.injector.get(TaskListService);
            peopleService = fixture.debugElement.injector.get(PeopleService);
            getFormlistSpy = spyOn(service, 'getFormList').and.returnValue(Observable.of(fakeForms));
            getWorkflowUsersSpy = spyOn(peopleService, 'getWorkflowUsers').and.returnValue(Observable.of([
                {
                    id: 1,
                    firstName: 'fakeName',
                    lastName: 'fakeName',
                    email: 'fake@app.activiti.com',
                    company: 'Alfresco.com',
                    pictureId: 3003
                },
                {
                    id: 1001,
                    firstName: 'fake-name',
                    lastName: 'fake-name',
                    email: 'fake-@app.com',
                    company: 'app'
                }
            ]));

            fixture.detectChanges();
        });
    }));

    it('should create instance of StartTaskComponent', () => {
        expect(fixture.componentInstance instanceof StartTaskComponent).toBe(true, 'should create StartTaskComponent');
    });

    it('should fetch fakeform on ngonint', () => {
        component.ngOnInit();
        expect(component.forms).toEqual(fakeForms);
        expect(component.forms[0].name).toEqual('Display Data');
        expect(component.forms[1].name).toEqual('Employee Info');
        expect(component.forms[1].id).toEqual(1111);
        expect(getFormlistSpy).toHaveBeenCalled();
    });

    describe('create task', () => {

        beforeEach(() => {
            createNewTaskSpy = spyOn(service, 'createNewTask').and.returnValue(Observable.of(
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
            component.appId = 'fakeAppId';
            component.startTaskmodel = new StartTaskModel(startTaskMock);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalled();
        });

        it('should send on success event when the task is started', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.appId = 'fakeAppId';
            component.startTaskmodel = new StartTaskModel(startTaskMock);
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
            component.appId = 'fakeAppId';
            component.startTaskmodel.name = 'fakeName';
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(successSpy).toHaveBeenCalled();
        });

        it('should not emit success event when data not present', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.startTaskmodel = new StartTaskModel(null);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(createNewTaskSpy).not.toHaveBeenCalled();
            expect(successSpy).not.toHaveBeenCalled();
        });
    });

    describe('attach form', () => {
        beforeEach(() => {
            spyOn(service, 'createNewTask').and.returnValue(Observable.of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: null,
                    assignee: null
                }
            ));
            attachFormSpy = spyOn(service, 'attachFormToATask').and.returnValue(Observable.of(
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
            component.appId = 'fakeAppId';
            component.startTaskmodel = new StartTaskModel(startTaskMock);
            component.formKey = 1204;
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
            component.appId = 'fakeAppId';
            component.startTaskmodel = new StartTaskModel(startTaskMock);
            component.formKey = null;
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
            spyOn(service, 'createNewTask').and.returnValue(Observable.of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: null,
                    assignee: null
                }
            ));
            spyOn(service, 'attachFormToATask').and.returnValue(Observable.of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: 1204,
                    assignee: null
                }
            ));
            assignUserSpy = spyOn(service, 'assignTaskByUserId').and.returnValue(Observable.of(
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
            component.appId = 'fakeAppId';
            component.startTaskmodel = new StartTaskModel(startTaskMock);
            component.formKey = 1204;
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

        it('should not assign task when no assignee is selected', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.appId = 'fakeAppId';
            component.formKey = 1204;
            component.assigneeId = null;
            component.startTaskmodel = new StartTaskModel(startTaskMock);
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

    it('should not attach a form when a form id is not slected', () => {
        let attachFormToATask = spyOn(service, 'attachFormToATask').and.returnValue(Observable.of());
        spyOn(service, 'createNewTask').and.callFake(
            function() {
                return Observable.create(observer => {
                    observer.next({ id: 'task-id'});
                    observer.complete();
                });
            });
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        component.startTaskmodel.name = 'fake-name';
        fixture.detectChanges();
        createTaskButton.click();
        expect(attachFormToATask).not.toHaveBeenCalled();
    });

    it('should show start task button', () => {
        expect(element.querySelector('#button-start')).toBeDefined();
        expect(element.querySelector('#button-start')).not.toBeNull();
        expect(element.querySelector('#button-start').textContent).toContain('START_TASK.FORM.ACTION.START');
    });

    it('should fetch all users on ngonint', () => {
        component.ngOnInit();
        expect(component.people).toBeDefined();
        expect(component.people[0].firstName).toEqual('fakeName');
        expect(component.people[1].firstName).toEqual('fake-name');
        expect(component.people[0].id).toEqual(1);
        expect(component.people[1].id).toEqual(1001);
        expect(getWorkflowUsersSpy).toHaveBeenCalled();
    });

    it('should not emit TaskDetails OnCancel', () => {
        let emitSpy = spyOn(component.cancel, 'emit');
        component.onCancel();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should disable start button if name is empty', () => {
        component.startTaskmodel.name = '';
        fixture.detectChanges();
        let createTaskButton =  fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeTruthy();
    });

    it('should cancel start task on cancel button click', () => {
        let emitSpy = spyOn(component.cancel, 'emit');
        let cancleTaskButton =  fixture.nativeElement.querySelector('#button-cancle');
        component.startTaskmodel.name = '';
        fixture.detectChanges();
        cancleTaskButton.click();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should enable start button if name is filled out', () => {
        component.startTaskmodel.name = 'fakeName';
        fixture.detectChanges();
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeFalsy();
    });

    it('should define the select option for Assignee', async(() => {
        fixture.whenStable().then(() => {
            let selectElement = fixture.nativeElement.querySelector('#assignee_id');
            expect(selectElement).not.toBeNull();
            expect(selectElement).toBeDefined();
            expect(selectElement.innerText.trim()).toBe('START_TASK.FORM.LABEL.ASSIGNEE');
        });
    }));

    it('should define the select option for Forms', () => {
        component.forms = fakeForms;
        fixture.detectChanges();
        let selectElement = fixture.nativeElement.querySelector('#form_id');
        expect(selectElement.innerText.trim()).toBe('START_TASK.FORM.LABEL.FORM');
    });

    it('should get formatted fullname', () => {
        let testUser1 = {'id': 1001, 'firstName': 'Wilbur', 'lastName': 'Adams', 'email': 'wilbur@app.activiti.com'};
        let testUser2 = {'id': 1002, 'firstName': '', 'lastName': 'Adams', 'email': 'adams@app.activiti.com'};
        let testUser3 = {'id': 1003, 'firstName': 'Wilbur', 'lastName': '', 'email': 'wilbur@app.activiti.com'};
        let testUser4 = {'id': 1004, 'firstName': '', 'lastName': '', 'email': 'test@app.activiti.com'};

        let testFullname1 = component.getDisplayUser(testUser1.firstName, testUser1.lastName, ' ');
        let testFullname2 = component.getDisplayUser(testUser2.firstName, testUser2.lastName, ' ');
        let testFullname3 = component.getDisplayUser(testUser3.firstName, testUser3.lastName, ' ');
        let testFullname4 = component.getDisplayUser(testUser4.firstName, testUser4.lastName, ' ');

        expect(testFullname1.trim()).toBe('Wilbur Adams');
        expect(testFullname2.trim()).toBe('Adams');
        expect(testFullname3.trim()).toBe('Wilbur');
        expect(testFullname4.trim()).toBe('');
    });

    it('should emit error when there is an error while creating task', () => {
        let errorSpy = spyOn(component.error, 'emit');
        spyOn(service, 'createNewTask').and.returnValue(Observable.throw({}));
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        component.startTaskmodel.name = 'fake-name';
        fixture.detectChanges();
        createTaskButton.click();
        expect(errorSpy).toHaveBeenCalled();
    });
});
