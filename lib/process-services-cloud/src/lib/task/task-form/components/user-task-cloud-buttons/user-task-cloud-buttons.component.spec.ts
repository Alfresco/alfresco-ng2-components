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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserTaskCloudButtonsComponent } from './user-task-cloud-buttons.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { NoopAuthModule } from '@alfresco/adf-core';
import { TaskCloudService } from '../../../services/task-cloud.service';

describe('UserTaskCloudButtonsComponent', () => {
    let component: UserTaskCloudButtonsComponent;
    let fixture: ComponentFixture<UserTaskCloudButtonsComponent>;
    let loader: HarnessLoader;
    let debugElement: DebugElement;
    let taskCloudService: TaskCloudService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, UserTaskCloudButtonsComponent]
        });
        fixture = TestBed.createComponent(UserTaskCloudButtonsComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        taskCloudService = TestBed.inject(TaskCloudService);

        fixture.componentRef.setInput('appName', 'app-test');
        fixture.componentRef.setInput('taskId', 'task1');

        fixture.detectChanges();
    });

    it('should show cancel button', async () => {
        fixture.componentRef.setInput('showCancelButton', false);
        let cancelButton: MatButtonHarness = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-cloud-cancel-task' }));

        expect(cancelButton).toBeNull();

        fixture.componentRef.setInput('showCancelButton', true);
        fixture.detectChanges();
        cancelButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-cloud-cancel-task' }));

        expect(cancelButton).toBeTruthy();
    });

    it('should emit onCancelClick when cancel button clicked', async () => {
        const cancelClickSpy = spyOn(component.cancelClick, 'emit');
        fixture.componentRef.setInput('showCancelButton', true);
        fixture.detectChanges();
        const cancelButton: MatButtonHarness = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-cloud-cancel-task' }));
        await cancelButton.click();
        expect(cancelClickSpy).toHaveBeenCalled();
    });

    it('should show claim button', async () => {
        let claimButton: MatButtonHarness = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '.adf-user-task-cloud-claim-btn' }));

        expect(claimButton).toBeNull();

        fixture.componentRef.setInput('canClaimTask', true);
        fixture.detectChanges();
        claimButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '.adf-user-task-cloud-claim-btn' }));

        expect(claimButton).toBeTruthy();
    });

    it('should emit claimTask when claim button clicked', async () => {
        spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
        fixture.componentRef.setInput('canClaimTask', true);
        spyOn(component.claimTask, 'emit').and.stub();
        fixture.detectChanges();

        const claimButton = debugElement.query(By.css('[adf-cloud-claim-task]'));
        expect(claimButton).toBeTruthy();

        claimButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.claimTask.emit).toHaveBeenCalled();
    });

    it('should show unclaim button', async () => {
        let unclaimButton: MatButtonHarness = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '.adf-user-task-cloud-unclaim-btn' }));

        expect(unclaimButton).toBeNull();

        fixture.componentRef.setInput('canUnclaimTask', true);
        fixture.detectChanges();
        unclaimButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '.adf-user-task-cloud-unclaim-btn' }));

        expect(unclaimButton).toBeTruthy();
    });

    it('should emit unclaim when button clicked', async () => {
        spyOn(taskCloudService, 'unclaimTask').and.returnValue(of({}));
        fixture.componentRef.setInput('canUnclaimTask', true);
        spyOn(component.unclaimTask, 'emit').and.stub();
        fixture.detectChanges();

        const unclaimButton = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
        expect(unclaimButton).toBeTruthy();
        unclaimButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.unclaimTask.emit).toHaveBeenCalled();
    });
});
