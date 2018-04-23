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

import { Component, SimpleChange, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ProcessInstanceListComponent } from './process-list.component';

import { AppConfigService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { DataRowEvent, DataSorting, ObjectDataRow, ObjectDataTableAdapter } from '@alfresco/adf-core';

import { fakeProcessInstance, fakeProcessInstancesWithNoName } from '../../mock';
import { ProcessService } from '../services/process.service';
import { ProcessTestingModule } from '../../testing/process.testing.module';

describe('ProcessInstanceListComponent', () => {

    let fixture: ComponentFixture<ProcessInstanceListComponent>;
    let component: ProcessInstanceListComponent;
    let service: ProcessService;
    let getProcessInstancesSpy: jasmine.Spy;
    let appConfig: AppConfigService;

    let fakeCutomSchema = [
        {
            'key': 'fakeName',
            'type': 'text',
            'title': 'ADF_PROCESS_LIST.PROPERTIES.FAKE',
            'sortable': true
        },
        {
            'key': 'fakeProcessName',
            'type': 'text',
            'title': 'ADF_PROCESS_LIST.PROPERTIES.PROCESS_FAKE',
            'sortable': true
        }
    ];

    let fakeColumnSchema = {
        'default': [
                {
                    'key': 'name',
                    'type': 'text',
                    'title': 'ADF_PROCESS_LIST.PROPERTIES.NAME',
                    'sortable': true
                },
                {
                    'key': 'created',
                    'type': 'text',
                    'title': 'ADF_PROCESS_LIST.PROPERTIES.CREATED',
                    'cssClass': 'hidden',
                    'sortable': true
                }
            ]
        , fakeCutomSchema };

    setupTestBed({
        imports: [
            ProcessTestingModule
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(ProcessInstanceListComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.get(AppConfigService);
        service = TestBed.get(ProcessService);

        getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(Observable.of(fakeProcessInstance));
        appConfig.config['adf-process-list'] = {
            'presets': {
                'fakeCutomSchema': [
                    {
                        'key': 'fakeName',
                        'type': 'text',
                        'title': 'ADF_PROCESS_LIST.PROPERTIES.FAKE',
                        'sortable': true
                    },
                    {
                        'key': 'fakeProcessName',
                        'type': 'text',
                        'title': 'ADF_PROCESS_LIST.PROPERTIES.PROCESS_FAKE',
                        'sortable': true
                    }
                ]
            }
        };
    }));

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(2);
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
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.layoutPresets).toEqual(fakeColumnSchema);
    });

    it('should fetch custom schemaColumn when the input presetColumn is defined', () => {
        component.presetColumn = 'fakeCutomSchema';
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(2);
    });

    it('should return an empty process list when no input parameters are passed', () => {
        component.ngAfterContentInit();
        expect(component.data).toBeDefined();
        expect(component.isListEmpty()).toBeTruthy();
    });

    it('should emit onSuccess event when process instances loaded', fakeAsync(() => {
        let emitSpy = spyOn(component.success, 'emit');
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        fixture.detectChanges();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(fakeProcessInstance);
    }));

    it('should return the process instances list in original order when datalist passed non-existent columns', async(() => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 382927392');
        });
        fixture.detectChanges();
    }));

    it('should order the process instances by name column when no sort passed', async(() => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 382927392');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 773443333');
        });
        fixture.detectChanges();
    }));

    it('should order the process instances by descending column when specified', async(() => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.sort = 'name-desc';
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 382927392');
        });
        fixture.detectChanges();
    }));

    it('should order the process instances by ascending column when specified', async(() => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.sort = 'started-asc';
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 382927392');
        });
        fixture.detectChanges();
    }));

    it('should order the process instances by descending start date when specified', async(() => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.sort = 'started-desc';
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 382927392');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 773443333');
        });
        fixture.detectChanges();
    }));

    it('should return a default name if no name is specified on the process', async(() => {
        getProcessInstancesSpy = getProcessInstancesSpy.and.returnValue(Observable.of(fakeProcessInstancesWithNoName));
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = 'fakeprocess';
        component.success.subscribe( (res) => {
            expect(component.data.getRows()[0].getValue('name')).toEqual('Fake Process Name - Nov 9, 2017, 12:36:14 PM');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Fake Process Name - Nov 9, 2017, 12:37:25 PM');
        });
        fixture.detectChanges();
    }));

    it('should return a currentId null when the processList is empty', () => {
        component.selectFirst();
        expect(component.getCurrentId()).toBeNull();
    });

    it('should return selected true for the selected process', () => {
        component.data = new ObjectDataTableAdapter(
            [
                { id: '999', name: 'Fake-name' },
                { id: '888', name: 'Fake-name-888' }
            ],
            [
                { type: 'text', key: 'id', title: 'Id' },
                { type: 'text', key: 'name', title: 'Name' }
            ]
        );
        component.selectFirst();
        const dataRow = component.data.getRows();
        expect(dataRow).toBeDefined();
        expect(dataRow[0].getValue('id')).toEqual('999');
        expect(dataRow[0].isSelected).toEqual(true);
        expect(dataRow[1].getValue('id')).toEqual('888');
        expect(dataRow[1].isSelected).toEqual(false);
    });

    it('should not select first row when selectFirstRow is false', () => {
        component.data = new ObjectDataTableAdapter(
            [
                { id: '999', name: 'Fake-name' },
                { id: '888', name: 'Fake-name-888' }
            ],
            [
                { type: 'text', key: 'id', title: 'Id' },
                { type: 'text', key: 'name', title: 'Name' }
            ]
        );
        component.selectFirstRow = false;
        component.selectFirst();
        const dataRow = component.data.getRows();
        expect(dataRow).toBeDefined();
        expect(dataRow[0].getValue('id')).toEqual('999');
        expect(dataRow[0].isSelected).toEqual(false);
        expect(dataRow[1].getValue('id')).toEqual('888');
        expect(dataRow[1].isSelected).toEqual(false);
    });

    it('should throw an exception when the response is wrong', fakeAsync(() => {
        let emitSpy: jasmine.Spy = spyOn(component.error, 'emit');
        let mockError = 'Fake server error';
        getProcessInstancesSpy.and.returnValue(Observable.throw(mockError));
        component.appId = 1;
        component.state = 'open';
        fixture.detectChanges();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(mockError);
    }));

    it('should emit onSuccess event when reload() called', fakeAsync(() => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        fixture.detectChanges();
        tick();
        let emitSpy = spyOn(component.success, 'emit');
        component.reload();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(fakeProcessInstance);
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
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            done();
        });
        component.reload();
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

    it('should emit row click event on Enter', (done) => {
        let prevented = false;
        let keyEvent = new CustomEvent('Keyboard event', { detail: {
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

    it('should NOT emit row click event on every other key', async(() => {
        let triggered = false;
        let keyEvent = new CustomEvent('Keyboard event', { detail: {
            keyboardEvent: { key: 'Space' },
            row: new ObjectDataRow({ id: 999 })
        }});

        component.rowClick.subscribe(() => triggered = true);
        component.onRowKeyUp(keyEvent);

        fixture.whenStable().then(() => {
            expect(triggered).toBeFalsy();
        });
    }));

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
            let change = new SimpleChange(null, appId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'appId': change});
        });

        it('should reload the list when the processDefinitionKey parameter changes', (done) => {
            const processDefinitionKey = 'fakeprocess';
            let change = new SimpleChange(null, processDefinitionKey, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processDefinitionKey': change});
        });

        it('should reload the list when the state parameter changes', (done) => {
            const state = 'open';
            let change = new SimpleChange(null, state, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'state': change});
        });

        it('should reload the list when the sort parameter changes', (done) => {
            const sort = 'created-desc';
            let change = new SimpleChange(null, sort, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'sort': change});
        });

        it('should sort the list when the sort parameter changes', (done) => {
            const sort = 'created-asc';
            let change = new SimpleChange(null, sort, true);
            let sortSpy = spyOn(component.data, 'setSorting');

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(sortSpy).toHaveBeenCalledWith(new DataSorting('started', 'asc'));
                done();
            });

            component.sort = sort;
            component.ngOnChanges({'sort': change});
        });

        it('should reload the process list when the name parameter changes', (done) => {
            const name = 'FakeTaskName';
            let change = new SimpleChange(null, name, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'name': change});
        });
    });
});

