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
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';

import { ActivitiProcessInstanceVariables } from './activiti-process-instance-variables.component';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { TranslationMock } from './../assets/translation.service.mock';

describe('ActivitiProcessInstanceVariables', () => {

    let componentHandler: any;
    let service: ActivitiProcessService;
    let component: ActivitiProcessInstanceVariables;
    let fixture: ComponentFixture<ActivitiProcessInstanceVariables>;
    let getVariablesSpy: jasmine.Spy;
    let createOrUpdateProcessInstanceVariablesSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule
            ],
            declarations: [
                ActivitiProcessInstanceVariables
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiProcessInstanceVariables);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiProcessService);

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

    it('should not display list when no processInstanceId is specified', fakeAsync(() => {
        fixture.detectChanges();
        fixture.whenStable();
        tick();
        let datatable: DebugElement = fixture.debugElement.query(By.css('alfresco-datatable'));
        expect(datatable).toBeNull();
    }));

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
        let datatable: DebugElement = fixture.debugElement.query(By.css('alfresco-datatable'));
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

        let change = new SimpleChange('123', '456');
        let nullChange = new SimpleChange('123', null);

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

        it('should set a placeholder message when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('[data-automation-id="variables-none"]'))).not.toBeNull();
        });
    });

    describe('Add comment', () => {

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog')).nativeElement;
            let showSpy: jasmine.Spy = spyOn(dialogEl, 'showModal');
            component.showDialog();
            expect(showSpy).toHaveBeenCalled();
        });

        it('should call service to add a comment', () => {
            component.showDialog();
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
            component.showDialog();
            component.variableName = 'Test var';
            component.variableValue = 'Test 222';
            component.add();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should close add dialog when close button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog')).nativeElement;
            let closeSpy: jasmine.Spy = spyOn(dialogEl, 'close');
            component.showDialog();
            component.cancel();
            expect(closeSpy).toHaveBeenCalled();
        });

    });

});
