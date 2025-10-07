/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, SimpleChange, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    AppConfigService,
    DataRowEvent,
    ObjectDataRow,
    User,
    DataColumn,
    ColumnsSelectorComponent,
    DataColumnListComponent,
    DataColumnComponent,
    CustomEmptyContentTemplateDirective,
    NoopAuthModule
} from '@alfresco/adf-core';
import { TaskListCloudService } from '../../services/task-list-cloud.service';
import { TaskListCloudComponent } from './task-list-cloud.component';
import { fakeGlobalTasks, fakeCustomSchema, fakeGlobalTask } from '../../mock/fake-task-response.mock';
import { of } from 'rxjs';
import { TaskListCloudSortingModel } from '../../../../models/task-list-sorting.model';
import { shareReplay, skip } from 'rxjs/operators';
import { TASK_LIST_CLOUD_TOKEN, TASK_LIST_PREFERENCES_SERVICE_TOKEN } from '../../../../services/cloud-token.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { provideCloudPreferences } from '../../../../providers';

@Component({
    imports: [TaskListCloudComponent, DataColumnListComponent, DataColumnComponent],
    template: ` <adf-cloud-task-list #taskListCloud>
        <data-columns>
            <data-column id="name" key="name" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME" class="adf-full-width adf-name-column" [order]="3" />
            <data-column id="created" key="created" title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED" class="adf-hidden" />
            <data-column
                id="startedBy"
                key="startedBy"
                title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED"
                class="adf-desktop-only dw-dt-col-3 adf-ellipsis-cell"
            >
                <ng-template let-entry="$implicit">
                    <div>{{ getFullName(entry.row?.obj?.startedBy) }}</div>
                </ng-template>
            </data-column>
        </data-columns>
    </adf-cloud-task-list>`
})
class CustomTaskListComponent {
    @ViewChild(TaskListCloudComponent)
    taskList: TaskListCloudComponent;

    getFullName(person: User): string {
        return `${person.firstName} ${person.lastName}`;
    }
}

@Component({
    imports: [CustomEmptyContentTemplateDirective, TaskListCloudComponent],
    template: `
        <adf-cloud-task-list>
            <adf-custom-empty-content-template>
                <p id="custom-id"></p>
            </adf-custom-empty-content-template>
        </adf-cloud-task-list>
    `
})
class EmptyTemplateComponent {}

@Component({
    imports: [TaskListCloudComponent, DataColumnListComponent, DataColumnComponent],
    template: ` <adf-cloud-task-list>
        <data-columns>
            <data-column [copyContent]="true" key="id" title="ADF_CLOUD_TASK_LIST.PROPERTIES.ID" />
            <data-column key="name" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME" />
        </data-columns>
    </adf-cloud-task-list>`
})
class CustomCopyContentTaskListComponent {
    @ViewChild(TaskListCloudComponent, { static: true })
    taskList: TaskListCloudComponent;
}

