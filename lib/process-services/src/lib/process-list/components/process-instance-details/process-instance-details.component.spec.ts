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

import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CommentProcessService } from '../../../process-comments/services/comment-process.service';
import { exampleProcess, exampleProcessNoName, mockRunningProcess, processEnded } from '../../../testing/mock';
import { mockProcessInstanceComments } from '../../../testing/mock/process/process-comments.mock';
import { ProcessService } from '../../services/process.service';
import { ProcessInstanceDetailsComponent } from './process-instance-details.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

describe('ProcessInstanceDetailsComponent', () => {
    let service: ProcessService;
    let component: ProcessInstanceDetailsComponent;
    let fixture: ComponentFixture<ProcessInstanceDetailsComponent>;
    let loader: HarnessLoader;
    let getProcessSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProcessInstanceDetailsComponent],
            providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(ProcessInstanceDetailsComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        service = fixture.debugElement.injector.get(ProcessService);
        const commentService = fixture.debugElement.injector.get(CommentProcessService);

        getProcessSpy = spyOn(service, 'getProcess').and.returnValue(of(exampleProcess));
        spyOn(service, 'getProcessTasks').and.returnValue(of());
        spyOn(commentService, 'get').and.returnValue(of(mockProcessInstanceComments));
    });

    afterEach(() => {
        getProcessSpy.calls.reset();
        fixture.destroy();
    });

    it('should not load task details when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getProcessSpy).not.toHaveBeenCalled();
    });

    it('should set a placeholder message when processInstanceId not initialised', () => {
        fixture.detectChanges();
        expect(component.processInstanceDetails).toBeFalsy();
        expect(fixture.nativeElement.innerText).toBe('ADF_PROCESS_LIST.DETAILS.MESSAGES.NONE');
    });

    it('should display a header when the processInstanceId is provided', async () => {
        fixture.detectChanges();
        component.ngOnChanges({ processInstanceId: new SimpleChange(null, '123', true) });

        const headerEl = await loader.getHarness(MatCardHarness);
        expect(await headerEl.getTitleText()).toBe('Process 123');
    });

    it('should display default details when the process instance has no name', async () => {
        fixture.detectChanges();
        getProcessSpy.and.returnValue(of(exampleProcessNoName));
        fixture.detectChanges();
        component.ngOnChanges({ processInstanceId: new SimpleChange(null, '123', true) });

        const headerEl = await loader.getHarness(MatCardHarness);
        expect(await headerEl.getTitleText()).toBe('My Process - Nov 10, 2016, 3:37:30 AM');
    });

    it('should enable diagram button if the process is running', async () => {
        fixture.detectChanges();
        getProcessSpy.and.returnValue(of(mockRunningProcess));
        fixture.detectChanges();
        component.ngOnChanges({ processInstanceId: new SimpleChange(null, '123', true) });

        fixture.detectChanges();
        await fixture.whenStable();

        const diagramButton = fixture.debugElement.query(By.css('#show-diagram-button'));
        expect(diagramButton).not.toBeNull();
        expect(diagramButton.nativeElement.disabled).toBe(false);
    });

    it('should disable diagram button if the process is running', async () => {
        fixture.detectChanges();
        getProcessSpy.and.returnValue(of(processEnded));
        fixture.detectChanges();
        component.ngOnChanges({ processInstanceId: new SimpleChange(null, '123', true) });

        fixture.detectChanges();
        await fixture.whenStable();

        const diagramButton = fixture.debugElement.query(By.css('#show-diagram-button'));
        expect(diagramButton).not.toBeNull();
        expect(diagramButton.nativeElement.disabled).toBe(true);
    });

    describe('change detection', () => {
        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(() => {
            component.processInstanceId = '123';
            component.tasksList = jasmine.createSpyObj('tasksList', ['load']);
            fixture.detectChanges();
        });

        it('should fetch new process details when processInstanceId changed', async () => {
            fixture.detectChanges();
            component.ngOnChanges({ processInstanceId: change });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getProcessSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new process details when empty changeset made', async () => {
            fixture.detectChanges();
            component.ngOnChanges({});

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getProcessSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new process details when processInstanceId changed to null', async () => {
            fixture.detectChanges();
            component.ngOnChanges({ processInstanceId: nullChange });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getProcessSpy).not.toHaveBeenCalled();
        });

        it('should set a placeholder message when processInstanceId changed to null', async () => {
            component.ngOnChanges({ processInstanceId: nullChange });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.nativeElement.innerText).toBe('ADF_PROCESS_LIST.DETAILS.MESSAGES.NONE');
        });

        it('should display cancel button if process is running', async () => {
            component.ngOnChanges({ processInstanceId: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const buttonEl = fixture.debugElement.query(By.css('[data-automation-id="header-status"] button'));
            expect(buttonEl).not.toBeNull();
        });
    });
});
