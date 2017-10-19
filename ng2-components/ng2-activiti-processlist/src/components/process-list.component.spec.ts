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
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { ProcessInstanceListComponent } from './process-list.component';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataRowEvent, DataSorting, DataTableModule, ObjectDataRow, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';

import { fakeProcessInstances, fakeProcessInstancesWithNoName } from '../assets/process-instances-list.mock';
import { ProcessService } from '../services/process.service';
import { TranslationMock } from './../assets/translation.service.mock';

describe('ProcessInstanceListComponent', () => {

    let fixture: ComponentFixture<ProcessInstanceListComponent>;
    let component: ProcessInstanceListComponent;
    let service: ProcessService;
    let getProcessInstancesSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule,
                MatProgressSpinnerModule
            ],
            declarations: [ ProcessInstanceListComponent ],
            providers: [
                ProcessService,
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ProcessInstanceListComponent);
            component = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProcessService);

            getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(Observable.of(fakeProcessInstances));

        });
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

    it('should return an empty process list when no input parameters are passed', () => {
        component.ngAfterContentInit();
        expect(component.data).toBeDefined();
        expect(component.isListEmpty()).toBeTruthy();
    });

    it('should emit onSuccess event when process instances loaded', fakeAsync(() => {
        let emitSpy = spyOn(component.onSuccess, 'emit');
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        fixture.detectChanges();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(fakeProcessInstances);
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
        component.processDefinitionKey = null;
        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 382927392');
            done();
        });
        fixture.detectChanges();
    });

    it('should order the process instances by name column when no sort passed', (done) => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 382927392');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 773443333');
            done();
        });
        fixture.detectChanges();
    });

    it('should order the process instances by descending column when specified', (done) => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.sort = 'name-desc';
        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 382927392');
            done();
        });
        fixture.detectChanges();
    });

    it('should order the process instances by ascending column when specified', (done) => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.sort = 'started-asc';
        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 382927392');
            done();
        });
        fixture.detectChanges();
    });

    it('should order the process instances by descending start date when specified', (done) => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        component.sort = 'started-desc';
        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.data).toBeDefined();
            expect(component.isListEmpty()).not.toBeTruthy();
            expect(component.data.getRows().length).toEqual(2);
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 382927392');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Process 773443333');
            done();
        });
        fixture.detectChanges();
    });

    it('should return a default name if no name is specified on the process', (done) => {
        getProcessInstancesSpy = getProcessInstancesSpy.and.returnValue(Observable.of(fakeProcessInstancesWithNoName));
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = 'fakeprocess';
        component.onSuccess.subscribe( (res) => {
            expect(component.data.getRows()[0].getValue('name')).toEqual('Fake Process Name - Nov 9, 2017, 12:36:14 PM');
            expect(component.data.getRows()[1].getValue('name')).toEqual('Fake Process Name - Nov 9, 2017, 12:37:25 PM');
            done();
        });
        fixture.detectChanges();
    });

    it('should return a currentId null when the processList is empty', () => {
        component.selectFirst();
        expect(component.getCurrentId()).toBeNull();
    });

    it('should throw an exception when the response is wrong', fakeAsync(() => {
        let emitSpy: jasmine.Spy = spyOn(component.onError, 'emit');
        let fakeError = 'Fake server error';
        getProcessInstancesSpy.and.returnValue(Observable.throw(fakeError));
        component.appId = 1;
        component.state = 'open';
        fixture.detectChanges();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(fakeError);
    }));

    it('should emit onSuccess event when reload() called', fakeAsync(() => {
        component.appId = 1;
        component.state = 'open';
        component.processDefinitionKey = null;
        fixture.detectChanges();
        tick();
        let emitSpy = spyOn(component.onSuccess, 'emit');
        component.reload();
        tick();
        expect(emitSpy).toHaveBeenCalledWith(fakeProcessInstances);
    }));

    it('should reload processes when reload() is called', (done) => {
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
            expect(component.data.getRows()[0].getValue('name')).toEqual('Process 773443333');
            done();
        });
        component.reload();
    });

    it('should emit row click event', (done) => {
        let row = new ObjectDataRow({
            id: 999
        });
        let rowEvent = new DataRowEvent(row, null);

        component.rowClick.subscribe(taskId => {
            expect(taskId).toEqual(999);
            expect(component.getCurrentId()).toEqual(999);
            done();
        });

        component.onRowClick(rowEvent);
    });

    it('should emit row click event on Enter', (done) => {
        let prevented = false;
        let keyEvent = new CustomEvent('Keyboard event', { detail: {
            keyboardEvent: { key: 'Enter' },
            row: new ObjectDataRow({ id: 999 })
        }});

        spyOn(keyEvent, 'preventDefault').and.callFake(() => prevented = true);

        component.rowClick.subscribe(taskId => {
            expect(taskId).toEqual(999);
            expect(component.getCurrentId()).toEqual(999);
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

            component.onSuccess.subscribe((res) => {
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

            component.onSuccess.subscribe((res) => {
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

            component.onSuccess.subscribe((res) => {
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

            component.onSuccess.subscribe((res) => {
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

            component.onSuccess.subscribe((res) => {
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

            component.onSuccess.subscribe((res) => {
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