describe('TaskListCloudComponent', () => {
    let loader: HarnessLoader;
    let component: TaskListCloudComponent;
    let fixture: ComponentFixture<TaskListCloudComponent>;
    let appConfig: AppConfigService;
    let getTaskByRequestSpy: jasmine.Spy;
    let fetchTaskListSpy: jasmine.Spy;

    const preferencesService = jasmine.createSpyObj('preferencesService', {
        getPreferences: of({}),
        updatePreference: of({})
    });

    const configureTestingModule = (searchApiMethod: 'GET' | 'POST') => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, TaskListCloudComponent],
            providers: [
                {
                    provide: TASK_LIST_CLOUD_TOKEN,
                    useClass: TaskListCloudService
                },
                {
                    provide: TASK_LIST_PREFERENCES_SERVICE_TOKEN,
                    useValue: preferencesService
                }
            ]
        });
        appConfig = TestBed.inject(AppConfigService);
        fixture = TestBed.createComponent(TaskListCloudComponent);
        component = fixture.componentInstance;

        const taskListCloudService = TestBed.inject(TASK_LIST_CLOUD_TOKEN);
        getTaskByRequestSpy = spyOn(taskListCloudService, 'getTaskByRequest');
        fetchTaskListSpy = spyOn(taskListCloudService, 'fetchTaskList').and.returnValue(of(fakeGlobalTasks));

        appConfig.config = Object.assign(appConfig.config, {
            'adf-cloud-task-list': {
                presets: {
                    fakeCustomSchema: [
                        {
                            key: 'fakeName',
                            type: 'text',
                            title: 'ADF_CLOUD_TASK_LIST.PROPERTIES.FAKE',
                            sortable: true
                        },
                        {
                            key: 'fakeTaskName',
                            type: 'text',
                            title: 'ADF_CLOUD_TASK_LIST.PROPERTIES.TASK_FAKE',
                            sortable: true
                        }
                    ]
                }
            }
        });

        component.searchApiMethod = searchApiMethod;
        component.isColumnSchemaCreated$ = of(true).pipe(shareReplay(1));
        loader = TestbedHarnessEnvironment.loader(fixture);
    };

    afterEach(() => {
        fixture.destroy();
    });

    describe('searchApiMethod set to GET', () => {
        beforeEach(() => {
            configureTestingModule('GET');
        });

        it('should load spinner and show the content', async () => {
            getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);

            component.ngOnChanges({ appName });
            fixture.detectChanges();

            expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(false);

            const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
            expect(emptyContent).toBeFalsy();

            expect(component.rows.length).toEqual(1);
        });

        it('should hide columns on applying new columns visibility through columns selector', () => {
            component.showMainDatatableActions = true;
            getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));
            component.ngAfterContentInit();

            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            component.ngOnChanges({ appName });

            fixture.detectChanges();

            const mainMenuButton = fixture.debugElement.query(By.css('[data-automation-id="adf-datatable-main-menu-button"]'));
            mainMenuButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            const columnSelectorMenu = fixture.debugElement.query(By.css('adf-datatable-column-selector'));
            expect(columnSelectorMenu).toBeTruthy();

            const columnsSelectorInstance = columnSelectorMenu.componentInstance as ColumnsSelectorComponent;
            expect(columnsSelectorInstance.columns).toBe(component.columns, 'should pass columns as input');

            const newColumns = (component.columns as DataColumn[]).map((column, index) => ({
                ...column,
                isHidden: index !== 0 // only first one is shown
            }));

            columnSelectorMenu.triggerEventHandler('submitColumnsVisibility', newColumns);
            fixture.detectChanges();

            const displayedColumns = fixture.debugElement.queryAll(By.css('.adf-datatable-cell-header'));
            expect(displayedColumns.length).toBe(2, 'only column with isHidden set to false and action column should be shown');
        });

        it('should return the results if an application name is given', (done) => {
            getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(1);

                const expectedTask = {
                    ...fakeGlobalTask,
                    variables: fakeGlobalTask.processVariables
                };

                expect(component.rows[0]).toEqual(expectedTask);
                done();
            });

            component.ngAfterContentInit();
            spyOn(component, 'createDatatableSchema');
            component.appName = 'fake-app-name';
            component.reload();
        });

        it('should call endpoint when a column visibility gets changed', () => {
            component.ngAfterContentInit();
            spyOn(component, 'createDatatableSchema');
            component.appName = 'fake-app-name';
            component.reload();
            fixture.detectChanges();

            component.onColumnsVisibilityChange(component.columns);

            fixture.detectChanges();

            expect(getTaskByRequestSpy).toHaveBeenCalledTimes(1);
        });

        describe('component changes', () => {
            beforeEach(() => {
                component.rows = fakeGlobalTasks.list.entries;
                fixture.detectChanges();
            });

            it('should reload the task list when input parameters changed', () => {
                getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));
                component.appName = 'mock-app-name';
                component.priority = 1;
                component.status = 'mock-status';
                component.lastModifiedFrom = 'mock-lastmodified-date';
                component.owner = 'mock-owner-name';

                const priorityChange = new SimpleChange(undefined, 1, true);
                const statusChange = new SimpleChange(undefined, 'mock-status', true);
                const lastModifiedFromChange = new SimpleChange(undefined, 'mock-lastmodified-date', true);
                const ownerChange = new SimpleChange(undefined, 'mock-owner-name', true);

                component.ngOnChanges({
                    priority: priorityChange,
                    status: statusChange,
                    lastModifiedFrom: lastModifiedFromChange,
                    owner: ownerChange
                });

                fixture.detectChanges();
                expect(component.isListEmpty()).toBeFalsy();
                expect(getTaskByRequestSpy).toHaveBeenCalled();
            });

            it('should reload task list when sorting on a column changes', () => {
                getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));
                component.onSortingChanged(
                    new CustomEvent('sorting-changed', {
                        detail: {
                            key: 'fakeName',
                            direction: 'asc'
                        },
                        bubbles: true
                    })
                );
                fixture.detectChanges();
                expect(component.sorting).toEqual([
                    new TaskListCloudSortingModel({
                        orderBy: 'fakeName',
                        direction: 'ASC'
                    })
                ]);
                expect(component.formattedSorting).toEqual(['fakeName', 'asc']);
                expect(component.isListEmpty()).toBeFalsy();
                expect(getTaskByRequestSpy).toHaveBeenCalled();
            });
        });
    });

    describe('searchApiMethod set to POST', () => {
        beforeEach(() => {
            configureTestingModule('POST');
            component.appName = 'mock-app-name';
        });

        it('should load spinner and show the content', async () => {
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);

            fixture.detectChanges();
            component.ngOnChanges({ appName });
            fixture.detectChanges();

            expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(false);

            const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
            expect(emptyContent).toBeFalsy();

            expect(component.rows.length).toEqual(1);
        });

        it('should hide columns on applying new columns visibility through columns selector', () => {
            component.showMainDatatableActions = true;
            component.ngAfterContentInit();

            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            component.ngOnChanges({ appName });

            fixture.detectChanges();

            const mainMenuButton = fixture.debugElement.query(By.css('[data-automation-id="adf-datatable-main-menu-button"]'));
            mainMenuButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            const columnSelectorMenu = fixture.debugElement.query(By.css('adf-datatable-column-selector'));
            expect(columnSelectorMenu).toBeTruthy();

            const columnsSelectorInstance = columnSelectorMenu.componentInstance as ColumnsSelectorComponent;
            expect(columnsSelectorInstance.columns).toBe(component.columns, 'should pass columns as input');

            const newColumns = (component.columns as DataColumn[]).map((column, index) => ({
                ...column,
                isHidden: index !== 0 // only first one is shown
            }));

            columnSelectorMenu.triggerEventHandler('submitColumnsVisibility', newColumns);
            fixture.detectChanges();

            const displayedColumns = fixture.debugElement.queryAll(By.css('.adf-datatable-cell-header'));
            expect(displayedColumns.length).toBe(2, 'only column with isHidden set to false and action column should be shown');
        });

        it('should return the results if an application name is given', (done) => {
            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(1);

                const expectedTask = {
                    ...fakeGlobalTask,
                    variables: fakeGlobalTask.processVariables
                };

                expect(component.rows[0]).toEqual(expectedTask);
                done();
            });

            component.ngAfterContentInit();
            spyOn(component, 'createDatatableSchema');
            component.appName = 'fake-app-name';
            component.reload();
        });

        it('should call endpoint when a column visibility gets changed', () => {
            component.ngAfterContentInit();
            spyOn(component, 'createDatatableSchema');
            component.appName = 'fake-app-name';
            component.reload();
            fixture.detectChanges();

            component.onColumnsVisibilityChange(component.columns);

            fixture.detectChanges();

            expect(fetchTaskListSpy).toHaveBeenCalledTimes(2);
        });
        describe('component changes', () => {
            beforeEach(() => {
                component.rows = fakeGlobalTasks.list.entries;
                component.appName = 'mock-app-name';
                fixture.detectChanges();
            });

            it('should reload the task list when input parameters changed', () => {
                component.appName = 'mock-app-name';
                component.priorities = ['1', '2'];
                component.statuses = ['mock-status-1', 'mock-status-2'];
                component.lastModifiedFrom = 'mock-lastmodified-date';
                const prioritiesChange = new SimpleChange(undefined, ['1'], true);
                const statusesChange = new SimpleChange(undefined, ['mock-status'], true);
                const lastModifiedFromChange = new SimpleChange(undefined, 'mock-lastmodified-date', true);
                component.ngOnChanges({
                    priorities: prioritiesChange,
                    statuses: statusesChange,
                    lastModifiedFrom: lastModifiedFromChange
                });
                fixture.detectChanges();
                expect(component.isListEmpty()).toBeFalsy();
                expect(fetchTaskListSpy).toHaveBeenCalled();
            });

            it('should reload task list when sorting on a column changes', () => {
                fixture.detectChanges();
                component.onSortingChanged(
                    new CustomEvent('sorting-changed', {
                        detail: {
                            key: 'fakeName',
                            direction: 'asc'
                        },
                        bubbles: true
                    })
                );
                fixture.detectChanges();
                expect(component.sorting).toEqual([
                    new TaskListCloudSortingModel({
                        orderBy: 'fakeName',
                        direction: 'ASC'
                    })
                ]);
                expect(component.formattedSorting).toEqual(['fakeName', 'asc']);
                expect(component.isListEmpty()).toBeFalsy();
                expect(fetchTaskListSpy).toHaveBeenCalled();
            });
        });
    });

    describe('API agnostic', () => {
        beforeEach(() => {
            configureTestingModule('GET');
        });

        it('should be able to inject TaskListCloudService instance', () => {
            fixture.detectChanges();

            expect(component.taskListCloudService instanceof TaskListCloudService).toBeTruthy();
        });

        it('should use the default schemaColumn as default', () => {
            component.ngAfterContentInit();
            expect(component.columns).toBeDefined();
            expect(component.columns.length).toEqual(3);
        });

        it('should display empty content when process list is empty', async () => {
            const emptyList = { list: { entries: [] } };
            getTaskByRequestSpy.and.returnValue(of(emptyList));
            fixture.detectChanges();

            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            component.ngOnChanges({ appName });
            fixture.detectChanges();

            expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(false);

            const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
            expect(emptyContent.nativeElement).toBeDefined();
        });

        it('should use the custom schemaColumn from app.config.json', () => {
            component.presetColumn = 'fakeCustomSchema';
            component.ngAfterContentInit();
            fixture.detectChanges();
            expect(component.columns).toEqual(fakeCustomSchema);
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

        it('should emit row click event', (done) => {
            const row = new ObjectDataRow({ id: '999' });
            const rowEvent = new DataRowEvent(row, null);
            component.rowClick.subscribe((taskId) => {
                expect(taskId).toEqual('999');
                expect(component.currentInstanceId).toEqual('999');
                done();
            });
            component.onRowClick(rowEvent);
        });

        it('should re-create columns when a column width gets changed', () => {
            component.reload();
            fixture.detectChanges();

            const newColumns = [...component.columns];
            newColumns[0].width = 120;
            component.onColumnsWidthChanged(newColumns);

            expect(component.columns[0].width).toBe(120);
        });

        it('should update columns widths when a column width gets changed', () => {
            component.appName = 'fake-app-name';
            component.reload();
            fixture.detectChanges();

            const newColumns = [...component.columns];
            newColumns[0].width = 120;
            component.onColumnsWidthChanged(newColumns);

            expect(component.columns[0].width).toBe(120);
            expect(preferencesService.updatePreference).toHaveBeenCalledWith('fake-app-name', 'tasks-list-cloud-columns-widths', {
                name: 120
            });
        });

        it('should update columns widths while preserving previously saved widths when a column width gets changed', () => {
            component.appName = 'fake-app-name';
            component.reload();
            fixture.detectChanges();

            const newColumns = [...component.columns];
            newColumns[0].width = 120;
            component.onColumnsWidthChanged(newColumns);

            expect(component.columns[0].width).toBe(120);
            expect(preferencesService.updatePreference).toHaveBeenCalledWith('fake-app-name', 'tasks-list-cloud-columns-widths', {
                name: 120
            });

            newColumns[1].width = 150;
            component.onColumnsWidthChanged(newColumns);

            expect(component.columns[0].width).toBe(120);
            expect(component.columns[1].width).toBe(150);
            expect(preferencesService.updatePreference).toHaveBeenCalledWith('fake-app-name', 'tasks-list-cloud-columns-widths', {
                name: 120,
                created: 150
            });
        });

        it('should re-create columns when a column order gets changed', () => {
            component.reload();
            fixture.detectChanges();

            expect(component.columns[0].title).toBe('ADF_CLOUD_TASK_LIST.PROPERTIES.NAME');
            expect(component.columns[1].title).toBe('ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED');
            expect(component.columns[2].title).toBe('ADF_CLOUD_TASK_LIST.PROPERTIES.ASSIGNEE');

            component.onColumnOrderChanged([component.columns[1], ...component.columns]);
            fixture.detectChanges();

            expect(component.columns[0].title).toBe('ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED');
            expect(component.columns[1].title).toBe('ADF_CLOUD_TASK_LIST.PROPERTIES.NAME');
            expect(component.columns[2].title).toBe('ADF_CLOUD_TASK_LIST.PROPERTIES.ASSIGNEE');
        });

        it('should create datatable schema when a column visibility gets changed', () => {
            component.ngAfterContentInit();
            spyOn(component, 'createDatatableSchema');

            component.onColumnsVisibilityChange(component.columns);

            fixture.detectChanges();

            expect(component.createDatatableSchema).toHaveBeenCalled();
        });

        describe('component changes', () => {
            beforeEach(() => {
                component.rows = fakeGlobalTasks.list.entries;
                fixture.detectChanges();
            });

            it('should NOT reload the task list when no parameters changed', () => {
                component.rows = null;
                fixture.detectChanges();
                expect(component.isListEmpty()).toBeTruthy();
            });

            it('should set formattedSorting if sorting input changes', () => {
                getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));
                spyOn(component, 'formatSorting').and.callThrough();

                component.appName = 'mock-app-name';
                const mockSort = [
                    new TaskListCloudSortingModel({
                        orderBy: 'startDate',
                        direction: 'DESC'
                    })
                ];
                const sortChange = new SimpleChange(undefined, mockSort, true);
                component.ngOnChanges({
                    sorting: sortChange
                });
                fixture.detectChanges();
                expect(component.formatSorting).toHaveBeenCalledWith(mockSort);
                expect(component.formattedSorting).toEqual(['startDate', 'desc']);
            });

            it('should reset pagination when resetPaginationValues is called', (done) => {
                getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));

                const size = component.size;
                const skipCount = component.skipCount;
                component.pagination.pipe(skip(3)).subscribe((updatedPagination) => {
                    fixture.detectChanges();
                    expect(component.size).toBe(size);
                    expect(component.skipCount).toBe(skipCount);
                    expect(updatedPagination.maxItems).toEqual(size);
                    expect(updatedPagination.skipCount).toEqual(skipCount);
                    done();
                });

                const pagination = {
                    maxItems: 250,
                    skipCount: 200
                };
                component.updatePagination(pagination);

                component.resetPagination();
            });

            it('should set pagination and reload when updatePagination is called', (done) => {
                getTaskByRequestSpy.and.returnValue(of(fakeGlobalTasks));
                spyOn(component, 'reload').and.stub();

                const pagination = {
                    maxItems: 250,
                    skipCount: 200
                };
                component.pagination.pipe(skip(1)).subscribe((updatedPagination) => {
                    fixture.detectChanges();
                    expect(component.size).toBe(pagination.maxItems);
                    expect(component.skipCount).toBe(pagination.skipCount);
                    expect(updatedPagination.maxItems).toEqual(pagination.maxItems);
                    expect(updatedPagination.skipCount).toEqual(pagination.skipCount);
                    done();
                });

                component.updatePagination(pagination);
            });
        });
    });
});

