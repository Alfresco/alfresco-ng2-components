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
    NoopAuthModule,
    DataColumnComponent,
    DataColumnListComponent,
    CustomEmptyContentTemplateDirective
} from '@alfresco/adf-core';
import { ServiceTaskListCloudComponent } from './service-task-list-cloud.component';
import { fakeServiceTask, fakeCustomSchema } from '../../mock/fake-task-response.mock';
import { of } from 'rxjs';
import { TaskListCloudSortingModel } from '../../../../models/task-list-sorting.model';
import { shareReplay, skip } from 'rxjs/operators';
import { ServiceTaskListCloudService } from '../../services/service-task-list-cloud.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { provideCloudPreferences } from '../../../../providers';

@Component({
    template: ` <adf-cloud-service-task-list #taskListCloud>
        <data-columns>
            <data-column key="activityName" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME" class="adf-full-width adf-name-column" [order]="2" />
            <data-column key="startedDate" title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED" class="adf-hidden" />
        </data-columns>
    </adf-cloud-service-task-list>`,
    standalone: true,
    imports: [ServiceTaskListCloudComponent, DataColumnComponent, DataColumnListComponent]
})
class CustomTaskListComponent {
    @ViewChild(ServiceTaskListCloudComponent)
    taskList: ServiceTaskListCloudComponent;
}

@Component({
    template: `
        <adf-cloud-service-task-list>
            <adf-custom-empty-content-template>
                <p id="custom-id"></p>
            </adf-custom-empty-content-template>
        </adf-cloud-service-task-list>
    `,
    standalone: true,
    imports: [CustomEmptyContentTemplateDirective, ServiceTaskListCloudComponent]
})
class EmptyTemplateComponent {}

@Component({
    template: ` <adf-cloud-service-task-list>
        <data-columns>
            <data-column [copyContent]="true" key="id" title="ADF_CLOUD_TASK_LIST.PROPERTIES.ID" />
            <data-column key="activityName" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME" />
        </data-columns>
    </adf-cloud-service-task-list>`,
    standalone: true,
    imports: [ServiceTaskListCloudComponent, DataColumnComponent, DataColumnListComponent]
})
class CustomCopyContentTaskListComponent {
    @ViewChild(ServiceTaskListCloudComponent, { static: true })
    taskList: ServiceTaskListCloudComponent;
}

