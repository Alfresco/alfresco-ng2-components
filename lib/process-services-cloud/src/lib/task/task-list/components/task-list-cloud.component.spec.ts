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

import { Component, SimpleChange, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { DataRowEvent, ObjectDataRow } from '@alfresco/adf-core';
import { TaskListCloudService } from '../services/task-list-cloud.service';
import { TaskListCloudComponent } from './task-list-cloud.component';
import { fakeGlobalTask, fakeCustomSchema } from '../mock/fakeTaskResponseMock';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskListCloudModule } from '../task-list-cloud.module';

@Component({
    template: `
    <adf-cloud-task-list #taskListCloud>
        <data-columns>
            <data-column key="name" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME" class="adf-full-width adf-name-column"></data-column>
            <data-column key="created" title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED" class="adf-hidden"></data-column>
            <data-column key="startedBy" title="ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED" class="adf-desktop-only dw-dt-col-3 adf-ellipsis-cell">
                <ng-template let-entry="$implicit">
                    <div>{{getFullName(entry.row.obj.startedBy)}}</div>
                </ng-template>
            </data-column>
        </data-columns>
    </adf-cloud-task-list>`
})
class CustomTaskListComponent {
    @ViewChild(TaskListCloudComponent)
    taskList: TaskListCloudComponent;
}
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
@Component({
    template: `
    <adf-cloud-task-list #taskListCloudCopy>
        <data-columns>
            <data-column [copyContent]="true" key="entry.id" title="ADF_CLOUD_TASK_LIST.PROPERTIES.ID"></data-column>
            <data-column key="entry.name" title="ADF_CLOUD_TASK_LIST.PROPERTIES.NAME"></data-column>
        </data-columns>
    </adf-cloud-task-list>`
})
class CustomCopyContentTaskListComponent {
    @ViewChild(TaskListCloudComponent)
    taskList: TaskListCloudComponent;
}

