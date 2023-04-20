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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { TaskDetailsModel } from '../../task-list';

import { taskDetailsMock } from '../../mock';
import { ProcessInstance } from './../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { ProcessInstanceTasksComponent } from './process-instance-tasks.component';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessInstanceTasksComponent', () => {

    let component: ProcessInstanceTasksComponent;
    let fixture: ComponentFixture<ProcessInstanceTasksComponent>;
    let service: ProcessService;
    // let getProcessTasksSpy: jasmine.Spy;

    const exampleProcessInstance = new ProcessInstance({ id: '123' });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessInstanceTasksComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ProcessService);

        spyOn(service, 'getProcessTasks').and.returnValue(of([new TaskDetailsModel(taskDetailsMock)]));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should initially render message about no active tasks if no process instance ID provided', async () => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();
        await fixture.whenStable();

        const msgEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks-none"]'));
        expect(msgEl).not.toBeNull();
    });

    it('should initially render message about no completed tasks if no process instance ID provided', async () => {
        component.processInstanceDetails = undefined;

        fixture.detectChanges();
        await fixture.whenStable();

        const msgEl = fixture.debugElement.query(By.css('[data-automation-id="completed-tasks-none"]'));
        expect(msgEl).not.toBeNull();
    });

    it('should not render active tasks list if no process instance ID provided', () => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();
        const listEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks"]'));
        expect(listEl).toBeNull();
    });

    it('should not render completed tasks list if no process instance ID provided', () => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();
        const listEl = fixture.debugElement.query(By.css('[data-automation-id="completed-tasks"]'));
        expect(listEl).toBeNull();
    });

    it('should display active tasks', async () => {
        const change = new SimpleChange(null, exampleProcessInstance, true);
        fixture.detectChanges();
        component.ngOnChanges({ processInstanceDetails: change });

        fixture.detectChanges();
        await fixture.whenStable();

        component.ngOnChanges({ processInstanceDetails: change });
        const listEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks"]'));
        expect(listEl).not.toBeNull();
        expect(listEl.queryAll(By.css('mat-list-item')).length).toBe(1);
    });

    it('should display completed tasks', async () => {
        const change = new SimpleChange(null, exampleProcessInstance, true);
        fixture.detectChanges();
        component.ngOnChanges({ processInstanceDetails: change });

        fixture.detectChanges();
        await fixture.whenStable();

        const listEl = fixture.debugElement.query(By.css('[data-automation-id="completed-tasks"]'));
        expect(listEl).not.toBeNull();
        expect(listEl.queryAll(By.css('mat-list-item')).length).toBe(1);
    });

    describe('task reloading', () => {

        beforeEach(() => {
            component.processInstanceDetails = exampleProcessInstance;
        });

        it('should render a refresh button by default', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('.process-tasks-refresh'))).not.toBeNull();
        });

        it('should render a refresh button if configured to', async () => {
            component.showRefreshButton = true;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('.process-tasks-refresh'))).not.toBeNull();
        });

        it('should NOT render a refresh button if configured not to', async () => {
            component.showRefreshButton = false;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('.process-tasks-refresh'))).toBeNull();
        });

        it('should call service to get tasks when reload button clicked', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            component.onRefreshClicked();
            expect(service.getProcessTasks).toHaveBeenCalled();
        });
    });
});
