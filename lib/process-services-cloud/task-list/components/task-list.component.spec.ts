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

import { Component, SimpleChange, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { DataRowEvent, ObjectDataRow } from '@alfresco/adf-core';
import { TaskListService } from '../services/tasklist.service';
import { TaskListComponent } from './task-list.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { fakeGlobalTask, fakeCutomSchema } from '../../mock';

declare let jasmine: any;

describe('TaskListComponent', () => {
    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;
    let appConfig: AppConfigService;

    setupTestBed({
        imports: [
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        appConfig = TestBed.get(AppConfigService);
        appConfig.config.bpmHost = 'http://localhost:9876/bpm';

        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;

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
        });

    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(3);
    });

    it('should use the custom schemaColumn from app.config.json', () => {
        component.presetColumn = 'fakeCutomSchema';
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.columns).toEqual(fakeCutomSchema);
    });

    it('should fetch custom schemaColumn when the input presetColumn is defined', () => {
        component.presetColumn = 'fakeCutomSchema';
        fixture.detectChanges();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(2);
    });

    it('should return an empty task list when no input parameters are passed', () => {
        component.ngAfterContentInit();
        expect(component.rows).toBeDefined();
        expect(component.isListEmpty()).toBeTruthy();
    });

    it('should return the filtered task list when the input parameters are passed', (done) => {
        let state = new SimpleChange(null, 'open', true);
        let processDefinitionKey = new SimpleChange(null, null, true);
        let assignment = new SimpleChange(null, 'fake-assignee', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['description']).toEqual('descriptionFake1');
            expect(component.rows[0]['category']).toEqual('categoryFake1');
            expect(component.rows[0]['assignee'].id).toEqual(2);
            expect(component.rows[0]['assignee'].firstName).toEqual('firstNameFake1');
            expect(component.rows[0]['assignee'].lastName).toEqual('lastNameFake1');
            expect(component.rows[0][('assignee')].email).toEqual('emailFake1');
            expect(component.rows[0]['created']).toEqual('2017-03-01T12:25:17.189+0000');
            expect(component.rows[0]['dueDate']).toEqual('2017-04-02T12:25:17.189+0000');
            expect(component.rows[0]['endDate']).toEqual('2017-05-03T12:25:31.129+0000');
            expect(component.rows[0]['duration']).toEqual(13940);
            expect(component.rows[0]['priority']).toEqual(50);
            expect(component.rows[0]['parentTaskId']).toEqual(1);
            expect(component.rows[0]['parentTaskName']).toEqual('parentTaskNameFake');
            expect(component.rows[0]['processInstanceId']).toEqual(2511);
            expect(component.rows[0]['processInstanceName']).toEqual('processInstanceNameFake');
            expect(component.rows[0]['processDefinitionId']).toEqual('myprocess:1:4');
            expect(component.rows[0]['processDefinitionName']).toEqual('processDefinitionNameFake');
            expect(component.rows[0]['processDefinitionDescription']).toEqual('processDefinitionDescriptionFake');
            expect(component.rows[0]['processDefinitionKey']).toEqual('myprocess');
            expect(component.rows[0]['processDefinitionCategory']).toEqual('http://www.activiti.org/processdef');
            done();
        });
        component.ngAfterContentInit();
        component.ngOnChanges({ 'state': state, 'processDefinitionKey': processDefinitionKey, 'assignment': assignment });
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
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            done();
        });

        component.ngAfterContentInit();
        component.ngOnChanges({ 'state': state, 'processDefinitionKey': processDefinitionKey, 'assignment': assignment });
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
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['processInstanceId']).toEqual(2511);
            done();
        });

        component.ngAfterContentInit();
        component.ngOnChanges({ 'state': state, 'processInstanceId': processInstanceId, 'assignment': assignment });
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should return the filtered task list by processDefinitionId', (done) => {
        let state = new SimpleChange(null, 'open', true);
        let processDefinitionId = new SimpleChange(null, 'fakeprocessDefinitionId', true);
        let assignment = new SimpleChange(null, 'fake-assignee', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['processDefinitionId']).toEqual('myprocess:1:4');
            done();
        });

        component.ngAfterContentInit();
        component.ngOnChanges({ 'state': state, 'processDefinitionId': processDefinitionId, 'assignment': assignment });
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should return the filtered task list by created date', (done) => {
        let state = new SimpleChange(null, 'open', true);
        let afterDate = new SimpleChange(null, '28-02-2017', true);
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['processDefinitionId']).toEqual('myprocess:1:4');
            done();
        });
        component.ngAfterContentInit();
        component.ngOnChanges({ 'state': state, 'afterDate': afterDate });
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
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['processInstanceId']).toEqual(2511);
            expect(component.rows[0]['endDate']).toBeDefined();
            expect(component.rows[1]['name']).toEqual('No name');
            expect(component.rows[1]['endDate']).toBeNull();
            done();
        });

        component.ngAfterContentInit();
        component.ngOnChanges({ 'state': state, 'processInstanceId': processInstanceId });
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

    it('should return selected id for the selected task', () => {
        component.rows = [
            { id: '999', name: 'Fake-name' },
            { id: '888', name: 'Fake-name-888' }
        ];
        component.selectTask('888');
        expect(component.rows).toBeDefined();
        expect(component.currentInstanceId).toEqual('888');
    });

    it('should reload tasks when reload() is called', (done) => {
        component.state = 'open';
        component.assignment = 'fake-assignee';
        component.ngAfterContentInit();
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
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
            id: '999'
        });
        let rowEvent = new DataRowEvent(row, null);

        component.rowClick.subscribe(taskId => {
            expect(taskId).toEqual('999');
            expect(component.getCurrentId()).toEqual('999');
            done();
        });

        component.onRowClick(rowEvent);
    });

    describe('component changes', () => {

        beforeEach(() => {
            component.rows = fakeGlobalTask.data;
            fixture.detectChanges();
        });

        it('should NOT reload the tasks if the loadingTaskId is the same of the current task', () => {
            spyOn(component, 'reload').and.stub();
            component.currentInstanceId = '999';

            component.rows = [{ id: '999', name: 'Fake-name' }];
            const landingTaskId = '999';
            let change = new SimpleChange(null, landingTaskId, true);
            component.ngOnChanges({'landingTaskId': change});
            expect(component.reload).not.toHaveBeenCalled();
            expect(component.rows.length).toEqual(1);
        });

        it('should reload the tasks if the loadingTaskId is different from the current task', (done) => {
            component.currentInstanceId = '999';
            component.rows = [{ id: '999', name: 'Fake-name' }];
            const landingTaskId = '888';
            let change = new SimpleChange(null, landingTaskId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.rows.length).toEqual(2);
                done();
            });

            component.ngOnChanges({'landingTaskId': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should NOT reload the task list when no parameters changed', () => {
            component.rows = null;
            component.ngOnChanges({});
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeTruthy();
        });

        it('should reload the list when the appId parameter changes', (done) => {
            const appId = '1';
            let change = new SimpleChange(null, appId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });
            component.ngOnChanges({ 'appId': change });

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
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ 'processDefinitionKey': change });

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
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ 'state': change });

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
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ 'sort': change });

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
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ 'name': change });

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
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ 'assignment': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });
    });
});

