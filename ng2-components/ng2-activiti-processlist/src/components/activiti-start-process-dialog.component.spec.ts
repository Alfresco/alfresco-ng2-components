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
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { ActivitiFormModule, FormService } from 'ng2-activiti-form';

import { TranslationMock } from './../assets/translation.service.mock';
import { newProcess, fakeProcessDefs, taskFormMock } from './../assets/activiti-start-process.component.mock';
import { ActivitiStartProcessInstance } from './activiti-start-process.component';
import { ActivitiStartProcessInstanceDialog } from './activiti-start-process-dialog.component';
import { ActivitiProcessService } from '../services/activiti-process.service';

describe('ActivitiStartProcessInstanceDialog', () => {

    let componentHandler: any;
    let component: ActivitiStartProcessInstanceDialog;
    let fixture: ComponentFixture<ActivitiStartProcessInstanceDialog>;
    let processService: ActivitiProcessService;
    let formService: FormService;
    let getDefinitionsSpy: jasmine.Spy;
    let getStartFormDefinitionSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let debugElement: DebugElement;

    const showBtnSelector = '[data-automation-id="btn-show"]';
    const startBtnSelector = '[data-automation-id="btn-start"]';
    const closeBtnSelector = '[data-automation-id="btn-close"]';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ CoreModule, ActivitiFormModule ],
            declarations: [
                ActivitiStartProcessInstance,
                ActivitiStartProcessInstanceDialog
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiStartProcessInstanceDialog);
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

    describe('render dialog', () => {

        let buttonEl: DebugElement;

        it('should render a Start Process button by default', () => {
            fixture.detectChanges();
            buttonEl = debugElement.query(By.css(showBtnSelector));
            expect(buttonEl).not.toBeNull();
        });

        it('should not render the Start Process button when configured not to', () => {
            component.showButton = false;
            fixture.detectChanges();
            buttonEl = debugElement.query(By.css(showBtnSelector));
            expect(buttonEl).toBeNull();
        });

    });

    describe('open dialog', () => {

        it('should open dialog when button clicked', () => {
            fixture.detectChanges();
            let showModalSpy = spyOn(component.dialog.nativeElement, 'showModal');
            let showButton: DebugElement = debugElement.query(By.css(showBtnSelector));
            showButton.triggerEventHandler('click', null);
            expect(showModalSpy).toHaveBeenCalled();
        });

    });

    describe('start process', () => {

        it('should output start event when process started from inside inner component', () => {
            let emitSpy = spyOn(component.start, 'emit');
            component.startProcessComponent.start.emit(newProcess);
            expect(emitSpy).toHaveBeenCalledWith(newProcess);
        });

        it('should call inner component to start process when dialog Start button clicked', () => {
            let startSpy = spyOn(component.startProcessComponent, 'startProcess').and.returnValue(null);
            let closeButton: DebugElement = debugElement.query(By.css(startBtnSelector));
            closeButton.triggerEventHandler('click', null);
            expect(startSpy).toHaveBeenCalled();
        });

    });

    describe('close dialog', () => {

        let dialogPolyfill: any;

        let setupDialog = () => {
            component.showDialog();
            fixture.detectChanges();
        };

        let clickCancelButton = () => {
            let closeButton: DebugElement = debugElement.query(By.css(closeBtnSelector));
            closeButton.triggerEventHandler('click', null);
        };

        beforeEach(() => {
            dialogPolyfill = { registerDialog: (widget) => widget.showModal = () => {} };
            dialogPolyfill.registerDialog = spyOn(dialogPolyfill, 'registerDialog').and.callThrough();
            window['dialogPolyfill'] = dialogPolyfill;
        });

        it('should close dialog when close button clicked', async(() => {
            let closeSpy = spyOn(component.dialog.nativeElement, 'close');
            setupDialog();
            clickCancelButton();
            expect(closeSpy).toHaveBeenCalled();
        }));

        it('should reset embedded component when dialog cancelled', async(() => {
            let resetSpy = spyOn(component.startProcessComponent, 'reset');
            setupDialog();
            clickCancelButton();
            expect(resetSpy).toHaveBeenCalled();
        }));

        it('should register dialog via polyfill', () => {
            fixture.detectChanges();
            component.dialog.nativeElement.showModal = null;
            component.showDialog();
            expect(dialogPolyfill.registerDialog).toHaveBeenCalledWith(component.dialog.nativeElement);
        });

    });

});
