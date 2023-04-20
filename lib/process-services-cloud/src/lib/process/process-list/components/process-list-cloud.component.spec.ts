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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    AppConfigService,
    ColumnsSelectorComponent,
    CustomEmptyContentTemplateDirective,
    DataColumn,
    DataRowEvent,
    DataTableModule,
    getDataColumnMock,
    ObjectDataRow,
    setupTestBed
} from '@alfresco/adf-core';
import { ProcessListCloudService } from '../services/process-list-cloud.service';
import { ProcessListCloudComponent } from './process-list-cloud.component';
import { fakeCustomSchema, fakeProcessCloudList, processListSchemaMock } from '../mock/process-list-service.mock';
import { of } from 'rxjs';
import { shareReplay, skip } from 'rxjs/operators';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessListCloudSortingModel } from '../models/process-list-sorting.model';
import { PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { ProcessListCloudPreferences } from '../models/process-cloud-preferences';
import { PROCESS_LIST_CUSTOM_VARIABLE_COLUMN } from '../../../models/data-column-custom-data';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreferenceCloudServiceInterface } from '@alfresco/adf-process-services-cloud';

@Component({
    template: `
    <adf-cloud-process-list #processListCloud>
        <data-columns>
            <data-column key="name" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME" class="adf-full-width adf-name-column"></data-column>
            <data-column key="created" title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED" class="adf-hidden"></data-column>
            <data-column key="startedBy" title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED" class="adf-desktop-only dw-dt-col-3 adf-ellipsis-cell">
                <ng-template let-entry="$implicit">
                    <div>{{getFullName(entry.row.obj.startedBy)}}</div>
                </ng-template>
            </data-column>
        </data-columns>
    </adf-cloud-process-list>`
})
class CustomTaskListComponent {
    @ViewChild(ProcessListCloudComponent)
    processListCloud: ProcessListCloudComponent;
}

