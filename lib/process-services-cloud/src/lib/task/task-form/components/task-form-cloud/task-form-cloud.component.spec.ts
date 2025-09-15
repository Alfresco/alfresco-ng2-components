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

import { FormModel, FormOutcomeEvent, FormOutcomeModel, NoopAuthModule, NoopTranslateModule } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormCloudComponent } from '../../../../form/components/form-cloud.component';
import { DisplayModeService } from '../../../../form/services/display-mode.service';
import { IdentityUserService } from '../../../../people/services/identity-user.service';
import { TaskCloudService } from '../../../services/task-cloud.service';
import {
    TASK_ASSIGNED_STATE,
    TASK_CLAIM_PERMISSION,
    TASK_CREATED_STATE,
    TASK_RELEASE_PERMISSION,
    TASK_VIEW_PERMISSION,
    TaskDetailsCloudModel
} from '../../../models/task-details-cloud.model';
import { UserTaskCloudButtonsComponent } from '../user-task-cloud-buttons/user-task-cloud-buttons.component';
import { TaskFormCloudComponent } from './task-form-cloud.component';
import { FormCustomOutcomesComponent } from '../../../../form/components/form-cloud-custom-outcomes.component';
import { By } from '@angular/platform-browser';

const taskDetails: TaskDetailsCloudModel = {
    appName: 'simple-app',
    appVersion: 1,
    assignee: 'admin.adf',
    completedDate: null,
    createdDate: new Date(1555419255340),
    description: null,
    formKey: null,
    id: 'bd6b1741-6046-11e9-80f0-0a586460040d',
    name: 'Task1',
    owner: 'admin.adf',
    standalone: false,
    status: TASK_ASSIGNED_STATE,
    permissions: [TASK_VIEW_PERMISSION]
};

