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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiContentService, AppConfigService, FormService, setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';

import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessService } from '../services/process.service';
import {
    newProcess,
    taskFormMock,
    testProcessDef,
    testMultipleProcessDefs,
    testProcessDefWithForm,
    testProcessDefinitions
} from '../../mock';
import { StartProcessInstanceComponent } from './start-process.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';

describe('StartFormComponent', () => {

    let appConfig: AppConfigService;
    let activitiContentService: ActivitiContentService;
    let component: StartProcessInstanceComponent;
    let fixture: ComponentFixture<StartProcessInstanceComponent>;
    let processService: ProcessService;
    let formService: FormService;
    let getDefinitionsSpy: jasmine.Spy;
    let getStartFormDefinitionSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        appConfig = TestBed.get(AppConfigService);
        activitiContentService = TestBed.get(ActivitiContentService);
        fixture = TestBed.createComponent(StartProcessInstanceComponent);
        component = fixture.componentInstance;
        processService = TestBed.get(ProcessService);
        formService = TestBed.get(FormService);

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(of(testMultipleProcessDefs));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(of(newProcess));
        getStartFormDefinitionSpy = spyOn(formService, 'getStartFormDefinition').and.returnValue(of(taskFormMock));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of({ id: 1234 }));
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should create instance of StartProcessInstanceComponent', () => {
        expect(fixture.componentInstance instanceof StartProcessInstanceComponent).toBe(true, 'should create StartProcessInstanceComponent');
    });

    describe('first step', () => {

        describe('without start form', () => {

            beforeEach(() => {
                fixture.detectChanges();
                component.name = 'My new process';
                let change = new SimpleChange(null, 123, true);
                component.ngOnChanges({ 'appId': change });
                fixture.detectChanges();
            });

            it('should enable start button when name and process filled out', async(() => {
                spyOn(component, 'loadStartProcess').and.callThrough();
                component.processNameInput.setValue('My Process');
                component.processDefinitionInput.setValue(testProcessDef.name);

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let startBtn = fixture.nativeElement.querySelector('#button-start');
                    expect(startBtn.disabled).toBe(false);
                });
            }));

            it('should have start button disabled when name not filled out', async(() => {
                spyOn(component, 'loadStartProcess').and.callThrough();
                component.processNameInput.setValue('');
                component.processDefinitionInput.setValue(testProcessDef.name);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let startBtn = fixture.nativeElement.querySelector('#button-start');
                    expect(startBtn.disabled).toBe(true);
                });
            }));

            it('should have start button disabled when no process is selected', async(() => {
                component.selectedProcessDef = null;
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let startBtn = fixture.nativeElement.querySelector('#button-start');
                    expect(startBtn.disabled).toBe(true);
                });
            }));
        });

        describe('with start form', () => {

            beforeEach(() => {
                fixture.detectChanges();
                getDefinitionsSpy.and.returnValue(of(testProcessDefWithForm));
                let change = new SimpleChange(null, 123, true);
                component.ngOnChanges({ 'appId': change });
            });

            it('should initialize start form', async(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.startForm).toBeDefined();
                    expect(component.startForm).not.toBeNull();
                });
            }));

            it('should load start form from service', async(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(getStartFormDefinitionSpy).toHaveBeenCalled();
                });
            }));

            it('should have start button disabled if the process is not selected', async(() => {
                component.name = 'My new process';
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let startBtn = fixture.nativeElement.querySelector('#button-start');
                    expect(startBtn).toBeNull();
                });
            }));

            it('should emit cancel event on cancel Button', async(() => {
                fixture.detectChanges();
                let cancelButton = fixture.nativeElement.querySelector('#cancel_process');
                let cancelSpy: jasmine.Spy = spyOn(component.cancel, 'emit');
                cancelButton.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(cancelSpy).toHaveBeenCalled();
                });
            }));
        });

        describe('CS content connection', () => {

            it('alfrescoRepositoryName default configuration property', () => {
                appConfig.config = Object.assign(appConfig.config, {
                    'alfrescoRepositoryName': null
                });

                expect(component.getAlfrescoRepositoryName()).toBe('alfresco-1Alfresco');
            });

            it('alfrescoRepositoryName configuration property should be fetched', () => {
                appConfig.config = Object.assign(appConfig.config, {
                    'alfrescoRepositoryName': 'alfresco-123'
                });

                expect(component.getAlfrescoRepositoryName()).toBe('alfresco-123Alfresco');
            });

            it('if values in input is a node should be linked in the process service', async(() => {

                component.values = {};
                component.values['file'] = {
                    isFile: true,
                    name: 'example-file'
                };

                component.moveNodeFromCStoPS();

                fixture.whenStable().then(() => {
                    expect(component.values.file[0].id).toBe(1234);
                });
            }));
        });
    });

    describe('process definitions list', () => {

        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'My new process';
            component.appId = 123;
            component.ngOnChanges({});
            fixture.detectChanges();
        });

        it('should call service to fetch process definitions with appId', () => {
            fixture.whenStable().then(() => {
                expect(getDefinitionsSpy).toHaveBeenCalledWith(123);
            });
        });

        it('should display the correct number of processes in the select list', () => {
            fixture.whenStable().then(() => {
                let selectElement = fixture.nativeElement.querySelector('mat-select');
                expect(selectElement.children.length).toBe(1);
            });
        });

        it('should display the option def details', () => {
            component.processDefinitions = testMultipleProcessDefs;
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
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(throwError({}));
            component.appId = 123;
            component.ngOnChanges({});
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl).not.toBeNull('Expected error message to be present');
                expect(errorEl.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.ERROR.LOAD_PROCESS_DEFS');
            });
        }));

        it('should show no process available message when no process definition is loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of([]));
            component.appId = 123;
            component.ngOnChanges({});
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const noProcessElement = fixture.nativeElement.querySelector('#no-process-message');
                expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
                expect(noProcessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_PROCESS_DEFINITIONS');
            });
        }));

        it('should select processDefinition based on processDefinition input', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            component.appId = 123;
            component.processNameInput.setValue('My Process 2');
            component.processDefinitionInput.setValue('My Process 2');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.selectedProcessDef.name).toBe(JSON.parse(JSON.stringify(testMultipleProcessDefs[1])).name);
            });
        }));

        it('should select automatically the processDefinition if the app contain only one', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testProcessDefinitions));
            component.appId = 123;
            component.ngOnChanges({});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.selectedProcessDef.name).toBe(JSON.parse(JSON.stringify(testProcessDefinitions[0])).name);
            });
        }));

        it('should not select automatically any processDefinition if the app contain multiple process and does not have any processDefinition as input', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            component.appId = 123;
            component.ngOnChanges({});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.selectedProcessDef.name).toBeNull();
            });
        }));

        describe('dropdown', () => {

            it('should hide the process dropdown button if showSelectProcessDropdown is false', async(() => {
                fixture.detectChanges();
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of([testProcessDef]));
                component.appId = 123;
                component.showSelectProcessDropdown = false;
                component.ngOnChanges({});
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                    expect(selectElement).toBeNull();
                });
            }));

            it('should show the process dropdown button if showSelectProcessDropdown is false', async(() => {
                fixture.detectChanges();
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
                component.appId = 123;
                component.processDefinitionName = 'My Process 2';
                component.showSelectProcessDropdown = true;
                component.ngOnChanges({});
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                    expect(selectElement).not.toBeNull();
                });
            }));

            it('should show the process dropdown button by default', async(() => {
                fixture.detectChanges();
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
                component.appId = 123;
                component.processDefinitionName = 'My Process 2';
                component.ngOnChanges({});
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                    expect(selectElement).not.toBeNull();
                });
            }));
        });
    });

    describe('input changes', () => {

        let change = new SimpleChange(123, 456, true);

        beforeEach(async(() => {
            component.appId = 123;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                getDefinitionsSpy.calls.reset();
            });
        }));

        it('should reload processes when appId input changed', async(() => {
            component.appId = 456;
            component.ngOnChanges({ appId: change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getDefinitionsSpy).toHaveBeenCalledWith(456);
            });
        }));

        it('should get current processDef', () => {
            component.appId = 456;
            component.ngOnChanges({ appId: change });
            fixture.detectChanges();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.processDefinitions).toBe(testMultipleProcessDefs);
        });
    });

    describe('start process', () => {

        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'My new process';
            component.appId = 123;
            component.ngOnChanges({});
        });

        it('should call service to start process if required fields provided', async(() => {
            component.selectedProcessDef = testProcessDef;
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
            component.selectedProcessDef = testProcessDef;
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
            component.selectedProcessDef = testProcessDef;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined, inputProcessVariable);
            });
        }));

        it('should output start event when process started successfully', async(() => {
            let emitSpy = spyOn(component.start, 'emit');
            component.selectedProcessDef = testProcessDef;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(emitSpy).toHaveBeenCalledWith(newProcess);
            });
        }));

        it('should throw error event when process cannot be started', async(() => {
            let errorSpy = spyOn(component.error, 'error');
            let error = { message: 'My error' };
            startProcessSpy = startProcessSpy.and.returnValue(throwError(error));
            component.selectedProcessDef = testProcessDef;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(errorSpy).toHaveBeenCalledWith(error);
            });
        }));

        it('should indicate an error to the user if process cannot be started', async(() => {
            fixture.detectChanges();
            startProcessSpy = startProcessSpy.and.returnValue(throwError({}));
            component.selectedProcessDef = testProcessDef;
            component.startProcess();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl).not.toBeNull();
                expect(errorEl.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.ERROR.START');
            });
        }));

        it('should emit start event when start select a process and add a name', (done) => {
            let disposableStart = component.start.subscribe(() => {
                disposableStart.unsubscribe();
                done();
            });

            component.selectedProcessDef = testProcessDef;
            component.name = 'my:Process';
            component.startProcess();
            fixture.detectChanges();
        });

        it('should not emit start event when start the process without select a process and name', () => {
            component.name = null;
            component.selectedProcessDef = null;
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should not emit start event when start the process without name', () => {
            component.name = null;
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should not emit start event when start the process without select a process', () => {
            component.selectedProcessDef = null;
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should able to start the process when the required fields are filled up', (done) => {
            component.name = 'my:process1';
            component.selectedProcessDef = testProcessDef;

            let disposableStart = component.start.subscribe(() => {
                disposableStart.unsubscribe();
                done();
            });

            component.startProcess();
        });

        it('should return true if startFrom defined', async(() => {
            component.selectedProcessDef = testProcessDef;
            component.name = 'my:process1';
            component.selectedProcessDef.hasStartForm = true;
            component.hasStartForm();
            fixture.whenStable().then(() => {
                expect(component.hasStartForm()).toBe(true);
            });
        }));

    });

});
