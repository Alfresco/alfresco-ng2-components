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

import { DebugElement, SimpleChange } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MdProgressSpinnerModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule, ObjectDataRow, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';

import { TranslationMock } from './../assets/translation.service.mock';
import { ProcessService } from './../services/process.service';
import { ProcessInstanceVariablesComponent } from './process-instance-variables.component';

describe('ProcessInstanceVariablesComponent', () => {

    let componentHandler: any;
    let service: ProcessService;
    let component: ProcessInstanceVariablesComponent;
    let fixture: ComponentFixture<ProcessInstanceVariablesComponent>;
    let getVariablesSpy: jasmine.Spy;
    let createOrUpdateProcessInstanceVariablesSpy: jasmine.Spy;
    let deleteProcessInstanceVariableSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule.forRoot(),
                MdProgressSpinnerModule
            ],
            declarations: [
                ProcessInstanceVariablesComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ProcessService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessInstanceVariablesComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ProcessService);

        getVariablesSpy = spyOn(service, 'getProcessInstanceVariables').and.returnValue(Observable.of([{
            name: 'var1',
            value: 'Test1'
        }, {
            name: 'var2',
            value: 'Test2'
        }, {
            name: 'var3',
            value: 'Test3'
        }]));
        createOrUpdateProcessInstanceVariablesSpy = spyOn(service, 'createOrUpdateProcessInstanceVariables').and.returnValue(Observable.of({id: 123, message: 'Test'}));
        deleteProcessInstanceVariableSpy = spyOn(service, 'deleteProcessInstanceVariable').and.returnValue(Observable.of());

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should load variables when processInstanceId specified', () => {
        component.processInstanceId = '123';
        fixture.detectChanges();
        expect(getVariablesSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading variables', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getVariablesSpy.and.returnValue(Observable.throw({}));
        component.processInstanceId = '123';
        fixture.detectChanges();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not fetch variables when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getVariablesSpy).not.toHaveBeenCalled();
    });

    it('should use the default schemaColumn as default', () => {
        fixture.detectChanges();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(3);
    });

    it('should use the schemaColumn passed in input', () => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );

        fixture.detectChanges();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(1);
    });

    it('should display list when the process has variables', fakeAsync(() => {
        component.processInstanceId = '123';
        fixture.detectChanges();
        fixture.whenStable();
        tick();
        let datatable: DebugElement = fixture.debugElement.query(By.css('adf-datatable'));
        expect(datatable).not.toBeNull();
    }));

    it('should display correct number of data table rows when the process has variables', fakeAsync(() => {
        component.processInstanceId = '123';
        fixture.detectChanges();
        fixture.whenStable();
        tick();
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('tbody tr')).length).toBe(3);
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getVariablesSpy.calls.reset();
            });
        }));

        it('should fetch new variables when processInstanceId changed', () => {
            component.ngOnChanges({ 'processInstanceId': change });
            expect(getVariablesSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new variables when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getVariablesSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new variables when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            expect(getVariablesSpy).not.toHaveBeenCalled();
        });
    });

    describe('Add variable', () => {

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog.add-dialog')).nativeElement;
            let showSpy: jasmine.Spy = spyOn(dialogEl, 'showModal');
            component.showAddDialog();
            expect(showSpy).toHaveBeenCalled();
        });

        it('should call service to add a variable', () => {
            component.showAddDialog();
            component.variableName = 'Test var';
            component.variableValue = 'Test 222';
            component.add();
            let serviceArgs = createOrUpdateProcessInstanceVariablesSpy.calls.mostRecent().args;
            let sentProcessId = serviceArgs[0];
            let sentProcesses = serviceArgs[1];
            expect(serviceArgs.length).toBe(2);
            expect(sentProcessId).toBe('123');
            expect(sentProcesses.length).toBe(1);
            expect(sentProcesses[0].name).toBe('Test var');
            expect(sentProcesses[0].value).toBe('Test 222');
            expect(sentProcesses[0].scope).toBe('global');
        });

        it('should emit an error when an error occurs adding the variable', () => {
            let emitSpy = spyOn(component.error, 'emit');
            createOrUpdateProcessInstanceVariablesSpy.and.returnValue(Observable.throw({}));
            component.showAddDialog();
            component.variableName = 'Test var';
            component.variableValue = 'Test 222';
            component.add();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should close add dialog when close button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog.add-dialog')).nativeElement;
            let closeSpy: jasmine.Spy = spyOn(dialogEl, 'close');
            component.showAddDialog();
            component.closeAddDialog();
            expect(closeSpy).toHaveBeenCalled();
        });

    });

    describe('Edit variable', () => {

        let fakeVariable = {
            name: 'fakeVar',
            value: 'my value 4',
            scope: 'global'
        };

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Edit action clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog.edit-dialog')).nativeElement;
            let showSpy: jasmine.Spy = spyOn(dialogEl, 'showModal');
            component.onExecuteRowAction({
                args: {
                    row: new ObjectDataRow(fakeVariable),
                    action: {
                        id: 'edit'
                    }
                }
            });
            expect(showSpy).toHaveBeenCalled();
        });

        it('should call service to edit a variable', () => {
            component.showEditDialog(new ObjectDataRow(fakeVariable));
            component.variableValue = 'Test 222';
            component.edit();
            let serviceArgs = createOrUpdateProcessInstanceVariablesSpy.calls.mostRecent().args;
            let sentProcessId = serviceArgs[0];
            let sentProcesses = serviceArgs[1];
            expect(serviceArgs.length).toBe(2);
            expect(sentProcessId).toBe('123');
            expect(sentProcesses.length).toBe(1);
            expect(sentProcesses[0].name).toBe(fakeVariable.name);
            expect(sentProcesses[0].value).toBe('Test 222');
            expect(sentProcesses[0].scope).toBe(fakeVariable.scope);
        });

        it('should emit an error when an error occurs editing the variable', () => {
            let emitSpy = spyOn(component.error, 'emit');
            createOrUpdateProcessInstanceVariablesSpy.and.returnValue(Observable.throw({}));
            component.showEditDialog(new ObjectDataRow(fakeVariable));
            component.variableName = 'Test var';
            component.variableValue = 'Test 222';
            component.edit();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should close edit dialog when close button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog.edit-dialog')).nativeElement;
            let closeSpy: jasmine.Spy = spyOn(dialogEl, 'close');
            component.showEditDialog(new ObjectDataRow(fakeVariable));
            component.closeEditDialog();
            expect(closeSpy).toHaveBeenCalled();
        });

    });

    describe('Delete variable', () => {

        let fakeVariable = {
            name: 'fakeVar',
            value: 'my value 4',
            scope: 'global'
        };

        let deleteAction = {
            id: 'delete'
        };

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should call service to delete the variable', () => {
            component.variableValue = 'Test 222';
            component.onExecuteRowAction({
                args: {
                    row: new ObjectDataRow(fakeVariable),
                    action: deleteAction
                }
            });
            let serviceArgs = deleteProcessInstanceVariableSpy.calls.mostRecent().args;
            let sentProcessId = serviceArgs[0];
            let sentVariableName = serviceArgs[1];
            expect(serviceArgs.length).toBe(2);
            expect(sentProcessId).toBe('123');
            expect(sentVariableName).toBe(fakeVariable.name);
        });

        it('should emit an error when an error occurs deleting the variable', () => {
            let emitSpy = spyOn(component.error, 'emit');
            deleteProcessInstanceVariableSpy.and.returnValue(Observable.throw({}));
            component.onExecuteRowAction({
                args: {
                    row: new ObjectDataRow(fakeVariable),
                    action: deleteAction
                }
            });
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should display error dialog when an error is triggered', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog.error-dialog')).nativeElement;
            let showSpy: jasmine.Spy = spyOn(dialogEl, 'showModal');
            deleteProcessInstanceVariableSpy.and.returnValue(Observable.throw({}));
            component.onExecuteRowAction({
                args: {
                    row: new ObjectDataRow(fakeVariable),
                    action: deleteAction
                }
            });
            expect(showSpy).toHaveBeenCalled();
        });

        it('should close error dialog when close button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog.error-dialog')).nativeElement;
            let closeSpy: jasmine.Spy = spyOn(dialogEl, 'close');
            component.showErrorDialog();
            component.closeErrorDialog();
            expect(closeSpy).toHaveBeenCalled();
        });

    });

});
