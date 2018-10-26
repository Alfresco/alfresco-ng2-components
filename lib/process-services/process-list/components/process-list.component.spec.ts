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
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { ProcessInstanceListComponent } from './process-list.component';

import { AppConfigService, setupTestBed, CoreModule, DataTableModule } from '@alfresco/adf-core';
import { DataRowEvent, ObjectDataRow, ObjectDataTableAdapter } from '@alfresco/adf-core';

import { fakeProcessInstance, fakeProcessInstancesWithNoName, fakeProcessInstancesEmpty } from '../../mock';
import { ProcessService } from '../services/process.service';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { fakeProcessCustomSchema } from '../../mock';
import { ProcessListModule } from 'process-list/process-list.module';

describe('ProcessInstanceListComponent', () => {

    let fixture: ComponentFixture<ProcessInstanceListComponent>;
    let component: ProcessInstanceListComponent;
    let service: ProcessService;
    let getProcessInstancesSpy: jasmine.Spy;
    let appConfig: AppConfigService;

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

        getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(of(fakeProcessInstance));
        appConfig.config['adf-process-list'] = {
            'presets': {
                'fakeProcessCustomSchema': [
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
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(2);
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
        expect(component.columns).toEqual(fakeProcessCustomSchema);
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
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('Process 773443333');
            expect(component.rows[1]['name']).toEqual('Process 382927392');
        });
        fixture.detectChanges();
    }));

    it('should return a default name if no name is specified on the process', async(() => {
        getProcessInstancesSpy = getProcessInstancesSpy.and.returnValue(of(fakeProcessInstancesWithNoName));
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = 'fakeprocess';
        component.success.subscribe( (res) => {
            expect(component.rows[0]['name']).toEqual('Fake Process Name - Nov 9, 2017, 12:36:14 PM');
            expect(component.rows[1]['name']).toEqual('Fake Process Name - Nov 9, 2017, 12:37:25 PM');
        });
        fixture.detectChanges();
    }));

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

    it('should throw an exception when the response is wrong', fakeAsync(() => {
        let emitSpy: jasmine.Spy = spyOn(component.error, 'emit');
        let mockError = 'Fake server error';
        getProcessInstancesSpy.and.returnValue(throwError(mockError));
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
            expect(component.rows).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.rows.length).toEqual(2);
            expect(component.rows[0]['name']).toEqual('Process 773443333');
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
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0]['name']).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'appId': change});
        });

        it('should reload the list when the processDefinitionKey parameter changes', (done) => {
            const processDefinitionKey = 'fakeprocess';
            let change = new SimpleChange(null, processDefinitionKey, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0]['name']).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processDefinitionKey': change});
        });

        it('should reload the list when the state parameter changes', (done) => {
            const state = 'open';
            let change = new SimpleChange(null, state, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'state': change});
        });

        it('should reload the list when the sort parameter changes', (done) => {
            const sort = 'created-desc';
            let change = new SimpleChange(null, sort, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0]['name']).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'sort': change});
        });

        it('should reload the process list when the processDefinitionKey parameter changes', (done) => {
            const processDefinitionKey = 'SimpleProcess';
            let change = new SimpleChange(null, processDefinitionKey, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processDefinitionKey': change});
        });

        it('should reload the process list when the processDefinitionKey parameter changes to null', (done) => {
            const processDefinitionKey = null;
            let change = new SimpleChange('SimpleProcess', processDefinitionKey, false);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processDefinitionKey': change});
        });

        it('should reload the process list when the processDefinitionId parameter changes', (done) => {
            const processDefinitionId = 'SimpleProcess:1:10';
            let change = new SimpleChange(null, processDefinitionId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processDefinitionId': change});
        });

        it('should reload the process list when the processDefinitionId parameter changes to null', (done) => {
            const processDefinitionId = null;
            let change = new SimpleChange('SimpleProcess:1:10', processDefinitionId, false);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processDefinitionId': change});
        });

        it('should reload the process list when the processInstanceId parameter changes', (done) => {
            const processInstanceId = '123';
            let change = new SimpleChange(null, processInstanceId, true);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processInstanceId': change});
        });

        it('should reload the process list when the processInstanceId parameter changes to null', (done) => {
            const processInstanceId = null;
            let change = new SimpleChange('123', processInstanceId, false);

            component.success.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.rows).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.rows.length).toEqual(2);
                expect(component.rows[0].name).toEqual('Process 773443333');
                done();
            });

            component.ngOnChanges({'processInstanceId': change});
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
        expect(component.processList.columns).toBeDefined();
        expect(component.processList.columns.length).toEqual(3);
        expect(component.processList.columns[1]['title']).toEqual('ADF_PROCESS_LIST.PROPERTIES.END_DATE');
        expect(component.processList.columns[2]['title']).toEqual('ADF_PROCESS_LIST.PROPERTIES.CREATED');
    });
});

@Component({
    template: `
    <adf-process-instance-list [appId]="1">
        <adf-empty-custom-content>
            <p id="custom-id"> No Process Instance</p>
        </adf-empty-custom-content>
    </adf-process-instance-list>
       `
})
class EmptyTemplateComponent {
}
describe('Process List: Custom EmptyTemplateComponent', () => {
    let fixture: ComponentFixture<EmptyTemplateComponent>;
    let processService: ProcessService;

    setupTestBed({
        imports: [ProcessTestingModule, ProcessListModule, DataTableModule],
        declarations: [EmptyTemplateComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EmptyTemplateComponent);
        processService = TestBed.get(ProcessService);
        spyOn(processService, 'getProcessInstances').and.returnValue(of(fakeProcessInstancesEmpty));
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the custom template', (done) => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let title = fixture.debugElement.query(By.css('#custom-id'));
            expect(title).not.toBeNull();
            expect(title.nativeElement.innerText).toBe('No Process Instance');
            expect(fixture.debugElement.query(By.css('.adf-empty-content'))).toBeNull();
            done();
        });
    });
});
