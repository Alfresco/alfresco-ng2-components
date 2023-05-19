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

import { Component, SimpleChange, ViewChild, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService, setupTestBed, DataRowEvent, ObjectDataRow, DataCellEvent, ObjectDataColumn } from '@alfresco/adf-core';
import { TaskListService } from '../services/tasklist.service';
import { TaskListComponent } from './task-list.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import {
    fakeGlobalTask,
    fakeEmptyTask,
    paginatedTask,
    fakeColumnSchema, fakeCustomSchema
} from '../../mock';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';

declare let jasmine: any;

describe('TaskListComponent', () => {
    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;
    let appConfig: AppConfigService;
    let taskListService: TaskListService;

    const testMostRecentCall = (changes: SimpleChanges) => {
        component.ngAfterContentInit();
        component.ngOnChanges(changes);
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    };

    const testSubscribeForFilteredTaskList = (done: DoneFn) => {
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['processDefinitionId']).toEqual('myprocess:1:4');
            done();
        });
    };

    const testRowSelection = async (selectionMode?: string) => {
        spyOn(taskListService, 'findTasksByState').and.returnValues(of(fakeGlobalTask));
        const state = new SimpleChange(null, 'open', true);
        component.multiselect = true;
        if (selectionMode) {
            component.selectionMode = selectionMode;
        }
        component.ngOnChanges({ sort: state });
        fixture.detectChanges();
        await fixture.whenStable();

        const selectTask1 = fixture.nativeElement.querySelector('[data-automation-id="datatable-row-0"] .mat-checkbox-inner-container');
        const selectTask2 = fixture.nativeElement.querySelector('[data-automation-id="datatable-row-1"] .mat-checkbox-inner-container');
        selectTask1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        selectTask1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        selectTask2.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        fixture.detectChanges();
        await fixture.whenStable();

        let selectRow1 = fixture.nativeElement.querySelector('[class*="adf-is-selected"][data-automation-id="datatable-row-0"]');
        let selectRow2 = fixture.nativeElement.querySelector('[class*="adf-is-selected"][data-automation-id="datatable-row-1"]');
        expect(selectRow1).toBeDefined();
        expect(selectRow2).toBeDefined();
        expect(component.selectedInstances.length).toBe(2);
        selectTask2.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.selectedInstances.length).toBe(1);
        selectRow1 = fixture.nativeElement.querySelector('[class*="adf-is-selected"][data-automation-id="datatable-row-0"]');
        selectRow2 = fixture.nativeElement.querySelector('[class*="adf-is-selected"][data-automation-id="datatable-row-1"]');
        expect(selectRow1).toBeDefined();
        expect(selectRow2).toBeNull();
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        appConfig = TestBed.inject(AppConfigService);
        appConfig.config.bpmHost = 'http://localhost:9876/bpm';

        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;
        taskListService = TestBed.inject(TaskListService);

        appConfig.config = Object.assign(appConfig.config, {
            'adf-task-list': {
                presets: {
                    fakeCustomSchema
                }
            }
        });
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
        fixture.destroy();
    });

    it('should display loading spinner', () => {
        component.isLoading = true;

        const spinner = fixture.debugElement.query(By.css('.mat-progress-spinner'));
        expect(spinner).toBeDefined();
    });

    it('should hide loading spinner upon loading complete', async () => {
        component.isLoading = true;
        fixture.detectChanges();
        await fixture.whenStable();

        let spinner = fixture.debugElement.query(By.css('.mat-progress-spinner'));
        expect(spinner).toBeDefined();

        component.isLoading = false;

        fixture.detectChanges();
        await fixture.whenStable();

        spinner = fixture.debugElement.query(By.css('.mat-progress-spinner'));
        expect(spinner).toBeNull();
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(3);
    });

    it('should use the custom schemaColumn from app.config.json', () => {
        component.presetColumn = 'fakeCustomSchema';
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.columns.length).toEqual(2);
        expect(component.columns[0]).toEqual(new ObjectDataColumn(fakeCustomSchema[0]));
        expect(component.columns[1]).toEqual(new ObjectDataColumn(fakeCustomSchema[1]));
    });

    it('should fetch custom schemaColumn when the input presetColumn is defined', () => {
        component.presetColumn = 'fakeCustomSchema';
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
        const state = new SimpleChange(null, 'open', true);
        const processDefinitionKey = new SimpleChange(null, null, true);
        const assignment = new SimpleChange(null, 'fake-assignee', true);

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
            expect(component.rows[0]['created'].toISOString()).toEqual('2017-03-01T12:25:17.189Z');
            expect(component.rows[0]['dueDate'].toISOString()).toEqual('2017-04-02T12:25:17.189Z');
            expect(component.rows[0]['endDate'].toISOString()).toEqual('2017-05-03T12:25:31.129Z');
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
        testMostRecentCall({ state, processDefinitionKey, assignment });
    });

    it('should return the filtered task list by processDefinitionKey', (done) => {
        const state = new SimpleChange(null, 'open', true);
        /* cspell:disable-next-line */
        const processDefinitionKey = new SimpleChange(null, 'fakeprocess', true);
        const assignment = new SimpleChange(null, 'fake-assignee', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            done();
        });
        testMostRecentCall({ state, processDefinitionKey, assignment });
    });

    it('should return the filtered task list by processInstanceId', (done) => {
        const state = new SimpleChange(null, 'open', true);
        const processInstanceId = new SimpleChange(null, 'fakeprocessId', true);
        const assignment = new SimpleChange(null, 'fake-assignee', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['processInstanceId']).toEqual(2511);
            done();
        });
        testMostRecentCall({ state, processInstanceId, assignment });
    });

    it('should return the filtered task list by processDefinitionId', (done) => {
        const state = new SimpleChange(null, 'open', true);
        const processDefinitionId = new SimpleChange(null, 'fakeprocessDefinitionId', true);
        const assignment = new SimpleChange(null, 'fake-assignee', true);

        testSubscribeForFilteredTaskList(done);
        testMostRecentCall({ state, processDefinitionId, assignment });
    });

    it('should return the filtered task list by created date', (done) => {
        const state = new SimpleChange(null, 'open', true);
        const afterDate = new SimpleChange(null, '28-02-2017', true);
        testSubscribeForFilteredTaskList(done);
        testMostRecentCall({ state, afterDate });
    });

    it('should return the filtered task list for all state', (done) => {
        const state = new SimpleChange(null, 'all', true);
        /* cspell:disable-next-line */
        const processInstanceId = new SimpleChange(null, 'fakeprocessId', true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('nameFake1');
            expect(component.rows[0]['processInstanceId']).toEqual(2511);
            expect(component.rows[0]['endDate']).toBeDefined();
            expect(component.rows[1]['name']).toEqual('No name');
            expect(component.rows[1]['endDate']).toBeUndefined();
            done();
        });
        testMostRecentCall({ state, processInstanceId });
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
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeGlobalTask)
        });
    });

    it('should emit row click event', (done) => {
        const row = new ObjectDataRow({
            id: '999'
        });
        const rowEvent = new DataRowEvent(row, null);

        component.rowClick.subscribe((taskId) => {
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
            const change = new SimpleChange(null, landingTaskId, true);
            component.ngOnChanges({ landingTaskId: change });
            expect(component.reload).not.toHaveBeenCalled();
            expect(component.rows.length).toEqual(1);
        });

        it('should reload the tasks if the loadingTaskId is different from the current task', (done) => {
            component.currentInstanceId = '999';
            component.rows = [{ id: '999', name: 'Fake-name' }];
            const landingTaskId = '888';
            const change = new SimpleChange(null, landingTaskId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.rows.length).toEqual(2);
                done();
            });

            component.ngOnChanges({ landingTaskId: change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
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
            const change = new SimpleChange(null, appId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });
            component.ngOnChanges({ appId: change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the processDefinitionKey parameter changes', (done) => {
            const processDefinitionKey = 'fakeprocess';
            const change = new SimpleChange(null, processDefinitionKey, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ processDefinitionKey: change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the state parameter changes', (done) => {
            const state = 'open';
            const change = new SimpleChange(null, state, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ state: change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the sort parameter changes', (done) => {
            const sort = 'desc';
            const change = new SimpleChange(null, sort, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ sort: change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the process list when the name parameter changes', (done) => {
            const name = 'FakeTaskName';
            const change = new SimpleChange(null, name, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ name: change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });

        it('should reload the list when the assignment parameter changes', (done) => {
            const assignment = 'assignee';
            const change = new SimpleChange(null, assignment, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[1]['name']).toEqual('No name');
                done();
            });

            component.ngOnChanges({ assignment: change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGlobalTask)
            });
        });
    });

    it('should update the columns when presetColumn schema changes', () => {
        appConfig.config = Object.assign(appConfig.config, {
            'adf-task-list': {
                presets: fakeColumnSchema
            }
        });

        component.presetColumn = 'fakeCustomSchema';
        component.ngAfterContentInit();
        const initialColumnSchema = component.mergeJsonAndHtmlSchema();
        expect(component.columns).toEqual(initialColumnSchema);

        component.presetColumn = 'fakeMyTasksSchema';
        const presetColumnChange = new SimpleChange(null, 'fakeMyTasksSchema', false);
        component.ngOnChanges({ presetColumn: presetColumnChange });

        const newColumnSchema = component.mergeJsonAndHtmlSchema();
        const expectedColumn1 = new ObjectDataColumn(fakeColumnSchema.fakeMyTasksSchema[0]);
        const expectedColumn2 = new ObjectDataColumn(fakeColumnSchema.fakeMyTasksSchema[1]);

        expect(component.columns).toEqual(newColumnSchema);
        expect(initialColumnSchema).not.toEqual(newColumnSchema);
        expect(component.columns.length).toEqual(2);
        expect(component.columns[0]).toEqual(expectedColumn1);
        expect(component.columns[1]).toEqual(expectedColumn2);
    });

    it('should show the updated list when pagination changes', async () => {
        spyOn(taskListService, 'findTasksByState').and.returnValues(of(fakeGlobalTask), of(paginatedTask));
        const state = new SimpleChange(null, 'open', true);
        const processDefinitionKey = new SimpleChange(null, null, true);
        const assignment = new SimpleChange(null, 'fake-assignee', true);
        component.ngAfterContentInit();
        component.ngOnChanges({ state, processDefinitionKey, assignment });

        fixture.detectChanges();
        await fixture.whenStable();

        let rows = Array.from(fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-body adf-datatable-row'));
        expect(rows.length).toEqual(2);
        component.updatePagination({ skipCount: 0, maxItems: 5 });

        fixture.detectChanges();
        await fixture.whenStable();

        rows = Array.from(fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-body adf-datatable-row'));
        expect(rows.length).toEqual(5);
        expect(taskListService.findTasksByState).toHaveBeenCalledTimes(2);
    });

    it('should be able to select all tasks when multi-selection is enabled', async () => {
        spyOn(taskListService, 'findTasksByState').and.returnValues(of(fakeGlobalTask));
        const state = new SimpleChange(null, 'open', true);
        component.multiselect = true;

        component.ngOnChanges({ sort: state });

        fixture.detectChanges();
        await fixture.whenStable();

        const selectAllCheckbox = fixture.nativeElement.querySelector('div[class*="adf-datatable-cell-header adf-datatable-checkbox"] .mat-checkbox-inner-container');
        selectAllCheckbox.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.selectedInstances.length).toBe(2);
        expect(component.selectedInstances[0].obj.name).toBe('nameFake1');
        expect(component.selectedInstances[1].obj.description).toBe('descriptionFake2');

        selectAllCheckbox.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.selectedInstances.length).toBe(0);
    });

    it('should be able to unselect a selected tasks using the checkbox', async () => {
        await testRowSelection();
    });

    it('should not be able to select different row when selection mode is set to NONE and multiselection is enabled', async () => {
        await testRowSelection('none');
        const selectTask2Row = fixture.nativeElement.querySelector('[data-automation-id="text_No name"]');
        selectTask2Row.click();

        const selectRow1 = fixture.nativeElement.querySelector('[class*="adf-is-selected"][data-automation-id="datatable-row-0"]');
        const selectRow2 = fixture.nativeElement.querySelector('[class*="adf-is-selected"][data-automation-id="datatable-row-1"]');
        expect(selectRow1).toBeDefined();
        expect(selectRow2).toBeNull();
    });

    it('should select only one row when selection mode is set to SINGLE and multiselection is enabled', async () => {
        spyOn(taskListService, 'findTasksByState').and.returnValues(of(fakeGlobalTask));
        const state = new SimpleChange(null, 'open', true);
        component.multiselect = true;
        component.selectionMode = 'single';

        component.ngOnChanges({ sort: state });
        fixture.detectChanges();

        const selectTask1 = fixture.nativeElement.querySelector('[data-automation-id="datatable-row-0"] .mat-checkbox-inner-container');
        const selectTask2 = fixture.nativeElement.querySelector('[data-automation-id="datatable-row-1"] .mat-checkbox-inner-container');
        selectTask1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        selectTask1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        selectTask2.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.selectedInstances.length).toBe(2);
    });

    it('should change selected row after clicking on different row', async () => {
        spyOn(taskListService, 'findTasksByState').and.returnValues(of(fakeGlobalTask));
        const state = new SimpleChange(null, 'open', true);

        component.ngOnChanges({ sort: state });
        fixture.detectChanges();
        await fixture.whenStable();

        const selectTask1 = fixture.nativeElement.querySelector('[data-automation-id="text_nameFake1"]');
        const selectTask2 = fixture.nativeElement.querySelector('[data-automation-id="text_No name"]');
        selectTask1.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentInstanceId.toString()).toBe('14');
        selectTask2.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentInstanceId.toString()).toBe('2');
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
                    <div>{{entry.row?.obj?.startedBy | fullName}}</div>
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
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [CustomTaskListComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomTaskListComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
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
    <adf-tasklist [appId]="1">
        <adf-custom-empty-content-template>
            <p id="custom-id">CUSTOM EMPTY</p>
        </adf-custom-empty-content-template>
    </adf-tasklist>
       `
})
class EmptyTemplateComponent {
}

describe('Task List: Custom EmptyTemplateComponent', () => {
    let fixture: ComponentFixture<EmptyTemplateComponent>;
    let translateService: TranslateService;
    let taskListService: TaskListService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [EmptyTemplateComponent]
    });

    beforeEach(() => {
        translateService = TestBed.inject(TranslateService);
        taskListService = TestBed.inject(TaskListService);
        spyOn(translateService, 'get').and.callFake((key: string) => of(key));
        spyOn(taskListService, 'findTasksByState').and.returnValue(of(fakeEmptyTask));
        fixture = TestBed.createComponent(EmptyTemplateComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the custom template', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.debugElement.query(By.css('#custom-id'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('.adf-empty-content'))).toBeNull();
            done();
        });
    });
});

@Component({
    template: `
    <adf-tasklist
    [showContextMenu]="true"
    (showRowContextMenu)="onShowRowContextMenu($event)"
    #taskList>
        <data-columns>
            <data-column key="name" title="ADF_TASK_LIST.PROPERTIES.NAME" class="full-width name-column"></data-column>
            <data-column key="created" title="ADF_TASK_LIST.PROPERTIES.CREATED" class="hidden"></data-column>
            <data-column key="startedBy" title="ADF_TASK_LIST.PROPERTIES.CREATED" class="desktop-only dw-dt-col-3 ellipsis-cell">
                <ng-template let-entry="$implicit">
                    <div>{{entry.row?.obj?.startedBy | fullName}}</div>
                </ng-template>
            </data-column>
        </data-columns>
    </adf-tasklist>`
})

class TaskListContextMenuComponent implements OnInit {

    @Output()
    contextAction = new EventEmitter<any>();
    private performAction$ = new Subject<any>();

    ngOnInit() {
        this.performContextActions();
    }

    onShowRowContextMenu(event: DataCellEvent) {
        event.value.actions = [
            {
                data: event.value.row['obj'],
                model:
                {
                    key: 'taskDetails',
                    icon: 'open',
                    title: 'View Task Details',
                    visible: true
                },
                subject: this.performAction$
            },
            {
                data: event.value.row['obj'],
                model:
                {
                    key: 'cancel',
                    icon: 'open',
                    title: 'Cancel Process',
                    visible: true
                },
                subject: this.performAction$
            }
        ];
    }

    performContextActions() {
        this.performAction$
          .subscribe((action: any) => {
            this.contextAction.emit(action.data);
          });
    }
}

describe('TaskListContextMenuComponent', () => {
    let fixture: ComponentFixture<TaskListContextMenuComponent>;
    let customComponent: TaskListContextMenuComponent;
    let taskListService: TaskListService;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [
            TaskListContextMenuComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskListContextMenuComponent);
        customComponent = fixture.componentInstance;
        element = fixture.nativeElement;
        taskListService = TestBed.inject(TaskListService);
        spyOn(taskListService, 'findTasksByState').and.returnValues(of(fakeGlobalTask));
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.detectChanges();
    });

    it('Should be able to show context menu on task list', async () => {
        const contextMenu =  element.querySelector(`[data-automation-id="text_${fakeGlobalTask.data[0].name}"]`);
        const contextActionSpy = spyOn(customComponent.contextAction, 'emit').and.callThrough();
        contextMenu.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        const contextActions = document.querySelectorAll('.mat-menu-item');

        expect(contextActions.length).toBe(2);
        expect(contextActions[0]['disabled']).toBe(false, 'View Task Details action not enabled');
        expect(contextActions[1]['disabled']).toBe(false, 'Cancel Task action not enabled');
        contextActions[0].dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(contextActionSpy).toHaveBeenCalled();
      });
});
