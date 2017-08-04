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
import { User } from '../models/user.model';
import { PeopleService } from '../services/people.service';
import { TaskListService } from '../services/tasklist.service';
import { startTaskMock } from './../assets/start-task.mock';
import { StartTaskComponent } from './start-task.component';

describe('StartTaskComponent', () => {

    let activitiStartTaskComponent: StartTaskComponent;
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
            activitiStartTaskComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            fixture.detectChanges();
        });
    }));

    beforeEach(() => {
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
    });

    it('should create instance of StartTaskComponent', () => {
        expect(fixture.componentInstance instanceof StartTaskComponent).toBe(true, 'should create StartTaskComponent');
    });

    it('should fetch fakeform on ngonint', () => {
        activitiStartTaskComponent.ngOnInit();
        expect(activitiStartTaskComponent.forms).toEqual(fakeForms);
        expect(activitiStartTaskComponent.forms[0].name).toEqual('Display Data');
        expect(activitiStartTaskComponent.forms[1].name).toEqual('Employee Info');
        expect(activitiStartTaskComponent.forms[1].id).toEqual(1111);
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

        it('should create new task when start is clicked', async(() => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
        }));

        it('should send on success event when the task is started', async(() => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe(91);
                expect(res.name).toBe('fakeName');
                expect(res.formKey).toBe(null);
                expect(res.assignee).toBe(null);
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
        }));

        it('should send on success event when only name is given', async(() => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.startTaskmodel.name = 'fakeName';
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
        }));

        it('should not emit success event when data not present', async(() => {
            let successSpy: jasmine.Spy = spyOn(activitiStartTaskComponent.success, 'emit');
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(null);
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            expect(createNewTaskSpy).not.toHaveBeenCalled();
            expect(successSpy).not.toHaveBeenCalled();
        }));
    });

    describe('assign form', () => {
        beforeEach(() => {
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
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe(91);
                expect(res.name).toBe('fakeName');
                expect(res.formKey).toBe(1204);
                expect(res.assignee).toBe(null);
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.formKey = 1204;
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
        });

        it('should not attach form to the task when a no form is selected', () => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe(91);
                expect(res.name).toBe('fakeName');
                expect(res.formKey).toBe(null);
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.formKey = null;
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
        });
    });

    describe('assign task', () => {
        beforeEach(() => {
            assignUserSpy = spyOn(service, 'assignTask').and.returnValue(Observable.of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: 1204,
                    assignee: testUser
                }
            ));
        });

        it('should assign task when an assignee is selected', () => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe(91);
                expect(res.name).toBe('fakeName');
                expect(res.formKey).toBe(1204);
                expect(res.assignee).toBe(testUser);
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.formKey = 1204;
            activitiStartTaskComponent.assignee = new User(testUser);
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
        });

        it('should not assign task when no assignee is selected', () => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe(91);
                expect(res.name).toBe('fakeName');
                expect(res.formKey).toBe(1204);
                expect(res.assignee).toBe(null);
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.formKey = 1204;
            activitiStartTaskComponent.assignee = null;
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
        });
    });

    it('should not attach a task when a form id is not slected', () => {
        let attachFormToATask = spyOn(service, 'attachFormToATask').and.returnValue(Observable.of());
        spyOn(service, 'createNewTask').and.callFake(
            function() {
                return Observable.create(observer => {
                    observer.next({ id: 'task-id'});
                    observer.complete();
                });
            });
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        activitiStartTaskComponent.startTaskmodel.name = 'fake-name';
        createTaskButton.click();
        expect(attachFormToATask).not.toHaveBeenCalled();
    });

    it('should show start task button', () => {
        expect(element.querySelector('#button-start')).toBeDefined();
        expect(element.querySelector('#button-start')).not.toBeNull();
        expect(element.querySelector('#button-start').textContent).toContain('START_TASK.FORM.ACTION.START');
    });

    it('should fetch all users on ngonint', async(() => {
        activitiStartTaskComponent.ngOnInit();
        expect(activitiStartTaskComponent.people).toBeDefined();
        expect(activitiStartTaskComponent.people[0].firstName).toEqual('fakeName');
        expect(activitiStartTaskComponent.people[1].firstName).toEqual('fake-name');
        expect(activitiStartTaskComponent.people[0].id).toEqual(1);
        expect(activitiStartTaskComponent.people[1].id).toEqual(1001);
        expect(getWorkflowUsersSpy).toHaveBeenCalled();
    }));

    it('should not emit TaskDetails OnCancle', () => {
        let emitSpy = spyOn(activitiStartTaskComponent.cancel, 'emit');
        activitiStartTaskComponent.onCancel();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should start button disable if name is empty', () => {
        let createTaskButton =  fixture.nativeElement.querySelector('#button-start');
        activitiStartTaskComponent.startTaskmodel.name = '';
        fixture.detectChanges();
        expect(createTaskButton.disabled).toBeTruthy();
    });

    it('should cancle start task on cancle button clicked', () => {
        let emitSpy = spyOn(activitiStartTaskComponent.cancel, 'emit');
        let cancleTaskButton =  fixture.nativeElement.querySelector('#button-cancle');
        activitiStartTaskComponent.startTaskmodel.name = '';
        fixture.detectChanges();
        cancleTaskButton.click();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should enable start button if name is filled out', () => {
        activitiStartTaskComponent.startTaskmodel.name = 'fakeName';
        fixture.detectChanges();
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.enable).toBeFalsy();
    });

    it('should defined the select option for Assignee', () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let selectElement = fixture.nativeElement.querySelector('#assignee_id');
            expect(selectElement).not.toBeNull();
            expect(selectElement).toBeDefined();
            expect(selectElement.innerText.trim()).toBe('START_TASK.FORM.LABEL.ASSIGNEE');
        });
    });

    it('should defined the select option for Forms', () => {
        activitiStartTaskComponent.forms = fakeForms;
        fixture.detectChanges();
        let selectElement = fixture.nativeElement.querySelector('#form_id');
        expect(selectElement.innerText.trim()).toBe('START_TASK.FORM.LABEL.FORM');
    });

    it('should get formatted fullname', () => {
        let testUser1 = {'id': 1001, 'firstName': 'Wilbur', 'lastName': 'Adams', 'email': 'wilbur@app.activiti.com'};
        let testUser2 = {'id': 1002, 'firstName': '', 'lastName': 'Adams', 'email': 'adams@app.activiti.com'};
        let testUser3 = {'id': 1003, 'firstName': 'Wilbur', 'lastName': '', 'email': 'wilbur@app.activiti.com'};
        let testUser4 = {'id': 1004, 'firstName': '', 'lastName': '', 'email': 'test@app.activiti.com'};

        let testFullname1 = activitiStartTaskComponent.getDisplayUser(testUser1.firstName, testUser1.lastName, ' ');
        let testFullname2 = activitiStartTaskComponent.getDisplayUser(testUser2.firstName, testUser2.lastName, ' ');
        let testFullname3 = activitiStartTaskComponent.getDisplayUser(testUser3.firstName, testUser3.lastName, ' ');
        let testFullname4 = activitiStartTaskComponent.getDisplayUser(testUser4.firstName, testUser4.lastName, ' ');

        expect(testFullname1.trim()).toBe('Wilbur Adams');
        expect(testFullname2.trim()).toBe('Adams');
        expect(testFullname3.trim()).toBe('Wilbur');
        expect(testFullname4.trim()).toBe('');
    });

    it('should not show the name if it is empty', () => {
        let testUser2 = {'id': 1001, 'firstName': '', 'lastName': '', 'email': 'wilbur@app.activiti.com'};
        let isUserNameEmpty2 = activitiStartTaskComponent.isUserNameEmpty(testUser2);
        expect(isUserNameEmpty2).toBe(true);
    });
});
