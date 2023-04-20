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

import { Component, SimpleChange, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ProcessInstanceListComponent } from './process-list.component';
import {
    AppConfigService, setupTestBed, DataRow, DataColumn,
    DataRowEvent, ObjectDataRow, ObjectDataTableAdapter, DataCellEvent, ObjectDataColumn
} from '@alfresco/adf-core';
import {
    fakeProcessInstance,
    fakeProcessInstancesWithNoName,
    fakeProcessInstancesEmpty,
    fakeProcessColumnSchema
} from '../../mock';
import { ProcessService } from '../services/process.service';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessInstanceListComponent', () => {

    let fixture: ComponentFixture<ProcessInstanceListComponent>;
    let component: ProcessInstanceListComponent;
    let service: ProcessService;
    let getProcessInstancesSpy: jasmine.Spy;
    let appConfig: AppConfigService;

    const resolverfn = (row: DataRow, col: DataColumn) => {
        const value = row.getValue(col.key);
        if (col.key === 'variables') {
            return (value || []).map((processVar) => `${processVar.name} - ${processVar.value}`).toString();
        }
        return value;
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessInstanceListComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.inject(AppConfigService);
        service = TestBed.inject(ProcessService);

        getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(of(fakeProcessInstance));
        appConfig.config['adf-process-list'] = {
            presets: fakeProcessColumnSchema
        };
    });

    it('should display loading spinner', () => {
        component.isLoading = true;

        const spinner = fixture.debugElement.query(By.css('.mat-progress-spinner'));
        expect(spinner).toBeDefined();
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(1);
        expect(component.columns[0]).toEqual(new ObjectDataColumn(fakeProcessColumnSchema.default[0]));
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

    it('should fetch the custom schemaColumn from app.config.json', () => {
        component.presetColumn = 'fakeProcessCustomSchema';
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.columns.length).toEqual(2);
        expect(component.columns[0]).toEqual(new ObjectDataColumn(fakeProcessColumnSchema.fakeProcessCustomSchema[0]));
        expect(component.columns[1]).toEqual(new ObjectDataColumn(fakeProcessColumnSchema.fakeProcessCustomSchema[1]));
    });

    it('should fetch custom schemaColumn when the input presetColumn is defined', () => {
        component.presetColumn = 'fakeProcessCustomSchema';
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(2);
    });

    it('should return an empty process list when no input parameters are passed', () => {
        component.ngAfterContentInit();
        expect(component.rows).toBeDefined();
        expect(component.isListEmpty()).toBeTruthy();
    });

    it('should emit onSuccess event when process instances loaded', fakeAsync(() => {
        const emitSpy = spyOn(component.success, 'emit');
        component.appId = 1;
        component.state = 'open';
        fixture.detectChanges();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(jasmine.objectContaining(fakeProcessInstance));
    }));

    it('should return the process instances list in original order when datalist passed non-existent columns', (done) => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );
        component.appId = 1;
        component.state = 'open';
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('Process 773443333');
            expect(component.rows[1]['name']).toEqual('Process 382927392');
            done();
        });
        fixture.detectChanges();
    });

    it('should return a default name if no name is specified on the process', (done) => {
        getProcessInstancesSpy = getProcessInstancesSpy.and.returnValue(of(fakeProcessInstancesWithNoName));
        component.appId = 1;
        component.state = 'open';
        component.success.subscribe(() => {
            expect(component.rows[0]['name']).toEqual('Fake Process Name - Nov 9, 2017, 12:36:14 PM');
            expect(component.rows[1]['name']).toEqual('Fake Process Name - Nov 9, 2017, 12:37:25 PM');
            done();
        });
        fixture.detectChanges();
    });

    it('should return a currentId null when the processList is empty', () => {
        component.selectFirst();
        expect(component.getCurrentId()).toBeNull();
    });

    it('should return selected true for the selected process', () => {
        component.rows =
            [
                { id: '999', name: 'Fake-name' },
                { id: '888', name: 'Fake-name-888' }
            ];
        component.selectFirst();
        const dataRow = component.rows[0];
        expect(dataRow).toBeDefined();
        expect(component.currentInstanceId).toEqual('999');
    });

    it('should not select first row when selectFirstRow is false', () => {
        component.rows =
            [
                { id: '999', name: 'Fake-name' },
                { id: '888', name: 'Fake-name-888' }
            ];
        component.selectFirstRow = false;
        component.selectFirst();
        const dataRow = component.rows;
        expect(dataRow).toBeDefined();
        expect(dataRow[0]['id']).toEqual('999');
    });

    it('should return an empty list when the response is wrong', fakeAsync(() => {
        const mockError = 'Fake server error';
        getProcessInstancesSpy.and.returnValue(throwError(mockError));
        component.appId = 1;
        component.state = 'open';
        fixture.detectChanges();
        tick();
        expect(component.isListEmpty()).toBeTruthy();
    }));

    it('should emit onSuccess event when reload() called', fakeAsync(() => {
        component.appId = 1;
        component.state = 'open';
        fixture.detectChanges();
        tick();
        const emitSpy = spyOn(component.success, 'emit');
        component.reload();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(jasmine.objectContaining(fakeProcessInstance));
    }));

    it('should reload processes when reload() is called', (done) => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );
        component.state = 'open';
        component.success.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('Process 773443333');
            done();
        });
        component.reload();
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

    it('should emit row click event on Enter', (done) => {
        let prevented = false;
        const keyEvent = new CustomEvent('Keyboard event', { detail: {
            keyboardEvent: { key: 'Enter' },
            row: new ObjectDataRow({ id: '999' })
        }});

        spyOn(keyEvent, 'preventDefault').and.callFake(() => prevented = true);

        component.rowClick.subscribe((taskId: string) => {
            expect(taskId).toEqual('999');
            expect(component.getCurrentId()).toEqual('999');
            expect(prevented).toBeTruthy();
            done();
        });

        component.onRowKeyUp(keyEvent);
    });

    it('should NOT emit row click event on every other key', async () => {
        let triggered = false;
        const keyEvent = new CustomEvent('Keyboard event', { detail: {
            keyboardEvent: { key: 'Space' },
            row: new ObjectDataRow({ id: 999 })
        }});

        component.rowClick.subscribe(() => triggered = true);
        component.onRowKeyUp(keyEvent);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(triggered).toBeFalsy();
    });

    it('should show custom resolved value in the column', async () => {
        appConfig.config['adf-process-list'] = {
            presets: {
                fakeProcessCustomSchema: [
                    {
                        key: 'variables',
                        type: 'text',
                        title: 'Variables'
                    }
                ]
            }
        };
        component.presetColumn = 'fakeProcessCustomSchema';
        component.resolverFn = resolverfn;
        component.reload();

        fixture.detectChanges();
        await fixture.whenStable();

        const customColumn = fixture.debugElement.queryAll(By.css('[title="Variables"] adf-datatable-cell'));
        expect(customColumn[0].nativeElement.innerText).toEqual('initiator - fake-user-1');
        expect(customColumn[1].nativeElement.innerText).toEqual('initiator - fake-user-2');
    });

    describe('component changes', () => {

        beforeEach(() => {
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
            const change = new SimpleChange(null, appId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0]['name']).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({appId: change});
        });

        it('should reload the list when the state parameter changes', (done) => {
            const state = 'open';
            const change = new SimpleChange(null, state, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({state: change});
        });

        it('should reload the list when the sort parameter changes', (done) => {
            const sort = 'created-desc';
            const change = new SimpleChange(null, sort, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0]['name']).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({sort: change});
        });

        it('should reload the process list when the processDefinitionId parameter changes', (done) => {
            const processDefinitionId = 'SimpleProcess:1:10';
            const change = new SimpleChange(null, processDefinitionId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({processDefinitionId: change});
        });

        it('should reload the process list when the processDefinitionId parameter changes to null', (done) => {
            const processDefinitionId = null;
            const change = new SimpleChange('SimpleProcess:1:10', processDefinitionId, false);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({processDefinitionId: change});
        });

        it('should reload the process list when the processInstanceId parameter changes', (done) => {
            const processInstanceId = '123';
            const change = new SimpleChange(null, processInstanceId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({processInstanceId: change});
        });

        it('should reload the process list when the processInstanceId parameter changes to null', (done) => {
            const processInstanceId = null;
            const change = new SimpleChange('123', processInstanceId, false);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({processInstanceId: change});
        });

        it('should update the columns when presetColumn schema changes', () => {
            component.presetColumn = 'fakeProcessCustomSchema';
            component.ngAfterContentInit();
            const initialColumnSchema = component.mergeJsonAndHtmlSchema();
            expect(component.columns).toEqual(initialColumnSchema);

            component.presetColumn = 'fakeRunningProcessSchema';
            const presetColumnChange = new SimpleChange(null, 'fakeRunningProcessSchema', false);
            component.ngOnChanges({ presetColumn: presetColumnChange });

            const newColumnSchema = component.mergeJsonAndHtmlSchema();
            const expectedColumn1 = new ObjectDataColumn(fakeProcessColumnSchema.fakeRunningProcessSchema[0]);
            const expectedColumn2 = new ObjectDataColumn(fakeProcessColumnSchema.fakeRunningProcessSchema[1]);

            expect(component.columns).toEqual(newColumnSchema);
            expect(initialColumnSchema).not.toEqual(newColumnSchema);
            expect(component.columns.length).toEqual(2);
            expect(component.columns[0]).toEqual(expectedColumn1);
            expect(component.columns[1]).toEqual(expectedColumn2);
        });
    });
});

