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
import { ActivitiFormModule } from 'ng2-activiti-form';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { FormService } from 'ng2-activiti-form';
import { TranslationMock } from './../assets/translation.service.mock';
import { ActivitiStartProcessButton } from './activiti-start-process.component';
import { ActivitiProcessService } from '../services/activiti-process.service';

describe('ActivitiStartProcessButton', () => {

    let componentHandler: any;
    let component: ActivitiStartProcessButton;
    let fixture: ComponentFixture<ActivitiStartProcessButton>;
    let processService: ActivitiProcessService;
    let formService: FormService;
    let getDefinitionsSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ CoreModule, ActivitiFormModule ],
            declarations: [
                ActivitiStartProcessButton
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService,
                FormService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiStartProcessButton);
        component = fixture.componentInstance;
        processService = fixture.debugElement.injector.get(ActivitiProcessService);
        formService = fixture.debugElement.injector.get(FormService);

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(Observable.of([{
            id: 'my:process1',
            name: 'My Process 1'
        }, {
            id: 'my:process2',
            name: 'My Process 2'
        }]));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(Observable.of({
            id: '32323',
            name: 'Process'
        }));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should display the correct number of processes in the select list', () => {
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('select'));
        expect(de.children.length).toBe(3);
    });

    it('should display the correct process def details', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.queryAll(By.css('select option'))[1];
            let optionEl: HTMLOptionElement = de.nativeElement;
            expect(optionEl.value).toBe('my:process1');
            expect(optionEl.textContent.trim()).toBe('My Process 1');
            done();
        });
    });

    it('should call service to start process if required fields provided', (done) => {
        component.name = 'My new process';
        component.processDefinitionId = 'my:process1';
        component.showDialog();
        fixture.detectChanges();
        component.startProcess();
        fixture.whenStable().then(() => {
            expect(startProcessSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should avoid calling service to start process if required fields NOT provided', (done) => {
        component.showDialog();
        fixture.detectChanges();
        component.startProcess();
        fixture.whenStable().then(() => {
            expect(startProcessSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('should call service to start process with the correct parameters', (done) => {
        component.name = 'My new process';
        component.processDefinitionId = 'my:process1';
        component.showDialog();
        fixture.detectChanges();
        component.startProcess();
        fixture.whenStable().then(() => {
            expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined);
            done();
        });
    });

    it('should indicate start form is missing when process does not have a start form', (done) => {
        component.name = 'My new process';
        component.processDefinitionId = 'my:process1';
        component.showDialog();
        fixture.detectChanges();
        component.startProcess();
        fixture.whenStable().then(() => {
            expect(component.isStartFormMissingOrValid()).toBe(true);
            done();
        });
    });

});
