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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CoreModule, AlfrescoTranslateService } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ActivitiTaskList } from './activiti-tasklist.component';
import { Observable } from 'rxjs/Rx';
import { ObjectDataRow, DataRowEvent, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';

describe('ActivitiTaskList', () => {

    let fakeGlobalTask = [
        {
            id: 14, name: 'task-name',
            processDefinitionId: 'fakeprocess:5:7507',
            processDefinitionKey: 'fakeprocess',
            processDefinitionName: 'Fake Process Name',
            description: null, category: null,
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
    ];

    let fakeGlobalTotalTasks = {
        size: 2, total: 2, start: 0,
        data: []
    };

    let fakeErrorTaskList = {
        error: 'wrong request'
    };

    let componentHandler: any;
    let component: ActivitiTaskList;
    let fixture: ComponentFixture<ActivitiTaskList>;
    let taskListService: ActivitiTaskListService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule
            ],
            declarations: [
                ActivitiTaskList
            ],
            providers: [
                ActivitiTaskListService
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslateService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiTaskList);
        component = fixture.componentInstance;

        taskListService = TestBed.get(ActivitiTaskListService);

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
        expect(component.isListEmpty()).toBeTruthy();
    });

    it('should return the filtered task list when the input parameters are passed', (done) => {
        spyOn(taskListService, 'getTotalTasks').and.returnValue(Observable.of(fakeGlobalTotalTasks));
        spyOn(taskListService, 'getTasks').and.returnValue(Observable.of(fakeGlobalTask));

        let state = new SimpleChange(null, 'open');
        let processDefinitionKey = new SimpleChange(null, null);
        let assignment = new SimpleChange(null, 'fake-assignee');

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('No name');
            done();
        });
        component.ngOnInit();
        component.ngOnChanges({'state': state, 'processDefinitionKey': processDefinitionKey, 'assignment': assignment});
        fixture.detectChanges();
    });

    it('should return the filtered task list by processDefinitionKey', (done) => {
        spyOn(taskListService, 'getTotalTasks').and.returnValue(Observable.of(fakeGlobalTotalTasks));
        spyOn(taskListService, 'getTasks').and.returnValue(Observable.of(fakeGlobalTask));

        let state = new SimpleChange(null, 'open');
        let processDefinitionKey = new SimpleChange(null, 'fakeprocess');
        let assignment = new SimpleChange(null, 'fake-assignee');

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('No name');
            done();
        });

        component.ngOnInit();
        component.ngOnChanges({'state': state, 'processDefinitionKey': processDefinitionKey, 'assignment': assignment});
        fixture.detectChanges();
    });

    it('should return a currentId null when the taskList is empty', () => {
        component.selectTask(null);
        expect(component.getCurrentId()).toBeNull();
    });

    it('should throw an exception when the response is wrong', (done) => {
        spyOn(taskListService, 'getTotalTasks').and.returnValue(Observable.throw(fakeErrorTaskList));

        let state = new SimpleChange(null, 'open');
        let assignment = new SimpleChange(null, 'fake-assignee');

        component.onError.subscribe((err) => {
            expect(err).toBeDefined();
            expect(err.error).toBe('wrong request');
            done();
        });

        component.ngOnInit();
        component.ngOnChanges({'state': state, 'assignment': assignment});
        fixture.detectChanges();
    });

    it('should reload tasks when reload() is called', (done) => {
        spyOn(taskListService, 'getTotalTasks').and.returnValue(Observable.of(fakeGlobalTotalTasks));
        spyOn(taskListService, 'getTasks').and.returnValue(Observable.of(fakeGlobalTask));
        component.state = 'open';
        component.assignment = 'fake-assignee';
        component.ngOnInit();
        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('No name');
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
            expect(component.getCurrentId()).toEqual(999);
            done();
        });

        component.onRowClick(rowEvent);
    });

    describe('component changes', () => {

        beforeEach(() => {
            spyOn(taskListService, 'getTotalTasks').and.returnValue(Observable.of(fakeGlobalTotalTasks));
            spyOn(taskListService, 'getTasks').and.returnValue(Observable.of(fakeGlobalTask));

            component.data = new ObjectDataTableAdapter(
                [],
                [
                    {type: 'text', key: 'fake-id', title: 'Name'}
                ]
            );
        });

        it('should NOT reload the process list when no parameters changed', () => {
            expect(component.isListEmpty()).toBeTruthy();
            component.ngOnChanges({});
            expect(component.isListEmpty()).toBeTruthy();
        });

        it('should reload the list when the appId parameter changes', (done) => {
            const appId = '1';
            let change = new SimpleChange(null, appId);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'appId': change});
        });

        it('should reload the list when the processDefinitionKey parameter changes', (done) => {
            const processDefinitionKey = 'fakeprocess';
            let change = new SimpleChange(null, processDefinitionKey);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'processDefinitionKey': change});
        });

        it('should reload the list when the state parameter changes', (done) => {
            const state = 'open';
            let change = new SimpleChange(null, state);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'state': change});
        });

        it('should reload the list when the sort parameter changes', (done) => {
            const sort = 'desc';
            let change = new SimpleChange(null, sort);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'sort': change});
        });

        it('should reload the process list when the name parameter changes', (done) => {
            const name = 'FakeTaskName';
            let change = new SimpleChange(null, name);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'name': change});
        });

        it('should reload the list when the assignment parameter changes', (done) => {
            const assignment = 'assignee';
            let change = new SimpleChange(null, assignment);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'assignment': change});
        });
    });
});