@Component({
    template: `
    <adf-process-instance-list #processlistComponentInstance>
        <data-columns>
            <data-column key="name" title="ADF_PROCESS_LIST.PROPERTIES.NAME" class="full-width name-column"></data-column>
            <data-column key="created" title="ADF_PROCESS_LIST.PROPERTIES.END_DATE" class="hidden"></data-column>
            <data-column key="startedBy" title="ADF_PROCESS_LIST.PROPERTIES.CREATED" class="desktop-only dw-dt-col-3 ellipsis-cell">
                <ng-template let-entry="$implicit">
                    <div>{{getFullName(entry.row.obj.startedBy)}}</div>
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
        imports: [CoreModule.forRoot()],
        declarations: [ProcessInstanceListComponent, CustomProcessListComponent],
        providers: [ProcessService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomProcessListComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of CustomProcessListComponent', () => {
        expect(component instanceof CustomProcessListComponent).toBe(true, 'should create CustomProcessListComponent');
    });

    it('should fetch custom schemaColumn from html', () => {
        fixture.detectChanges();
        expect(component.processList.data.getColumns()).toBeDefined();
        expect(component.processList.data.getColumns()[1].title).toEqual('ADF_PROCESS_LIST.PROPERTIES.END_DATE');
        expect(component.processList.data.getColumns()[2].title).toEqual('ADF_PROCESS_LIST.PROPERTIES.CREATED');
        expect(component.processList.data.getColumns().length).toEqual(3);
    });
});
