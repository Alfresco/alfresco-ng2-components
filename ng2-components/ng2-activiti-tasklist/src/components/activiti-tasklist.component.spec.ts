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
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ActivitiTaskList } from './activiti-tasklist.component';
import { Observable } from 'rxjs/Rx';
import { ObjectDataRow, DataRowEvent, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';
import { TranslationMock } from './../assets/translation.service.mock';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';

describe('ActivitiTaskList', () => {

    let fakeGlobalTask = {
        size: 2, total: 2, start: 0,
        data: [
            {
                id: 14, name: 'fake-long-name-fake-long-name-fake-long-name-fak50-long-name', description: null, category: null,
                assignee: {
                    id: 1, firstName: null, lastName: 'Administrator', email: 'admin'
                }
            },
            {
                id: 2, name: '', description: null, category: null,
                assignee: {
                    id: 1, firstName: null, lastName: 'Administrator', email: 'admin'
                }
            }
        ]
    };

    let fakeGlobalTotalTasks = {
        size: 2, total: 2, start: 0,
        data: []
    };

    let fakeGlobalTaskPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalTask);
    });

    let fakeGlobalTotalTasksPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalTotalTasks);
    });

    let fakeErrorTaskList = {
        error: 'wrong request'
    };

    let fakeErrorTaskPromise = new Promise(function (resolve, reject) {
        reject(fakeErrorTaskList);
    });

    let componentHandler: any;
    let component: ActivitiTaskList;
    let fixture: ComponentFixture<ActivitiTaskList>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule
            ],
            declarations: [
                ActivitiTaskList
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiTaskListService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiTaskList);
        component = fixture.componentInstance;

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should use the default schemaColumn as default', () => {
        component.ngOnInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(4);
    });

    it('should use the schemaColumn passed in input', () => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );

        component.ngOnInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(1);
    });

    it('should return an empty task list when no input parameters are passed', () => {
        component.ngOnInit();
        expect(component.data).toBeDefined();
        expect(component.isTaskListEmpty()).toBeTruthy();
    });

    it('should return the filtered task list when the input parameters are passed', (done) => {
        spyOn(component.activiti, 'getTotalTasks').and.returnValue(Observable.fromPromise(fakeGlobalTotalTasksPromise));
        spyOn(component.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeGlobalTaskPromise));
        component.state = 'open';
        component.assignment = 'fake-assignee';
        component.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isTaskListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Nameless task');
            done();
        });

        component.ngOnInit();
    });

    it('should return a currentId null when the taskList is empty', () => {
        component.selectFirstTask();
        expect(component.getCurrentTaskId()).toBeNull();
    });

    it('should throw an exception when the response is wrong', (done) => {
        spyOn(component.activiti, 'getTotalTasks').and.returnValue(Observable.fromPromise(fakeErrorTaskPromise));
        component.state = 'open';
        component.assignment = 'fake-assignee';
        component.onError.subscribe( (err) => {
            expect(err).toBeDefined();
            done();
        });

        component.ngOnInit();
    });

    it('should reload tasks when reload() is called', (done) => {
        spyOn(component.activiti, 'getTotalTasks').and.returnValue(Observable.fromPromise(fakeGlobalTotalTasksPromise));
        spyOn(component.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeGlobalTaskPromise));
        component.state = 'open';
        component.assignment = 'fake-assignee';
        component.ngOnInit();
        component.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isTaskListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Nameless task');
            done();
        });
        component.reload();
    });

    it('should emit row click event', (done) => {
        let row = new ObjectDataRow({
            id: 999
        });
        let rowEvent = <DataRowEvent> {value: row};

        component.rowClick.subscribe(taskId => {
            expect(taskId).toEqual(999);
            expect(component.getCurrentTaskId()).toEqual(999);
            done();
        });

        component.onRowClick(rowEvent);
    });

    it('should reload the task list when the input parameters changes', (done) => {
        spyOn(component.activiti, 'getTotalTasks').and.returnValue(Observable.fromPromise(fakeGlobalTotalTasksPromise));
        spyOn(component.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeGlobalTaskPromise));

        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );
        component.state = 'open';
        component.assignment = 'fake-assignee';
        component.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isTaskListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Nameless task');
            done();
        });

        component.ngOnChanges({});
    });

});
