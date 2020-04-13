/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { SimpleChange, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { FormCloudService } from '../../../form/services/form-cloud.service';

import { StartProcessCloudComponent } from './start-process-cloud.component';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { ProcessCloudModule } from '../../process-cloud.module';
import { fakeProcessDefinitions, fakeStartForm, fakeStartFormNotValid,
    fakeProcessInstance, fakeProcessPayload, fakeNoNameProcessDefinitions, fakeSingleProcessDefinition } from '../mock/start-process.component.mock';
import { By } from '@angular/platform-browser';

describe('StartProcessCloudComponent', () => {

    let component: StartProcessCloudComponent;
    let fixture: ComponentFixture<StartProcessCloudComponent>;
    let processService: StartProcessCloudService;
    let formCloudService: FormCloudService;
    let getDefinitionsSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let formDefinitionSpy: jasmine.Spy;

    const selectOptionByName = (name: string) => {

        const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
        selectElement.click();
        fixture.detectChanges();
        const options: any = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        const currentOption = options.find( (option: DebugElement) => option.nativeElement.innerHTML.trim() === name );

        if (currentOption) {
            currentOption.nativeElement.click();
        }
    };

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule,
            ProcessCloudModule
        ]
    });

    beforeEach(() => {
        processService = TestBed.get(StartProcessCloudService);
        formCloudService = TestBed.get(FormCloudService);
        fixture = TestBed.createComponent(StartProcessCloudComponent);
        component = fixture.componentInstance;

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(of(fakeProcessDefinitions));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(of(fakeProcessInstance));
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('start a process without start form', () => {

        it('should be able to start a process with a valid process name and process definition', async(() => {
            component.name = 'My new process';
            component.processDefinitionName = 'processwithoutform2';
            fixture.detectChanges();

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn.disabled).toBe(false);
            });
        }));

        it('should have start button disabled when name not filled out', async(() => {
            component.name = '';
            component.processDefinitionName = 'processwithoutform2';
            fixture.detectChanges();

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn.disabled).toBe(true);
            });
        }));

        it('should have start button disabled when no process is selected', async(() => {
            component.name = '';
            component.processDefinitionName = '';
            fixture.detectChanges();

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn.disabled).toBe(true);
            });
        }));
    });

    describe('start a process with start form', () => {

        beforeEach(() => {
            component.name = 'My new process with form';
        });

        it('should be able to start a process with a valid form', async(() => {
            component.processDefinitionName = 'processwithform';
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition(component.processDefinitionName)));
            fixture.detectChanges();
            formDefinitionSpy = spyOn(formCloudService, 'getForm').and.returnValue(of(fakeStartForm));

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const firstNameEl = fixture.nativeElement.querySelector('#firstName');
                expect(firstNameEl).toBeDefined();
                const lastNameEl = fixture.nativeElement.querySelector('#lastName');
                expect(lastNameEl).toBeDefined();
                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(component.formCloud.isValid).toBe(true);
                expect(startBtn.disabled).toBe(false);
            });
        }));

        it('should NOT be able to start a process with a form NOT valid', async(() => {
            component.processDefinitionName = 'processwithform';
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition(component.processDefinitionName)));
            fixture.detectChanges();
            formDefinitionSpy = spyOn(formCloudService, 'getForm').and.returnValue(of(fakeStartFormNotValid));

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const firstNameEl = fixture.nativeElement.querySelector('#firstName');
                expect(firstNameEl).toBeDefined();
                const lastNameEl = fixture.nativeElement.querySelector('#lastName');
                expect(lastNameEl).toBeDefined();
                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(component.formCloud.isValid).toBe(false);
                expect(startBtn.disabled).toBe(true);
            });
        }));

        it('should be able to start a process with a prefilled valid form', async(() => {
            component.processDefinitionName = 'processwithform';
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition(component.processDefinitionName)));
            component.values = [{'name': 'firstName', 'value': 'FakeName'}, {'name': 'lastName', 'value': 'FakeLastName'}];
            fixture.detectChanges();
            formDefinitionSpy = spyOn(formCloudService, 'getForm').and.returnValue(of(fakeStartForm));

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const firstNameEl = fixture.nativeElement.querySelector('#firstName');
                expect(firstNameEl).toBeDefined();
                expect(firstNameEl.value).toEqual('FakeName');
                const lastNameEl = fixture.nativeElement.querySelector('#lastName');
                expect(lastNameEl).toBeDefined();
                expect(lastNameEl.value).toEqual('FakeLastName');
                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(component.formCloud.isValid).toBe(true);
                expect(startBtn.disabled).toBe(false);
            });
        }));

        it('should NOT be able to start a process with a prefilled NOT valid form', async(() => {
            component.processDefinitionName = 'processwithform';
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition(component.processDefinitionName)));
            component.values = [{'name': 'firstName', 'value': 'FakeName'}, {'name': 'lastName', 'value': 'FakeLastName'}];
            fixture.detectChanges();
            formDefinitionSpy = spyOn(formCloudService, 'getForm').and.returnValue(of(fakeStartFormNotValid));

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(formDefinitionSpy).toHaveBeenCalled();
                const firstNameEl = fixture.nativeElement.querySelector('#firstName');
                expect(firstNameEl).toBeDefined();
                expect(firstNameEl.value).toEqual('FakeName');
                const lastNameEl = fixture.nativeElement.querySelector('#lastName');
                expect(lastNameEl).toBeDefined();
                expect(lastNameEl.value).toEqual('FakeLastName');
                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(component.formCloud.isValid).toBe(false);
                expect(startBtn.disabled).toBe(true);
            });
        }));
    });

    describe('process definitions list', () => {

        beforeEach(() => {
            component.name = 'My new process';
            component.appName = 'myApp';
            fixture.detectChanges();
            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();
        });

        it('should call service to fetch process definitions with appId', () => {
            fixture.whenStable().then(() => {
                expect(getDefinitionsSpy).toHaveBeenCalledWith('myApp');
            });
        });

        it('should display the correct number of processes in the select list', () => {
            fixture.whenStable().then(() => {
                const selectElement = fixture.nativeElement.querySelector('mat-select');
                expect(selectElement.children.length).toBe(1);
            });
        });

        it('should display the option def details', () => {
            component.processDefinitionList = fakeProcessDefinitions;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const selectElement = fixture.nativeElement.querySelector('mat-select > .mat-select-trigger');
                const optionElement = fixture.nativeElement.querySelectorAll('mat-option');
                selectElement.click();
                expect(selectElement).not.toBeNull();
                expect(selectElement).toBeDefined();
                expect(optionElement).not.toBeNull();
                expect(optionElement).toBeDefined();
            });
        });

        it('should display the key when the processDefinition name is empty or null', () => {
            component.processDefinitionList = fakeNoNameProcessDefinitions;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const selectElement = fixture.nativeElement.querySelector('mat-select > .mat-select-trigger');
                const optionElement = fixture.nativeElement.querySelectorAll('mat-option');
                selectElement.click();
                expect(selectElement).not.toBeNull();
                expect(selectElement).toBeDefined();
                expect(optionElement).not.toBeNull();
                expect(optionElement[0].textContent).toBe('NewProcess 1');
            });
        });

        it('should indicate an error to the user if process defs cannot be loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(throwError({}));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl.innerText.trim()).toBe('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.LOAD_PROCESS_DEFS');
            });
        }));

        it('should show no process available message when no process definition is loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of([]));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const noProcessElement = fixture.nativeElement.querySelector('#no-process-message');
                expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
                expect(noProcessElement.innerText.trim()).toBe('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.NO_PROCESS_DEFINITIONS');
            });
        }));

        it('should select automatically the processDefinition if the app contain only one', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[0]]));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
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
                expect(component.processPayloadCloud.name).toBeNull();
            });
        }));

        it('should select the right process when the processKey begins with the name', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.name = 'My new process';
            component.processDefinitionName = 'process';
            selectOptionByName('process');

            fixture.whenStable().then(() => {
                expect(component.processDefinitionCurrent.name).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[3])).name);
                expect(component.processDefinitionCurrent.key).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[3])).key);
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
                    const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
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
                    const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
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
                    const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                    expect(selectElement).not.toBeNull();
                });
            }));
        });
    });

    describe('input changes', () => {

        const change = new SimpleChange('myApp', 'myApp1', true);

        beforeEach(async(() => {
            component.appName = 'myApp';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                getDefinitionsSpy.calls.reset();
            });
        }));

        it('should have labels for process name and type', async(() => {
            component.appName = 'myApp';
            component.processDefinitionName = 'NewProcess 2';
            component.ngOnChanges({});
            fixture.detectChanges();
            const inputLabelsNodes = document.querySelectorAll('.adf-start-process .adf-process-input-container mat-label');
            expect(inputLabelsNodes.length).toBe(2);
        }));

        it('should have floating labels for process name and type', async(() => {
            component.appName = 'myApp';
            component.processDefinitionName = 'NewProcess 2';
            component.ngOnChanges({});
            fixture.detectChanges();
            const inputLabelsNodes = document.querySelectorAll('.adf-start-process .adf-process-input-container');
            inputLabelsNodes.forEach(labelNode => {
                expect(labelNode.getAttribute('ng-reflect-float-label')).toBe('always');
            });
        }));

        it('should reload processes when appName input changed', async(() => {
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getDefinitionsSpy).toHaveBeenCalledWith('myApp1');
            });
        }));

        it('should get current processDef', () => {
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.processDefinitionList).toBe(fakeProcessDefinitions);
        });

        it('should display the matching results in the dropdown as the user types down', fakeAsync(() => {
            component.processDefinitionList = fakeProcessDefinitions;
            component.ngOnInit();
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();

            component.processForm.controls['processDefinition'].setValue('process');
            fixture.detectChanges();
            tick(3000);
            expect(component.filteredProcesses.length).toEqual(4);

            component.processForm.controls['processDefinition'].setValue('processwithfo');
            fixture.detectChanges();
            tick(3000);
            expect(component.filteredProcesses.length).toEqual(1);
        }));

        it('should display the process definion field as empty if are more than one process definition in the list', async(() => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const processDefinitionInput = fixture.nativeElement.querySelector('#processDefinitionName');
                expect(processDefinitionInput.textContent).toEqual('');
            });
        }));
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

        it('should call service to start process with the correct parameters', async(() => {
            component.processPayloadCloud = fakeProcessPayload;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('myApp', fakeProcessPayload);
            });
        }));

        it('should call service to start process with the variables setted', async(() => {
            const inputProcessVariable: Map<string, object>[] = [];
            inputProcessVariable['name'] = {value: 'Josh'};

            component.variables = inputProcessVariable;
            component.processPayloadCloud = fakeProcessPayload;

            component.startProcess();
            fixture.whenStable().then(() => {
                expect(component.processPayloadCloud.variables).toBe(inputProcessVariable);
            });
        }));

        it('should output start event when process started successfully', async(() => {
            const emitSpy = spyOn(component.success, 'emit');
            component.processPayloadCloud = fakeProcessPayload;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(emitSpy).toHaveBeenCalledWith(fakeProcessInstance);
            });
        }));

        it('should throw error event when process cannot be started', async(() => {
            const errorSpy = spyOn(component.error, 'emit');
            const error = { message: 'My error' };
            startProcessSpy = startProcessSpy.and.returnValue(throwError(error));
            component.processPayloadCloud = fakeProcessPayload;
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(errorSpy).toHaveBeenCalledWith(error);
            });
        }));

        it('should indicate an error to the user if process cannot be started', async(() => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
            startProcessSpy = startProcessSpy.and.returnValue(throwError({}));
            component.startProcess();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl.innerText.trim()).toBe('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.START');
            });
        }));

        it('should emit start event when start select a process and add a name', (done) => {
            const disposableStart = component.success.subscribe(() => {
                disposableStart.unsubscribe();
                done();
            });

            component.processPayloadCloud = fakeProcessPayload;
            component.name = 'NewProcess 1';
            component.startProcess();
            fixture.detectChanges();
        });

        it('should be able to start the process when the required fields are filled up', (done) => {
            component.processForm.controls['processInstanceName'].setValue('My Process 1');
            component.processForm.controls['processDefinition'].setValue('NewProcess 1');

            const disposableStart = component.success.subscribe(() => {
                disposableStart.unsubscribe();
                done();
            });

            component.startProcess();
        });

        it('should emit error when process name field is empty', () => {
            fixture.detectChanges();
            const processInstanceName = component.processForm.controls['processInstanceName'];
            processInstanceName.setValue('');
            fixture.detectChanges();
            expect(processInstanceName.valid).toBeFalsy();
            processInstanceName.setValue('task');
            fixture.detectChanges();
            expect(processInstanceName.valid).toBeTruthy();
        });

        it('should emit processDefinitionSelection event when a process definition is selected', (done) => {
            component.processDefinitionSelection.subscribe((processDefinition) => {
                expect(processDefinition).toEqual(fakeProcessDefinitions[0]);
                done();
            });
            fixture.detectChanges();
            selectOptionByName(fakeProcessDefinitions[0].name);
        });
    });
});