@Component({
    template: `
    <adf-process-instance-list #processlistComponentInstance>
        <data-columns>
            <data-column key="name" title="ADF_PROCESS_LIST.PROPERTIES.NAME" class="adf-full-width adf-name-column"></data-column>
            <data-column key="created" title="ADF_PROCESS_LIST.PROPERTIES.END_DATE" class="adf-hidden"></data-column>
            <data-column key="startedBy" title="ADF_PROCESS_LIST.PROPERTIES.CREATED" class="adf-desktop-only dw-dt-col-3 adf-ellipsis-cell">
                <ng-template let-entry="$implicit">
                    <div>{{entry.row.obj.startedBy | fullName}}</div>
                </ng-template>
            </data-column>
        </data-columns>
    </adf-process-instance-list>`
})

class CustomProcessListComponent {

    @ViewChild(ProcessInstanceListComponent)
    processList: ProcessInstanceListComponent;
}

describe('CustomProcessListComponent', () => {
    let fixture: ComponentFixture<CustomProcessListComponent>;
    let component: CustomProcessListComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [CustomProcessListComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomProcessListComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should fetch custom schemaColumn from html', () => {
        fixture.detectChanges();
        expect(component.processList.columns).toBeDefined();
        expect(component.processList.columns.length).toEqual(3);
        expect(component.processList.columns[1]['title']).toEqual('ADF_PROCESS_LIST.PROPERTIES.END_DATE');
        expect(component.processList.columns[2]['title']).toEqual('ADF_PROCESS_LIST.PROPERTIES.CREATED');
    });
});

