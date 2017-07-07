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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';
import { ActivitiStartTaskComponent } from './activiti-start-task.component';
import { ActivitiPeopleService } from '../services/activiti-people.service';
import { MdIconModule, MdButtonModule, MdDatepickerModule, MdGridListModule, MdNativeDateModule, MdSelectModule, MdInputModule } from '@angular/material';

declare let jasmine: any;

describe('ActivitiStartTaskComponent', () => {

    let activitiStartTaskComponent: ActivitiStartTaskComponent;
    let fixture: ComponentFixture<ActivitiStartTaskComponent>;
    let service: ActivitiTaskListService;
    let peopleService: ActivitiPeopleService;
    let element: HTMLElement;
    let getformlistSpy: jasmine.Spy;
    let getWorkflowUsersSpy: jasmine.Spy;
    let getcreateNewTaskSpy: jasmine.Spy;

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
                ActivitiStartTaskComponent
            ],
            providers: [
                ActivitiTaskListService,
                ActivitiPeopleService
            ]
        }).compileComponents().then(() => {
            let translateService = TestBed.get(AlfrescoTranslationService);
            spyOn(translateService, 'addTranslationFolder').and.stub();
            spyOn(translateService.translate, 'get').and.callFake((key) => { return Observable.of(key); });

            fixture = TestBed.createComponent(ActivitiStartTaskComponent);
            activitiStartTaskComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            fixture.detectChanges();
        });
    }));

    beforeEach(() => {
        service = fixture.debugElement.injector.get(ActivitiTaskListService);
        peopleService = fixture.debugElement.injector.get(ActivitiPeopleService);
        getformlistSpy = spyOn(service, 'getFormList').and.returnValue(Observable.of([{id: 123, name: 'fakeFormName'}, {id: 1111, name: 'fakeFormName'}]));
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
        }]));
    });

    it('should create instance of ActivitiStartTaskButton', () => {
        expect(fixture.componentInstance instanceof ActivitiStartTaskComponent).toBe(true, 'should create ActivitiStartTaskComponent');
    });

    it('should fetch fakeform on ngonint', () => {
        let loadForms = [{id: 123, name: 'fakeFormName'}, {id: 1111, name: 'fakeFormName'}];
        activitiStartTaskComponent.ngOnInit();
        expect(activitiStartTaskComponent.forms).toEqual(loadForms);
        expect(activitiStartTaskComponent.forms[0].name).toEqual('fakeFormName');
        expect(activitiStartTaskComponent.forms[1].id).toEqual(1111);
        expect(getformlistSpy).toHaveBeenCalled();
    });

    describe('create task', () => {

        beforeEach(() => {
            getcreateNewTaskSpy = spyOn(service, 'createNewTask').and.returnValue
            (Observable.of({ id: 91, name: 'fakeName', formKey: '4', assignee: {id: 1001, firstName: 'fakeName', email: 'fake@app.activiti.com'}}));
        });

        it('should create new task when start is clicked', async(() => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.name = 'fake-name';
            activitiStartTaskComponent.assignee = {id: 1111, firstName: 'fakeName', email: 'fake@app.com'};
            activitiStartTaskComponent.formDetails = {id: 4, forname: 'Expence Summary'};
            activitiStartTaskComponent.selectedDate = '2016-11-03T15:25:42.749+0000';
            activitiStartTaskComponent.description = 'fakeDescription';
            activitiStartTaskComponent.start();
            expect(getcreateNewTaskSpy).toHaveBeenCalled();
        }));

        it('should send on success event when the task is started', async(() => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe(91);
                expect(res.name).toBe('fakeName');
                expect(res.formKey).toBe('4');
                expect(res.assignee.id).toBe(1001);
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.name = 'fake-name';
            activitiStartTaskComponent.assignee = {id: 1111, firstName: 'fakeName', email: 'fake@app.com'};
            activitiStartTaskComponent.formDetails = {id: 4, forname: 'Expence Summary'};
            activitiStartTaskComponent.selectedDate = '2016-11-03T15:25:42.749+0000';
            activitiStartTaskComponent.description = 'fakeDescription';
            activitiStartTaskComponent.start();
            expect(getcreateNewTaskSpy).toHaveBeenCalled();
        }));

        it('should not emit success event when data not present', async(() => {
            let onSuccessSpy: jasmine.Spy = spyOn(activitiStartTaskComponent.success, 'emit');
            activitiStartTaskComponent.start();
            fixture.detectChanges();
            expect(getcreateNewTaskSpy).not.toHaveBeenCalled();
            expect(onSuccessSpy).not.toHaveBeenCalled();
        }));

        it('should attach a task when a form id selected', async(() => {
            activitiStartTaskComponent.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.formKey).toBe('4');
            });
            activitiStartTaskComponent.appId = 'fakeAppId';
            activitiStartTaskComponent.name = 'fake-name';
            activitiStartTaskComponent.assignee = {id: 1111, firstName: 'fakeName', email: 'fake@app.com'};
            activitiStartTaskComponent.formDetails = {id: 4, forname: 'Expence Summary'};
            activitiStartTaskComponent.selectedDate = '2016-11-03T15:25:42.749+0000';
            activitiStartTaskComponent.description = 'fakeDescription';
            activitiStartTaskComponent.start();
            expect(getcreateNewTaskSpy).toHaveBeenCalled();
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
        activitiStartTaskComponent.name = 'fake-name';
        createTaskButton.click();
        expect(activitiStartTaskComponent.formDetails).not.toBeDefined();
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
        activitiStartTaskComponent.name = '';
        fixture.detectChanges();
        expect(createTaskButton.disabled).toBeTruthy();
    });

    it('should enable button if name is not empty', () => {
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        activitiStartTaskComponent.name = 'fakeName';
        fixture.detectChanges();
        expect(createTaskButton.enable).toBeFalsy();
    });
});