describe('ServiceTaskListCloudComponent', () => {
    let loader: HarnessLoader;
    let component: ServiceTaskListCloudComponent;
    let fixture: ComponentFixture<ServiceTaskListCloudComponent>;
    let getServiceTaskByRequestSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, ServiceTaskListCloudComponent, EmptyTemplateComponent],
            providers: [provideCloudPreferences()]
        });

        const serviceTaskListCloudService = TestBed.inject(ServiceTaskListCloudService);
        getServiceTaskByRequestSpy = spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest');

        const appConfig = TestBed.inject(AppConfigService);
        appConfig.config = Object.assign(appConfig.config, {
            'adf-cloud-service-task-list': {
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

        fixture = TestBed.createComponent(ServiceTaskListCloudComponent);
        component = fixture.componentInstance;

        component.isColumnSchemaCreated$ = of(true).pipe(shareReplay(1));
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(3);
    });

    it('should display empty content when process list is empty', async () => {
        const emptyList = { list: { entries: [] } };
        getServiceTaskByRequestSpy.and.returnValue(of(emptyList));
        fixture.detectChanges();

        expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(false);

        const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
        expect(emptyContent.nativeElement).toBeDefined();
    });

    it('should load spinner and show the content', async () => {
        getServiceTaskByRequestSpy.and.returnValue(of(fakeServiceTask));
        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);

        fixture.detectChanges();
        component.ngOnChanges({ appName });
        fixture.detectChanges();

        expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(false);

        const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
        expect(emptyContent).toBeFalsy();

        expect(component.rows.length).toEqual(1);
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

    it('should reload tasks when reload() is called', (done) => {
        getServiceTaskByRequestSpy.and.returnValue(of(fakeServiceTask));
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(1);
            expect(component.rows[0]['appName']).toBe('simpleapp');
            expect(component.rows[0]['activityType']).toBe('serviceTask');
            expect(component.rows[0]['id']).toBe('04fdf69f-4ddd-48ab-9563-da776c9b163c');
            expect(component.rows[0]['elementId']).toBe('ServiceTask_0lszm0x');
            expect(component.rows[0]['executionId']).toBe('2023b099-fced-11ea-b116-62141048995a');
            expect(component.rows[0]['startedDate']).toBe('2020-09-22T16:03:37.444+0000');
            expect(component.rows[0]['completedDate']).toBe('2020-09-22T16:03:37.482+0000');
            expect(component.rows[0]['processDefinitionVersion']).toBe(1);
            expect(component.rows[0]['processDefinitionId']).toBe('Process_24rkVVSR:1:0db78dcd-fc14-11ea-bce0-62141048995a');
            expect(component.rows[0]['processInstanceId']).toBe('2023b097-fced-11ea-b116-62141048995a');
            expect(component.rows[0]['status']).toBe('COMPLETED');
            expect(component.rows[0]['serviceFullName']).toBe('simpleapp-rb');
            expect(component.rows[0]['serviceName']).toBe('simpleapp-rb');
            done();
        });

        component.reload();
        fixture.detectChanges();
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

    it('should create datatable schema when a column visibility gets changed', () => {
        component.ngAfterContentInit();
        spyOn(component, 'createDatatableSchema');

        component.onColumnsVisibilityChange(component.columns);

        fixture.detectChanges();

        expect(component.createDatatableSchema).toHaveBeenCalled();
    });

    it('should call endpoint when a column visibility gets changed', () => {
        const emptyList = { list: { entries: [] } };
        getServiceTaskByRequestSpy.and.returnValue(of(emptyList));
        component.ngAfterContentInit();
        spyOn(component, 'createDatatableSchema');
        component.appName = 'fake-app-name';
        component.reload();
        fixture.detectChanges();

        component.onColumnsVisibilityChange(component.columns);

        fixture.detectChanges();

        expect(getServiceTaskByRequestSpy).toHaveBeenCalledTimes(1);
    });

    describe('component changes', () => {
        beforeEach(() => {
            component.rows = fakeServiceTask.list.entries.map((task) => task.entry);
            fixture.detectChanges();
        });

        it('should NOT reload the task list when no parameters changed', () => {
            component.rows = null;
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeTruthy();
        });

        it('should reload the task list when input parameters changed', () => {
            getServiceTaskByRequestSpy.and.returnValue(of(fakeServiceTask));
            component.appName = 'mock-app-name';
            component.queryParams.status = 'mock-status';
            const queryParams = new SimpleChange(undefined, { status: 'mock-status' }, true);
            component.ngOnChanges({
                queryParams
            });
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeFalsy();
            expect(getServiceTaskByRequestSpy).toHaveBeenCalled();
        });

        it('should set formattedSorting if sorting input changes', () => {
            getServiceTaskByRequestSpy.and.returnValue(of(fakeServiceTask));
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

        it('should reload task list when sorting on a column changes', () => {
            getServiceTaskByRequestSpy.and.returnValue(of(fakeServiceTask));
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
            expect(getServiceTaskByRequestSpy).toHaveBeenCalled();
        });

        it('should reset pagination when resetPaginationValues is called', (done) => {
            getServiceTaskByRequestSpy.and.returnValue(of(fakeServiceTask));

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
            getServiceTaskByRequestSpy.and.returnValue(of(fakeServiceTask));
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

describe('ServiceTaskListCloudComponent: Injecting custom columns for task list - CustomTaskListComponent', () => {
    let fixtureCustom: ComponentFixture<CustomTaskListComponent>;
    let componentCustom: CustomTaskListComponent;
    let customCopyComponent: CustomCopyContentTaskListComponent;
    let copyFixture: ComponentFixture<CustomCopyContentTaskListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, CustomTaskListComponent, CustomCopyContentTaskListComponent],
            providers: [provideCloudPreferences()]
        });

        const serviceTaskListCloudService = TestBed.inject(ServiceTaskListCloudService);
        spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));

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
        fixtureCustom.detectChanges();
        expect(componentCustom.taskList.columnList).toBeDefined();
        expect(componentCustom.taskList.columns[0].key).toEqual('startedDate');
        expect(componentCustom.taskList.columns[1].key).toEqual('activityName');
        expect(componentCustom.taskList.columns.length).toEqual(2);
    });

    it('it should show copy tooltip when key is present in data-column', () => {
        customCopyComponent.taskList.reload();
        copyFixture.detectChanges();

        copyFixture.debugElement.query(By.css('span[title="04fdf69f-4ddd-48ab-9563-da776c9b163c"]')).triggerEventHandler('mouseenter');

        copyFixture.detectChanges();
        expect(copyFixture.debugElement.query(By.css('.adf-copy-tooltip'))).not.toBeNull();
    });

    it('it should not show copy tooltip when key is not present in data-column', () => {
        customCopyComponent.taskList.reload();
        copyFixture.detectChanges();

        copyFixture.debugElement.query(By.css('span[title="serviceTaskName"]')).triggerEventHandler('mouseenter');

        copyFixture.detectChanges();
        expect(copyFixture.debugElement.query(By.css('.adf-copy-tooltip'))).toBeNull();
    });
});

describe('ServiceTaskListCloudComponent: Copy cell content directive from app.config specifications', () => {
    let taskSpy: jasmine.Spy;
    let appConfig: AppConfigService;
    let fixture: ComponentFixture<ServiceTaskListCloudComponent>;
    let component: ServiceTaskListCloudComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, ServiceTaskListCloudComponent],
            providers: [provideCloudPreferences()]
        });

        const serviceTaskListCloudService = TestBed.inject(ServiceTaskListCloudService);
        taskSpy = spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));

        appConfig = TestBed.inject(AppConfigService);
        appConfig.config = Object.assign(appConfig.config, {
            'adf-cloud-service-task-list': {
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
                            key: 'activityName',
                            type: 'text',
                            title: 'ADF_CLOUD_TASK_LIST.PROPERTIES.TASK_FAKE',
                            sortable: true
                        }
                    ]
                }
            }
        });
        fixture = TestBed.createComponent(ServiceTaskListCloudComponent);
        component = fixture.componentInstance;
    });
    afterEach(() => {
        fixture.destroy();
    });

    it('shoud show tooltip if config copyContent flag is true', () => {
        taskSpy.and.returnValue(of(fakeServiceTask));
        component.presetColumn = 'fakeCustomSchema';

        component.reload();
        fixture.detectChanges();

        const columnWithCopyContentFlagTrue = fixture.debugElement.query(By.css('span[title="04fdf69f-4ddd-48ab-9563-da776c9b163c"]'));

        columnWithCopyContentFlagTrue.triggerEventHandler('mouseenter');

        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
    });

    it('shoud not show tooltip if config copyContent flag is NOT true', () => {
        taskSpy.and.returnValue(of(fakeServiceTask));
        component.presetColumn = 'fakeCustomSchema';

        component.reload();
        fixture.detectChanges();

        const columnWithCopyContentFlagNotTrue = fixture.debugElement.query(By.css('span[title="serviceTaskName"]'));

        columnWithCopyContentFlagNotTrue.triggerEventHandler('mouseenter');

        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).toBeNull();
    });
});
