/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormModel, setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { FormCloudService } from '../../../form/services/form-cloud.service';
import { StartProcessCloudComponent } from './start-process-cloud.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule, MatRippleModule, MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    fakeProcessDefinitions, fakeStartForm, fakeStartFormNotValid,
    fakeProcessInstance, fakeNoNameProcessDefinitions,
    fakeSingleProcessDefinition,
    fakeSingleProcessDefinitionWithoutForm,
    fakeFormModelJson
} from '../mock/start-process.component.mock';
import { By } from '@angular/platform-browser';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessNameCloudPipe } from '../../../pipes/process-name-cloud.pipe';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ESCAPE } from '@angular/cdk/keycodes';
import { ProcessDefinitionCloud, TaskVariableCloud } from '@alfresco/adf-process-services-cloud';
import { first } from 'rxjs/operators';

describe('StartProcessCloudComponent', () => {

    let component: StartProcessCloudComponent;
    let fixture: ComponentFixture<StartProcessCloudComponent>;
    let processService: StartProcessCloudService;
    let formCloudService: FormCloudService;
    let getDefinitionsSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let formDefinitionSpy: jasmine.Spy;
    let getStartEventFormStaticValuesMappingSpy: jasmine.Spy;

    const firstChange = new SimpleChange(undefined, 'myApp', true);

    const selectOptionByName = async (name: string) => {

        const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
        selectElement.click();
        fixture.detectChanges();
        await fixture.whenStable();
        const options: any = fixture.debugElement.queryAll(By.css('.mat-autocomplete-panel .mat-option'));
        const currentOption: DebugElement = options.find((option: DebugElement) => option.nativeElement.querySelector('.mat-option-text').innerHTML.trim() === name);

        if (currentOption) {
            currentOption.nativeElement.click();
        }
    };

    const typeValueInto = (selector: any, value: string) => {
        const inputElement = fixture.debugElement.query(By.css(`${selector}`));
        inputElement.nativeElement.value = value;
        inputElement.nativeElement.dispatchEvent(new Event('input'));
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            FormsModule,
            MatCommonModule,
            ReactiveFormsModule,
            MatCardModule,
            MatIconModule,
            MatAutocompleteModule,
            MatOptionModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatRippleModule
        ]
    });

    beforeEach(() => {
        processService = TestBed.inject(StartProcessCloudService);
        formCloudService = TestBed.inject(FormCloudService);
        fixture = TestBed.createComponent(StartProcessCloudComponent);
        component = fixture.componentInstance;

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions');
        formDefinitionSpy = spyOn(formCloudService, 'getForm');
        spyOn(processService, 'updateProcess').and.returnValue(of());
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(of(fakeProcessInstance));
        getStartEventFormStaticValuesMappingSpy = spyOn(processService, 'getStartEventFormStaticValuesMapping').and.returnValue(of([]));
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

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
            expect(component.isProcessFormValid()).toBe(true);
            expect(startBtn.disabled).toBe(false);
        }));

        it('should create a process instance if the selection is valid', async () => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.name = 'My new process';
            component.processDefinitionName = 'process';
            await selectOptionByName('processwithoutform2');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.processDefinitionCurrent.name).toBe(JSON.parse(JSON.stringify(fakeProcessDefinitions[1])).name);
            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(component.isProcessFormValid()).toBe(true);
            expect(startBtn.disabled).toBe(false);
        });

        it('should have start button disabled when no process is selected', async () => {
            component.name = '';
            component.processDefinitionName = '';

            fixture.detectChanges();
            await fixture.whenStable();

            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(startBtn.disabled).toBe(true);
            expect(component.isProcessFormValid()).toBe(false);
        });

        it('should have start button disabled when name not filled out', async () => {
            component.name = '';
            component.processDefinitionName = 'processwithoutform2';

            fixture.detectChanges();
            await fixture.whenStable();

            const startBtn = fixture.nativeElement.querySelector('#button-start');
            expect(startBtn.disabled).toBe(true);
            expect(component.isProcessFormValid()).toBe(false);
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
            component.name = 'My new process';
            component.processDefinitionName = 'processwithoutform2';
            component.values = values;
            getDefinitionsSpy.and.returnValue(of(fakeSingleProcessDefinitionWithoutForm(component.processDefinitionName)));
            getStartEventFormStaticValuesMappingSpy.and.returnValue(of(staticInputs));
            fixture.detectChanges();

            const change = new SimpleChange(null, 'MyApp', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            tick(550);
            expect(component.resolvedValues).toEqual(staticInputs.concat(values));
        }));
    });

    describe('start a process with start form', () => {

        beforeEach(() => {
            component.name = 'My new process with form';
            component.appName = 'startformwithoutupload';
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            fixture.detectChanges();
            const change = new SimpleChange(null, 'startformwithoutupload', true);
            component.ngOnChanges({ appName: change });
            component.values = [{
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
            }, {
                id: '1', type: 'string',
                name: 'lastName',
                value: 'FakeLastName',
                get hasValue() {
                    return this['value'];
                },
                set hasValue(value) {
                    this['value'] = value;
                }
            }];
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
            expect(component.isProcessFormValid()).toBe(true);
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
            await fixture.whenStable();

            const arrowButton = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
            arrowButton.click();
            fixture.detectChanges();
            const processLists = fixture.debugElement.query(By.css('.mat-autocomplete-panel'));
            expect(processLists.children.length).toBe(4);
        });

        it('should display the option def details', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
            selectElement.click();
            fixture.detectChanges();
            const optionElement = fixture.debugElement.queryAll(By.css('.mat-autocomplete-panel .mat-option'));
            expect(selectElement).not.toBeNull();
            expect(selectElement).toBeDefined();
            expect(optionElement).not.toBeNull();
            expect(optionElement).toBeDefined();
        });

        it('should display the key when the processDefinition name is empty or null', async () => {
            component.processDefinitionList = fakeNoNameProcessDefinitions;
            fixture.detectChanges();
            await fixture.whenStable();

            const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
            selectElement.click();
            fixture.detectChanges();
            const optionElement = fixture.debugElement.queryAll(By.css('.mat-autocomplete-panel .mat-option'));
            expect(selectElement).not.toBeNull();
            expect(selectElement).toBeDefined();
            expect(optionElement).not.toBeNull();
            expect(optionElement[0].nativeElement.textContent.trim()).toBe('NewProcess 1');
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
            fixture.detectChanges();
            await fixture.whenStable();

            component.processDefinitionName = fakeProcessDefinitions[2].name;
            component.setProcessDefinitionOnForm(fakeProcessDefinitions[2].name);
            fixture.detectChanges();
            await fixture.whenStable();

            const processForm = fixture.nativeElement.querySelector('adf-cloud-form');
            expect(component.hasForm()).toBeTruthy();
            expect(processForm).not.toBeNull();
        });

        it('should not select automatically any processDefinition if the app contain multiple process and does not have any processDefinition as input', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.appName = 'myApp';
            component.ngOnChanges({});

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.processPayloadCloud.name).toBeNull();
        });

        it('should select the right process when the processKey begins with the name', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            component.name = 'My new process';
            component.processDefinitionName = 'process';
            component.appName = 'myApp';
            component.ngOnChanges({});
            selectOptionByName('process');

            fixture.detectChanges();
            await fixture.whenStable();

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
            fixture.detectChanges();
        });

        it('should have floating labels for process name and type', async () => {
            getDefinitionsSpy.and.returnValue(of(fakeProcessDefinitions));
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            await fixture.whenStable();
            component.processForm.controls.processInstanceName.setValue('My sharona');
            component.processForm.controls.processDefinition.setValue('process');

            fixture.detectChanges();

            const inputLabelsNodes = document.querySelectorAll('.mat-form-field-label');
            expect(inputLabelsNodes.length).toBe(2);
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

        it('should see start button', async () => {
            component.ngOnChanges({ appName: firstChange });
            fixture.detectChanges();
            await fixture.whenStable();

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).toBeDefined();
            expect(startButton).not.toBeNull();
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

        it('should call service with the correct parameters when variables are undefined and formCloud is defined', async () => {
            getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[2]]));
            formDefinitionSpy.and.returnValue(of(fakeStartForm));
            const change = new SimpleChange('myApp', 'myApp1', true);
            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            await fixture.whenStable();

            await selectOptionByName('processwithform');
            fixture.detectChanges();
            await fixture.whenStable();

            component.processDefinitionName = fakeProcessDefinitions[2].name;
            component.setProcessDefinitionOnForm(fakeProcessDefinitions[2].name);
            fixture.detectChanges();
            await fixture.whenStable();

            const processForm = fixture.nativeElement.querySelector('adf-cloud-form');
            expect(component.hasForm()).toBeTruthy();
            expect(processForm).not.toBeNull();

            const payload: ProcessPayloadCloud = new ProcessPayloadCloud({
                name: component.processInstanceName.value,
                processDefinitionKey: fakeProcessDefinitions[2].key,
                variables: Object.assign({}, component.formCloud.values)
            });
            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();

            startButton.triggerEventHandler('click', null);
            expect(startProcessSpy).toHaveBeenCalledWith(component.appName, payload);
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
            selectOptionByName(fakeProcessDefinitions[0].name);
            fixture.detectChanges();
            await fixture.whenStable();
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
            const processNameCloudPipe = TestBed.inject(ProcessNameCloudPipe);
            const processNamePipeTransformSpy = spyOn(processNameCloudPipe, 'transform').and.returnValue('fake-transformed-name');
            const expectedProcessInstanceDetails: ProcessInstanceCloud = { processDefinitionName: fakeProcessDefinitions[0].name };
            getDefinitionsSpy.and.returnValue(of([fakeProcessDefinitions[0]]));
            formDefinitionSpy.and.stub();

            component.appName = 'myApp';
            component.ngOnChanges({ appName: firstChange });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(processNamePipeTransformSpy).toHaveBeenCalledWith(component.name, expectedProcessInstanceDetails);
            expect(component.processInstanceName.dirty).toBe(true);
            expect(component.processInstanceName.touched).toBe(true);
            expect(component.processInstanceName.value).toEqual('fake-transformed-name');
        });

        it('should set the process name on when a process definition name is present', (done) => {
            const definitions: ProcessDefinitionCloud[] = [{
                appName: 'app',
                appVersion: 1,
                category: '',
                description: '',
                id: 'id',
                key: 'key',
                name: 'fake-name',
                version: 1
            }];

            component.processInstanceName.valueChanges.subscribe((value) => {
                expect(value).toBe(fakeTransformedName);
                done();
            });

            getDefinitionsSpy.and.returnValue(of(definitions));

            const processNameCloudPipe = TestBed.inject(ProcessNameCloudPipe);
            const fakeTransformedName = 'fake-transformed-name';
            spyOn(processNameCloudPipe, 'transform').and.returnValue(fakeTransformedName);

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
            component.loading$.next(false);
            component.showTitle = false;
            fixture.detectChanges();

            const title = fixture.debugElement.query(By.css('.adf-title'));

            expect(title).toBeFalsy();
        });

        it('should show title', () => {
            component.loading$.next(false);
            fixture.detectChanges();

            const title = fixture.debugElement.query(By.css('.adf-title'));

            expect(title).toBeTruthy();
        });

        it('should show process definition dropdown', () => {
            component.loading$.next(false);
            component.processDefinitionList = fakeProcessDefinitions;
            fixture.detectChanges();

            const processDropdown = fixture.debugElement.query(By.css('[data-automation-id="adf-select-cloud-process-dropdown"]'));

            expect(processDropdown).toBeTruthy();
        });

        it('should hide process definition dropdown', () => {
            component.loading$.next(false);
            component.processDefinitionList = fakeProcessDefinitions;
            component.showSelectProcessDropdown = false;
            fixture.detectChanges();

            const processDropdown = fixture.debugElement.query(By.css('#processDefinitionName'));

            expect(processDropdown).toBeFalsy();
        });

        it('should show the loading spinner before process definitions loaded', () => {
            component.loading$.next(true);
            fixture.detectChanges();

            const spinner = fixture.debugElement.query(By.css('.adf-loading'));

            expect(spinner).toBeTruthy();
        });

        it('should show the process card after process definitions loaded', () => {
            component.loading$.next(false);
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

        it('start process button should be enabled when isLoading is false', async () => {
            fixture.detectChanges();
            component.processForm.controls['processInstanceName'].setValue(fakeProcessDefinitions[0].id);
            component.appName = 'test app name';
            component.isLoading = false;
            fixture.detectChanges();
            await fixture.whenStable();

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();
            expect(component.disableStartButton()).toBeFalse();
            expect((startButton.nativeElement as HTMLButtonElement).disabled).toBeFalse();
        });

        it('start process button should be disabled when isLoading is true', async () => {
            fixture.detectChanges();
            component.processForm.controls['processInstanceName'].setValue(fakeProcessDefinitions[0].id);
            component.appName = 'test app name';
            component.isLoading = true;
            fixture.detectChanges();
            await fixture.whenStable();

            const startButton = fixture.debugElement.query(By.css('#button-start'));
            expect(startButton).not.toBeNull();
            expect(component.disableStartButton()).toBeTrue();
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
