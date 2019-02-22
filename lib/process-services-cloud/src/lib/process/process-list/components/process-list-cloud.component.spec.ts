/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService, setupTestBed, CoreModule, DataTableModule } from '@alfresco/adf-core';
import { DataRowEvent, ObjectDataRow } from '@alfresco/adf-core';
import { ProcessListCloudService } from '../services/process-list-cloud.service';
import { ProcessListCloudComponent } from './process-list-cloud.component';
import { fakeProcessCloudList, fakeCustomSchema } from '../mock/process-list-service.mock';
import { of } from 'rxjs';
import { ProcessListCloudTestingModule } from '../testing/process-list.testing.module';
import { ProcessListCloudModule } from '../process-list-cloud.module';

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

@Component({
    template: `
        <adf-cloud-process-list>
            <adf-custom-empty-content-template>
                <p id="custom-id">TEST</p>
            </adf-custom-empty-content-template>
        </adf-cloud-process-list>
    `
})

class EmptyTemplateComponent {
}

describe('ProcessListCloudComponent', () => {
    let component: ProcessListCloudComponent;
    let fixture: ComponentFixture<ProcessListCloudComponent>;
    let appConfig: AppConfigService;
    let processListCloudService: ProcessListCloudService;

    setupTestBed({
        imports: [
            ProcessListCloudTestingModule, ProcessListCloudModule
        ],
        providers: [ProcessListCloudService]
    });

    beforeEach(() => {
        appConfig = TestBed.get(AppConfigService);
        processListCloudService = TestBed.get(ProcessListCloudService);
        fixture = TestBed.createComponent(ProcessListCloudComponent);
        component = fixture.componentInstance;
        appConfig.config = Object.assign(appConfig.config, {
            'adf-cloud-process-list': {
                'presets': {
                    'fakeCustomSchema': [
                        {
                            'key': 'fakeName',
                            'type': 'text',
                            'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.FAKE',
                            'sortable': true
                        },
                        {
                            'key': 'fakeTaskName',
                            'type': 'text',
                            'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.TASK_FAKE',
                            'sortable': true
                        }
                    ]
                }
            }
        });
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(2);
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

    it('should return the results if an application name is given', (done) => {
        spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
        let appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.rows.length).toEqual(3);
            expect(component.rows[0].entry['appName']).toBe('easy-peasy-japanesey');
            expect(component.rows[0].entry['appVersion']).toBe('');
            expect(component.rows[0].entry['id']).toBe('69eddfa7-d781-11e8-ae24-0a58646001fa');
            expect(component.rows[0].entry['name']).toEqual('starring');
            expect(component.rows[0].entry['description']).toBeNull();
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
        component.ngOnChanges({ 'appName': appName });
        fixture.detectChanges();
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
        let row = new ObjectDataRow({
            entry: {
                id: '999'
            }
        });
        let rowEvent = new DataRowEvent(row, null);
        component.rowClick.subscribe((taskId) => {
            expect(taskId).toEqual('999');
            expect(component.getCurrentId()).toEqual('999');
            done();
        });
        component.onRowClick(rowEvent);
    });

    describe('component changes', () => {

        beforeEach(() => {
            component.rows = fakeProcessCloudList.list.entries;
            fixture.detectChanges();
        });

        it('should reload the task list when input parameters changed', () => {
            const getProcessByRequestSpy = spyOn(processListCloudService, 'getProcessByRequest').and.returnValue(of(fakeProcessCloudList));
            component.appName = 'mock-app-name';
            component.status = 'mock-status';
            component.initiator = 'mock-initiator';
            const appNameChange = new SimpleChange(undefined, 'mock-app-name', true);
            const statusChange = new SimpleChange(undefined, 'mock-status', true);
            const initiatorChange = new SimpleChange(undefined, 'mock-initiator', true);

            component.ngOnChanges({
                'appName': appNameChange,
                'assignee': initiatorChange,
                'status': statusChange
            });
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeFalsy();
            expect(getProcessByRequestSpy).toHaveBeenCalled();
        });
    });

    describe('Injecting custom colums for tasklist - CustomTaskListComponent', () => {

        let fixtureCustom: ComponentFixture<CustomTaskListComponent>;
        let componentCustom: CustomTaskListComponent;

        setupTestBed({
            imports: [CoreModule.forRoot()],
            declarations: [ProcessListCloudComponent, CustomTaskListComponent],
            providers: [ProcessListCloudService]
        });

        beforeEach(() => {
            fixtureCustom = TestBed.createComponent(CustomTaskListComponent);
            fixtureCustom.detectChanges();
            componentCustom = fixtureCustom.componentInstance;
        });

        afterEach(() => {
            fixtureCustom.destroy();
        });

        it('should create instance of CustomTaskListComponent', () => {
            expect(componentCustom instanceof CustomTaskListComponent).toBe(true, 'should create CustomTaskListComponent');
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

        let fixtureEmpty: ComponentFixture<EmptyTemplateComponent>;

        setupTestBed({
            imports: [ProcessListCloudModule, ProcessListCloudTestingModule, DataTableModule],
            declarations: [EmptyTemplateComponent]
        });

        beforeEach(() => {
            fixtureEmpty = TestBed.createComponent(EmptyTemplateComponent);
            fixtureEmpty.detectChanges();
        });

        afterEach(() => {
            fixtureEmpty.destroy();
        });

        it('should render the custom template', async(() => {
            fixtureEmpty.whenStable().then(() => {
                fixtureEmpty.detectChanges();
                expect(fixtureEmpty.debugElement.query(By.css('#custom-id'))).not.toBeNull();
                expect(fixtureEmpty.debugElement.query(By.css('.adf-empty-content'))).toBeNull();
            });
        }));
    });
});