describe('TaskListCloudComponent', () => {
    let component: TaskListCloudComponent;
    let fixture: ComponentFixture<TaskListCloudComponent>;
    let appConfig: AppConfigService;
    let taskListCloudService: TaskListCloudService;

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule, TaskListCloudModule
        ],
        providers: [TaskListCloudService]
    });

    beforeEach(() => {
        appConfig = TestBed.get(AppConfigService);
        taskListCloudService = TestBed.get(TaskListCloudService);
        fixture = TestBed.createComponent(TaskListCloudComponent);
        component = fixture.componentInstance;
        appConfig.config = Object.assign(appConfig.config, {
            'adf-cloud-task-list': {
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
        expect(component.columns.length).toEqual(3);
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
        spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(fakeGlobalTask));
        const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(1);
            expect(component.rows[0].entry['appName']).toBe('test-ciprian2');
            expect(component.rows[0].entry['appVersion']).toBe('');
            expect(component.rows[0].entry['id']).toBe('11fe013d-c263-11e8-b75b-0a5864600540');
            expect(component.rows[0].entry['assignee']).toBeNull();
            expect(component.rows[0].entry['name']).toEqual('standalone-subtask');
            expect(component.rows[0].entry['description']).toBeNull();
            expect(component.rows[0].entry['createdDate']).toBe(1538059139420);
            expect(component.rows[0].entry['dueDate']).toBeNull();
            expect(component.rows[0].entry['claimedDate']).toBeNull();
            expect(component.rows[0].entry['priority']).toBe(0);
            expect(component.rows[0].entry['category']).toBeNull();
            expect(component.rows[0].entry['processDefinitionId']).toBeNull();
            expect(component.rows[0].entry['processInstanceId']).toBeNull();
            expect(component.rows[0].entry['status']).toBe('CREATED');
            expect(component.rows[0].entry['owner']).toBe('devopsuser');
            expect(component.rows[0].entry['parentTaskId']).toBe('71fda20b-c25b-11e8-b75b-0a5864600540');
            expect(component.rows[0].entry['lastModified']).toBe(1538059139420);
            expect(component.rows[0].entry['lastModifiedTo']).toBeNull();
            expect(component.rows[0].entry['lastModifiedFrom']).toBeNull();
            expect(component.rows[0].entry['standalone']).toBeTruthy();
            done();
        });
        component.appName = appName.currentValue;
        component.ngOnChanges({ 'appName': appName });
        fixture.detectChanges();
    });

    it('should reload tasks when reload() is called', (done) => {
        component.appName = 'fake';
        spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(fakeGlobalTask));
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
        const row = new ObjectDataRow({
            entry: {
                id: '999'
            }
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
            component.rows = fakeGlobalTask.list.entries;
            fixture.detectChanges();
        });

        it('should NOT reload the task list when no parameters changed', () => {
            component.rows = null;
            component.ngOnChanges({});
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeTruthy();
        });

        it('should reload the task list when input parameters changed', () => {
            const getTaskByRequestSpy = spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(fakeGlobalTask));
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
                'priority': priorityChange,
                'status': statusChange,
                'lastModifiedFrom': lastModifiedFromChange,
                'owner': ownerChange
            });
            fixture.detectChanges();
            expect(component.isListEmpty()).toBeFalsy();
            expect(getTaskByRequestSpy).toHaveBeenCalled();
        });
    });

    describe('Injecting custom colums for tasklist - CustomTaskListComponent', () => {
        let fixtureCustom: ComponentFixture<CustomTaskListComponent>;
        let componentCustom: CustomTaskListComponent;
        let customCopyComponent: CustomCopyContentTaskListComponent;
        let element: any;
        let copyFixture: ComponentFixture<CustomCopyContentTaskListComponent>;

        setupTestBed({
            imports: [CoreModule.forRoot()],
            declarations: [TaskListCloudComponent, CustomTaskListComponent, CustomCopyContentTaskListComponent],
            providers: [TaskListCloudService]
        });

        beforeEach(() => {
            spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(fakeGlobalTask));
            fixtureCustom = TestBed.createComponent(CustomTaskListComponent);
            copyFixture = TestBed.createComponent(CustomCopyContentTaskListComponent);
            fixtureCustom.detectChanges();
            componentCustom = fixtureCustom.componentInstance;
            customCopyComponent = copyFixture.componentInstance;
            element = copyFixture.debugElement.nativeElement;
        });

        afterEach(() => {
            fixtureCustom.destroy();
            copyFixture.destroy();
        });

        it('should create instance of CustomTaskListComponent', () => {
            expect(componentCustom instanceof CustomTaskListComponent).toBe(true, 'should create CustomTaskListComponent');
        });

        it('should fetch custom schemaColumn from html', () => {
            fixture.detectChanges();
            expect(componentCustom.taskList.columnList).toBeDefined();
            expect(componentCustom.taskList.columns[0]['title']).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.NAME');
            expect(componentCustom.taskList.columns[1]['title']).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED');
            expect(componentCustom.taskList.columns.length).toEqual(3);
        });

        it('it should show copy tooltip when key is present in data-colunn', async(() => {
            copyFixture.detectChanges();
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            copyFixture.whenStable().then(() => {
                copyFixture.detectChanges();
                const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span[title="11fe013d-c263-11e8-b75b-0a5864600540"]');
                spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                copyFixture.detectChanges();
                expect(copyFixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
            });
            customCopyComponent.taskList.appName = appName.currentValue;
            customCopyComponent.taskList.ngOnChanges({ 'appName': appName });
            copyFixture.detectChanges();
        }));

        it('it should not show copy tooltip when key is not present in data-colunn', async(() => {
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            customCopyComponent.taskList.success.subscribe( () => {
                copyFixture.whenStable().then(() => {
                    copyFixture.detectChanges();
                    const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span[title="standalone-subtask"]');
                    spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                    copyFixture.detectChanges();
                    expect(copyFixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).toBeNull();
                });
            });
            customCopyComponent.taskList.appName = appName.currentValue;
            customCopyComponent.taskList.ngOnChanges({ 'appName': appName });
            copyFixture.detectChanges();
        }));

    });

    describe('Creating an empty custom template - EmptyTemplateComponent', () => {
        let fixtureEmpty: ComponentFixture<EmptyTemplateComponent>;

        setupTestBed({
            imports: [ProcessServiceCloudTestingModule, TaskListCloudModule],
            declarations: [EmptyTemplateComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

    describe('Copy cell content directive from app.config specifications', () => {

        let element: any;
        let taskSpy: jasmine.Spy;

        setupTestBed({
            imports: [ProcessServiceCloudTestingModule, TaskListCloudModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        beforeEach( () => {
            appConfig = TestBed.get(AppConfigService);
            taskListCloudService = TestBed.get(TaskListCloudService);
            appConfig.config = Object.assign(appConfig.config, {
                'adf-cloud-task-list': {
                    'presets': {
                        'fakeCustomSchema': [
                            {
                                'key': 'entry.id',
                                'type': 'text',
                                'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.FAKE',
                                'sortable': true,
                                'copyContent': true
                            },
                            {
                                'key': 'entry.name',
                                'type': 'text',
                                'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.TASK_FAKE',
                                'sortable': true
                            }
                        ]
                    }
                }
            });
            fixture = TestBed.createComponent(TaskListCloudComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement.nativeElement;
            taskSpy = spyOn(taskListCloudService, 'getTaskByRequest').and.returnValue(of(fakeGlobalTask));

        });
        afterEach(() => {
            fixture.destroy();
        });

        it('shoud show tooltip if config copyContent flag is true', async(() => {
            taskSpy.and.returnValue(of(fakeGlobalTask));
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);

            component.success.subscribe( () => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span[title="11fe013d-c263-11e8-b75b-0a5864600540"]');
                    spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
                });
            });

            component.presetColumn = 'fakeCustomSchema';
            component.appName = appName.currentValue;
            component.ngOnChanges({ 'appName': appName });
            component.ngAfterContentInit();
        }));

        it('shoud not show tooltip if config copyContent flag is true', async(() => {
            taskSpy.and.returnValue(of(fakeGlobalTask));
            const appName = new SimpleChange(null, 'FAKE-APP-NAME', true);
            component.success.subscribe( () => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span[title="standalone-subtask"]');
                    spanHTMLElement.dispatchEvent(new Event('mouseenter'));
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).toBeNull();
                });
            });
            component.presetColumn = 'fakeCustomSchema';
            component.appName = appName.currentValue;
            component.ngOnChanges({ 'appName': appName });
            component.ngAfterContentInit();
        }));
    });

});
