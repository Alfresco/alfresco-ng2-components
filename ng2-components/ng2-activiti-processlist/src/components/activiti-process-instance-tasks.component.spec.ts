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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { TaskDetailsModel } from 'ng2-activiti-tasklist';

import { ActivitiProcessInstanceTasks } from './activiti-process-instance-tasks.component';
import { TranslationMock } from './../assets/translation.service.mock';
import { taskDetailsMock } from './../assets/task-details.mock';
import { ProcessInstance } from './../models/process-instance';
import { ActivitiProcessService } from './../services/activiti-process.service';

describe('ActivitiProcessInstanceTasks', () => {

    let componentHandler: any;
    let component: ActivitiProcessInstanceTasks;
    let fixture: ComponentFixture<ActivitiProcessInstanceTasks>;
    let service: ActivitiProcessService;
    let getProcessTasksSpy: jasmine.Spy;

    let exampleProcessInstance = new ProcessInstance({ id: '123' });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                ActivitiProcessInstanceTasks
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiProcessInstanceTasks);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiProcessService);
        getProcessTasksSpy = spyOn(service, 'getProcessTasks').and.returnValue(Observable.of([new TaskDetailsModel(taskDetailsMock)]));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should initially render message about no active tasks if no process instance ID provided', async(() => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let msgEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks-none"]'));
            expect(msgEl).not.toBeNull();
        });
    }));

    it('should initially render message about no completed tasks if no process instance ID provided', async(() => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let msgEl = fixture.debugElement.query(By.css('[data-automation-id="completed-tasks-none"]'));
            expect(msgEl).not.toBeNull();
        });
    }));

    it('should not render active tasks list if no process instance ID provided', () => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();
        let listEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks"]'));
        expect(listEl).toBeNull();
    });

    it('should not render completed tasks list if no process instance ID provided', () => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();
        let listEl = fixture.debugElement.query(By.css('[data-automation-id="completed-tasks"]'));
        expect(listEl).toBeNull();
    });

    it('should call service to get tasks on init', () => {
        component.processInstanceDetails = exampleProcessInstance;
        fixture.detectChanges();
        expect(getProcessTasksSpy).toHaveBeenCalled();
    });

    it('should display active tasks', () => {
        component.processInstanceDetails = exampleProcessInstance;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let listEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks"]'));
            expect(listEl).not.toBeNull();
            expect(listEl.queryAll(By.css('li')).length).toBe(1);
        });
    });

    it('should display completed tasks', () => {
        component.processInstanceDetails = exampleProcessInstance;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let listEl = fixture.debugElement.query(By.css('[data-automation-id="completed-tasks"]'));
            expect(listEl).not.toBeNull();
            expect(listEl.queryAll(By.css('li')).length).toBe(1);
        });
    });

    describe('task reloading', () => {

        beforeEach(async(() => {
            component.processInstanceDetails = exampleProcessInstance;
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should render a refresh button by default', () => {
            expect(fixture.debugElement.query(By.css('.process-tasks-refresh'))).not.toBeNull();
        });

        it('should render a refresh button if configured to', () => {
            component.showRefreshButton = true;
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('.process-tasks-refresh'))).not.toBeNull();
        });

        it('should NOT render a refresh button if configured not to', () => {
            component.showRefreshButton = false;
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('.process-tasks-refresh'))).toBeNull();
        });

        it('should call service to get tasks when reload button clicked', () => {
            getProcessTasksSpy.calls.reset();
            component.onRefreshClicked();
            expect(getProcessTasksSpy).toHaveBeenCalled();
        });
    });

    describe('task details', () => {

        let closeSpy;

        beforeEach(async(() => {
            closeSpy = spyOn(component.dialog.nativeElement, 'close');
            component.processInstanceDetails = exampleProcessInstance;
            fixture.detectChanges();
            fixture.whenStable();
            component.taskdetails = jasmine.createSpyObj('taskdetails', [
                'loadDetails'
            ]);
        }));

        it('should display task details dialog when task clicked', () => {
            let showModalSpy = spyOn(component.dialog.nativeElement, 'showModal');
            component.clickTask({}, new TaskDetailsModel(taskDetailsMock));
            expect(showModalSpy).toHaveBeenCalled();
        });

        it('should close the task details dialog when close button clicked', () => {
            component.clickTask({}, new TaskDetailsModel(taskDetailsMock));
            fixture.detectChanges();
            component.cancelDialog();
            expect(closeSpy).toHaveBeenCalled();
        });

        it('should output event when task form completed', async(() => {
            let emitSpy = spyOn(component.taskFormCompleted, 'emit');
            fixture.detectChanges();
            component.clickTask({}, new TaskDetailsModel(taskDetailsMock));
            fixture.detectChanges();
            component.onTaskFormCompleted();
            expect(emitSpy).toHaveBeenCalled();
        }));

        it('should close dialog when task form completed', async(() => {
            component.clickTask({}, new TaskDetailsModel(taskDetailsMock));
            fixture.detectChanges();
            component.onTaskFormCompleted();
            expect(closeSpy).toHaveBeenCalled();
        }));

    });

});
