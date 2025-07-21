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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { taskDetailsMock } from '../../../testing/mock';
import { ProcessService } from '../../services/process.service';
import { ProcessInstanceTasksComponent } from './process-instance-tasks.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListItemHarness } from '@angular/material/list/testing';
import { ProcessInstanceRepresentation, TaskRepresentation } from '@alfresco/js-api';

describe('ProcessInstanceTasksComponent', () => {
    let component: ProcessInstanceTasksComponent;
    let fixture: ComponentFixture<ProcessInstanceTasksComponent>;
    let loader: HarnessLoader;
    let processService: ProcessService;

    const exampleProcessInstance: ProcessInstanceRepresentation = { id: '123' };

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessInstanceTasksComponent);
        processService = TestBed.inject(ProcessService);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        spyOn(processService, 'getProcessTasks').and.returnValue(of([new TaskRepresentation(taskDetailsMock)]));
    });

    it('should initially render message about no active tasks if no process instance ID provided', () => {
        component.processInstanceDetails = undefined;
        fixture.detectChanges();

        const msgEl = fixture.debugElement.query(By.css('[data-automation-id="active-tasks-none"]'));
        expect(msgEl).not.toBeNull();
    });

    it('should initially render message about no completed tasks if no process instance ID provided', () => {
        component.processInstanceDetails = undefined;

        fixture.detectChanges();

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

        const items = await loader.getAllHarnesses(MatListItemHarness.with({ ancestor: '[data-automation-id="active-tasks"]' }));
        expect(items.length).toBe(1);
    });

    it('should display completed tasks', async () => {
        const change = new SimpleChange(null, exampleProcessInstance, true);
        fixture.detectChanges();
        component.ngOnChanges({ processInstanceDetails: change });

        const items = await loader.getAllHarnesses(MatListItemHarness.with({ ancestor: '[data-automation-id="completed-tasks"]' }));
        expect(items.length).toBe(1);
    });

    describe('task reloading', () => {
        beforeEach(() => {
            component.processInstanceDetails = exampleProcessInstance;
        });

        it('should render a refresh button by default', () => {
            fixture.detectChanges();

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
            fixture.detectChanges();

            component.onRefreshClicked();
            expect(processService.getProcessTasks).toHaveBeenCalled();
        });
    });
});
