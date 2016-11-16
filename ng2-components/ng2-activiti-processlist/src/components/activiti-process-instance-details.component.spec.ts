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

import { NO_ERRORS_SCHEMA, DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { ActivitiFormModule, FormModel, FormOutcomeEvent, FormOutcomeModel, FormService } from 'ng2-activiti-form';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';

import { ActivitiProcessInstanceDetails } from './activiti-process-instance-details.component';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { exampleProcess } from './../assets/activiti-process.model.mock';

describe('ActivitiProcessInstanceDetails', () => {

    let componentHandler: any;
    let service: ActivitiProcessService;
    let formService: FormService;
    let component: ActivitiProcessInstanceDetails;
    let fixture: ComponentFixture<ActivitiProcessInstanceDetails>;
    let getProcessSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                ActivitiFormModule,
                ActivitiTaskListModule
            ],
            declarations: [
                ActivitiProcessInstanceDetails
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiProcessInstanceDetails);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiProcessService);
        formService = fixture.debugElement.injector.get(FormService);

        getProcessSpy = spyOn(service, 'getProcess').and.returnValue(Observable.of(exampleProcess));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should load task details when processInstanceId specified', () => {
        component.processInstanceId = '123';
        fixture.detectChanges();
        expect(getProcessSpy).toHaveBeenCalled();
    });

    it('should not load task details when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getProcessSpy).not.toHaveBeenCalled();
    });

    it('should set a placeholder message when processInstanceId not initialised', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.innerText).toBe('DETAILS.MESSAGES.NONE');
    });

    it('should display a header when the processInstanceId is provided', async(() => {
        component.processInstanceId = '123';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerEl: DebugElement = fixture.debugElement.query(By.css('h2'));
            expect(headerEl).not.toBeNull();
            expect(headerEl.nativeElement.innerText).toBe('Process 123');
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456');
        let nullChange = new SimpleChange('123', null);

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            component.tasksList = jasmine.createSpyObj('tasksList', ['load']);
            fixture.whenStable().then(() => {
                getProcessSpy.calls.reset();
            });
        }));

        it('should fetch new process details when processInstanceId changed', () => {
            component.ngOnChanges({ 'processInstanceId': change });
            expect(getProcessSpy).toHaveBeenCalledWith('456');
        });

        it('should reload tasks list when processInstanceId changed', () => {
            component.ngOnChanges({ 'processInstanceId': change });
            expect(component.tasksList.load).toHaveBeenCalled();
        });

        it('should NOT fetch new process details when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getProcessSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new process details when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            expect(getProcessSpy).not.toHaveBeenCalled();
        });

        it('should set a placeholder message when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            fixture.detectChanges();
            expect(fixture.nativeElement.innerText).toBe('DETAILS.MESSAGES.NONE');
        });
    });

    describe('events', () => {

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should emit a task form completed event when task form completed', () => {
            let emitSpy: jasmine.Spy = spyOn(component.taskFormCompleted, 'emit');
            component.bubbleTaskFormCompleted(new FormModel());
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should emit a outcome execution event when task form outcome executed', () => {
            let emitSpy: jasmine.Spy = spyOn(component.processCancelled, 'emit');
            component.bubbleProcessCancelled(new FormOutcomeEvent(new FormOutcomeModel(new FormModel())));
            expect(emitSpy).toHaveBeenCalled();
        });

    });

});
