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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { ActivitiFormModule, FormService } from 'ng2-activiti-form';

import { TranslationMock } from './../assets/translation.service.mock';
import { newProcess, fakeProcessDefs, fakeProcessDefWithForm, taskFormMock } from './../assets/activiti-start-process.component.mock';
import { ActivitiStartProcessInstance } from './activiti-start-process.component';
import { ActivitiProcessService } from '../services/activiti-process.service';

describe('ActivitiStartProcessInstance', () => {

    let componentHandler: any;
    let component: ActivitiStartProcessInstance;
    let fixture: ComponentFixture<ActivitiStartProcessInstance>;
    let processService: ActivitiProcessService;
    let formService: FormService;
    let getDefinitionsSpy: jasmine.Spy;
    let getStartFormDefinitionSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ActivitiFormModule.forRoot()
            ],
            declarations: [
                ActivitiStartProcessInstance
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService,
                FormService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiStartProcessInstance);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        processService = fixture.debugElement.injector.get(ActivitiProcessService);
        formService = fixture.debugElement.injector.get(FormService);

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(Observable.of(fakeProcessDefs));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(Observable.of(newProcess));
        getStartFormDefinitionSpy = spyOn(formService, 'getStartFormDefinition').and.returnValue(Observable.of(taskFormMock));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    describe('process definitions list', () => {

        it('should call service to fetch process definitions', () => {
            let change = new SimpleChange(null, '123');
            component.ngOnChanges({ 'appId': change });
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalled();
        });

        it('should call service to fetch process definitions with appId when provided', () => {
            let change = new SimpleChange(null, '123');
            component.ngOnChanges({ 'appId': change });
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith('123');
        });

        it('should display the correct number of processes in the select list', () => {
            let change = new SimpleChange(null, '123');
            component.ngOnChanges({ 'appId': change });
            fixture.detectChanges();

            let selectElement = debugElement.query(By.css('select'));
            expect(selectElement.children.length).toBe(3);
        });

        it('should display the correct process def details', async(() => {
            let change = new SimpleChange(null, '123');
            component.ngOnChanges({ 'appId': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let optionEl: HTMLOptionElement = debugElement.queryAll(By.css('select option'))[1].nativeElement;
                expect(optionEl.value).toBe('my:process1');
                expect(optionEl.textContent.trim()).toBe('My Process 1');
            });
        }));

        it('should indicate an error to the user if process defs cannot be loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(Observable.throw({}));
            let change = new SimpleChange(null, '123');
            component.ngOnChanges({ 'appId': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let errorEl: DebugElement = debugElement.query(By.css('.error-message'));
                expect(errorEl).not.toBeNull('Expected error message to be present');
                expect(errorEl.nativeElement.innerText.trim()).toBe('START_PROCESS.ERROR.LOAD_PROCESS_DEFS');
            });
        }));

        it('should show no process available message when no process definition is loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(Observable.of([]));
            let change = new SimpleChange(null, '123');
            component.ngOnChanges({ 'appId': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let noprocessElement: DebugElement = debugElement.query(By.css('#no-process-message'));
                expect(noprocessElement).not.toBeNull('Expected no available process message to be present');
                expect(noprocessElement.nativeElement.innerText.trim()).toBe('START_PROCESS.NO_PROCESS_DEFINITIONS');
            });
        }));

    });

    describe('input changes', () => {

        let change = new SimpleChange('123', '456');
        let nullChange = new SimpleChange('123', null);

        beforeEach(async(() => {
            component.appId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                getDefinitionsSpy.calls.reset();
            });
        }));

        it('should reload processes when appId input changed', () => {
            component.ngOnChanges({ appId: change });
            expect(getDefinitionsSpy).toHaveBeenCalledWith('456');
        });

        it('should reload processes when appId input changed to null', () => {
            component.ngOnChanges({ appId: nullChange });
            expect(getDefinitionsSpy).toHaveBeenCalledWith(null);
        });

        it('should not reload processes when changes do not include appId input', () => {
            component.ngOnChanges({});
            expect(getDefinitionsSpy).not.toHaveBeenCalled();
        });

    });

    describe('start process', () => {

        beforeEach(() => {
            component.name = 'My new process';
            let change = new SimpleChange(null, '123');
            component.ngOnChanges({ 'appId': change });
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
                expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined);
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

        it('should throw start event error when process cannot be started', async(() => {
            let errorSpy = spyOn(component.start, 'error');
            let error = { message: 'My error' };
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
                let errorEl: DebugElement = debugElement.query(By.css('.error-message'));
                expect(errorEl).not.toBeNull();
                expect(errorEl.nativeElement.innerText.trim()).toBe('START_PROCESS.ERROR.START');
            });
        }));

    });

    describe('start forms', () => {

        let startBtn;

        describe('without start form', () => {

            beforeEach(async(() => {
                component.name = 'My new process';
                let change = new SimpleChange(null, '123');
                component.ngOnChanges({ 'appId': change });
                fixture.detectChanges();
                component.onProcessDefChange('my:process1');
                fixture.whenStable();
                startBtn = debugElement.query(By.css('[data-automation-id="btn-start"]'));
            }));

            it('should have start button disabled when name not filled out', async(() => {
                component.name = '';
                fixture.detectChanges();
                expect(startBtn.properties['disabled']).toBe(true);
            }));

            it('should have start button disabled when no process is selected', async(() => {
                component.onProcessDefChange('');
                fixture.detectChanges();
                expect(startBtn.properties['disabled']).toBe(true);
            }));

            it('should enable start button when name and process filled out', async(() => {
                fixture.detectChanges();
                startBtn = debugElement.query(By.css('[data-automation-id="btn-start"]'));
                expect(startBtn.properties['disabled']).toBe(false);
            }));

        });

        describe('with start form', () => {

            beforeEach(() => {
                getDefinitionsSpy.and.returnValue(Observable.of(fakeProcessDefWithForm));
                let change = new SimpleChange(null, '123');
                component.ngOnChanges({ 'appId': change });
                component.onProcessDefChange('my:process1');
                fixture.detectChanges();
                fixture.whenStable();
                startBtn = debugElement.query(By.css('[data-automation-id="btn-start"]'));
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

        });

    });

});
