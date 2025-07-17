/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormModel } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { FormCloudService } from '../../../form/services/form-cloud.service';
import { StartProcessCloudComponent } from './start-process-cloud.component';
import {
    fakeProcessDefinitions,
    fakeStartForm,
    fakeStartFormNotValid,
    fakeProcessInstance,
    fakeProcessWithFormInstance,
    fakeNoNameProcessDefinitions,
    fakeSingleProcessDefinition,
    fakeSingleProcessDefinitionWithoutForm,
    fakeFormModelJson,
    fakeStartFormWithOutcomes
} from '../mock/start-process.component.mock';
import { By } from '@angular/platform-browser';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessWithFormPayloadCloud } from '../models/process-with-form-payload-cloud.model';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ESCAPE } from '@angular/cdk/keycodes';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { TaskVariableCloud } from '../../../form/models/task-variable-cloud.model';
import { first } from 'rxjs/operators';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { FormCloudDisplayMode } from '../../../services/form-fields.interfaces';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatDialog } from '@angular/material/dialog';

describe('StartProcessCloudComponent', () => {
    let loader: HarnessLoader;
    let documentRootLoader: HarnessLoader;
    let component: StartProcessCloudComponent;
    let fixture: ComponentFixture<StartProcessCloudComponent>;
    let processService: StartProcessCloudService;
    let formCloudService: FormCloudService;
    let getDefinitionsSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let startProcessWithFormSpy: jasmine.Spy;
    let formDefinitionSpy: jasmine.Spy;
    let getStartEventFormStaticValuesMappingSpy: jasmine.Spy;
    let getStartEventConstantSpy: jasmine.Spy;

    const firstChange = new SimpleChange(undefined, 'myApp', true);

    const selectOptionByName = async (name: string) => {
        const arrowButton = await loader.getHarness(MatButtonHarness.with({ selector: '#adf-select-process-dropdown' }));
        await arrowButton.click();

        const panel = await loader.getHarness(MatAutocompleteHarness);
        await panel.selectOption({ text: name });
        fixture.detectChanges();
        await fixture.whenStable();
    };

    const typeValueInto = (selector: any, value: string) => {
        const inputElement = fixture.debugElement.query(By.css(`${selector}`));
        inputElement.nativeElement.value = value;
        inputElement.nativeElement.dispatchEvent(new Event('input'));
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StartProcessCloudComponent]
        });
        processService = TestBed.inject(StartProcessCloudService);
        formCloudService = TestBed.inject(FormCloudService);
        fixture = TestBed.createComponent(StartProcessCloudComponent);
        component = fixture.componentInstance;

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions');
        formDefinitionSpy = spyOn(formCloudService, 'getForm');
        spyOn(processService, 'updateProcess').and.returnValue(of());
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(of(fakeProcessInstance));
        startProcessWithFormSpy = spyOn(processService, 'startProcessWithForm').and.returnValue(of(fakeProcessWithFormInstance));
        getStartEventFormStaticValuesMappingSpy = spyOn(processService, 'getStartEventFormStaticValuesMapping').and.returnValue(of([]));
        getStartEventConstantSpy = spyOn(processService, 'getStartEventConstants').and.returnValue(of([]));
        loader = TestbedHarnessEnvironment.loader(fixture);
        documentRootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    /**
     * Setup the component with the given start event information.
     *
     * @param values the values for the form
     * @param staticValues the static values retrieved from the API for the form
     * @param constantValues the constant values retrieved from the API for customising the buttons
     * @returns the start and cancel buttons HTML elements
     */
    function loadWithStartEventInformation(
        values?: TaskVariableCloud[],
        staticValues?: TaskVariableCloud[] | Error,
        constantValues?: TaskVariableCloud[] | Error
    ): {
        startButton: any;
        cancelButton: any;
    } {
        if (values) {
            component.values = values;
        }
        if (staticValues) {
            if (staticValues instanceof Error) {
                getStartEventConstantSpy.and.returnValue(throwError(() => staticValues));
            } else {
                getStartEventFormStaticValuesMappingSpy.and.returnValue(of(staticValues));
            }
        }
        if (constantValues) {
            if (constantValues instanceof Error) {
                getStartEventConstantSpy.and.returnValue(throwError(() => constantValues));
            } else {
                getStartEventConstantSpy.and.returnValue(of(constantValues));
            }
        }

        component.name = 'My new process';
        component.processDefinitionName = 'processwithoutform2';
        getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinitionWithoutForm(component.processDefinitionName)));
        fixture.detectChanges();

        const change = new SimpleChange(null, 'MyApp', true);
        component.ngOnChanges({ appName: change });
        fixture.detectChanges();
        tick(550);
        fixture.detectChanges();

        const startButton = fixture.nativeElement.querySelector('#button-start');
        const cancelButton = fixture.nativeElement.querySelector('#cancel_process');

        return { startButton, cancelButton };
    }

    describe('start a process without start form', () => {
        beforeEach(() => {
            component.name = 'My formless new process';
            component.appName = 'myApp';
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            fixture.detectChanges();
            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
        });

        it('should be able to start a process with a valid process name and process definition', fakeAsync(() => {
            component.name = 'My new process';
            component.processDefinitionName = 'processwithoutform2';
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinitionWithoutForm(component.processDefinitionName)));
            fixture.detectChanges();

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            tick(550);

            fixture.detectChanges();
            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(component.isProcessFormValid).toBe(true);
            expect(startBtn.disabled).toBe(false);
        }));

        it('should create a process instance if the selection is valid', async () => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.name = 'My new process';
            component.processDefinitionName = 'process';
            await selectOptionByName('processwithoutform2');

            expect(component.processDefinitionCurrent.name).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[1])).name);
            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(component.isProcessFormValid).toBe(true);
            expect(startBtn.disabled).toBe(false);
        });

        it('should have start button disabled when no process is selected', async () => {
            component.name = '';
            component.processDefinitionName = '';

            fixture.detectChanges();
            await fixture.whenStable();

            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(startBtn.disabled).toBe(true);
            expect(component.isProcessFormValid).toBe(false);
        });

        it('should have start button disabled when name not filled out', async () => {
            component.name = '';
            component.processDefinitionName = 'processwithoutform2';

            fixture.detectChanges();
            await fixture.whenStable();

            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(startBtn.disabled).toBe(true);
            expect(component.isProcessFormValid).toBe(false);
        });

        it('should include the static input mappings in the resolved values', fakeAsync(() => {
            const values: TaskVariableCloud[] = [
                new TaskVariableCloud({ name: 'value1', value: 'value' }),
                new TaskVariableCloud({ name: 'value2', value: 1 }),
                new TaskVariableCloud({ name: 'value3', value: false })
            ];
            const staticInputs: TaskVariableCloud[] = [
                new TaskVariableCloud({ name: 'static1', value: 'static value' }),
                new TaskVariableCloud({ name: 'static2', value: 0 }),
                new TaskVariableCloud({ name: 'static3', value: true })
            ];

            loadWithStartEventInformation(values, staticInputs);

            expect(component.resolvedValues).toEqual(staticInputs.concat(values));
        }));

        describe('start event constants', () => {
            it('should not display the buttons when they are disabled by the constants', fakeAsync(() => {
                const constants: TaskVariableCloud[] = [
                    new TaskVariableCloud({ name: 'startEnabled', value: 'false' }),
                    new TaskVariableCloud({ name: 'cancelEnabled', value: 'false' })
                ];

                const { startButton, cancelButton } = loadWithStartEventInformation(null, null, constants);

                expect(startButton).toBeNull();
                expect(cancelButton).toBeNull();
            }));

            it('should display the customised button labels when they are set in the constants', fakeAsync(() => {
                const constants: TaskVariableCloud[] = [
                    new TaskVariableCloud({ name: 'startEnabled', value: 'true' }),
                    new TaskVariableCloud({ name: 'startLabel', value: 'Start' }),
                    new TaskVariableCloud({ name: 'cancelEnabled', value: 'true' }),
                    new TaskVariableCloud({ name: 'cancelLabel', value: 'Cancel' })
                ];
                const { startButton, cancelButton } = loadWithStartEventInformation(null, null, constants);

                expect(startButton.textContent?.trim()).toEqual('Start');
                expect(cancelButton.textContent?.trim()).toEqual('Cancel');
            }));

            it('should load with default values when retrieving the constants fails', fakeAsync(() => {
                const { startButton, cancelButton } = loadWithStartEventInformation(null, null, new Error('test'));

                expect(startButton).not.toBeNull();
                expect(cancelButton).not.toBeNull();
                expect(startButton.textContent?.trim()).toEqual(component.defaultStartProcessButtonLabel);
                expect(cancelButton.textContent?.trim()).toEqual(component.defaultCancelProcessButtonLabel);
            }));
        });
    });

    describe('start a process with start form', () => {
        beforeEach(() => {
            component.name = 'My new process with form';
            component.appName = 'startformwithoutupload';
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            fixture.detectChanges();
            const change = new SimpleChange(null, 'startformwithoutupload', true);
            component.ngOnChanges({ appName: change });
            component.values = [
                {
                    id: '1',
                    type: 'string',
                    name: 'firstName',
                    value: 'FakeName',
                    get hasValue() {
                        return this['value'];
                    },
                    set hasValue(value) {
                        this['value'] = value;
                    }
                },
                {
                    id: '1',
                    type: 'string',
                    name: 'lastName',
                    value: 'FakeLastName',
                    get hasValue() {
                        return this['value'];
                    },
                    set hasValue(value) {
                        this['value'] = value;
                    }
                }
            ];
            fixture.detectChanges();
        });

        it('should be able to start a process with a valid form', async () => {
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition('processwithform')));
            typeValueInto('[data-automation-id="adf-inplace-input"]', 'My new process with form');
            typeValueInto('#processDefinitionName', 'processwithform');
            fixture.detectChanges();
            await fixture.whenStable();

            fixture.detectChanges();
            const firstNameEl = fixture.nativeElement.querySelector('#firstName');
            expect(firstNameEl).toBeDefined();
            const lastNameEl = fixture.nativeElement.querySelector('#lastName');
            expect(lastNameEl).toBeDefined();
            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(component.formCloud.isValid).toBe(true);
            expect(startBtn.disabled).toBe(false);
        });

        it('should be able to start a process with form full display mode', async () => {
            component.displayModeConfigurations = [
                {
                    displayMode: FormCloudDisplayMode.fullScreen,
                    options: {
                        onDisplayModeOn: () => {},
                        onDisplayModeOff: () => {},
                        onCompleteTask: () => {},
                        onSaveTask: () => {},
                        fullscreen: true,
                        displayToolbar: true,
                        displayCloseButton: true,
                        trapFocus: true
                    }
                }
            ];

            const fakeStartFormClone = structuredClone(fakeStartForm);

            (fakeStartFormClone.formRepresentation as any).displayMode = FormCloudDisplayMode.fullScreen;

            formDefinitionSpy.and.returnValue(of(fakeStartFormClone));
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition('processwithform')));
            typeValueInto('[data-automation-id="adf-inplace-input"]', 'My new process with form');
            typeValueInto('#processDefinitionName', 'processwithform');
            fixture.detectChanges();
            await fixture.whenStable();

            fixture.detectChanges();
            const firstNameEl = fixture.nativeElement.querySelector('#firstName');
            expect(firstNameEl).toBeDefined();
            const lastNameEl = fixture.nativeElement.querySelector('#lastName');
            expect(lastNameEl).toBeDefined();
            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(component.formCloud.isValid).toBe(true);
            expect(startBtn.disabled).toBe(false);
        });

        it('should NOT be able to start a process with a form NOT valid', async () => {
            formDefinitionSpy.and.returnValue(of(fakeStartFormNotValid));
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition('processwithform')));
            typeValueInto('[data-automation-id="adf-inplace-input"]', 'My new process with form');
            typeValueInto('#processDefinitionName', 'processwithform');
            fixture.detectChanges();
            await fixture.whenStable();

            fixture.detectChanges();
            const firstNameEl = fixture.nativeElement.querySelector('#firstName');
            expect(firstNameEl).toBeDefined();
            const lastNameEl = fixture.nativeElement.querySelector('#lastName');
            expect(lastNameEl).toBeDefined();
            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(component.formCloud.isValid).toBe(false);
            expect(startBtn.disabled).toBe(true);
        });

        it('should be able to start a process with a prefilled valid form', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition('processwithform')));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            typeValueInto('[data-automation-id="adf-inplace-input"]', 'My new process with form');
            typeValueInto('#processDefinitionName', 'processwithform');
            fixture.detectChanges();
            await fixture.whenStable();

            fixture.detectChanges();
            await fixture.whenStable();
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

        it('should NOT be able to start a process with a prefilled NOT valid form', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition('processwithform')));
            formDefinitionSpy.and.returnValue(of(fakeStartFormNotValid));
            typeValueInto('[data-automation-id="adf-inplace-input"]', 'My new process with form');
            typeValueInto('#processDefinitionName', 'processwithform');
            fixture.detectChanges();
            await fixture.whenStable();

            fixture.detectChanges();
            await fixture.whenStable();
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

        it('should display enabled start process button if the selection is valid', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition('processwithoutform2')));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            typeValueInto('[data-automation-id="adf-inplace-input"]', 'My new process with form');
            typeValueInto('#processDefinitionName', 'processwithoutform2');
            fixture.detectChanges();
            await fixture.whenStable();

            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(startBtn.disabled).toBe(false);
            expect(component.isProcessFormValid).toBe(true);
        });

        it('should have start button enabled when default values are set', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinition('processwithoutform2')));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            await fixture.whenStable();

            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(startBtn.disabled).toBe(false);
        });
    });

    describe('process definitions list', () => {
        beforeEach(() => {
            component.name = 'My new process';
            component.appName = 'myApp';
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            fixture.detectChanges();
            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
        });

        it('should call service to fetch process definitions with appId', async () => {
            await fixture.whenStable();

            expect(getDefinitionsSpy).toHaveBeenCalledWith('MyApp');
        });

        it('should display the correct number of processes in the select list', async () => {
            const arrowButton = await loader.getHarness(MatButtonHarness.with({ selector: '#adf-select-process-dropdown' }));
            await arrowButton.click();

            const panel = await loader.getHarness(MatAutocompleteHarness);
            const options = await panel.getOptions();
            expect(options.length).toBe(4);
        });

        it('should display the key when the processDefinition name is empty or null', async () => {
            component.processDefinitionList = fakeNoNameProcessDefinitions;
            fixture.detectChanges();
            await fixture.whenStable();

            const arrowButton = await loader.getHarness(MatButtonHarness.with({ selector: '#adf-select-process-dropdown' }));
            await arrowButton.click();

            const panel = await loader.getHarness(MatAutocompleteHarness);
            const options = await panel.getOptions();
            expect(await options[0].getText()).toBe('NewProcess 1');
        });

        it('should indicate an error to the user if process defs cannot be loaded', async () => {
            getDefinitionsSpy.and.returnValue(throwError({}));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const errorEl = fixture.nativeElement.querySelector('#error-message');
            expect(errorEl.innerText.trim()).toBe('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.LOAD_PROCESS_DEFS');
        });

        it('should show no process available message when no process definition is loaded', async () => {
            getDefinitionsSpy.and.returnValue(of([]));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const noProcessElement = fixture.nativeElement.querySelector('#no-process-message');
            expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
            expect(noProcessElement.innerText.trim()).toBe('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.NO_PROCESS_DEFINITIONS');
        });

        it('should select automatically the processDefinition if the app contain only one', async () => {
            getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[0]]));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.processForm.controls['processDefinition'].value).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[0])).name);
        });

        it('should select automatically the form when processDefinition is selected as default', async () => {
            getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[2]]));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            await fixture.whenStable();

            await selectOptionByName('processwithform');

            component.processDefinitionName = fakeProcessDefinitions[2].name;
            component.setProcessDefinitionOnForm(fakeProcessDefinitions[2].name);
            fixture.detectChanges();
            await fixture.whenStable();

            const processForm = fixture.nativeElement.querySelector('adf-cloud-form');
            expect(component.hasForm).toBeTruthy();
            expect(processForm).not.toBeNull();
        });

        it('should not select automatically any processDefinition if the app contain multiple process and does not have any processDefinition as input', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.appName = 'myApp';
            component.ngOnChanges({});

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.processPayloadCloud.name).toBeUndefined();
        });

        it('should select the right process when the processKey begins with the name', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            component.name = 'My new process';
            component.processDefinitionName = 'process';
            component.appName = 'myApp';
            component.ngOnChanges({});
            await selectOptionByName('process');

            expect(component.processDefinitionCurrent.name).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[3])).name);
            expect(component.processDefinitionCurrent.key).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[3])).key);
        });

        describe('dropdown', () => {
            it('should hide the process dropdown button if showSelectProcessDropdown is false', async () => {
                fixture.detectChanges();
                getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
                component.appName = 'myApp';
                component.showSelectProcessDropdown = false;
                component.ngOnChanges({});

                fixture.detectChanges();
                await fixture.whenStable();

                const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                expect(selectElement).toBeNull();
            });

            it('should show the process dropdown button if showSelectProcessDropdown is false', async () => {
                fixture.detectChanges();
                getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
                component.appName = 'myApp';
                component.processDefinitionName = 'NewProcess 2';
                component.showSelectProcessDropdown = true;
                component.ngOnChanges({});

                fixture.detectChanges();
                await fixture.whenStable();

                const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                expect(selectElement).not.toBeNull();
            });

            it('should show the process dropdown button by default', async () => {
                fixture.detectChanges();
                getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
                component.appName = 'myApp';
                component.processDefinitionName = 'NewProcess 2';
                component.ngOnChanges({});

                fixture.detectChanges();
                await fixture.whenStable();

                const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                expect(selectElement).not.toBeNull();
            });
        });
    });

    describe('input changes', () => {
        const change = new SimpleChange('myApp', 'myApp1', false);

        beforeEach(() => {
            component.name = 'My new process';
            component.appName = 'myApp';
        });

        it('should reload processes when appName input changed', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: firstChange });
            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getDefinitionsSpy).toHaveBeenCalledWith('myApp1');
        });

        it('should reload processes ONLY when appName input changed', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: firstChange });
            fixture.detectChanges();

            component.ngOnChanges({ maxNameLength: new SimpleChange(0, 2, false) });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getDefinitionsSpy).toHaveBeenCalledTimes(1);
        });

        it('should get current processDef', () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.processDefinitionList).toBe(fakeProcessDefinitions);
        });

        it('should display the matching results in the dropdown as the user types down', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();

            typeValueInto('#processDefinitionName', 'process');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.filteredProcesses.length).toEqual(4);

            typeValueInto('#processDefinitionName', 'processwithfo');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.filteredProcesses.length).toEqual(1);
        });

        it('should display the process definion field as empty if are more than one process definition in the list', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const processDefinitionInput = fixture.nativeElement.querySelector('#processDefinitionName');
            expect(processDefinitionInput.textContent).toEqual('');
        });
    });

    describe('start process', () => {
        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'NewProcess 1';
            component.appName = 'myApp';
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            fixture.detectChanges();
        });

        it('should show start button', () => {
            component.ngOnChanges({ appName: firstChange });
            fixture.detectChanges();

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).toBeDefined();
            expect(startButton).not.toBeNull();
        });

        it('should show start button when start process has form without outcomes', async () => {
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            component.ngOnChanges({ appName: firstChange });
            fixture.detectChanges();

            await selectOptionByName('processwithform');

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).toBeDefined();
            expect(startButton).not.toBeNull();
        });

        it('should NOT see start button when start process has form with outcomes', async () => {
            formDefinitionSpy.and.returnValue(of(fakeStartFormWithOutcomes));
            component.ngOnChanges({ appName: firstChange });
            fixture.detectChanges();

            await selectOptionByName('processwithform');

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).toBeNull();
        });

        it('should call service with the correct parameters when button is clicked and variables are defined and formCloud is undefined', async () => {
            component.ngOnChanges({ appName: firstChange });
            component.processForm.controls['processInstanceName'].setValue('My Process 1');
            component.appName = 'test app name';
            component.variables = { correlationKey: 'AIyRfpxbBX' };
            component.formCloud = null;
            const payload: ProcessPayloadCloud = new ProcessPayloadCloud({
                name: component.processInstanceName.value,
                ProcessDefinitionKey: component.processPayloadCloud.processDefinitionKey,
                variables: Object.assign(component.variables, component.formCloud)
            });

            fixture.detectChanges();
            await fixture.whenStable();
            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();

            startButton.triggerEventHandler('click', null);
            expect(startProcessSpy).toHaveBeenCalledWith(component.appName, payload);

            component.success.pipe(first()).subscribe((data: ProcessInstanceCloud) => {
                expect(data).not.toBeNull();
                expect(data).toEqual(fakeProcessInstance);
            });
        });

        it('should call service with the correct parameters when variables and formCloud are both undefined', async () => {
            component.ngOnChanges({ appName: firstChange });
            component.processForm.controls['processInstanceName'].setValue('My Process 1');
            component.appName = 'test app name';
            component.variables = undefined;
            component.formCloud = undefined;
            const payload: ProcessPayloadCloud = new ProcessPayloadCloud({
                name: component.processInstanceName.value,
                ProcessDefinitionKey: component.processPayloadCloud.processDefinitionKey,
                variables: {}
            });

            fixture.detectChanges();
            await fixture.whenStable();
            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();

            startButton.triggerEventHandler('click', null);
            expect(startProcessSpy).toHaveBeenCalledWith(component.appName, payload);
        });

        it('should call service with the correct parameters when variables and formCloud are both defined', async () => {
            component.ngOnChanges({ appName: firstChange });
            component.processForm.controls['processInstanceName'].setValue('My Process 1');
            component.appName = 'test app name';
            component.variables = { correlationKey: 'AIyRfpxbBX' };
            component.formCloud = new FormModel(JSON.stringify(fakeFormModelJson));
            component.formCloud.values = { dropdown: { id: '1', name: 'label 2' } };

            const payload: ProcessPayloadCloud = new ProcessPayloadCloud({
                name: component.processInstanceName.value,
                ProcessDefinitionKey: component.processPayloadCloud.processDefinitionKey,
                variables: Object.assign(component.variables, component.formCloud.values)
            });

            fixture.detectChanges();
            await fixture.whenStable();
            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();

            startButton.triggerEventHandler('click', null);
            expect(startProcessSpy).toHaveBeenCalledWith(component.appName, payload);
        });

        it('should call service with the correct parameters when formCloud is defined and custom outcome is clicked', async () => {
            formDefinitionSpy.and.returnValue(of(fakeFormModelJson));
            component.ngOnChanges({ appName: firstChange });
            component.processForm.controls['processInstanceName'].setValue('My Process 1');
            component.appName = 'test app name';
            component.formCloud = new FormModel(JSON.stringify(fakeFormModelJson));
            component.formCloud.values = { dropdown: { id: '1', name: 'label 2' } };
            component.processDefinitionCurrent = fakeProcessDefinitions[2];
            component.processPayloadCloud.processDefinitionKey = fakeProcessDefinitions[2].key;

            const payload: ProcessWithFormPayloadCloud = new ProcessWithFormPayloadCloud({
                processName: component.processInstanceName.value,
                processDefinitionKey: fakeProcessDefinitions[2].key,
                variables: {},
                values: component.formCloud.values,
                outcome: 'custom_outcome'
            });

            fixture.detectChanges();

            component.onCustomOutcomeClicked('custom_outcome');

            expect(startProcessWithFormSpy).toHaveBeenCalledWith(
                component.appName,
                fakeProcessDefinitions[2].formKey,
                fakeProcessDefinitions[2].version,
                payload
            );
        });

        it('should call service with the correct parameters when variables are undefined and formCloud is defined', async () => {
            getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[2]]));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            await fixture.whenStable();

            await selectOptionByName('processwithform');

            component.processDefinitionName = fakeProcessDefinitions[2].name;
            component.setProcessDefinitionOnForm(fakeProcessDefinitions[2].name);
            fixture.detectChanges();
            await fixture.whenStable();

            const processForm = fixture.nativeElement.querySelector('adf-cloud-form');
            expect(component.hasForm).toBeTruthy();
            expect(processForm).not.toBeNull();

            const payload: ProcessWithFormPayloadCloud = new ProcessWithFormPayloadCloud({
                processName: component.processInstanceName.value,
                processDefinitionKey: fakeProcessDefinitions[2].key,
                variables: {},
                values: component.formCloud.values
            });
            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();

            startButton.triggerEventHandler('click', null);
            expect(startProcessWithFormSpy).toHaveBeenCalledWith(
                component.appName,
                component.processDefinitionCurrent.formKey,
                component.processDefinitionCurrent.version,
                payload
            );
        });

        it('should output start event when process started successfully', () => {
            const emitSpy = spyOn(component.success, 'emit');
            component.startProcess();
            expect(emitSpy).toHaveBeenCalledWith(fakeProcessInstance);
        });

        it('should throw error event when process cannot be started', async () => {
            const errorSpy = spyOn(component.error, 'emit');
            const error = { message: 'My error' };
            startProcessSpy = startProcessSpy.and.returnValue(throwError(error));
            component.startProcess();
            await fixture.whenStable();
            expect(errorSpy).toHaveBeenCalledWith(error);
        });

        it('should indicate an error to the user if process cannot be started', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
            startProcessSpy = startProcessSpy.and.returnValue(throwError({}));
            component.startProcess();

            fixture.detectChanges();
            await fixture.whenStable();

            const errorEl = fixture.nativeElement.querySelector('#error-message');
            expect(errorEl.innerText.trim()).toBe('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.START');
        });

        it('should emit start event when start select a process and add a name', (done) => {
            const disposableStart = component.success.subscribe(() => {
                disposableStart.unsubscribe();
                expect(startProcessSpy).toHaveBeenCalled();
                done();
            });

            component.name = 'NewProcess 1';
            component.startProcess();
            fixture.detectChanges();
        });

        it('should be able to start the process when the required fields are filled up', (done) => {
            component.processForm.controls['processInstanceName'].setValue('My Process 1');
            component.processForm.controls['processDefinition'].setValue('NewProcess 1');

            const disposableStart = component.success.subscribe(() => {
                disposableStart.unsubscribe();
                expect(startProcessSpy).toHaveBeenCalled();
                done();
            });
            component.startProcess();
        });

        it('should open confirmation dialog on start process if confirmMessage.show is true', async () => {
            component.formCloud = new FormModel({ confirmMessage: { show: true } });

            let dialogs = await documentRootLoader.getAllHarnesses(MatDialogHarness);
            expect(dialogs.length).toBe(0);

            component.startProcess();

            dialogs = await documentRootLoader.getAllHarnesses(MatDialogHarness);
            expect(dialogs.length).toBe(1);
        });

        it('should start process when user confirms', () => {
            const matDialog = TestBed.inject(MatDialog);
            spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(true) } as never);
            fixture.detectChanges();

            component.formCloud = new FormModel({ confirmMessage: { show: true } });

            component.startProcess();

            expect(startProcessSpy).toHaveBeenCalled();
        });

        it('should not start process if user rejects', () => {
            const matDialog = TestBed.inject(MatDialog);
            spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(false) } as never);
            fixture.detectChanges();

            component.formCloud = new FormModel({ confirmMessage: { show: true } });

            component.startProcess();

            expect(startProcessSpy).not.toHaveBeenCalled();
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

        it('should have start button disabled if process definition name has a space as the first or last character', async () => {
            component.appName = 'myApp';
            component.processDefinitionName = ' Space in the beginning';
            component.ngOnChanges({ appName: firstChange });

            fixture.detectChanges();
            await fixture.whenStable();

            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(startBtn.disabled).toBe(true);
            component.processDefinitionName = 'Space in the end ';

            fixture.detectChanges();
            await fixture.whenStable();

            expect(startBtn.disabled).toBe(true);
        });

        it('should emit processDefinitionSelection event when a process definition is selected', async () => {
            const emitSpy = spyOn(component.processDefinitionSelection, 'emit');
            component.appName = 'myApp';
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            component.ngOnChanges({ appName: firstChange });
            fixture.detectChanges();
            await fixture.whenStable();
            component.processDefinitionName = 'processwithoutform1';
            await selectOptionByName(fakeProcessDefinitions[0].name);
            expect(emitSpy).toHaveBeenCalledOnceWith(fakeProcessDefinitions[0]);
        });

        it('should wait for process definition to be loaded before showing the empty process definition message', () => {
            component.processDefinitionLoaded = false;
            fixture.detectChanges();
            let noProcessElement = fixture.nativeElement.querySelector('#no-process-message');
            expect(noProcessElement).toBeNull();
            getDefinitionsSpy.and.returnValue(of([]));

            component.loadProcessDefinitions();
            fixture.detectChanges();
            noProcessElement = fixture.nativeElement.querySelector('#no-process-message');
            expect(noProcessElement).not.toBeNull();
        });

        it('should set the process name using the processName cloud pipe when a process definition gets selected', async () => {
            const getDefaultProcessNameSpy = spyOn(component, 'getDefaultProcessName').and.returnValue('fake-transformed-name');
            const expectedProcessInstanceDetails: ProcessInstanceCloud = { processDefinitionName: fakeProcessDefinitions[0].name };
            getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[0]]));
            formDefinitionSpy.and.stub();

            component.appName = 'myApp';
            component.ngOnChanges({ appName: firstChange });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getDefaultProcessNameSpy).toHaveBeenCalledWith(component.name, expectedProcessInstanceDetails);
            expect(component.processInstanceName.dirty).toBe(true);
            expect(component.processInstanceName.touched).toBe(true);
            expect(component.processInstanceName.value).toEqual('fake-transformed-name');
        });

        it('should set the process name on when a process definition name is present', (done) => {
            const definitions: ProcessDefinitionCloud[] = [
                {
                    appName: 'app',
                    appVersion: 1,
                    category: '',
                    description: '',
                    id: 'id',
                    key: 'key',
                    name: 'fake-name',
                    version: 1
                }
            ];

            component.processInstanceName.valueChanges.subscribe((value) => {
                expect(value).toBe(fakeTransformedName);
                done();
            });

            getDefinitionsSpy.and.returnValue(of(definitions));

            const fakeTransformedName = 'fake-transformed-name';
            spyOn(component, 'getDefaultProcessName').and.returnValue(fakeTransformedName);

            component.processDefinitionName = 'fake-name';
            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ appName: change });
        });

        it('should stop propagation on keydown event', () => {
            const escapeKeyboardEvent = new KeyboardEvent('keydown', { key: ESCAPE.toString() });
            const stopPropagationSpy = spyOn(escapeKeyboardEvent, 'stopPropagation');

            fixture.debugElement.triggerEventHandler('keydown', escapeKeyboardEvent);

            expect(stopPropagationSpy).toHaveBeenCalled();
        });

        it('should hide title', () => {
            component.showTitle = false;
            fixture.detectChanges();

            const title = fixture.debugElement.query(By.css('.adf-title'));

            expect(title).toBeFalsy();
        });

        it('should show title', () => {
            component.processDefinitionLoaded = true;
            fixture.detectChanges();

            const title = fixture.debugElement.query(By.css('.adf-title'));

            expect(title).toBeTruthy();
        });

        it('should show process definition dropdown', () => {
            component.processDefinitionLoaded = true;
            component.processDefinitionList = fakeProcessDefinitions;
            fixture.detectChanges();

            const processDropdown = fixture.debugElement.query(By.css('[data-automation-id="adf-select-cloud-process-dropdown"]'));

            expect(processDropdown).toBeTruthy();
        });

        it('should hide process definition dropdown', () => {
            component.processDefinitionLoaded = true;
            component.processDefinitionList = fakeProcessDefinitions;
            component.showSelectProcessDropdown = false;
            fixture.detectChanges();

            const processDropdown = fixture.debugElement.query(By.css('#processDefinitionName'));

            expect(processDropdown).toBeFalsy();
        });

        it('should show the loading spinner before process definitions loaded', () => {
            component.processDefinitionLoaded = false;
            fixture.detectChanges();

            const spinner = fixture.debugElement.query(By.css('.adf-loading'));

            expect(spinner).toBeTruthy();
        });

        it('should show the process card after process definitions loaded', () => {
            component.processDefinitionLoaded = true;
            fixture.detectChanges();

            const card = fixture.debugElement.query(By.css('.adf-start-process'));

            expect(card).toBeTruthy();
        });
    });

    describe('start button', () => {
        beforeEach(() => {
            component.name = 'NewProcess 1';
            component.appName = 'myApp';
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: firstChange });
            component.processDefinitionList = fakeProcessDefinitions;
            component.processDefinitionName = fakeProcessDefinitions[0].name;
        });

        it('start process button should be enabled when isProcessStarting is false', async () => {
            fixture.detectChanges();
            component.processForm.controls['processInstanceName'].setValue(fakeProcessDefinitions[0].id);
            component.appName = 'test app name';
            component.isProcessStarting = false;
            fixture.detectChanges();
            await fixture.whenStable();

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();
            expect(component.disableStartButton).toBeFalse();
            expect((startButton.nativeElement as HTMLButtonElement).disabled).toBeFalse();
        });

        it('start process button should be disabled when isFormCloudLoading is true', async () => {
            fixture.detectChanges();
            component.processForm.controls['processInstanceName'].setValue(fakeProcessDefinitions[0].id);
            component.appName = 'test app name';
            component.isFormCloudLoading = true;
            fixture.detectChanges();
            await fixture.whenStable();

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();
            expect(component.disableStartButton).toBeTrue();
            expect((startButton.nativeElement as HTMLButtonElement).disabled).toBeTrue();
        });

        it('start process button should be disabled when isLoading is true', async () => {
            fixture.detectChanges();
            component.processForm.controls['processInstanceName'].setValue(fakeProcessDefinitions[0].id);
            component.appName = 'test app name';
            component.isProcessStarting = true;
            fixture.detectChanges();
            await fixture.whenStable();

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();
            expect(component.disableStartButton).toBeTrue();
            expect((startButton.nativeElement as HTMLButtonElement).disabled).toBeTrue();
        });
    });

    describe('cancel process', () => {
        beforeEach(() => {
            component.name = 'NewProcess 1';
            component.appName = 'myApp';
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: firstChange });
            fixture.detectChanges();
        });

        it('user should see cancel button', () => {
            const startButton = fixture.debugElement.query(By.css('#cancel_process'));
            expect(startButton).toBeDefined();
            expect(startButton).not.toBeNull();
        });

        it('undefined should be emitted when cancel button clicked', () => {
            component.cancel.pipe(first()).subscribe((data: any) => {
                expect(data).not.toBeDefined();
            });
            component.cancelStartProcess();
        });
    });
});