describe('ProcessListCloudComponent', () => {
    let component: ProcessListCloudComponent;
    let fixture: ComponentFixture<ProcessListCloudComponent>;
    let appConfig: AppConfigService;
    let processListCloudService: ProcessListCloudService;
    let preferencesService: PreferenceCloudServiceInterface;
    const fakeCustomSchemaName = 'fakeCustomSchema';
    const schemaWithVariable = 'schemaWithVariableId';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        appConfig = TestBed.inject(AppConfigService);
        processListCloudService = TestBed.inject(ProcessListCloudService);
        preferencesService = TestBed.inject<PreferenceCloudServiceInterface>(PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN);
        fixture = TestBed.createComponent(ProcessListCloudComponent);
        component = fixture.componentInstance;
        appConfig.config = Object.assign(appConfig.config, {
            'adf-cloud-process-list': {
                presets: {
                    [fakeCustomSchemaName]: [
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
                    ],
                    [schemaWithVariable]: [
                        getDataColumnMock(),
                        getDataColumnMock({
                            id: 'variableColumnId',
                            customData: {
                                variableDefinitionsPayload: ['processKey/variableName'],
                                assignedVariableDefinitionIds: ['variableDefinitionId'],
                                columnType: PROCESS_LIST_CUSTOM_VARIABLE_COLUMN
                            }
                        })
                    ]
                }
            }
        });

        component.isColumnSchemaCreated$ = of(true).pipe(shareReplay(1));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should use the default schemaColumn', () => {
        appConfig.config = Object.assign(appConfig.config, { 'adf-cloud-process-list': processListSchemaMock });
        fixture.detectChanges();

        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(10);
    });

    it('should display empty content when process list is empty', () => {
        const emptyList = {list: {entries: []}};
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(emptyList));

        fixture.detectChanges();
        expect(component.isLoading).toBe(true);
        let loadingContent = fixture.debugElement.query(By.css('mat-progress-spinner'));
        expect(loadingContent.nativeElement).toBeDefined();

        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.ngOnChanges({ appName });
        fixture.detectChanges();

        loadingContent = fixture.debugElement.query(By.css('mat-progress-spinner'));
        expect(loadingContent).toBeFalsy();

        const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
        expect(emptyContent.nativeElement).toBeDefined();
    });

    it('should load spinner and show the content', () => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);

        fixture.detectChanges();
        expect(component.isLoading).toBe(true);
        let loadingContent = fixture.debugElement.query(By.css('mat-progress-spinner'));
        expect(loadingContent.nativeElement).toBeDefined();

        component.ngOnChanges({ appName });
        fixture.detectChanges();

        expect(component.isLoading).toBe(false);
        loadingContent = fixture.debugElement.query(By.css('mat-progress-spinner'));
        expect(loadingContent).toBeFalsy();

        const emptyContent = fixture.debugElement.query(By.css('.adf-empty-content'));
        expect(emptyContent).toBeFalsy();

        expect(component.rows.length).toEqual(3);
    });

    it('should the payload contain the appVersion if it is defined', () => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        component.appVersion = 1;
        component.ngAfterContentInit();
        component.reload();

        expect(component.requestNode.appVersion).toEqual('1');
    });

    it('should the payload contain all the app versions joined by a comma separator', () => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        component.appVersion = [1, 2, 3];
        component.ngAfterContentInit();
        component.reload();

        expect(component.requestNode.appVersion).toEqual('1,2,3');
    });

    it('should the payload NOT contain any app version when appVersion does not have a value', () => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        component.appVersion = undefined;
        component.ngAfterContentInit();
        component.reload();

        expect(component.requestNode.appVersion).toEqual('');
    });

    it('should use the custom schemaColumn from app.config.json', () => {
        component.presetColumn = fakeCustomSchemaName;
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.columns).toEqual(fakeCustomSchema);
    });

    it('should fetch custom schemaColumn when the input presetColumn is defined', () => {
        component.presetColumn = fakeCustomSchemaName;
        fixture.detectChanges();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(2);
    });

    it('should return the results if an application name is given', (done) => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.rows.length).toEqual(3);
            expect(component.rows[0].entry['appName']).toBe('easy-peasy-japanesey');
            expect(component.rows[0].entry['appVersion']).toBe(1);
            expect(component.rows[0].entry['id']).toBe('69eddfa7-d781-11e8-ae24-0a58646001fa');
            expect(component.rows[0].entry['name']).toEqual('starring');
            expect(component.rows[0].entry['processDefinitionId']).toBe('BasicProcess:1:d05062f1-c6fb-11e8-ae24-0a58646001fa');
            expect(component.rows[0].entry['processDefinitionKey']).toBe('BasicProcess');
            expect(component.rows[0].entry['initiator']).toBe('devopsuser');
            expect(component.rows[0].entry['startDate']).toBe(1540381146275);
            expect(component.rows[0].entry['businessKey']).toBe('MyBusinessKey');
            expect(component.rows[0].entry['status']).toBe('RUNNING');
            expect(component.rows[0].entry['lastModified']).toBe(1540381146276);
            expect(component.rows[0].entry['lastModifiedTo']).toBeNull();
            expect(component.rows[0].entry['lastModifiedFrom']).toBeNull();

            done();
        });
        component.appName = appName.currentValue;
        component.ngAfterContentInit();
        component.ngOnChanges({ appName });
        fixture.detectChanges();
    });

    it('should not shown columns selector by default', () => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));

        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.ngOnChanges({ appName });

        fixture.detectChanges();

        const mainMenuButton = fixture.debugElement.query(By.css('[data-automation-id="adf-datatable-main-menu-button"]'));
        expect(mainMenuButton).toBeFalsy();
    });

    it('should shown columns selector', () => {
        component.showMainDatatableActions = true;
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));

        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.ngAfterContentInit();
        component.ngOnChanges({ appName });

        fixture.detectChanges();

        const mainMenuButton = fixture.debugElement.query(By.css('[data-automation-id="adf-datatable-main-menu-button"]'));
        expect(mainMenuButton).toBeTruthy();
    });

    it('should hide columns on applying new columns visibility through columns selector', () => {
        component.showMainDatatableActions = true;
        fixture.detectChanges();

        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));

        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.ngOnChanges({ appName });

        fixture.detectChanges();

        const mainMenuButton = fixture.debugElement.query(By.css('[data-automation-id="adf-datatable-main-menu-button"]'));
        mainMenuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        const columnSelectorMenu = fixture.debugElement.query(By.css('adf-datatable-column-selector'));
        expect(columnSelectorMenu).toBeTruthy();

        const newColumns = (component.columns as DataColumn[]).map((column, index) => ({
            ...column,
            isHidden: index !== 0 // only first one is shown
        }));

        const columnsSelectorInstance = columnSelectorMenu.componentInstance as ColumnsSelectorComponent;
        expect(columnsSelectorInstance.columns).toBe(component.columns, 'should use columns as input');

        columnSelectorMenu.triggerEventHandler('submitColumnsVisibility', newColumns);
        fixture.detectChanges();

        const displayedColumns = fixture.debugElement.queryAll(By.css('.adf-datatable-cell-header'));
        expect(displayedColumns.length).toBe(2, 'only column with isHidden set to false and action column should be shown');
    });

    it('should NOT request process variable if columns for process variables are not displayed', () => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        spyOn(preferencesService, 'getPreferences').and.returnValue(of({
            list: {
                entries: []
            }
        }));

        component.ngAfterContentInit();
        component.reload();

        expect(component.requestNode.variableKeys).not.toBeDefined();
    });

    it('should request process variable if column for process variable is displayed', () => {
        component.presetColumn = schemaWithVariable;

        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        spyOn(preferencesService, 'getPreferences').and.returnValue(of({
            list: {
                entries: [{
                    entry: {
                        key: ProcessListCloudPreferences.columnsVisibility,
                        value: '{"variableColumnId":"id", "2":true}'
                    }
                }]
            }
        }));

        component.ngAfterContentInit();
        component.reload();

        expect(component.requestNode.variableKeys).toEqual(['processKey/variableName']);
    });

    it('should reload tasks when reload() is called', (done) => {
        component.appName = 'fake';
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
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
            expect(component.getCurrentId()).toEqual('999');
            done();
        });
        component.onRowClick(rowEvent);
    });

    it('should re-create columns when a column width gets changed', () => {
        component.isResizingEnabled = true;
        component.appName = 'FAKE-APP-NAME';
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));

        fixture.detectChanges();
        component.reload();
        fixture.detectChanges();

        const newColumns = [...component.columns];
        newColumns[0].width = 120;
        component.onColumnsWidthChanged(newColumns);

        expect(component.columns[0].width).toBe(120);
    });

    it('should update columns widths when a column width gets changed', () => {
        spyOn(preferencesService, 'updatePreference').and.returnValue(of({}));
        component.appName = 'fake-app-name';
        component.reload();
        fixture.detectChanges();

        const newColumns = [...component.columns];
        newColumns[0].width = 120;
        component.onColumnsWidthChanged(newColumns);

        expect(component.columns[0].width).toBe(120);
        expect(preferencesService.updatePreference).toHaveBeenCalledWith('fake-app-name', 'processes-cloud-columns-widths', {
            id: 120
        });
    });

    it('should update columns widths while preserving previously saved widths when a column width gets changed', () => {
        spyOn(preferencesService, 'updatePreference').and.returnValue(of({}));
        component.appName = 'fake-app-name';
        component.reload();
        fixture.detectChanges();

        const newColumns = [...component.columns];
        newColumns[0].width = 120;
        component.onColumnsWidthChanged(newColumns);

        expect(component.columns[0].width).toBe(120);
        expect(preferencesService.updatePreference).toHaveBeenCalledWith('fake-app-name', 'processes-cloud-columns-widths', {
            id: 120
        });

        newColumns[1].width = 150;
        component.onColumnsWidthChanged(newColumns);

        expect(component.columns[0].width).toBe(120);
        expect(component.columns[1].width).toBe(150);
        expect(preferencesService.updatePreference).toHaveBeenCalledWith('fake-app-name', 'processes-cloud-columns-widths', {
            id: 120,
            startDate: 150
        });
    });

    it('should re-create columns when a column order gets changed', () => {
        component.appName = 'FAKE-APP-NAME';

        fixture.detectChanges();
        component.reload();
        fixture.detectChanges();

        expect(component.columns[0].title).toBe('ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME');
        expect(component.columns[1].title).toBe('ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE');

        component.onColumnOrderChanged([component.columns[1], ...component.columns]);
        fixture.detectChanges();

        expect(component.columns[0].title).toBe('ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE');
        expect(component.columns[1].title).toBe('ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME');
    });

    describe('component changes', () => {

        beforeEach(() => {
            component.rows = fakeProcessCloudList.list.entries;
            fixture.detectChanges();
        });

        it('should reload the process list when input parameters changed', () => {
            const getProcessByRequestSpy = spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
            component.appName = 'mock-app-name';
            component.status = 'mock-status';
            component.initiator = 'mock-initiator';
            const appNameChange = new SimpleChange(undefined, 'mock-app-name', true);
            const statusChange = new SimpleChange(undefined, 'mock-status', true);
            const initiatorChange = new SimpleChange(undefined, 'mock-initiator', true);

            component.ngOnChanges({
                appName: appNameChange,
                assignee: initiatorChange,
                status: statusChange
            });
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeFalsy();
            expect(getProcessByRequestSpy).toHaveBeenCalled();
        });

        it('should set formattedSorting if sorting input changes', () => {
            spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
            spyOn(component, 'formatSorting').and.callThrough();

            component.appName = 'mock-app-name';
            const mockSort = [
                new ProcessListCloudSortingModel({
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

        it('should reload process list when sorting on a column changes', () => {
            const getProcessByRequestSpy = spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
            component.onSortingChanged(new CustomEvent('sorting-changed', {
                detail: {
                    key: 'fakeName',
                    direction: 'asc'
                },
                bubbles: true
            }));
            fixture.detectChanges();
            expect(component.sorting).toEqual([
                new ProcessListCloudSortingModel({
                    orderBy: 'fakeName',
                    direction: 'ASC'
                })
            ]);
            expect(component.formattedSorting).toEqual(['fakeName', 'asc']);
            expect(component.isListEmpty()).toBeFalsy();
            expect(getProcessByRequestSpy).toHaveBeenCalled();
        });

        it('should reset pagination when resetPaginationValues is called', (done) => {
            spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));

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
            spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
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

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                ProcessServiceCloudTestingModule
            ],
            declarations: [CustomTaskListComponent]
        });

        beforeEach(() => {
            fixtureCustom = TestBed.createComponent(CustomTaskListComponent);
            fixtureCustom.detectChanges();
            componentCustom = fixtureCustom.componentInstance;
        });

        afterEach(() => {
            fixtureCustom.destroy();
        });

        it('should fetch custom schemaColumn from html', () => {
            fixture.detectChanges();
            expect(componentCustom.processListCloud.columnList).toBeDefined();
            expect(componentCustom.processListCloud.columns[0]['title']).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.NAME');
            expect(componentCustom.processListCloud.columns[1]['title']).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED');
            expect(componentCustom.processListCloud.columns.length).toEqual(3);
        });
    });

    describe('Creating an empty custom template - EmptyTemplateComponent', () => {

        @Component({
            template: `
                 <adf-cloud-process-list #processListCloud>
                     <adf-custom-empty-content-template>
                         <p id="custom-id">TEST</p>
                     </adf-custom-empty-content-template>
                 </adf-cloud-process-list>
            `
        })

        class EmptyTemplateComponent {
            @ViewChild(ProcessListCloudComponent)
            processListCloud: ProcessListCloudComponent;
        }

        let fixtureEmpty: ComponentFixture<EmptyTemplateComponent>;
        preferencesService = jasmine.createSpyObj('preferencesService', {
            getPreferences: of({}),
            updatePreference: of({})
        });

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                HttpClientModule,
                NoopAnimationsModule,
                DataTableModule,
                MatProgressSpinnerModule
            ],
            providers: [{ provide: PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN, useValue: preferencesService }],
            declarations: [EmptyTemplateComponent, ProcessListCloudComponent, CustomEmptyContentTemplateDirective]
        });

        beforeEach(() => {
            fixtureEmpty = TestBed.createComponent(EmptyTemplateComponent);
            fixtureEmpty.detectChanges();
        });

        afterEach(() => {
            fixtureEmpty.destroy();
        });

        it('should render the custom template', async () => {
            const emptyList = {list: {entries: []}};
            spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(emptyList));
            fixtureEmpty.componentInstance.processListCloud.isLoading = false;
            fixtureEmpty.detectChanges();
            await fixtureEmpty.whenStable();

            expect(fixtureEmpty.debugElement.query(By.css('#custom-id'))).not.toBeNull();
            expect(fixtureEmpty.debugElement.query(By.css('.adf-empty-content'))).toBeNull();

        });
    });
});
