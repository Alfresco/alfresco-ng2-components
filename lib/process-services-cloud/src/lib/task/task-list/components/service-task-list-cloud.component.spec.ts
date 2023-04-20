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

import { Component, SimpleChange, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService, setupTestBed, DataRowEvent, ObjectDataRow, User } from '@alfresco/adf-core';
import { ServiceTaskListCloudComponent } from './service-task-list-cloud.component';
import { fakeServiceTask, fakeCustomSchema } from '../mock/fake-task-response.mock';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TaskListCloudSortingModel } from '../../../models/task-list-sorting.model';
import { shareReplay, skip } from 'rxjs/operators';
import { ServiceTaskListCloudService } from '../services/service-task-list-cloud.service';

@Component({
    template: `
    <adf-cloud-service-task-list #taskListCloud>
        <data-columns>
            <data-column key="activityName" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME" class="adf-full-width adf-name-column"></data-column>
            <data-column key="startedDate" title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED" class="adf-hidden"></data-column>
        </data-columns>
    </adf-cloud-service-task-list>`
})
class CustomTaskListComponent {
    @ViewChild(ServiceTaskListCloudComponent)
    taskList: ServiceTaskListCloudComponent;

    getFullName(person: User): string {
        return `${person.firstName} ${person.lastName}`;
    }
}
@Component({
    template: `
    <adf-cloud-service-task-list>
        <adf-custom-empty-content-template>
            <p id="custom-id"></p>
        </adf-custom-empty-content-template>
    </adf-cloud-service-task-list>
       `
})
class EmptyTemplateComponent {
}
@Component({
    template: `
    <adf-cloud-service-task-list>
        <data-columns>
            <data-column [copyContent]="true" key="id" title="ADF_CLOUD_TASK_LIST.PROPERTIES.ID"></data-column>
            <data-column key="activityName" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME"></data-column>
        </data-columns>
    </adf-cloud-service-task-list>`
})
class CustomCopyContentTaskListComponent {
    @ViewChild(ServiceTaskListCloudComponent, { static: true })
    taskList: ServiceTaskListCloudComponent;
}