describe('TaskListCloudComponent: Injecting custom colums for tasklist - CustomTaskListComponent', () => {
    let fixtureCustom: ComponentFixture<CustomTaskListComponent>;
    let componentCustom: CustomTaskListComponent;
    let customCopyComponent: CustomCopyContentTaskListComponent;
    let copyFixture: ComponentFixture<CustomCopyContentTaskListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, CustomTaskListComponent, CustomCopyContentTaskListComponent],
            providers: [provideCloudPreferences(), { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService }]
        });
        const taskListCloudService = TestBed.inject(TASK_LIST_CLOUD_TOKEN);
        spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(fakeGlobalTasks));
        spyOn(taskListCloudService, 'fetchTaskList').and.returnValue(of(fakeGlobalTasks));
        fixtureCustom = TestBed.createComponent(CustomTaskListComponent);
        copyFixture = TestBed.createComponent(CustomCopyContentTaskListComponent);
        fixtureCustom.detectChanges();
        componentCustom = fixtureCustom.componentInstance;
        customCopyComponent = copyFixture.componentInstance;
        customCopyComponent.taskList.isColumnSchemaCreated$ = of(true);
    });

    afterEach(() => {
        fixtureCustom.destroy();
        copyFixture.destroy();
    });

    it('should fetch custom schemaColumn from html', () => {
        copyFixture.detectChanges();
        expect(componentCustom.taskList.columnList).toBeDefined();
        expect(componentCustom.taskList.columns[0].key).toEqual('created');
        expect(componentCustom.taskList.columns[1].key).toEqual('startedBy');
        expect(componentCustom.taskList.columns[2].key).toEqual('name');
        expect(componentCustom.taskList.columns.length).toEqual(3);
    });

    it('it should show copy tooltip when key is present in data-column', () => {
        customCopyComponent.taskList.reload();
        copyFixture.detectChanges();

        copyFixture.debugElement.query(By.css('span[title="11fe013d-c263-11e8-b75b-0a5864600540"]')).triggerEventHandler('mouseenter');

        copyFixture.detectChanges();
        expect(copyFixture.debugElement.query(By.css('.adf-copy-tooltip'))).not.toBeNull();
    });

    it('it should not show copy tooltip when key is not present in data-column', () => {
        customCopyComponent.taskList.reload();
        copyFixture.detectChanges();

        copyFixture.debugElement.query(By.css('span[title="standalone-subtask"]')).triggerEventHandler('mouseenter');

        copyFixture.detectChanges();
        expect(copyFixture.debugElement.query(By.css('.adf-copy-tooltip'))).toBeNull();
    });
});

