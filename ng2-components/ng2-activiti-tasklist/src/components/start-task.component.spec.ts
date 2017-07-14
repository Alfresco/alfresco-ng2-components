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
import { StartTaskModel } from '../models/index';
import { PeopleService } from '../services/people.service';
import { TaskListService } from '../services/tasklist.service';
import { startTaskMock } from './../assets/start-task.mock';
import { StartTaskComponent } from './start-task.component';

declare let jasmine: any;

describe('StartTaskComponent', () => {

    let activitiStartTaskComponent: StartTaskComponent;
    let fixture: ComponentFixture<StartTaskComponent>;
    let service: TaskListService;
    let peopleService: PeopleService;
    let element: HTMLElement;
    let getformlistSpy: jasmine.Spy;
    let getWorkflowUsersSpy: jasmine.Spy;
    let getcreateNewTaskSpy: jasmine.Spy;
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
        getformlistSpy = spyOn(service, 'getFormList').and.returnValue(Observable.of(fakeForms));
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
        expect(getformlistSpy).toHaveBeenCalled();
    });

    describe('create task', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
            getcreateNewTaskSpy = spyOn(service, 'createNewTask').and.returnValue(Observable.of(
                {
                    id: 91,
                    name: 'fakeName',
                    formKey: '4',
                    assignee: {id: 1001, firstName: 'fakeName', email: 'fake@app.activiti.com'}
                }
            ));
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should create new task when start is clicked', async(() => {
            activitiStartTaskComponent.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            activitiStartTaskComponent.start();
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200
            });
        }));

        it('should send on onSuccess event when the task is started', async(() => {
            activitiStartTaskComponent.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe(91);
                expect(res.name).toBe('fakeName');
                expect(res.formKey).toBe('4');
                expect(res.assignee.id).toBe(1001);
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            activitiStartTaskComponent.start();
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'json',
                responseText:
                {
                    id: '91',
                    name: 'fakeName',
                    description: 'fakeDescription',
                    formKey: '4',
                    assignee: {id: 1001, firstName: 'fakeName', email: 'fake@app.activiti.com'},
                    dueDate: null,
                    endDate: null,
                    duration: null,
                    priority: 50,
                    parentTaskId: null,
                    parentTaskName: null
                }
            });
        }));

        it('should send on onSuccess event when only name is given', async(() => {
            activitiStartTaskComponent.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.startTaskmodel.name = 'fakeName';
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            activitiStartTaskComponent.start();
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'json',
                responseText: {}
            });
        }));

        it('should attach a task when a form id selected', () => {
            activitiStartTaskComponent.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.formKey).toBe('4');
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(startTaskMock);
            activitiStartTaskComponent.start();
            expect(getcreateNewTaskSpy).toHaveBeenCalled();
        });

        it('should not emit onSuccess event when data not present', async(() => {
            let onSuccessSpy: jasmine.Spy = spyOn(activitiStartTaskComponent.onSuccess, 'emit');
            activitiStartTaskComponent.startTaskmodel = new StartTaskModel(null);
            activitiStartTaskComponent.start();
            fixture.detectChanges();
            expect(getcreateNewTaskSpy).not.toHaveBeenCalled();
            expect(onSuccessSpy).not.toHaveBeenCalled();
        }));
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

    it('should enable button if name is not empty', () => {
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        activitiStartTaskComponent.startTaskmodel.name = 'fakeName';
        fixture.detectChanges();
        expect(createTaskButton.enable).toBeFalsy();
    });
});
