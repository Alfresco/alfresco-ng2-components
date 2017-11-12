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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule
} from '@angular/material';
import { FormModule, FormService } from '../../form';
import { TranslationService } from '@alfresco/core';
import { Observable } from 'rxjs/Rx';

import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessService } from '../services/process.service';
import { newProcess, taskFormMock, testProcessDefRepr, testProcessDefs, testProcessDefWithForm } from './../assets/start-process.component.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { StartProcessInstanceComponent } from './start-process.component';

describe('StartProcessInstanceComponent', () => {

    let component: StartProcessInstanceComponent;
    let fixture: ComponentFixture<StartProcessInstanceComponent>;
    let processService: ProcessService;
    let formService: FormService;
    let getDefinitionsSpy: jasmine.Spy;
    let getStartFormDefinitionSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [

                FormModule,
                MatButtonModule,
                MatCardModule,
                MatInputModule,
                MatSelectModule
            ],
            declarations: [
                StartProcessInstanceComponent
            ],
            providers: [
                {provide: TranslationService, useClass: TranslationMock},
                ProcessService,
                FormService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(StartProcessInstanceComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        processService = fixture.debugElement.injector.get(ProcessService);
        formService = fixture.debugElement.injector.get(FormService);

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(Observable.of(testProcessDefs));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(Observable.of(newProcess));
        getStartFormDefinitionSpy = spyOn(formService, 'getStartFormDefinition').and.returnValue(Observable.of(taskFormMock));

    });

    it('should create instance of StartProcessInstanceComponent', () => {
        expect(fixture.componentInstance instanceof StartProcessInstanceComponent).toBe(true, 'should create StartProcessInstanceComponent');
    });

    describe('process definitions list', () => {

        it('should call service to fetch process definitions with appId', () => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith('123');
        });

        it('should call service to fetch process definitions without appId', () => {
            let change = new SimpleChange(null, null, true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith(null);
        });

        it('should call service to fetch process definitions with appId when provided', () => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith('123');
        });

        it('should display the correct number of processes in the select list', () => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            let selectElement = fixture.nativeElement.querySelector('mat-select');
            expect(selectElement.children.length).toBe(1);
        });

        it('should display the option def details', () => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            component.processDefinitions = testProcessDefs;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let selectElement = fixture.nativeElement.querySelector('mat-select > .mat-select-trigger');
                let optionElement = fixture.nativeElement.querySelectorAll('mat-option');
                selectElement.click();
                expect(selectElement).not.toBeNull();
                expect(selectElement).toBeDefined();
                expect(optionElement).not.toBeNull();
                expect(optionElement).toBeDefined();
            });
        });

        it('should indicate an error to the user if process defs cannot be loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(Observable.throw({}));
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl).not.toBeNull('Expected error message to be present');
                expect(errorEl.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.ERROR.LOAD_PROCESS_DEFS');
            });
        }));

        it('should show no process available message when no process definition is loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(Observable.of([]));
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let noprocessElement = fixture.nativeElement.querySelector('#no-process-message');
                expect(noprocessElement).not.toBeNull('Expected no available process message to be present');
                expect(noprocessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_PROCESS_DEFINITIONS');
            });
        }));

    });

    describe('input changes', () => {

        let change = new SimpleChange(123, 456, true);
        let nullChange = new SimpleChange(123, null, true);

        beforeEach(async(() => {
            component.appId = 123;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                getDefinitionsSpy.calls.reset();
            });
        }));

        it('should reload processes when appId input changed', () => {
            component.ngOnChanges({appId: change});
            expect(getDefinitionsSpy).toHaveBeenCalledWith(456);
        });

        it('should reload processes when appId input changed to null', () => {
            component.ngOnChanges({appId: nullChange});
            expect(getDefinitionsSpy).toHaveBeenCalledWith(null);
        });

        it('should get current processDeff', () => {
            component.ngOnChanges({appId: change});
            component.onProcessDefChange('my:Process');
            fixture.detectChanges();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.processDefinitions).toBe(testProcessDefs);
        });
    });

    describe('start process', () => {

        beforeEach(() => {
            component.name = 'My new process';
            let change = new SimpleChange(null, 123, true);
            component.ngOnChanges({'appId': change});
        });

        it('should call service to start process if required fields provided', async(() => {
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalled();
            });
        }));

        it('should avoid calling service to start process if required fields NOT provided', async(() => {
            component.name = '';
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).not.toHaveBeenCalled();
            });
        }));

        it('should call service to start process with the correct parameters', async(() => {
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined, undefined);
            });
        }));

        it('should call service to start process with the variables setted', async(() => {
            let inputProcessVariable: ProcessInstanceVariable[] = [];

            let variable: ProcessInstanceVariable = {};
            variable.name = 'nodeId';
            variable.value = 'id';

            inputProcessVariable.push(variable);

            component.variables = inputProcessVariable;
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined, inputProcessVariable);
            });
        }));

        it('should output start event when process started successfully', async(() => {
            let emitSpy = spyOn(component.start, 'emit');
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(emitSpy).toHaveBeenCalledWith(newProcess);
            });
        }));

        it('should throw error event when process cannot be started', async(() => {
            let errorSpy = spyOn(component.error, 'error');
            let error = {message: 'My error'};
            startProcessSpy = startProcessSpy.and.returnValue(Observable.throw(error));
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(errorSpy).toHaveBeenCalledWith(error);
            });
        }));

        it('should indicate an error to the user if process cannot be started', async(() => {
            startProcessSpy = startProcessSpy.and.returnValue(Observable.throw({}));
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl).not.toBeNull();
                expect(errorEl.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.ERROR.START');
            });
        }));

        it('should emit start event when start the process with currentProcessDef and name', () => {
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.currentProcessDef.id = '1001';
            component.name = 'my:Process';
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).toHaveBeenCalled();
        });

        it('should not emit start event when start the process without currentProcessDef and name', () => {
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should able to start the process when the required fields are filled up', async(() => {
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.name = 'my:process1';
            component.onProcessDefChange('my:process1');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let startButton = fixture.nativeElement.querySelector('#button-start');
                startButton.click();
                expect(startSpy).toHaveBeenCalled();
            });
        }));

        it('should return true if startFrom defined', async(() => {
            component.currentProcessDef = testProcessDefRepr;
            component.name = 'my:process1';
            component.currentProcessDef.hasStartForm = true;
            component.hasStartForm();
            fixture.whenStable().then(() => {
                expect(component.hasStartForm()).toBe(true);
            });
        }));

    });

    describe('start forms', () => {

        let startBtn;

        describe('without start form', () => {

            beforeEach(async(() => {
                component.name = 'My new process';
                let change = new SimpleChange(null, '123', true);
                component.ngOnChanges({'appId': change});
                fixture.detectChanges();
                component.onProcessDefChange('my:process1');
                fixture.whenStable();
                startBtn = fixture.nativeElement.querySelector('#button-start');
            }));

            it('should have start button disabled when name not filled out', async(() => {
                component.name = '';
                fixture.detectChanges();
                expect(startBtn.disabled).toBe(true);
            }));

            it('should have start button disabled when no process is selected', async(() => {
                component.onProcessDefChange('');
                fixture.detectChanges();
                expect(startBtn.disabled).toBe(true);
            }));

            it('should enable start button when name and process filled out', async(() => {
                fixture.detectChanges();
                let startButton = fixture.nativeElement.querySelector('#button-start');
                expect(startButton.disabled).toBeFalsy();
            }));

            it('should disable the start process button when process name is empty', async(() => {
                component.name = '';
                fixture.detectChanges();
                let startButton = fixture.nativeElement.querySelector('#button-start');
                expect(startButton.disabled).toBeTruthy();
            }));

        });

        describe('with start form', () => {

            beforeEach(() => {
                getDefinitionsSpy.and.returnValue(Observable.of(testProcessDefWithForm));
                let change = new SimpleChange(null, '123', true);
                component.ngOnChanges({'appId': change});
                component.onProcessDefChange('my:process1');
                fixture.detectChanges();
                fixture.whenStable();
                startBtn = fixture.nativeElement.querySelector('#button-start');
            });

            it('should initialize start form', () => {
                expect(component.startForm).toBeDefined();
                expect(component.startForm).not.toBeNull();
            });

            it('should load start form from service', () => {
                expect(getStartFormDefinitionSpy).toHaveBeenCalled();
            });

            it('should not show the start process button', async(() => {
                component.name = 'My new process';
                fixture.detectChanges();
                expect(startBtn).toBeNull();
            }));

            it('should emit cancel event on cancel Button', () => {
                let cancelButton =  fixture.nativeElement.querySelector('#cancle_process');
                let cancelSpy: jasmine.Spy = spyOn(component.cancel, 'emit');
                cancelButton.click();
                fixture.detectChanges();
                expect(cancelSpy).toHaveBeenCalled();
            });
        });

    });

});
