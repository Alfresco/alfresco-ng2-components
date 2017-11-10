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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { AppConfigService, CoreModule, TranslationService } from 'ng2-alfresco-core';
import { DataTableModule } from '@adf/core';
import { DataRowEvent, ObjectDataRow, ObjectDataTableAdapter } from '@adf/core';
import { TranslationMock } from '../assets/translation.service.mock';
import { TaskListService } from '../services/tasklist.service';
import { TaskListComponent } from './task-list.component';

declare let jasmine: any;

describe('TaskListComponent', () => {

    let fakeGlobalTask = {
        size: 2,
        start: 0,
        total: 2,
        data: [
            {
                id: 14, name: 'nameFake1',
                description: 'descriptionFake1',
                category: 'categoryFake1',
                assignee: {
                    id: 2, firstName: 'firstNameFake1', lastName: 'lastNameFake1', email: 'emailFake1'
                },
                created: '2017-03-01T12:25:17.189+0000',
                dueDate: '2017-04-02T12:25:17.189+0000',
                endDate: '2017-05-03T12:25:31.129+0000',
                duration: 13940,
                priority: 50,
                parentTaskId: 1,
                parentTaskName: 'parentTaskNameFake',
                processInstanceId: 2511,
                processInstanceName: 'processInstanceNameFake',
                processDefinitionId: 'myprocess:1:4',
                processDefinitionName: 'processDefinitionNameFake',
                processDefinitionDescription: 'processDefinitionDescriptionFake',
                processDefinitionKey: 'myprocess',
                processDefinitionCategory: 'http://www.activiti.org/processdef',
                processDefinitionVersion: 1,
                processDefinitionDeploymentId: '1',
                formKey: 1,
                processInstanceStartUserId: null,
                initiatorCanCompleteTask: false,
                adhocTaskCanBeReassigned: false,
                taskDefinitionKey: 'sid-B6813AF5-8ACD-4481-A4D5-8BAAD1CB1416',
                executionId: 2511,
                memberOfCandidateGroup: false,
                memberOfCandidateUsers: false,
                managerOfCandidateGroup: false
            },

            {
                id: 2, name: '', description: 'descriptionFake2', category: null,
                assignee: {
                    id: 1, firstName: 'fistNameFake2', lastName: 'Administrator2', email: 'admin'
                },
                created: '2017-03-01T12:25:17.189+0000',
                dueDate: '2017-04-02T12:25:17.189+0000',
                endDate: null
            }
        ]
    };

    let fakeErrorTaskList = {
        error: 'wrong request'
    };

    let fakeCutomSchema = [
            {
                'key': 'fakeName',
                'type': 'text',
                'title': 'ADF_TASK_LIST.PROPERTIES.FAKE',
                'sortable': true
            },
            {
                'key': 'fakeTaskName',
                'type': 'text',
                'title': 'ADF_TASK_LIST.PROPERTIES.TASK_FAKE',
                'sortable': true
            }
        ];

    let fakeColumnSchema = {
        'default': [
                {
                    'key': 'name',
                    'type': 'text',
                    'title': 'ADF_TASK_LIST.PROPERTIES.NAME',
                    'sortable': true
                },
                {
                    'key': 'created',
                    'type': 'text',
                    'title': 'ADF_TASK_LIST.PROPERTIES.CREATED',
                    'cssClass': 'hidden',
                    'sortable': true
                },
                {
                    'key': 'assignee',
                    'type': 'text',
                    'title': 'ADF_TASK_LIST.PROPERTIES.ASSIGNEE',
                    'cssClass': 'hidden',
                    'sortable': true
                }
            ]
        , fakeCutomSchema };

    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;
    let taskListService: TaskListService;
    let appConfig: AppConfigService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule,
                MatProgressSpinnerModule
            ],
            declarations: [
                TaskListComponent
            ],
            providers: [
                TaskListService,
                {provide: TranslationService, useClass: TranslationMock}
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        appConfig = TestBed.get(AppConfigService);
        appConfig.config.bpmHost = 'http://localhost:9876/bpm';

        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;

        taskListService = TestBed.get(TaskListService);
        appConfig.config = Object.assign(appConfig.config, {
            'adf-task-list': {
                'presets': {
                    'fakeCutomSchema': [
                        {
                            'key': 'fakeName',
                            'type': 'text',
                            'title': 'ADF_TASK_LIST.PROPERTIES.FAKE',
                            'sortable': true
                        },
                        {
                            'key': 'fakeTaskName',
                            'type': 'text',
                            'title': 'ADF_TASK_LIST.PROPERTIES.TASK_FAKE',
                            'sortable': true
                        }
                    ]
                }
            }
        }
    );

    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(3);
    });

    it('should use the schemaColumn passed in input', () => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );

        component.ngAfterContentInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(1);
    });

    it('should use the custom schemaColumn from app.config.json', () => {
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.layoutPresets).toEqual(fakeColumnSchema);
    });

    it('should fetch custom schemaColumn when the input presetColumn is defined', () => {
        component.presetColumn = 'fakeCutomColumns';
        fixture.detectChanges();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(3);
    });

    it('should return an empty task list when no input parameters are passed', () => {
        component.ngAfterContentInit();
        expect(component.data).toBeDefined();
        expect(component.isListEmpty()).toBeTruthy();
    });

    it('should return the filtered task list when the input parameters are passed', (done) => {
        let state = new SimpleChange(null, 'open', true);
        let processDefinitionKey = new SimpleChange(null, null, true);
        let assignment = new SimpleChange(null, 'fake-assignee', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('nameFake1');
            expect(component.data.getRows()[0].getValue('description')).toEqual('descriptionFake1');
            expect(component.data.getRows()[0].getValue('category')).toEqual('categoryFake1');
            expect(component.data.getRows()[0].getValue('assignee').id).toEqual(2);
            expect(component.data.getRows()[0].getValue('assignee').firstName).toEqual('firstNameFake1');
            expect(component.data.getRows()[0].getValue('assignee').lastName).toEqual('lastNameFake1');
            expect(component.data.getRows()[0].getValue('assignee').email).toEqual('emailFake1');
            expect(component.data.getRows()[0].getValue('created')).toEqual('2017-03-01T12:25:17.189+0000');
            expect(component.data.getRows()[0].getValue('dueDate')).toEqual('2017-04-02T12:25:17.189+0000');
            expect(component.data.getRows()[0].getValue('endDate')).toEqual('2017-05-03T12:25:31.129+0000');
            expect(component.data.getRows()[0].getValue('duration')).toEqual(13940);
            expect(component.data.getRows()[0].getValue('priority')).toEqual(50);
            expect(component.data.getRows()[0].getValue('parentTaskId')).toEqual(1);
            expect(component.data.getRows()[0].getValue('parentTaskName')).toEqual('parentTaskNameFake');
            expect(component.data.getRows()[0].getValue('processInstanceId')).toEqual(2511);
            expect(component.data.getRows()[0].getValue('processInstanceName')).toEqual('processInstanceNameFake');
            expect(component.data.getRows()[0].getValue('processDefinitionId')).toEqual('myprocess:1:4');
            expect(component.data.getRows()[0].getValue('processDefinitionName')).toEqual('processDefinitionNameFake');
            expect(component.data.getRows()[0].getValue('processDefinitionDescription')).toEqual('processDefinitionDescriptionFake');
            expect(component.data.getRows()[0].getValue('processDefinitionKey')).toEqual('myprocess');
            expect(component.data.getRows()[0].getValue('processDefinitionCategory')).toEqual('http://www.activiti.org/processdef');
            done();
        });
        component.ngAfterContentInit();
        component.ngOnChanges({'state': state, 'processDefinitionKey': processDefinitionKey, 'assignment': assignment});
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should return the filtered task list by processDefinitionKey', (done) => {
        let state = new SimpleChange(null, 'open', true);
        let processDefinitionKey = new SimpleChange(null, 'fakeprocess', true);
        let assignment = new SimpleChange(null, 'fake-assignee', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('nameFake1');
            done();
        });

        component.ngAfterContentInit();
        component.ngOnChanges({'state': state, 'processDefinitionKey': processDefinitionKey, 'assignment': assignment});
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should return the filtered task list by processInstanceId', (done) => {
        let state = new SimpleChange(null, 'open', true);
        let processInstanceId = new SimpleChange(null, 'fakeprocessId', true);
        let assignment = new SimpleChange(null, 'fake-assignee', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('nameFake1');
            expect(component.data.getRows()[0].getValue('processInstanceId')).toEqual(2511);
            done();
        });

        component.ngAfterContentInit();
        component.ngOnChanges({'state': state, 'processInstanceId': processInstanceId, 'assignment': assignment});
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should return the filtered task list for all state', (done) => {
        let state = new SimpleChange(null, 'all', true);
        let processInstanceId = new SimpleChange(null, 'fakeprocessId', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('nameFake1');
            expect(component.data.getRows()[0].getValue('processInstanceId')).toEqual(2511);
            expect(component.data.getRows()[0].getValue('endDate')).toBeDefined();
            expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
            expect(component.data.getRows()[1].getValue('endDate')).toBeNull();
            done();
        });

        component.ngAfterContentInit();
        component.ngOnChanges({'state': state, 'processInstanceId': processInstanceId});
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should return a currentId null when the taskList is empty', () => {
        component.selectTask(null);
        expect(component.getCurrentId()).toBeNull();
    });

    it('should return selected true for the selected task', () => {
        component.data = new ObjectDataTableAdapter(
            [
                {id: '999', name: 'Fake-name'},
                {id: '888', name: 'Fake-name-888'}
            ],
            [
                {type: 'text', key: 'id', title: 'Id'},
                {type: 'text', key: 'name', title: 'Name'}
            ]
        );
        component.selectTask('888');
        const dataRow = component.data.getRows();
        expect(dataRow).toBeDefined();
        expect(dataRow[0].getValue('id')).toEqual('999');
        expect(dataRow[0].isSelected).toEqual(false);
        expect(dataRow[1].getValue('id')).toEqual('888');
        expect(dataRow[1].isSelected).toEqual(true);
    });

    xit('should throw an exception when the response is wrong', (done) => {
        let state = new SimpleChange(null, 'open', true);
        let assignment = new SimpleChange(null, 'fake-assignee', true);

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            expect(err.error).toBe('wrong request');
            done();
        });

        component.ngAfterContentInit();
        fixture.detectChanges();
        component.ngOnChanges({'state': state, 'assignment': assignment});

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 404,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeErrorTaskList)
        });
    });

    it('should reload tasks when reload() is called', (done) => {
        component.state = 'open';
        component.assignment = 'fake-assignee';
        component.ngAfterContentInit();
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('nameFake1');
            done();
        });
        fixture.detectChanges();
        component.reload();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should emit row click event', (done) => {
        let row = new ObjectDataRow({
            id: 999
        });
        let rowEvent = new DataRowEvent(row, null);

        component.rowClick.subscribe(taskId => {
            expect(taskId).toEqual(999);
            expect(component.getCurrentId()).toEqual(999);
            done();
        });

        component.onRowClick(rowEvent);
    });

    describe('component changes', () => {

        beforeEach(() => {
            component.data = new ObjectDataTableAdapter(
                [],
                [
                    {type: 'text', key: 'fake-id', title: 'Name'}
                ]
            );

            fixture.detectChanges();
        });

        it('should NOT reload the tasks if the loadingTaskId is the same of the current task', () => {
            spyOn(component, 'reload').and.stub();
            component.currentInstanceId = '999';

            component.data = new ObjectDataTableAdapter(
                [
                    {id: '999', name: 'Fake-name'}
                ],
                [
                    {type: 'text', key: 'id', title: 'Id'},
                    {type: 'text', key: 'name', title: 'Name'}
                ]
            );

            const landingTaskId = '999';
            let change = new SimpleChange(null, landingTaskId, true);
            component.ngOnChanges({'landingTaskId': change});
            expect(component.reload).not.toHaveBeenCalled();
            expect(component.data.getRows().length).toEqual(1);
        });

        it('should reload the tasks if the loadingTaskId is different from the current task', (done) => {
            component.currentInstanceId = '999';

            component.data = new ObjectDataTableAdapter(
                [
                    {id: '999', name: 'Fake-name'}
                ],
                [
                    {type: 'text', key: 'id', title: 'Id'},
                    {type: 'text', key: 'name', title: 'Name'}
                ]
            );

            const landingTaskId = '888';
            let change = new SimpleChange(null, landingTaskId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.data.getRows().length).toEqual(2);
                done();
            });

            component.ngOnChanges({'landingTaskId': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should NOT reload the process list when no parameters changed', () => {
            expect(component.isListEmpty()).toBeTruthy();
            component.ngOnChanges({});
            expect(component.isListEmpty()).toBeTruthy();
        });

        it('should reload the list when the appId parameter changes', (done) => {
            const appId = '1';
            let change = new SimpleChange(null, appId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });
            component.ngOnChanges({'appId': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the processDefinitionKey parameter changes', (done) => {
            const processDefinitionKey = 'fakeprocess';
            let change = new SimpleChange(null, processDefinitionKey, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'processDefinitionKey': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the state parameter changes', (done) => {
            const state = 'open';
            let change = new SimpleChange(null, state, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'state': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the sort parameter changes', (done) => {
            const sort = 'desc';
            let change = new SimpleChange(null, sort, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'sort': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the process list when the name parameter changes', (done) => {
            const name = 'FakeTaskName';
            let change = new SimpleChange(null, name, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'name': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the assignment parameter changes', (done) => {
            const assignment = 'assignee';
            let change = new SimpleChange(null, assignment, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'assignment': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });
    });
});
