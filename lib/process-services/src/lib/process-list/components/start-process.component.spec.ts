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

import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { AppsProcessService } from '../../app-list/services/apps-process.service';
import { of, throwError } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
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
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { deployedApps } from '../../mock/apps-list.mock';
import { ProcessNamePipe } from '../../pipes/process-name.pipe';
import { ProcessInstance } from '../models/process-instance.model';
import { ActivitiContentService } from '../../form/services/activiti-alfresco.service';

describe('StartProcessComponent', () => {

    let appConfig: AppConfigService;
    let activitiContentService: ActivitiContentService;
    let component: StartProcessInstanceComponent;
    let fixture: ComponentFixture<StartProcessInstanceComponent>;
    let processService: ProcessService;
    let appsProcessService: AppsProcessService;
    let getDefinitionsSpy: jasmine.Spy;
    let getStartFormDefinitionSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let applyAlfrescoNodeSpy: jasmine.Spy;
    let getDeployedApplicationsSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

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

    function changeAppId(appId: number) {
        const change = new SimpleChange(null, appId, true);
        component.appId = appId;
        component.ngOnChanges({ appId: change });
    }

    beforeEach(() => {
        appConfig = TestBed.inject(AppConfigService);
        activitiContentService = TestBed.inject(ActivitiContentService);
        fixture = TestBed.createComponent(StartProcessInstanceComponent);
        component = fixture.componentInstance;
        processService = TestBed.inject(ProcessService);
        appsProcessService = TestBed.inject(AppsProcessService);

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(of(testMultipleProcessDefs));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(of(newProcess));
        getStartFormDefinitionSpy = spyOn(processService, 'getStartFormDefinition').and.returnValue(of(taskFormMock));
        applyAlfrescoNodeSpy = spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of({ id: 1234 }));
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of([{ id: '1', name: 'fake-repo-name'}]));
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('first step', () => {

        describe('without start form', () => {

            beforeEach(() => {
                fixture.detectChanges();
                component.name = 'My new process';
                changeAppId(123);
                fixture.detectChanges();
            });

            it('should enable start button when name and process filled out', async () => {
                spyOn(component, 'loadProcessDefinitions').and.callThrough();
                component.processNameInput.setValue('My Process');
                component.processDefinitionInput.setValue(testProcessDef.name);

                fixture.detectChanges();
                await fixture.whenStable();

                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn.disabled).toBe(false);
            });

            it('should have start button disabled when name not filled out', async () => {
                spyOn(component, 'loadProcessDefinitions').and.callThrough();
                component.processNameInput.setValue('');
                component.processDefinitionInput.setValue(testProcessDef.name);

                fixture.detectChanges();
                await fixture.whenStable();

                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn.disabled).toBe(true);
            });

            it('should have start button disabled when no process is selected', async () => {
                component.selectedProcessDef = null;

                fixture.detectChanges();
                await fixture.whenStable();

                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn.disabled).toBe(true);
            });

            it('should have start button disabled process name has a space as the first or last character.', async () => {
                component.processNameInput.setValue(' Space in the beginning');
                component.processDefinitionInput.setValue(testProcessDef.name);

                fixture.detectChanges();
                await fixture.whenStable();

                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn.disabled).toBe(true);
                component.processNameInput.setValue('Space in the end ');

                fixture.detectChanges();
                await fixture.whenStable();

                expect(startBtn.disabled).toBe(true);
            });
        });

        describe('with start form', () => {

            beforeEach(() => {
                fixture.detectChanges();
                getDefinitionsSpy.and.returnValue(of(testProcessDefWithForm));
                changeAppId(123);
            });

            it('should initialize start form', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.startForm).toBeDefined();
                expect(component.startForm).not.toBeNull();
            });

            it('should have labels for process name and type', async () => {
                component.processDefinitionInput.setValue('My Default Name');
                component.processNameInput.setValue('claim');

                fixture.detectChanges();
                await fixture.whenStable();

                const inputLabelsNodes = document.querySelectorAll('.adf-start-process .adf-process-input-container mat-label');
                expect(inputLabelsNodes.length).toBe(2);
            });

            it('should have floating labels for process name and type', async () => {
                component.processDefinitionInput.setValue('My Default Name');
                component.processNameInput.setValue('claim');

                fixture.detectChanges();
                await fixture.whenStable();

                const inputLabelsNodes = document.querySelectorAll('.adf-start-process .adf-process-input-container');
                inputLabelsNodes.forEach(labelNode => {
                    expect(labelNode.getAttribute('ng-reflect-float-label')).toBe('always');
                });
            });

            it('should load start form from service', async () => {
                fixture.detectChanges();
                await fixture.whenStable();
                expect(getStartFormDefinitionSpy).toHaveBeenCalled();
            });

            it('should have start button disabled if the process is not selected', async () => {
                component.name = 'My new process';

                fixture.detectChanges();
                await fixture.whenStable();

                const startBtn = fixture.nativeElement.querySelector('#button-start');
                expect(startBtn).toBeNull();
            });

            it('should emit cancel event on cancel Button', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const cancelButton = fixture.nativeElement.querySelector('#cancel_process');
                const cancelSpy: jasmine.Spy = spyOn(component.cancel, 'emit');
                cancelButton.click();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(cancelSpy).toHaveBeenCalled();
            });

            it('should return true if startFrom defined', async () => {
                component.name = 'my:process1';

                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.hasStartForm()).toBe(true);
            });
        });

        describe('CS content connection', () => {

            it('Should get the alfrescoRepositoryName from the config json', async () => {
                appConfig.config = Object.assign(appConfig.config, {
                    alfrescoRepositoryName: 'alfresco-123'
                });

                expect(component.getAlfrescoRepositoryName()).toBe('alfresco-123Alfresco');
            });

            it('Should take the alfrescoRepositoryName from the API when there is no alfrescoRepositoryName defined in config json', async () => {
                fixture.detectChanges();
                await fixture.whenStable();
                expect(component.alfrescoRepositoryName).toBe('alfresco-1-fake-repo-name');
            });

            it('if values in input is a node should be linked in the process service', async () => {
                component.values = {};
                component.values['file'] = {
                    isFile: true,
                    name: 'example-file'
                };

                component.moveNodeFromCStoPS();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.movedNodeToPS.file[0].id).toBe(1234);
                expect(applyAlfrescoNodeSpy).toHaveBeenCalled();
            });

            it('if values in input is a collection of nodes should be linked in the process service', async () => {
                component.values = {};
                component.values['file'] = [
                    {
                        isFile: true,
                        name: 'example-file-1'
                    },
                    {
                        isFile: true,
                        name: 'example-fil-2'
                    },
                    {
                        isFile: true,
                        name: 'example-file-3'
                    }
                ];

                component.moveNodeFromCStoPS();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.movedNodeToPS.file.length).toBe(3);
                expect(component.movedNodeToPS.file[0].id).toBe(1234);
                expect(component.movedNodeToPS.file[1].id).toBe(1234);
                expect(applyAlfrescoNodeSpy).toHaveBeenCalledTimes(3);
            });
        });
    });

    describe('process definitions list', () => {

        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'My new process';
            changeAppId(123);
            fixture.detectChanges();
        });

        it('should call service to fetch process definitions with appId', async () => {
            await fixture.whenStable();
            expect(getDefinitionsSpy).toHaveBeenCalledWith(123);
        });

        it('should display the correct number of processes in the select list', async () => {
            const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
            selectElement.click();

            fixture.detectChanges();
            await fixture.whenStable();
            const options: any = fixture.debugElement.queryAll(By.css('.mat-option-text'));

            expect(options.length).toBe(2);
            expect(options[0].nativeElement.innerText).toBe('My Process 1');
            expect(options[1].nativeElement.innerText).toBe('My Process 2');
        });

        it('should show no process available message when no process definition is loaded', async () => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of([]));
            changeAppId(123);

            fixture.detectChanges();
            await fixture.whenStable();

            const noProcessElement = fixture.nativeElement.querySelector('.adf-empty-content__title');
            expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
            expect(noProcessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_PROCESS_DEFINITIONS');
        });

        it('should select processDefinition based on processDefinition input', async () => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            component.appId = 123;
            component.processNameInput.setValue('My Process 2');
            component.processDefinitionInput.setValue('My Process 2');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectedProcessDef.name).toBe(JSON.parse(JSON.stringify(testMultipleProcessDefs[1])).name);
        });

        it('should select automatically the processDefinition if the app contain only one', async () => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testProcessDefinitions));
            changeAppId(123);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectedProcessDef.name).toBe(JSON.parse(JSON.stringify(testProcessDefinitions[0])).name);
        });

        it('should not select automatically any processDefinition if the app contain multiple process and does not have any processDefinition as input', async () => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            changeAppId(123);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectedProcessDef.name).toBeNull();
        });

        describe('dropdown', () => {

            it('should hide the process dropdown button if showSelectProcessDropdown is false', async () => {
                fixture.detectChanges();
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of([testProcessDef]));
                component.appId = 123;
                component.showSelectProcessDropdown = false;
                component.ngOnChanges({});

                fixture.detectChanges();
                await fixture.whenStable();

                const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                expect(selectElement).toBeNull();
            });

            it('should show the process dropdown button if showSelectProcessDropdown is false', async () => {
                fixture.detectChanges();
                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
                component.appId = 123;
                component.processDefinitionName = 'My Process 2';
                component.showSelectProcessDropdown = true;
                component.ngOnChanges({});

                fixture.detectChanges();
                await fixture.whenStable();

                const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                expect(selectElement).not.toBeNull();
            });

            it('should show the process dropdown button by default', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
                component.appId = 123;
                component.processDefinitionName = 'My Process 2';
                component.ngOnChanges({});

                fixture.detectChanges();
                await fixture.whenStable();

                const selectElement = fixture.nativeElement.querySelector('button#adf-select-process-dropdown');
                expect(selectElement).not.toBeNull();
            });
        });
    });

    describe('input changes', () => {

        beforeEach(async () => {
            component.appId = 123;
            fixture.detectChanges();
        });

        it('should reload processes when appId input changed', async () => {
            changeAppId(456);
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith(456);
        });

        it('should get current processDef', () => {
            changeAppId(456);
            fixture.detectChanges();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.processDefinitions).toBe(testMultipleProcessDefs);
        });
    });

    describe('start process', () => {

        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'My new process';
            changeAppId(123);
        });

        it('should call service to start process if required fields provided', async () => {
            component.processDefinitionSelectionChanged(testProcessDef);
            component.startProcess();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(startProcessSpy).toHaveBeenCalled();
        });

        it('should avoid calling service to start process if required fields NOT provided', async () => {
            component.name = '';
            component.startProcess();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(startProcessSpy).not.toHaveBeenCalled();
        });

        it('should call service to start process with the correct parameters', async () => {
            component.processDefinitionSelectionChanged(testProcessDef);
            component.startProcess();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined, undefined);
        });

        it('should call service to start process with the variables setted', async () => {
            const inputProcessVariable: ProcessInstanceVariable[] = [];

            const variable: ProcessInstanceVariable = {};
            variable.name = 'nodeId';
            variable.value = 'id';

            inputProcessVariable.push(variable);

            component.variables = inputProcessVariable;
            component.processDefinitionSelectionChanged(testProcessDef);
            component.startProcess();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined, inputProcessVariable);
        });

        it('should output start event when process started successfully', async () => {
            const emitSpy = spyOn(component.start, 'emit');
            component.processDefinitionSelectionChanged(testProcessDef);
            component.startProcess();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(emitSpy).toHaveBeenCalledWith(newProcess);
        });

        it('should emit start event when start select a process and add a name', () => {
            const startProcessEmitterSpy = spyOn(component.start, 'emit');
            component.processDefinitionSelectionChanged(testProcessDef);
            component.name = 'my:Process';
            component.startProcess();

            expect(startProcessEmitterSpy).toHaveBeenCalledWith(newProcess);
        });

        it('should emit processDefinitionSelection event when a process definition is selected', () => {
            const processDefinitionSelectionSpy = spyOn(component.processDefinitionSelection, 'emit');
            fixture.detectChanges();
            selectOptionByName(testProcessDef.name);

            expect(processDefinitionSelectionSpy).toHaveBeenCalledWith(testProcessDef);
        });

        it('should set the process name using the processName pipe when a process definition gets selected', () => {
            const processNamePipe = TestBed.inject(ProcessNamePipe);
            const processNamePipeTransformSpy = spyOn(processNamePipe, 'transform').and.returnValue('fake-transformed-name');
            const expectedProcessInstanceDetails = new ProcessInstance({ processDefinitionName: testProcessDef.name });
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));

            changeAppId(123);
            fixture.detectChanges();

            selectOptionByName(testProcessDef.name);

            expect(processNamePipeTransformSpy).toHaveBeenCalledWith(component.name, expectedProcessInstanceDetails);
            expect(component.nameController.dirty).toBe(true);
            expect(component.nameController.touched).toBe(true);
            expect(component.nameController.value).toEqual('fake-transformed-name');
        });

        it('should not emit start event when start the process without select a process and name', () => {
            component.name = null;
            component.selectedProcessDef = null;
            const startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should not emit start event when start the process without name', () => {
            component.name = null;
            const startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should not emit start event when start the process without select a process', () => {
            component.selectedProcessDef = null;
            const startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });
   });

    describe('Select applications', () => {

        beforeEach(() => {
            fixture.detectChanges();
            component.name = 'My new process';
            component.showSelectApplicationDropdown = true;
            getDeployedApplicationsSpy = spyOn(appsProcessService, 'getDeployedApplications').and.returnValue(of(deployedApps));
        });

        it('Should be able to show application drop-down if showSelectApplicationDropdown set to true', () => {
            getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            changeAppId(3);
            fixture.detectChanges();

            const appsSelector = fixture.nativeElement.querySelector('[data-automation-id="adf-start-process-apps-drop-down"]');
            const labelElement = fixture.nativeElement.querySelector('.adf-start-process-app-list .mat-form-field-label');

            expect(appsSelector).not.toBeNull();
            expect(labelElement.innerText).toEqual('ADF_PROCESS_LIST.START_PROCESS.FORM.LABEL.SELECT_APPLICATION');

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(component.applications.length).toBe(6);

            expect(component.selectedApplication).toEqual(deployedApps[2]);
            expect(component.selectedApplication.id).toEqual(3);
            expect(component.selectedApplication.name).toEqual('App3');
        });

        it('Should not be able to show application drop-down if showSelectApplicationDropdown set to false', () => {
            component.showSelectApplicationDropdown = false;
            fixture.detectChanges();
            const appsSelector = fixture.nativeElement.querySelector('[data-automation-id="adf-start-process-apps-drop-down"]');
            expect(appsSelector).toBeNull();
        });

        it('Should be able to list process-definition based on selected application', () => {
            getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            changeAppId(3);
            fixture.detectChanges();

            expect(component.selectedApplication).toEqual(deployedApps[2]);
            expect(component.selectedApplication.name).toEqual('App3');
            expect(getDefinitionsSpy).toHaveBeenCalledWith(3);
            expect(component.processDefinitions.length).toEqual(2);
            expect(component.processDefinitions[0].name).toEqual('My Process 1');
            expect(component.processDefinitions[1].name).toEqual('My Process 2');

            getDefinitionsSpy.and.returnValue(of([ { id: 'my:process 3', name: 'My Process 3', hasStartForm: true } ]));
            fixture.detectChanges();

            const newApplication = { value: deployedApps[1] } as MatSelectChange;
            component.onAppSelectionChange(newApplication);
            fixture.detectChanges();

            expect(component.selectedApplication).toEqual(deployedApps[1]);
            expect(component.selectedApplication.name).toEqual('App2');

            expect(getDefinitionsSpy).toHaveBeenCalledWith(2);
            expect(component.processDefinitions.length).toEqual(1);
            expect(component.processDefinitions[0].name).toEqual('My Process 3');
        });

        it('Should be able to pre-select an application if the list has one application', () => {
            getDeployedApplicationsSpy.and.returnValues(of([deployedApps[0]]));
            getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            changeAppId(123);
            fixture.detectChanges();

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(component.applications.length).toEqual(1);
            expect(component.selectedApplication.name).toEqual('App1');
        });

        it('[C333511] Should be able to preselect single app deployed with single process and start event Form', async () => {
            getDeployedApplicationsSpy.and.returnValues(of([deployedApps[0]]));
            getDefinitionsSpy.and.returnValues(of(testProcessDefWithForm));
            changeAppId(123);

            fixture.detectChanges();
            await fixture.whenStable();

            const appsSelectElement = fixture.nativeElement.querySelector('[data-automation-id="adf-start-process-apps-drop-down"]');
            const processDefinitionSelectInput = fixture.nativeElement.querySelector('#processDefinitionName');
            const processNameInput = fixture.nativeElement.querySelector('#processName');
            const cancelButton = fixture.nativeElement.querySelector('#cancel_process');
            const startBtn = fixture.nativeElement.querySelector('[data-automation-id="adf-form-start process"]');
            const adfStartForm = fixture.nativeElement.querySelector('adf-start-form');

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.applications.length).toEqual(1);
            expect(component.processDefinitions.length).toEqual(1);
            expect(component.selectedApplication.name).toEqual('App1');
            expect(component.selectedProcessDef.name).toEqual('My Process 1');

            expect(appsSelectElement).not.toBeNull();
            expect(processDefinitionSelectInput).not.toBeNull();
            expect(processNameInput).not.toBeNull();

            expect(adfStartForm).not.toBeNull();
            expect(startBtn).not.toBeNull();
            expect(cancelButton).not.toBeNull();
        });

        it('[C333511] Should be able to preselect single app deployed with single process and no form', async () => {
            getDeployedApplicationsSpy.and.returnValues(of([deployedApps[0]]));
            getDefinitionsSpy.and.returnValues(of(testProcessDefinitions));
            changeAppId(123);

            fixture.detectChanges();
            await fixture.whenStable();

            const appsSelectElement = fixture.nativeElement.querySelector('[data-automation-id="adf-start-process-apps-drop-down"]');
            const processDefinitionSelectInput = fixture.nativeElement.querySelector('#processDefinitionName');
            const processNameInput = fixture.nativeElement.querySelector('#processName');
            const cancelButton = fixture.nativeElement.querySelector('#cancel_process');
            const startBtn = fixture.nativeElement.querySelector('#button-start');
            const adfStartForm = fixture.nativeElement.querySelector('adf-start-form');

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.applications.length).toEqual(1);
            expect(component.processDefinitions.length).toEqual(1);

            expect(component.selectedApplication.name).toEqual('App1');
            expect(component.selectedProcessDef.name).toEqual('My Process 1');

            expect(appsSelectElement).not.toBeNull();
            expect(processDefinitionSelectInput).not.toBeNull();
            expect(processNameInput).not.toBeNull();

            expect(adfStartForm).toBeNull();
            expect(startBtn).not.toBeNull();
            expect(cancelButton).not.toBeNull();
        });

        it('Should be able to pre-select an application from the apps based given appId', () => {
            changeAppId(2);
            fixture.detectChanges();

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(component.applications.length).toEqual(6);
            expect(component.selectedApplication.id).toEqual(2);
            expect(component.selectedApplication.id).toEqual(2);
            expect(component.selectedApplication.name).toEqual('App2');
        });

        it('Should be able to disable process name and definitions inputs if there is no application selected by default', () => {
            changeAppId(12345);
            fixture.detectChanges();

            const processDefinitionSelectInput = fixture.nativeElement.querySelector('#processDefinitionName');
            const processNameInput = fixture.nativeElement.querySelector('#processName');

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(component.applications.length).toEqual(6);
            expect(component.selectedApplication).toBeUndefined();
            expect(processDefinitionSelectInput.disabled).toEqual(true);
            expect(processNameInput.disabled).toEqual(true);
        });

        it('Should be able to enable process name and definitions inputs if the application selected by given appId', () => {
            changeAppId(2);
            fixture.detectChanges();

            const processDefinitionSelectInput = fixture.nativeElement.querySelector('#processDefinitionName');
            const processNameInput = fixture.nativeElement.querySelector('#processName');

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(component.applications.length).toEqual(6);
            expect(component.selectedApplication.id).toEqual(2);
            expect(processDefinitionSelectInput.disabled).toEqual(false);
            expect(processNameInput.disabled).toEqual(false);
        });

        it('Should be able to enable process name and definitions inputs when the application selected from the apps drop-down', () => {
            changeAppId(12345);
            fixture.detectChanges();

            const appsSelectElement = fixture.nativeElement.querySelector('[data-automation-id="adf-start-process-apps-drop-down"]');
            const processDefinitionSelectInput = fixture.nativeElement.querySelector('#processDefinitionName');
            const processNameInput = fixture.nativeElement.querySelector('#processName');

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(component.applications.length).toEqual(6);
            expect(component.selectedApplication).toBeUndefined();
            expect(processDefinitionSelectInput.disabled).toEqual(true);
            expect(processNameInput.disabled).toEqual(true);

            appsSelectElement.click();
            fixture.detectChanges();
            const sortOptions = document.querySelector('[data-automation-id="adf-start-process-apps-option-App2"]');
            sortOptions.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(component.selectedApplication.id).toBe(2);
            expect(component.selectedApplication.name).toBe('App2');

            expect(processDefinitionSelectInput.disabled).toEqual(false);
            expect(processNameInput.disabled).toEqual(false);
        });

        it('[C333521] Should be able to pre-select single deployed application with multiple processes', () => {
            const singleDeployedApp = deployedApps[0];
            getDeployedApplicationsSpy.and.returnValues(of([singleDeployedApp]));
            changeAppId(1);
            fixture.detectChanges();

            expect(getDeployedApplicationsSpy).toHaveBeenCalled();
            expect(component.applications.length).toBe(1);
            expect(component.selectedApplication).toEqual(singleDeployedApp);

            expect(getDefinitionsSpy).toHaveBeenCalledWith(1);
            expect(component.processDefinitions.length).toEqual(2);

            const processDefWithStartForm = testMultipleProcessDefs[1];
            component.processDefinitionSelectionChanged(processDefWithStartForm);
            fixture.detectChanges();
            const processWithStartForm = fixture.nativeElement.querySelector('adf-start-form');

            expect(processWithStartForm).not.toBeNull();
            expect(component.selectedProcessDef.hasStartForm).toEqual(processDefWithStartForm.hasStartForm);

            const processDefWithNoStartForm = testMultipleProcessDefs[0];
            component.processDefinitionSelectionChanged(processDefWithNoStartForm);
            fixture.detectChanges();
            const processWithNoStartForm = fixture.nativeElement.querySelector('adf-start-form');

            expect(processWithNoStartForm).toBeNull();
            expect(component.selectedProcessDef.hasStartForm).toEqual(processDefWithNoStartForm.hasStartForm);
        });

        it('[C333522] Should be able to list multiple deployed apps with multiple process', async () => {
            changeAppId(123);
            fixture.detectChanges();

            const application1 =  deployedApps[0];
            const application2 =  deployedApps[1];
            const application3 =  deployedApps[2];

            expect(component.applications.length).toBe(6);

            const processDefWithStartForm = testProcessDefWithForm[0];
            getDefinitionsSpy.and.returnValues(of([processDefWithStartForm]));
            component.onAppSelectionChange({ value: application1 } as MatSelectChange);
            fixture.detectChanges();
            await fixture.whenStable();

            const processWithStartForm = fixture.nativeElement.querySelector('adf-start-form');

            expect(processWithStartForm).not.toBeNull();
            expect(component.selectedApplication).toEqual(application1);
            expect(getDefinitionsSpy).toHaveBeenCalledWith(application1.id);
            expect(component.processDefinitions.length).toEqual(1);
            expect(component.selectedProcessDef.name).toEqual(processDefWithStartForm.name);
            expect(component.selectedProcessDef.hasStartForm).toEqual(processDefWithStartForm.hasStartForm);

            getDefinitionsSpy.and.returnValues(of(testMultipleProcessDefs));
            component.onAppSelectionChange({ value: application2 } as MatSelectChange);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectedApplication).toEqual(application2);
            expect(getDefinitionsSpy).toHaveBeenCalledWith(application2.id);
            expect(component.processDefinitions.length).toEqual(2);

            const processDefWithNoStartForm = testMultipleProcessDefs[0];
            getDefinitionsSpy.and.returnValues(of([processDefWithNoStartForm]));
            component.onAppSelectionChange({ value: application3 } as MatSelectChange);
            fixture.detectChanges();
            await fixture.whenStable();

            const processWithNoStartForm = fixture.nativeElement.querySelector('adf-start-form');

            expect(processWithNoStartForm).toBeNull();
            expect(component.selectedApplication).toEqual(application3);

            expect(getDefinitionsSpy).toHaveBeenCalledWith(application3.id);
            expect(component.processDefinitions.length).toEqual(1);
            expect(component.selectedProcessDef.name).toEqual(processDefWithNoStartForm.name);
            expect(component.selectedProcessDef.hasStartForm).toEqual(processDefWithNoStartForm.hasStartForm);
        });
   });

    describe('Empty Template', () => {

        it('[333510] Should be able to show empty template when no applications deployed', async () => {
            getDeployedApplicationsSpy = spyOn(appsProcessService, 'getDeployedApplications').and.returnValue(of([]));

            component.showSelectApplicationDropdown = true;
            component.appId = 3;
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            const noProcessElement = fixture.nativeElement.querySelector('.adf-empty-content__title');
            const appsSelectElement = fixture.nativeElement.querySelector('[data-automation-id="adf-start-process-apps-drop-down"]');
            const processDefinitionSelectInput = fixture.nativeElement.querySelector('#processDefinitionName');
            const processNameInput = fixture.nativeElement.querySelector('#processName');
            const cancelButton = fixture.nativeElement.querySelector('#cancel_process');
            const startBtn = fixture.nativeElement.querySelector('#button-start');

            expect(appsSelectElement).toBeNull();
            expect(processDefinitionSelectInput).toBeNull();
            expect(processNameInput).toBeNull();
            expect(startBtn).toBeNull();
            expect(cancelButton).toBeNull();
            expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
            expect(noProcessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_PROCESS_DEFINITIONS');
        });

        it('Should be able to show empty template if processDefinitions are empty', async () => {
            getDefinitionsSpy.and.returnValue(of([]));

            component.appId = 1;
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            const noProcessElement = fixture.nativeElement.querySelector('.adf-empty-content__title');
            const processDefinitionSelectInput = fixture.nativeElement.querySelector('#processDefinitionName');
            const processNameInput = fixture.nativeElement.querySelector('#processName');
            const cancelButton = fixture.nativeElement.querySelector('#cancel_process');
            const startBtn = fixture.nativeElement.querySelector('#button-start');

            expect(processDefinitionSelectInput).toBeNull();
            expect(processNameInput).toBeNull();
            expect(startBtn).toBeNull();
            expect(cancelButton).toBeNull();
            expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
            expect(noProcessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_PROCESS_DEFINITIONS');
        });

        it('should show no process definition selected template if there is no process definition selected', async () => {
            getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            getDeployedApplicationsSpy = spyOn(appsProcessService, 'getDeployedApplications').and.returnValue(of(deployedApps));

            component.showSelectApplicationDropdown = true;
            component.appId = 1234;
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            const noProcessElement = fixture.nativeElement.querySelector('.adf-empty-content__title');

            expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
            expect(noProcessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_PROCESS_DEF_SELECTED');
        });

        it('should show no start form template if selected process definition does not have start form', async () => {
            getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            getDeployedApplicationsSpy = spyOn(appsProcessService, 'getDeployedApplications').and.returnValue(of(deployedApps));

            component.showSelectApplicationDropdown = true;
            component.processDefinitionName = 'My Process 1';
            component.appId = 3;
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            const noProcessElement = fixture.nativeElement.querySelector('.adf-empty-content__title');

            expect(noProcessElement).not.toBeNull('Expected no available process message to be present');
            expect(noProcessElement.innerText.trim()).toBe('ADF_PROCESS_LIST.START_PROCESS.NO_START_FORM');
        });
    });

    describe('Error event', () => {

        const processDefError = { message: 'Failed to load Process definitions' };
        const applicationsError = { message: 'Failed to load applications' };
        const startProcessError = { message: 'Failed to start process' };

        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should emit error event in case loading process definitions failed', async () => {
            const errorSpy = spyOn(component.error, 'emit');
            getDefinitionsSpy.and.returnValue(throwError(processDefError));

            component.appId = 3;
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(errorSpy).toHaveBeenCalledWith(processDefError);
        });

        it('should emit error event in case loading applications failed', async () => {
            const errorSpy = spyOn(component.error, 'emit');
            getDeployedApplicationsSpy = spyOn(appsProcessService, 'getDeployedApplications').and.returnValue(throwError(applicationsError));

            component.showSelectApplicationDropdown = true;
            component.appId = 3;
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(errorSpy).toHaveBeenCalledWith(applicationsError);
        });

        it('should emit error event in case start process failed', async () => {
            const errorSpy = spyOn(component.error, 'emit');
            getDefinitionsSpy.and.returnValue(of(testMultipleProcessDefs));
            getDeployedApplicationsSpy = spyOn(appsProcessService, 'getDeployedApplications').and.returnValue(of(deployedApps));
            startProcessSpy.and.returnValue(throwError(startProcessError));

            component.showSelectApplicationDropdown = true;
            component.processDefinitionName = 'My Process 1';
            component.name = 'mock name';
            component.appId = 3;
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            component.startProcess();
            fixture.detectChanges();

            expect(errorSpy).toHaveBeenCalledWith(startProcessError);
        });
    });
});