describe('TaskFormCloudComponent', () => {
    let taskCloudService: TaskCloudService;
    let identityUserService: IdentityUserService;
    let getCurrentUserSpy: jasmine.Spy;
    let component: TaskFormCloudComponent;
    let fixture: ComponentFixture<TaskFormCloudComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopTranslateModule,
                NoopAuthModule,
                FormCloudComponent,
                FormCustomOutcomesComponent,
                UserTaskCloudButtonsComponent,
                TaskFormCloudComponent
            ]
        });
        taskDetails.status = TASK_ASSIGNED_STATE;
        taskDetails.permissions = [TASK_VIEW_PERMISSION];
        taskDetails.standalone = false;

        identityUserService = TestBed.inject(IdentityUserService);
        getCurrentUserSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({ username: 'admin.adf' });
        taskCloudService = TestBed.inject(TaskCloudService);
        fixture = TestBed.createComponent(TaskFormCloudComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Claim/Unclaim buttons', () => {
        beforeEach(() => {
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);
            fixture.componentRef.setInput('taskDetails', taskDetails);
            component.taskId = 'task1';
            component.showCancelButton = true;
            fixture.detectChanges();
        });

        it('should not show release button for standalone task', () => {
            taskDetails.permissions = [TASK_RELEASE_PERMISSION];
            taskDetails.standalone = true;
            fixture.detectChanges();
            const canUnclaimTask = component.canUnclaimTask();

            expect(canUnclaimTask).toBe(false);
        });

        it('should not show claim button for standalone task', () => {
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            taskDetails.standalone = true;
            fixture.detectChanges();
            const canClaimTask = component.canClaimTask();

            expect(canClaimTask).toBe(false);
        });

        it('should show release button when task is assigned to one of the candidate users', () => {
            taskDetails.permissions = [TASK_RELEASE_PERMISSION];
            fixture.detectChanges();
            const canUnclaimTask = component.canUnclaimTask();

            expect(canUnclaimTask).toBe(true);
        });

        it('should not show unclaim button when status is ASSIGNED but assigned to different person', () => {
            getCurrentUserSpy.and.returnValue({});
            fixture.detectChanges();
            const canUnclaimTask = component.canUnclaimTask();

            expect(canUnclaimTask).toBe(false);
        });

        it('should not show unclaim button when status is not ASSIGNED', () => {
            taskDetails.status = undefined;
            fixture.detectChanges();
            const canUnclaimTask = component.canUnclaimTask();

            expect(canUnclaimTask).toBe(false);
        });

        it('should not show unclaim button when status is ASSIGNED and permissions not include RELEASE', () => {
            taskDetails.status = TASK_ASSIGNED_STATE;
            taskDetails.permissions = [TASK_VIEW_PERMISSION];
            fixture.detectChanges();
            const canUnclaimTask = component.canUnclaimTask();

            expect(canUnclaimTask).toBe(false);
        });

        it('should show claim button when status is CREATED and permission includes CLAIM', () => {
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            fixture.detectChanges();
            const canClaimTask = component.canClaimTask();

            expect(canClaimTask).toBe(true);
        });

        it('should not show claim button when status is not CREATED', () => {
            taskDetails.status = undefined;
            fixture.detectChanges();
            const canClaimTask = component.canClaimTask();

            expect(canClaimTask).toBe(false);
        });

        it('should not show claim button when status is CREATED and permission not includes CLAIM', () => {
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_VIEW_PERMISSION];
            fixture.detectChanges();
            const canClaimTask = component.canClaimTask();

            expect(canClaimTask).toBe(false);
        });
    });

    describe('Inputs', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('taskDetails', taskDetails);
        });

        it('should not show complete/claim/unclaim buttons when readOnly=true', () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.readOnly = true;
            fixture.detectChanges();

            const canShowCompleteBtn = component.canCompleteTask();
            expect(canShowCompleteBtn).toBe(false);

            const canClaimTask = component.canClaimTask();
            expect(canClaimTask).toBe(false);

            const canUnclaimTask = component.canUnclaimTask();
            expect(canUnclaimTask).toBe(false);
        });

        it('should pass showCompleteButton to adf-cloud-form when task can be completed', () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showCompleteButton = true;
            spyOn(component, 'canCompleteTask').and.returnValue(true);
            fixture.detectChanges();

            const cloudFormElement = fixture.debugElement.query(By.css('adf-cloud-form'));
            expect(cloudFormElement).toBeDefined();
            const cloudFormComponent = cloudFormElement.componentInstance as FormCloudComponent;
            expect(cloudFormComponent).toBeDefined();
            expect(cloudFormComponent.showCompleteButton).toBe(true);
        });

        it('should not pass showCompleteButton to adf-cloud-form when task cannot be completed', () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showCompleteButton = true;
            spyOn(component, 'canCompleteTask').and.returnValue(false);
            fixture.detectChanges();

            const cloudFormElement = fixture.debugElement.query(By.css('adf-cloud-form'));
            expect(cloudFormElement).toBeDefined();
            const cloudFormComponent = cloudFormElement.componentInstance as FormCloudComponent;
            expect(cloudFormComponent).toBeDefined();
            expect(cloudFormComponent.showCompleteButton).toBe(false);
        });

        it('should pass showSaveButton to adf-cloud-form when task can be completed', () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showSaveButton = true;
            spyOn(component, 'canCompleteTask').and.returnValue(true);
            fixture.detectChanges();

            const cloudFormElement = fixture.debugElement.query(By.css('adf-cloud-form'));
            expect(cloudFormElement).toBeDefined();
            const cloudFormComponent = cloudFormElement.componentInstance as FormCloudComponent;
            expect(cloudFormComponent).toBeDefined();
            expect(cloudFormComponent.showSaveButton).toBe(true);
        });

        it('should not pass showSaveButton to adf-cloud-form when task cannot be completed', () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showSaveButton = true;
            spyOn(component, 'canCompleteTask').and.returnValue(false);
            fixture.detectChanges();

            const cloudFormElement = fixture.debugElement.query(By.css('adf-cloud-form'));
            expect(cloudFormElement).toBeDefined();
            const cloudFormComponent = cloudFormElement.componentInstance as FormCloudComponent;
            expect(cloudFormComponent).toBeDefined();
            expect(cloudFormComponent.showSaveButton).toBe(false);
        });

        it('should pass customSaveButtonText to adf-cloud-form', () => {
            const customText = 'Custom Save';
            component.appName = 'app1';
            component.taskId = 'task1';
            component.customSaveButtonText = customText;
            fixture.detectChanges();

            const cloudFormElement = fixture.debugElement.query(By.css('adf-cloud-form'));
            expect(cloudFormElement).toBeDefined();
            const cloudFormComponent = cloudFormElement.componentInstance as FormCloudComponent;
            expect(cloudFormComponent).toBeDefined();
            expect(cloudFormComponent.customSaveButtonText).toBe(customText);
        });

        it('should pass customCompleteButtonText to adf-cloud-form', () => {
            const customText = 'Custom Complete';
            component.appName = 'app1';
            component.taskId = 'task1';
            component.customCompleteButtonText = customText;
            fixture.detectChanges();

            const cloudFormElement = fixture.debugElement.query(By.css('adf-cloud-form'));
            expect(cloudFormElement).toBeDefined();
            const cloudFormComponent = cloudFormElement.componentInstance as FormCloudComponent;
            expect(cloudFormComponent).toBeDefined();
            expect(cloudFormComponent.customCompleteButtonText).toBe(customText);
        });
    });

    describe('Events', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('taskDetails', taskDetails);
            component.appName = 'app1';
            component.taskId = 'task1';
            fixture.detectChanges();
        });

        it('should emit cancelClick when cancel button is clicked', async () => {
            spyOn(component.cancelClick, 'emit').and.stub();
            component.onCancelClick();
            fixture.detectChanges();

            expect(component.cancelClick.emit).toHaveBeenCalledOnceWith('task1');
        });

        it('should emit taskClaimed when task is claimed', async () => {
            spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);
            spyOn(component.taskClaimed, 'emit').and.stub();
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            component.onClaimTask();
            fixture.detectChanges();

            expect(component.taskClaimed.emit).toHaveBeenCalledOnceWith('task1');
        });

        it('should emit error when error occurs', async () => {
            spyOn(component.error, 'emit').and.stub();
            component.onError({});
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.error.emit).toHaveBeenCalled();
        });

        it('should emit an executeOutcome event when form outcome executed', () => {
            const executeOutcomeSpy: jasmine.Spy = spyOn(component.executeOutcome, 'emit');
            component.onFormExecuteOutcome(new FormOutcomeEvent(new FormOutcomeModel(new FormModel())));

            expect(executeOutcomeSpy).toHaveBeenCalled();
        });

        it('should emit displayModeOn when display mode is turned on', async () => {
            spyOn(component.displayModeOn, 'emit').and.stub();
            component.onDisplayModeOn(DisplayModeService.DEFAULT_DISPLAY_MODE_CONFIGURATIONS[0]);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.displayModeOn.emit).toHaveBeenCalledWith(DisplayModeService.DEFAULT_DISPLAY_MODE_CONFIGURATIONS[0]);
        });

        it('should emit displayModeOff when display mode is turned on', async () => {
            spyOn(component.displayModeOff, 'emit').and.stub();
            component.onDisplayModeOff(DisplayModeService.DEFAULT_DISPLAY_MODE_CONFIGURATIONS[0]);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.displayModeOff.emit).toHaveBeenCalledWith(DisplayModeService.DEFAULT_DISPLAY_MODE_CONFIGURATIONS[0]);
        });

        it('should emit formLoaded when form is loaded', () => {
            const mockForm = new FormModel();
            spyOn(component.formLoaded, 'emit').and.stub();
            component.onFormLoaded(mockForm);

            expect(component.formLoaded.emit).toHaveBeenCalledOnceWith(mockForm);
        });

        it('should emit both formCompleted and taskCompleted events when form is completed', () => {
            const mockForm = new FormModel();
            spyOn(component.formCompleted, 'emit').and.stub();
            spyOn(component.taskCompleted, 'emit').and.stub();

            component.onFormCompleted(mockForm);

            expect(component.formCompleted.emit).toHaveBeenCalledOnceWith(mockForm);
            expect(component.taskCompleted.emit).toHaveBeenCalledOnceWith(mockForm);
        });

        it('should handle formLoaded event from adf-cloud-form and re-emit it', () => {
            const mockForm = new FormModel();
            spyOn(component.formLoaded, 'emit').and.stub();

            // Trigger the formLoaded event from the child adf-cloud-form component
            const cloudFormElement = fixture.debugElement.query((sel) => sel.name === 'adf-cloud-form');
            cloudFormElement.triggerEventHandler('formLoaded', mockForm);

            expect(component.formLoaded.emit).toHaveBeenCalledOnceWith(mockForm);
        });
    });

    it('should call children cloud task form change display mode when changing the display mode', () => {
        const displayMode = 'displayMode';
        component.taskDetails = { ...taskDetails, formKey: 'some-form' };
        fixture.detectChanges();

        expect(component.adfCloudForm).toBeDefined();

        const switchToDisplayModeSpy = spyOn(component.adfCloudForm, 'switchToDisplayMode');
        component.switchToDisplayMode(displayMode);

        expect(switchToDisplayModeSpy).toHaveBeenCalledOnceWith(displayMode);
    });
});