@Component({
    template: `
    <adf-process-instance-list [appId]="1">
        <adf-custom-empty-content-template>
            <p id="custom-id"> No Process Instance</p>
        </adf-custom-empty-content-template>
    </adf-process-instance-list>
       `
})
class EmptyTemplateComponent {
}
describe('Process List: Custom EmptyTemplateComponent', () => {
    let fixture: ComponentFixture<EmptyTemplateComponent>;
    let processService: ProcessService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [EmptyTemplateComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EmptyTemplateComponent);
        processService = TestBed.inject(ProcessService);
        spyOn(processService, 'getProcessInstances').and.returnValue(of(fakeProcessInstancesEmpty));
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the custom template', (done) => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const title = fixture.debugElement.query(By.css('#custom-id'));
            expect(title).not.toBeNull();
            expect(title.nativeElement.innerText).toBe('No Process Instance');
            expect(fixture.debugElement.query(By.css('.adf-empty-content'))).toBeNull();
            done();
        });
    });
});

@Component({
    template: `
    <adf-process-instance-list
    [appId]="appId"
    [showContextMenu]="true"
    (showRowContextMenu)="onShowRowContextMenu($event)"
    #processlistComponentInstance>
        <data-columns>
            <data-column key="name" title="ADF_PROCESS_LIST.PROPERTIES.NAME" class="adf-full-width adf-name-column"></data-column>
            <data-column key="created" title="ADF_PROCESS_LIST.PROPERTIES.END_DATE" class="adf-hidden"></data-column>
            <data-column key="startedBy" title="ADF_PROCESS_LIST.PROPERTIES.CREATED" class="adf-desktop-only dw-dt-col-3 adf-ellipsis-cell">
                <ng-template let-entry="$implicit">
                    <div>{{entry.row.obj.startedBy | fullName}}</div>
                </ng-template>
            </data-column>
        </data-columns>
    </adf-process-instance-list>`
})
class ProcessListContextMenuComponent implements OnInit {
    @Output()
    contextAction = new EventEmitter<any>();

    appId: number;

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
                    key: 'processDetails',
                    icon: 'open',
                    title: 'View Process Details',
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

describe('ProcessListContextMenuComponent', () => {
    let fixture: ComponentFixture<ProcessListContextMenuComponent>;
    let customComponent: ProcessListContextMenuComponent;
    let processService: ProcessService;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [ProcessListContextMenuComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessListContextMenuComponent);
        customComponent = fixture.componentInstance;
        element = fixture.nativeElement;
        processService = TestBed.inject(ProcessService);
        customComponent.appId = 12345;
        spyOn(processService, 'getProcesses').and.returnValue(of(fakeProcessInstance));
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.detectChanges();
    });

    it('Should be able to show context menu on process list', async () => {
        const contextMenu =  element.querySelector(`[data-automation-id="text_${fakeProcessInstance.data[0].name}"]`);
        const contextActionSpy = spyOn(customComponent.contextAction, 'emit').and.callThrough();
        contextMenu.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        const contextActions = document.querySelectorAll('.mat-menu-item');

        expect(contextActions.length).toBe(2);
        expect(contextActions[0]['disabled']).toBe(false, 'View Process Details action not enabled');
        expect(contextActions[1]['disabled']).toBe(false, 'Cancel Process action not enabled');
        contextActions[0].dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(contextActionSpy).toHaveBeenCalled();
      });
});
