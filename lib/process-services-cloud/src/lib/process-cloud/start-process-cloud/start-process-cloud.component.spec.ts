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
import { setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { ProcessCloudService } from '../services/process-cloud.service';

import { StartProcessCloudComponent } from './start-process-cloud.component';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { ProcessCloudModule } from '../process-cloud.module';
import { ProcessInstanceVariableCloud } from '../models/process-instance-variable-cloud.model';
import { fakeProcessDefinitions, fakeProcessInstance, fakeProcessPayload } from '../mock/start-process.component.mock';

/*tslint:disable */
fdescribe('StartProcessCloudComponent', () => {

    let component: StartProcessCloudComponent;
    let fixture: ComponentFixture<StartProcessCloudComponent>;
    let processService: ProcessCloudService;
    let getDefinitionsSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule,
            ProcessCloudModule
        ]
    });

    beforeEach(() => {
        processService = TestBed.get(ProcessCloudService);
        fixture = TestBed.createComponent(StartProcessCloudComponent);
        component = fixture.componentInstance;

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(of(fakeProcessDefinitions));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(of(fakeProcessInstance));
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should create instance of StartProcessInstanceComponent', () => {
        expect(fixture.componentInstance instanceof StartProcessCloudComponent).toBe(true, 'should create StartProcessInstanceComponent');
    });

    describe('first step', () => {

        describe('without start form', () => {

            beforeEach(() => {
                fixture.detectChanges();
                component.name = 'My new process';
                component.appName = 'myApp';
                fixture.detectChanges();
            });

            it('should enable start button when name and process filled out', async(() => {
                spyOn(component, 'loadStartProcess').and.callThrough();
                component.processDefinitions = fakeProcessDefinitions;
                component.processForm.controls['processName'].setValue('My Process 1');
                component.processForm.controls['processDefinition'].setValue('NewProcess 1');

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let startBtn = fixture.nativeElement.querySelector('#button-start');
                    expect(startBtn.disabled).toBe(false);
                });
            }));

            it('should have start button disabled when name not filled out', async(() => {
                spyOn(component, 'loadStartProcess').and.callThrough();
                component.processForm.controls['processName'].setValue('');
                component.processForm.controls['processDefinition'].setValue(fakeProcessInstance.name);
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
    });

    describe('process definitions list', () => {

        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'My new process';
            component.appName = 'myApp';
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
            component.processDefinitions = fakeProcessDefinitions;
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
            component.appName = 'myApp';
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
            component.appName = 'myApp';
            component.ngOnChanges({});
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const noProcessElement = fixture.nativeElement.querySelector('#no-process-message');
                expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
                expect(noProcessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_PROCESS_DEFINITIONS');
            });
        }));

        it('should select processDefinition based on processDefinition input', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.appName = 'myApp';
            component.processForm.controls['processName'].setValue('NewProcess 2');
            component.processForm.controls['processDefinition'].setValue('NewProcess 2');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.processPayloadCloud.processInstanceName).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[1])).name);
            });
        }));

        fit('should select automatically the processDefinition if the app contain only one', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[0]]));
            component.appName = 'myApp';
            component.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.processForm.controls['processDefinition'].value).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[0])).name);
            });
        }));

        it('should not select automatically any processDefinition if the app contain multiple process and does not have any processDefinition as input', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.appName = 'myApp';
            component.ngOnChanges({});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.processPayloadCloud.processInstanceName).toBeNull();
            });
        }));

        describe('dropdown', () => {

            it('should hide the process dropdown button if showSelectProcessDropdown is false', async(() => {
                fixture.detectChanges();
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
                component.appName = 'myApp';
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
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
                component.appName = 'myApp';
                component.processDefinitionName = 'NewProcess 2';
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
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
                component.appName = 'myApp';
                component.processDefinitionName = 'NewProcess 2';
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

        let change = new SimpleChange('myApp', 'myApp1', true);

        beforeEach(async(() => {
            component.appName = 'myApp';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                getDefinitionsSpy.calls.reset();
            });
        }));

        it('should reload processes when appId input changed', async(() => {
            component.appName = 'myApp1';
            component.ngOnChanges({ appId: change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getDefinitionsSpy).toHaveBeenCalledWith('myApp1');
            });
        }));

        it('should get current processDef', () => {
            component.appName = 'myApp1';
            component.ngOnChanges({ appId: change });
            fixture.detectChanges();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.processDefinitions).toBe(fakeProcessDefinitions);
        });
    });

    describe('start process', () => {

        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'NewProcess 1';
            component.appName = 'myApp';
            component.ngOnChanges({});
        });

        it('should call service to start process if required fields provided', async(() => {
            component.processPayloadCloud = fakeProcessPayload;
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
            component.processPayloadCloud = fakeProcessPayload;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('myApp', 'NewProcess:1', 'NewProcess 1', undefined, undefined, undefined);
            });
        }));

        it('should call service to start process with the variables setted', async(() => {
            let inputProcessVariable: ProcessInstanceVariableCloud = {};
            inputProcessVariable.name = 'nodeId';
            inputProcessVariable.value = 'id';

            component.variables = inputProcessVariable;
            component.processPayloadCloud = fakeProcessPayload;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('myApp', 'NewProcess:1', 'NewProcess 1', undefined, undefined, inputProcessVariable);
            });
        }));

        it('should output start event when process started successfully', async(() => {
            let emitSpy = spyOn(component.start, 'emit');
            component.processPayloadCloud = fakeProcessPayload;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(emitSpy).toHaveBeenCalledWith(fakeProcessInstance);
            });
        }));

        it('should throw error event when process cannot be started', async(() => {
            let errorSpy = spyOn(component.error, 'error');
            let error = { message: 'My error' };
            startProcessSpy = startProcessSpy.and.returnValue(throwError(error));
            component.processPayloadCloud = fakeProcessPayload;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(errorSpy).toHaveBeenCalledWith(error);
            });
        }));

        it('should indicate an error to the user if process cannot be started', async(() => {
            fixture.detectChanges();
            startProcessSpy = startProcessSpy.and.returnValue(throwError({}));
            component.processPayloadCloud = fakeProcessPayload;
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

            component.processPayloadCloud = fakeProcessPayload;
            component.name = 'NewProcess 1';
            component.startProcess();
            fixture.detectChanges();
        });

        it('should not emit start event when start the process without select a process and name', () => {
            component.name = null;
            component.processPayloadCloud = null;
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
            component.processForm.controls['processName'].setValue('My Process 1');
                component.processForm.controls['processDefinition'].setValue('');
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should able to start the process when the required fields are filled up', (done) => {
            component.processForm.controls['processName'].setValue('My Process 1');
            component.processForm.controls['processDefinition'].setValue('NewProcess 1');

            let disposableStart = component.start.subscribe(() => {
                disposableStart.unsubscribe();
                done();
            });

            component.startProcess();
        });
    });

});