@Component({
    template: `
    <adf-tasklist #taskList>
        <data-columns>
            <data-column key="name" title="ADF_TASK_LIST.PROPERTIES.NAME" class="full-width name-column"></data-column>
            <data-column key="created" title="ADF_TASK_LIST.PROPERTIES.CREATED" class="hidden"></data-column>
            <data-column key="startedBy" title="ADF_TASK_LIST.PROPERTIES.CREATED" class="desktop-only dw-dt-col-3 ellipsis-cell">
                <ng-template let-entry="$implicit">
                    <div>{{getFullName(entry.row.obj.startedBy)}}</div>
                </ng-template>
            </data-column>
        </data-columns>
    </adf-tasklist>`
})

class CustomTaskListComponent {

    @ViewChild(TaskListComponent)
    taskList: TaskListComponent;
}

describe('CustomTaskListComponent', () => {
    let fixture: ComponentFixture<CustomTaskListComponent>;
    let component: CustomTaskListComponent;

    setupTestBed({
        imports: [CoreModule.forRoot()],
        declarations: [TaskListComponent, CustomTaskListComponent],
        providers: [TaskListService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomTaskListComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of CustomTaskListComponent', () => {
        expect(component instanceof CustomTaskListComponent).toBe(true, 'should create CustomTaskListComponent');
    });

    it('should fetch custom schemaColumn from html', () => {
        fixture.detectChanges();
        expect(component.taskList.columnList).toBeDefined();
        expect(component.taskList.columns[0]['title']).toEqual('ADF_TASK_LIST.PROPERTIES.NAME');
        expect(component.taskList.columns[1]['title']).toEqual('ADF_TASK_LIST.PROPERTIES.CREATED');
        expect(component.taskList.columns.length).toEqual(3);
    });
});

@Component({
    template: `
    <adf-tasklist>
        <adf-empty-content-holder>
            <p id="custom-id"></p>
        </adf-empty-content-holder>
    </adf-tasklist>
       `
})
class EmptyTemplateComponent {
}

describe('Custom EmptyTemplateComponent', () => {
    let fixture: ComponentFixture<EmptyTemplateComponent>;

    setupTestBed({
        imports: [ProcessTestingModule],
        declarations: [EmptyTemplateComponent],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EmptyTemplateComponent);
        fixture.detectChanges();
    });

    it('should render the custom template', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#custom-id'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('.adf-empty-content'))).toBeNull();
        });
    }));
});