describe('ServiceTaskListCloudComponent', () => {
    let component: ServiceTaskListCloudComponent;
    let fixture: ComponentFixture<ServiceTaskListCloudComponent>;
    let appConfig: AppConfigService;
    let serviceTaskListCloudService: ServiceTaskListCloudService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        declarations: [
            EmptyTemplateComponent
        ]
    });

    beforeEach(() => {
        appConfig = TestBed.inject(AppConfigService);
        serviceTaskListCloudService = TestBed.inject(ServiceTaskListCloudService);
        fixture = TestBed.createComponent(ServiceTaskListCloudComponent);
        component = fixture.componentInstance;
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

        component.isColumnSchemaCreated$ = of(true).pipe(shareReplay(1));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(3);
    });

    it('should display empty content when process list is empty', () => {
        const emptyList = { list: { entries: [] } };
        spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(emptyList));

        fixture.detectChanges();
        expect(component.isLoading).toBe(false);

        const loadingContent = fixture.debugElement.query(By.css('mat-progress-spinner'));
        expect(loadingContent).toBeFalsy();

        const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
        expect(emptyContent.nativeElement).toBeDefined();
    });

    it('should load spinner and show the content', () => {
        spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);

        fixture.detectChanges();
        expect(component.isLoading).toBe(false);

        component.ngOnChanges({ appName });
        fixture.detectChanges();

        expect(component.isLoading).toBe(false);
        const loadingContent = fixture.debugElement.query(By.css('mat-progress-spinner'));
        expect(loadingContent).toBeFalsy();

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

    it('should return the results if an application name is given', (done) => {
        spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
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
        component.appName = appName.currentValue;
        component.ngOnChanges({ appName });
        fixture.detectChanges();
    });

    it('should reload tasks when reload() is called', (done) => {
        component.appName = 'fake';
        spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            done();
        });
        fixture.detectChanges();
        component.reload();
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

    describe('component changes', () => {

        beforeEach(() => {
            component.rows = fakeServiceTask.list.entries;
            fixture.detectChanges();
        });

        it('should NOT reload the task list when no parameters changed', () => {
            spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest');
            component.rows = null;
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeTruthy();
        });

        it('should reload the task list when input parameters changed', () => {
            const getServiceTaskByRequestSpy = spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
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
            spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
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
            const getServiceTaskByRequestSpy = spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
            component.onSortingChanged(new CustomEvent('sorting-changed', {
                detail: {
                    key: 'fakeName',
                    direction: 'asc'
                },
                bubbles: true
            }));
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
            spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));

            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            component.ngOnChanges({ appName });
            fixture.detectChanges();

            const size = component.size;
            const skipCount = component.skipCount;
            component.pagination.pipe(skip(3))
                .subscribe((updatedPagination) => {
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
            fixture.whenStable().then( () => {
                component.resetPagination();
            });
        });

        it('should set pagination and reload when updatePagination is called', (done) => {
            spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
            spyOn(component, 'reload').and.stub();
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            component.ngOnChanges({ appName });
            fixture.detectChanges();

            const pagination = {
                maxItems: 250,
                skipCount: 200
            };
            component.pagination.pipe(skip(1))
                .subscribe((updatedPagination) => {
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

    describe('Injecting custom colums for tasklist - CustomTaskListComponent', () => {
        let fixtureCustom: ComponentFixture<CustomTaskListComponent>;
        let componentCustom: CustomTaskListComponent;
        let customCopyComponent: CustomCopyContentTaskListComponent;
        let element: HTMLElement;
        let copyFixture: ComponentFixture<CustomCopyContentTaskListComponent>;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                ProcessServiceCloudTestingModule
            ],
            declarations: [
                CustomTaskListComponent,
                CustomCopyContentTaskListComponent
            ]
        });

        beforeEach(() => {
            spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));
            fixtureCustom = TestBed.createComponent(CustomTaskListComponent);
            copyFixture = TestBed.createComponent(CustomCopyContentTaskListComponent);
            fixtureCustom.detectChanges();
            componentCustom = fixtureCustom.componentInstance;
            customCopyComponent = copyFixture.componentInstance;
            element = copyFixture.debugElement.nativeElement;

            customCopyComponent.taskList.isColumnSchemaCreated$ = of(true);
        });

        afterEach(() => {
            fixtureCustom.destroy();
            copyFixture.destroy();
        });

        it('should fetch custom schemaColumn from html', () => {
            fixture.detectChanges();
            expect(componentCustom.taskList.columnList).toBeDefined();
            expect(componentCustom.taskList.columns[0]['title']).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.NAME');
            expect(componentCustom.taskList.columns[1]['title']).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED');
            expect(componentCustom.taskList.columns.length).toEqual(2);
        });

        it('it should show copy tooltip when key is present in data-colunn', fakeAsync(() => {
            copyFixture.detectChanges();
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            copyFixture.whenStable().then(() => {
                copyFixture.detectChanges();
                const spanHTMLElement = element.querySelector<HTMLInputElement>('span[title="04fdf69f-4ddd-48ab-9563-da776c9b163c"]');
                spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                copyFixture.detectChanges();
                expect(copyFixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
            });
            customCopyComponent.taskList.appName = appName.currentValue;
            customCopyComponent.taskList.ngOnChanges({ appName });
            copyFixture.detectChanges();
        }));

        it('it should not show copy tooltip when key is not present in data-column', (done) => {
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            customCopyComponent.taskList.success.subscribe(() => {
                copyFixture.whenStable().then(() => {
                    copyFixture.detectChanges();
                    const spanHTMLElement = element.querySelector<HTMLInputElement>('span[title="serviceTaskName"]');
                    spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                    copyFixture.detectChanges();
                    expect(copyFixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).toBeNull();
                    done();
                });
            });
            customCopyComponent.taskList.appName = appName.currentValue;
            customCopyComponent.taskList.ngOnChanges({ appName });
            copyFixture.detectChanges();
        });
    });

    describe('Copy cell content directive from app.config specifications', () => {

        let element: HTMLElement;
        let taskSpy: jasmine.Spy;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                ProcessServiceCloudTestingModule
            ]
        });

        beforeEach(() => {
            appConfig = TestBed.inject(AppConfigService);
            serviceTaskListCloudService = TestBed.inject(ServiceTaskListCloudService);
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
            element = fixture.debugElement.nativeElement;
            taskSpy = spyOn(serviceTaskListCloudService, 'getServiceTaskByRequest').and.returnValue(of(fakeServiceTask));

        });
        afterEach(() => {
            fixture.destroy();
        });

        it('shoud show tooltip if config copyContent flag is true', fakeAsync(() => {
            taskSpy.and.returnValue(of(fakeServiceTask));
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);

            component.success.subscribe(() => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const spanHTMLElement = element.querySelector<HTMLInputElement>('span[title="04fdf69f-4ddd-48ab-9563-da776c9b163c"]');
                    spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
                });
            });

            component.presetColumn = 'fakeCustomSchema';
            component.appName = appName.currentValue;
            component.ngOnChanges({ appName });
            component.ngAfterContentInit();
        }));

        it('shoud not show tooltip if config copyContent flag is true', fakeAsync(() => {
            taskSpy.and.returnValue(of(fakeServiceTask));
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            component.success.subscribe(() => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const spanHTMLElement = element.querySelector<HTMLInputElement>('span[title="serviceTaskName"]');
                    spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).toBeNull();
                });
            });
            component.presetColumn = 'fakeCustomSchema';
            component.appName = appName.currentValue;
            component.ngOnChanges({ appName });
            component.ngAfterContentInit();
        }));
    });
});
