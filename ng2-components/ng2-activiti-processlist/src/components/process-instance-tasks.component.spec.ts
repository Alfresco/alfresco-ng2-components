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

import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { TaskDetailsModel } from 'ng2-activiti-tasklist';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';

import { taskDetailsMock } from './../assets/task-details.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { ProcessInstance } from './../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { ProcessInstanceTasksComponent } from './process-instance-tasks.component';

describe('ProcessInstanceTasksComponent', () => {

    let componentHandler: any;
    let component: ProcessInstanceTasksComponent;
    let fixture: ComponentFixture<ProcessInstanceTasksComponent>;
    let debugElement: DebugElement;
    let service: ProcessService;
    let getProcessTasksSpy: jasmine.Spy;

    let exampleProcessInstance = new ProcessInstance({ id: '123' });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                ProcessInstanceTasksComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ProcessService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessInstanceTasksComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        service = fixture.debugElement.injector.get(ProcessService);
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

    it('should display active tasks', () => {
        let change = new SimpleChange(null, exampleProcessInstance, true);
        fixture.detectChanges();
        component.ngOnChanges({ 'processInstanceDetails': change });
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            component.ngOnChanges({ 'processInstanceDetails': change });
            let listEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks"]'));
            expect(listEl).not.toBeNull();
            expect(listEl.queryAll(By.css('mat-list-item')).length).toBe(1);
        });
    });

    it('should display completed tasks', () => {
        let change = new SimpleChange(null, exampleProcessInstance, true);
        fixture.detectChanges();
        component.ngOnChanges({ 'processInstanceDetails': change });
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let listEl = fixture.debugElement.query(By.css('[data-automation-id="completed-tasks"]'));
            expect(listEl).not.toBeNull();
            expect(listEl.queryAll(By.css('mat-list-item')).length).toBe(1);
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
});