describe('TaskListCloudComponent: Creating an empty custom template - EmptyTemplateComponent', () => {
    let fixtureEmpty: ComponentFixture<EmptyTemplateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, EmptyTemplateComponent],
            providers: [provideCloudPreferences(), { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService }]
        });
        const taskListCloudService = TestBed.inject(TASK_LIST_CLOUD_TOKEN);
        const emptyList = { list: { entries: [] } };
        spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(emptyList));
        spyOn(taskListCloudService, 'fetchTaskList').and.returnValue(of(fakeGlobalTasks));

        fixtureEmpty = TestBed.createComponent(EmptyTemplateComponent);
        fixtureEmpty.detectChanges();
    });

    afterEach(() => {
        fixtureEmpty.destroy();
    });

    it('should render the custom template', async () => {
        fixtureEmpty.detectChanges();
        await fixtureEmpty.whenStable();
        fixtureEmpty.detectChanges();
        expect(fixtureEmpty.debugElement.query(By.css('#custom-id'))).not.toBeNull();
        expect(fixtureEmpty.debugElement.query(By.css('.adf-empty-content'))).toBeNull();
    });
});

describe('TaskListCloudComponent: Copy cell content directive from app.config specifications', () => {
    let getTaskByRequestSpy: jasmine.Spy;
    let fetchTaskListSpy: jasmine.Spy;
    let appConfig: AppConfigService;
    let component: TaskListCloudComponent;
    let fixture: ComponentFixture<TaskListCloudComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, TaskListCloudComponent],
            providers: [provideCloudPreferences(), { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService }]
        });
        appConfig = TestBed.inject(AppConfigService);
        const taskListCloudService = TestBed.inject(TASK_LIST_CLOUD_TOKEN);
        appConfig.config = Object.assign(appConfig.config, {
            'adf-cloud-task-list': {
                presets: {
                    fakeCustomSchema: [
                        {
                            key: 'id',
                            type: 'text',
                            title: 'ADF_CLOUD_TASK_LIST.PROPERTIES.FAKE',
                            sortable: true,
                            copyContent: true
                        },
                        {
                            key: 'name',
                            type: 'text',
                            title: 'ADF_CLOUD_TASK_LIST.PROPERTIES.TASK_FAKE',
                            sortable: true
                        },
                        {
                            key: 'priority',
                            type: 'text',
                            title: 'ADF_TASK_LIST.PROPERTIES.PRIORITY',
                            sortable: true
                        }
                    ]
                }
            }
        });
        fixture = TestBed.createComponent(TaskListCloudComponent);
        component = fixture.componentInstance;
        getTaskByRequestSpy = spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(fakeGlobalTasks));
        fetchTaskListSpy = spyOn(taskListCloudService, 'fetchTaskList').and.returnValue(of(fakeGlobalTasks));
        component.isColumnSchemaCreated$ = of(true);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show tooltip if config copyContent flag is true', () => {
        component.presetColumn = 'fakeCustomSchema';

        component.reload();
        fixture.detectChanges();

        const columnWithCopyContentFlagTrue = fixture.debugElement.query(By.css('span[title="11fe013d-c263-11e8-b75b-0a5864600540"]'));

        columnWithCopyContentFlagTrue.triggerEventHandler('mouseenter');

        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
    });

    it('should replace priority values', () => {
        component.presetColumn = 'fakeCustomSchema';

        component.reload();
        fixture.detectChanges();
        const cell = fixture.debugElement.query(By.css('[data-automation-id="text_ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NONE"]'));
        expect(cell.nativeElement.textContent).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NONE');
    });

    it('replacePriorityValues should return undefined when no rows defined', () => {
        const emptyList = { list: { entries: [] } };
        getTaskByRequestSpy.and.returnValue(of(emptyList));
        fetchTaskListSpy.and.returnValue(of(emptyList));
        fixture.detectChanges();

        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.ngOnChanges({ appName });
        fixture.detectChanges();

        const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
        expect(emptyContent.nativeElement).toBeDefined();
        expect(
            component.replacePriorityValues(
                {
                    obj: {},
                    isSelected: false,
                    hasValue: () => false,
                    getValue: () => undefined
                },
                {
                    type: 'text',
                    key: 'priority'
                }
            )
        ).toEqual(undefined);
    });

    it('replacePriorityValues should return replaced value when rows are defined', () => {
        fixture.detectChanges();

        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.ngOnChanges({ appName });
        fixture.detectChanges();

        expect(
            component.replacePriorityValues(
                {
                    obj: {
                        priority: 1
                    },
                    isSelected: false,
                    hasValue: () => false,
                    getValue: () => undefined
                },
                {
                    type: 'text',
                    key: 'priority'
                }
            )
        ).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.LOW');
    });
});
