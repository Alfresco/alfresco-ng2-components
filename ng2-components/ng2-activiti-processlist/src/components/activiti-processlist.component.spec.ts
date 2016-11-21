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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ActivitiProcessInstanceListComponent } from './activiti-processlist.component';
import { Observable } from 'rxjs/Rx';
import { ObjectDataRow, DataRowEvent, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';
import { TranslationMock } from './../assets/translation.service.mock';
import { ActivitiProcessService } from '../services/activiti-process.service';

describe('ActivitiProcessInstanceListComponent', () => {

    let fakeGlobalProcesses = [
        {
            id: 1, name: 'fake-long-name-fake-long-name-fake-long-name-fak50-long-name',
            processDefinitionId: 'fakeprocess:5:7507',
            processDefinitionKey: 'fakeprocess',
            processDefinitionName: 'Fake Process Name',
            description: null, category: null,
            started: '2017-11-09T12:37:25.184+0000',
            startedBy: {
                id: 3, firstName: 'tenant2', lastName: 'tenantLastname', email: 'tenant2@tenant'
            }
        },
        {
            id: 2, name: '', description: null, category: null,
            started: '2015-11-09T12:37:25.184+0000',
            startedBy: {
                id: 3, firstName: 'tenant2', lastName: 'tenantLastname', email: 'tenant2@tenant'
            }
        }
    ];

    let componentHandler: any;
    let fixture: ComponentFixture<ActivitiProcessInstanceListComponent>;
    let component: ActivitiProcessInstanceListComponent;
    let service: ActivitiProcessService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule
            ],
            declarations: [ ActivitiProcessInstanceListComponent ],
            providers: [
                ActivitiProcessService,
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ActivitiProcessInstanceListComponent);
            component = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ActivitiProcessService);

            componentHandler = jasmine.createSpyObj('componentHandler', [
                'upgradeAllRegistered',
                'upgradeElement'
            ]);
            window['componentHandler'] = componentHandler;
        });
    }));

    it('should use the default schemaColumn as default', () => {
        component.ngOnInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(4);
    });

    it('should use the schemaColumn passed in input', () => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );

        component.ngOnInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(1);
    });

    it('should return an empty process list when no input parameters are passed', () => {
        component.ngOnInit();
        expect(component.data).toBeDefined();
        expect(component.isListEmpty()).toBeTruthy();
    });

    it('should return the process instances list', (done) => {
        spyOn(service, 'getProcessInstances').and.returnValue(Observable.of(fakeGlobalProcesses));
        component.appId = '1';
        component.state = 'open';
        component.processDefinitionKey = null;
        component.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
            done();
        });
        fixture.detectChanges();
    });

    it('should return the process instances list filtered by processDefinitionKey', (done) => {
        spyOn(service, 'getProcessInstances').and.returnValue(Observable.of(fakeGlobalProcesses));
        component.appId = '1';
        component.state = 'open';
        component.processDefinitionKey = 'fakeprocess';
        component.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
            done();
        });
        fixture.detectChanges();
    });

    it('should return a currentId null when the processList is empty', () => {
        component.selectFirst();
        expect(component.getCurrentId()).toBeNull();
    });

    it('should throw an exception when the response is wrong', (done) => {
        spyOn(service, 'getProcessInstances').and.returnValue(Observable.throw('Fake server error'));
        component.state = 'open';
        component.onError.subscribe( (err) => {
            expect(err).toBeDefined();
            expect(err).toBe('Fake server error');
            done();
        });
        fixture.detectChanges();
    });

    it('should reload processes when reload() is called', (done) => {
        spyOn(service, 'getProcessInstances').and.returnValue(Observable.of(fakeGlobalProcesses));
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );
        component.state = 'open';
        component.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
            done();
        });
        component.reload();
    });

    it('should emit row click event', (done) => {
        let row = new ObjectDataRow({
            id: 999
        });
        let rowEvent = <DataRowEvent> {value: row};

        component.rowClick.subscribe(taskId => {
            expect(taskId).toEqual(999);
            expect(component.getCurrentId()).toEqual(999);
            done();
        });

        component.onRowClick(rowEvent);
    });

    describe('component changes', () => {

        beforeEach(() => {
            spyOn(service, 'getProcessInstances').and.returnValue(Observable.of(fakeGlobalProcesses));
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
            let change = new SimpleChange(null, appId);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'appId': change});
        });

        it('should reload the list when the processDefinitionKey parameter changes', (done) => {
            const processDefinitionKey = 'fakeprocess';
            let change = new SimpleChange(null, processDefinitionKey);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'processDefinitionKey': change});
        });

        it('should reload the list when the state parameter changes', (done) => {
            const state = 'open';
            let change = new SimpleChange(null, state);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'state': change});
        });

        it('should reload the list when the sort parameter changes', (done) => {
            const sort = 'desc';
            let change = new SimpleChange(null, sort);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'sort': change});
        });

        it('should reload the process list when the name parameter changes', (done) => {
            const name = 'FakeTaskName';
            let change = new SimpleChange(null, name);

            component.onSuccess.subscribe((res) => {
                expect(res).toBeDefined();
                expect(component.data).toBeDefined();
                expect(component.isListEmpty()).not.toBeTruthy();
                expect(component.data.getRows().length).toEqual(2);
                expect(component.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
                expect(component.data.getRows()[1].getValue('name')).toEqual('No name');
                done();
            });

            component.ngOnChanges({'name': change});
        });
    });
});
