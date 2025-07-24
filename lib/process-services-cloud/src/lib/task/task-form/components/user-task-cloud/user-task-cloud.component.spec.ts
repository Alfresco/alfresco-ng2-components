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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { of, throwError } from 'rxjs';
import { IdentityUserService } from '../../../../people/services/identity-user.service';
import { UserTaskCloudComponent } from './user-task-cloud.component';
import { By } from '@angular/platform-browser';
import { TaskScreenCloudComponent } from '../../../../screen/components/screen-cloud/screen-cloud.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NoopAuthModule, NoopTranslateModule } from '@alfresco/adf-core';
import {
    TASK_ASSIGNED_STATE,
    TASK_CLAIM_PERMISSION,
    TASK_CREATED_STATE,
    TASK_RELEASE_PERMISSION,
    TASK_VIEW_PERMISSION,
    TaskDetailsCloudModel
} from '../../../models/task-details-cloud.model';
import { TaskFormCloudComponent } from '../task-form-cloud/task-form-cloud.component';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { FormModel } from '../../../../../../../core';
import { UserTaskCloudButtonsComponent } from '../user-task-cloud-buttons/user-task-cloud-buttons.component';

const taskDetails: TaskDetailsCloudModel = {
    appName: 'simple-app',
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

@Component({
    selector: 'adf-cloud-task-screen',
    standalone: true,
    template: ''
})
class TaskScreenCloudMockComponent {
    @Input() taskId: string;
    @Input() appName: string = '';
    @Input() canClaimTask: boolean;
    @Input() canUnclaimTask: boolean;
    @Input() showCancelButton: boolean;
    @Input() screenId: string = '';
    @Input() processInstanceId: string = '';
    @Input() taskName: string = '';
    @Input() readOnly = false;
    @Input() rootProcessInstanceId: string = '';
    @Input() isNextTaskCheckboxChecked = false;

    @Output() taskSaved = new EventEmitter();
    @Output() taskCompleted = new EventEmitter<any>();
    @Output() error = new EventEmitter<any>();
    @Output() cancelTask = new EventEmitter<any>();
    @Output() claimTask = new EventEmitter<any>();
    @Output() unclaimTask = new EventEmitter<any>();
    @Output() nextTaskCheckboxCheckedChanged = new EventEmitter<MatCheckboxChange>();
}

describe('UserTaskCloudComponent', () => {
    let component: UserTaskCloudComponent;
    let fixture: ComponentFixture<UserTaskCloudComponent>;
    let taskCloudService: TaskCloudService;
    let getTaskSpy: jasmine.Spy;
    let getCurrentUserSpy: jasmine.Spy;
    let loader: HarnessLoader;
    let identityUserService: IdentityUserService;
    let errorEmitSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAuthModule, UserTaskCloudComponent, TaskFormCloudComponent]
        }).overrideComponent(UserTaskCloudComponent, {
            remove: { imports: [TaskScreenCloudComponent] },
            add: { imports: [TaskScreenCloudMockComponent] }
        });

        fixture = TestBed.createComponent(UserTaskCloudComponent);
        component = fixture.componentInstance;
        errorEmitSpy = spyOn(component.error, 'emit');
        loader = TestbedHarnessEnvironment.loader(fixture);
        taskCloudService = TestBed.inject(TaskCloudService);
        identityUserService = TestBed.inject(IdentityUserService);

        getTaskSpy = spyOn(taskCloudService, 'getTaskById').and.returnValue(of(taskDetails));
        getCurrentUserSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({ username: 'admin.adf' });
        spyOn(taskCloudService, 'getCandidateGroups').and.returnValue(of([]));
        spyOn(taskCloudService, 'getCandidateUsers').and.returnValue(of([]));
        fixture.detectChanges();
    });

    describe('Complete button', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('showCompleteButton', true);
            fixture.componentRef.setInput('appName', 'app1');
            fixture.componentRef.setInput('taskId', 'task1');
            getTaskSpy.and.returnValue(of({ ...taskDetails }));
            fixture.detectChanges();
            fixture.whenStable();
        });

        it('should show complete button when status is ASSIGNED', async () => {
            const completeButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-form-complete' }));

            expect(completeButton).not.toBeNull();
        });

        it('should not show complete button when status is ASSIGNED but assigned to a different person', async () => {
            getCurrentUserSpy.and.returnValue({});
            fixture.detectChanges();
            const completeButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-form-complete' }));

            expect(completeButton).toBeNull();
        });

        it('should not show complete button when showCompleteButton=false', async () => {
            fixture.componentRef.setInput('showCompleteButton', false);
            fixture.detectChanges();
            const completeButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-form-complete' }));

            expect(completeButton).toBeNull();
        });
    });

    describe('Claim/Unclaim buttons', () => {
        beforeEach(() => {
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);
            component.taskDetails = taskDetails;
            fixture.componentRef.setInput('appName', 'app1');
            fixture.componentRef.setInput('taskId', 'task1');
            getTaskSpy.and.returnValue(of(taskDetails));
            fixture.detectChanges();
        });

        it('should not show release button for standalone task', async () => {
            component.taskDetails.permissions = [TASK_RELEASE_PERMISSION];
            component.taskDetails.standalone = true;
            fixture.detectChanges();
            const unclaimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-unclaim-task]' }));

            expect(unclaimBtn).toBeNull();
        });

        it('should not show claim button for standalone task', async () => {
            component.taskDetails.status = TASK_CREATED_STATE;
            component.taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            component.taskDetails.standalone = true;
            fixture.detectChanges();
            const claimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-claim-task]' }));

            expect(claimBtn).toBeNull();
        });

        it('should show release button when task is assigned to one of the candidate users', async () => {
            component.taskDetails = { ...taskDetails, standalone: false, status: TASK_ASSIGNED_STATE, permissions: [TASK_RELEASE_PERMISSION] };
            fixture.detectChanges();
            const unclaimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-unclaim-task]' }));
            expect(unclaimBtn).not.toBeNull();

            const unclaimBtnLabel = await unclaimBtn.getText();
            expect(unclaimBtnLabel).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.UNCLAIM');
        });

        it('should not show unclaim button when status is ASSIGNED but assigned to different person', async () => {
            getCurrentUserSpy.and.returnValue({});
            fixture.detectChanges();
            const unclaimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-unclaim-task]' }));

            expect(unclaimBtn).toBeNull();
        });

        it('should not show unclaim button when status is not ASSIGNED', async () => {
            component.taskDetails.status = undefined;
            fixture.detectChanges();
            const unclaimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-unclaim-task]' }));

            expect(unclaimBtn).toBeNull();
        });

        it('should not show unclaim button when status is ASSIGNED and permissions not include RELEASE', async () => {
            component.taskDetails.status = TASK_ASSIGNED_STATE;
            component.taskDetails.permissions = [TASK_VIEW_PERMISSION];
            fixture.detectChanges();
            const unclaimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-unclaim-task]' }));

            expect(unclaimBtn).toBeNull();
        });

        it('should show claim button when status is CREATED and permission includes CLAIM', async () => {
            component.taskDetails.standalone = false;
            component.taskDetails.status = TASK_CREATED_STATE;
            component.taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            fixture.detectChanges();

            const claimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-claim-task]' }));
            expect(claimBtn).not.toBeNull();

            const claimBtnLabel = await claimBtn.getText();
            expect(claimBtnLabel).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.CLAIM');
        });

        it('should not show claim button when status is not CREATED', async () => {
            component.taskDetails.status = undefined;
            fixture.detectChanges();
            const claimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-claim-task]' }));

            expect(claimBtn).toBeNull();
        });

        it('should not show claim button when status is CREATED and permission not includes CLAIM', async () => {
            component.taskDetails.status = TASK_CREATED_STATE;
            component.taskDetails.permissions = [TASK_VIEW_PERMISSION];
            fixture.detectChanges();
            const claimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-claim-task]' }));

            expect(claimBtn).toBeNull();
        });
    });

    describe('Cancel button', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('appName', 'app1');
            fixture.componentRef.setInput('taskId', 'task1');
            fixture.detectChanges();
        });

        it('should show cancel button by default', async () => {
            const cancelBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-cloud-cancel-task' }));
            expect(cancelBtn).toBeDefined();

            const cancelBtnLabel = await cancelBtn.getText();
            expect(cancelBtnLabel).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.CANCEL');
        });

        it('should not show cancel button when showCancelButton=false', async () => {
            fixture.componentRef.setInput('showCancelButton', false);
            fixture.detectChanges();
            const cancelBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-cloud-cancel-task' }));

            expect(cancelBtn).toBeNull();
        });
    });

    describe('Inputs', () => {
        it('should not show complete/claim/unclaim buttons when readOnly=true', async () => {
            getTaskSpy.and.returnValue(of(taskDetails));
            fixture.componentRef.setInput('appName', 'app1');
            fixture.componentRef.setInput('taskId', 'task1');
            fixture.componentRef.setInput('readOnly', true);
            fixture.componentRef.setInput('showCancelButton', true);
            component.getTaskType();
            fixture.detectChanges();
            await fixture.whenStable();

            const completeBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-complete-task]' }));
            expect(completeBtn).toBeNull();

            const claimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-claim-task]' }));
            expect(claimBtn).toBeNull();

            const unclaimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-unclaim-task]' }));
            expect(unclaimBtn).toBeNull();

            const cancelBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-cloud-cancel-task' }));
            expect(cancelBtn).toBeDefined();

            const cancelBtnLabel = await cancelBtn.getText();
            expect(cancelBtnLabel).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.CANCEL');
        });

        it('should load data when appName changes', () => {
            component.taskId = 'task1';
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });

            expect(getTaskSpy).toHaveBeenCalled();
        });

        it('should load data when taskId changes', () => {
            component.appName = 'app1';
            component.ngOnChanges({ taskId: new SimpleChange(null, 'task1', false) });

            expect(getTaskSpy).toHaveBeenCalled();
        });

        it('should not load data when appName changes and taskId is not defined', async () => {
            fixture.componentRef.setInput('taskId', null);
            fixture.detectChanges();

            expect(component.taskId).toBeNull();

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            await fixture.whenStable();

            expect(getTaskSpy).not.toHaveBeenCalled();
        });

        it('should not load data when taskId changes and appName is not defined', async () => {
            component.ngOnChanges({ taskId: new SimpleChange(null, 'task1', false) });

            expect(getTaskSpy).not.toHaveBeenCalled();
        });

        it('should emit error when getTaskById fails', async () => {
            getTaskSpy.and.returnValue(throwError(() => 'getTaskyById error'));
            component.taskId = 'task1';
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            await fixture.whenStable();

            expect(errorEmitSpy).toHaveBeenCalledWith('getTaskyById error');
        });
    });

    describe('Events', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('appName', 'app1');
            fixture.componentRef.setInput('taskId', 'task1');
            fixture.componentRef.setInput('showCancelButton', true);
            fixture.detectChanges();
        });

        it('should emit cancelClick when cancel button is clicked', async () => {
            spyOn(component.cancelClick, 'emit').and.stub();
            fixture.detectChanges();

            const cancelBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-cloud-cancel-task' }));
            await cancelBtn.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.cancelClick.emit).toHaveBeenCalledOnceWith('task1');
        });

        it('should emit taskCompleted when task is completed', async () => {
            component.taskDetails.status = TASK_ASSIGNED_STATE;
            spyOn(taskCloudService, 'completeTask').and.returnValue(of({}));
            spyOn(component.taskCompleted, 'emit').and.stub();
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
            const completeBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-complete-task]' }));
            await completeBtn.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.taskCompleted.emit).toHaveBeenCalledOnceWith(false);
        });

        it('should emit taskClaimed when task is claimed', async () => {
            spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);
            spyOn(component.taskClaimed, 'emit').and.stub();
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            getTaskSpy.and.returnValue(of(taskDetails));

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();

            const claimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-claim-task]' }));
            await claimBtn.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.taskClaimed.emit).toHaveBeenCalledOnceWith('task1');
        });

        it('should emit error when error occurs', async () => {
            component.onError({});
            fixture.detectChanges();
            await fixture.whenStable();

            expect(errorEmitSpy).toHaveBeenCalled();
        });

        it('should reload when task is completed', async () => {
            spyOn(taskCloudService, 'completeTask').and.returnValue(of({}));
            const reloadSpy = spyOn(component, 'ngOnChanges').and.callThrough();
            component.taskDetails.status = TASK_ASSIGNED_STATE;

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
            await fixture.whenStable();

            const completeBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-complete-task]' }));
            await completeBtn.click();
            await fixture.whenStable();

            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should reload when task is claimed', async () => {
            spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);
            const reloadSpy = spyOn(component, 'ngOnChanges').and.callThrough();
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            taskDetails.status = TASK_CREATED_STATE;
            getTaskSpy.and.returnValue(of(taskDetails));

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();

            const claimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-claim-task]' }));
            await claimBtn.click();
            await fixture.whenStable();

            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should emit taskUnclaimed when task is unclaimed', async () => {
            spyOn(taskCloudService, 'unclaimTask').and.returnValue(of({}));
            const reloadSpy = spyOn(component, 'ngOnChanges').and.callThrough();
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);

            taskDetails.status = TASK_ASSIGNED_STATE;
            taskDetails.permissions = [TASK_RELEASE_PERMISSION];
            getTaskSpy.and.returnValue(of(taskDetails));

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
            const unclaimBtn = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '[adf-cloud-unclaim-task]' }));
            await unclaimBtn.click();
            await fixture.whenStable();

            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should show loading template while task data is being loaded', async () => {
            component.loading = true;
            fixture.detectChanges();

            expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(true);
        });

        it('should not show loading template while task data is not being loaded', async () => {
            component.loading = false;
            fixture.detectChanges();

            expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(false);
        });

        it('should emit onTaskLoaded on initial load of component', () => {
            component.appName = '';
            spyOn(component.onTaskLoaded, 'emit');

            component.ngOnInit();
            fixture.detectChanges();
            expect(component.onTaskLoaded.emit).toHaveBeenCalledWith(taskDetails);
        });
    });

    it('should display task name as title on no form template if showTitle is true', async () => {
        fixture.componentRef.setInput('appName', 'app1');
        fixture.componentRef.setInput('taskId', 'task1');
        component.taskDetails = { ...taskDetails };
        fixture.detectChanges();

        const noFormTemplateTitle = await loader.getHarnessOrNull(MatCardHarness);
        const noFormTemplateTitleText = await noFormTemplateTitle.getTitleText();

        expect(noFormTemplateTitleText).toEqual('Task1');
    });

    it('should display default name as title on no form template if the task name empty/undefined', async () => {
        fixture.componentRef.setInput('appName', 'app1');
        fixture.componentRef.setInput('taskId', 'mock-task-id');
        const mockTaskDetailsWithOutName = { id: 'mock-task-id', name: null, formKey: null };
        getTaskSpy.and.returnValue(of(mockTaskDetailsWithOutName));

        fixture.detectChanges();
        const matCard = await loader.getHarnessOrNull(MatCardHarness);
        const noFormTemplateTitle = await matCard.getTitleText();

        expect(noFormTemplateTitle).toEqual('FORM.FORM_RENDERER.NAMELESS_TASK');
    });

    it('should not display no form title if showTitle is set to false', async () => {
        fixture.componentRef.setInput('appName', 'app1');
        fixture.componentRef.setInput('taskId', 'task1');
        fixture.componentRef.setInput('showTitle', false);
        component.showTitle = false;

        fixture.detectChanges();
        const matCard = await loader.getHarnessOrNull(MatCardHarness);
        expect(matCard).toBeDefined();

        const noFormTemplateTitleText = await matCard.getTitleText();
        expect(noFormTemplateTitleText).toBe('');
    });

    it('should allow controlling [open next task] checkbox visibility', () => {
        taskDetails.formKey = 'my-screen';
        component.taskDetails = { ...taskDetails };
        component.getTaskType();
        component.taskId = 'taskId';
        component.appName = 'app';

        const spy = spyOn(taskCloudService, 'canCompleteTask');

        const isCheckboxShown = () => {
            const screenElement = fixture.debugElement.query(By.css('adf-cloud-task-screen'));
            expect(screenElement).toBeTruthy();
            const screenComponent: TaskScreenCloudMockComponent = screenElement.componentInstance;
            expect(screenComponent).toBeTruthy();
            return screenComponent.showNextTaskCheckbox;
        };

        const prepareTestCase = (testCase: { showCompleteButton: boolean; readOnly: boolean; canCompleteTask: boolean }): void => {
            component.showCompleteButton = testCase.showCompleteButton;
            component.readOnly = testCase.readOnly;
            spy.calls.reset();
            spy.and.returnValue(testCase.canCompleteTask);
            fixture.detectChanges();
        };

        // The checkbox should always be shown when canCompleteTask() returns true, regardless of other settings
        prepareTestCase({ showCompleteButton: false, readOnly: false, canCompleteTask: false });
        expect(isCheckboxShown()).toBeFalse();

        prepareTestCase({ showCompleteButton: false, readOnly: false, canCompleteTask: true });
        expect(isCheckboxShown()).toBeTrue();

        prepareTestCase({ showCompleteButton: false, readOnly: true, canCompleteTask: false });
        expect(isCheckboxShown()).toBeFalse();

        prepareTestCase({ showCompleteButton: false, readOnly: true, canCompleteTask: true });
        expect(isCheckboxShown()).toBeTrue();

        prepareTestCase({ showCompleteButton: true, readOnly: false, canCompleteTask: false });
        expect(isCheckboxShown()).toBeFalse();

        prepareTestCase({ showCompleteButton: true, readOnly: false, canCompleteTask: true });
        expect(isCheckboxShown()).toBeTrue();

        prepareTestCase({ showCompleteButton: true, readOnly: true, canCompleteTask: false });
        expect(isCheckboxShown()).toBeFalse();

        prepareTestCase({ showCompleteButton: true, readOnly: true, canCompleteTask: true });
        expect(isCheckboxShown()).toBeTrue();
    });

    describe('Input Properties - Button Controls', () => {
        beforeEach(() => {
            taskDetails.formKey = 'my-form';
            component.taskDetails = { ...taskDetails };
            component.getTaskType();
            component.taskId = 'taskId';
            component.appName = 'app';
        });

        describe('showSaveButton', () => {
            it('should pass showSaveButton to task form when task type is Form', () => {
                fixture.componentRef.setInput('showSaveButton', false);
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.showSaveButton).toBe(false);
            });

            it('should pass showSaveButton as true by default to task form', () => {
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.showSaveButton).toBe(true);
            });

            it('should only show save button when canCompleteTask returns true', () => {
                spyOn(component, 'canCompleteTask').and.returnValue(false);
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.showSaveButton).toBe(false);
            });
        });

        describe('showCompleteButton', () => {
            it('should pass showCompleteButton to task form when task type is Form', () => {
                fixture.componentRef.setInput('showCompleteButton', false);
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.showCompleteButton).toBe(false);
            });

            it('should only show complete button when canCompleteTask returns true', () => {
                spyOn(component, 'canCompleteTask').and.returnValue(false);
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.showCompleteButton).toBe(false);
            });

            it('should display custom complete button text in no form template', async () => {
                component.taskDetails.formKey = '';
                component.getTaskType();

                const customText = 'Custom Complete Text';
                fixture.componentRef.setInput('customCompleteButtonText', customText);
                fixture.detectChanges();

                const completeButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-form-complete' }));
                expect(completeButton).not.toBeNull();

                const buttonText = await completeButton.getText();
                expect(buttonText).toBe(customText);
            });

            it('should display default complete button text when customCompleteButtonText is not provided', async () => {
                component.taskDetails.formKey = '';
                component.getTaskType();
                const spy = spyOn(taskCloudService, 'canCompleteTask');
                spy.and.returnValue(true);
                fixture.detectChanges();

                const completeButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '#adf-form-complete' }));
                expect(completeButton).not.toBeNull();

                const buttonText = await completeButton.getText();
                expect(buttonText).toBe('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.COMPLETE');
            });
        });

        describe('Custom button text', () => {
            it('should pass customCancelButtonText to task form when task type is Form', () => {
                const customText = 'Custom Cancel Text';
                fixture.componentRef.setInput('customCancelButtonText', customText);
                component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.customCancelButtonText).toBe(customText);
            });

            it('should pass customCancelButtonText to adf-cloud-user-task-cloud-buttons', () => {
                component.taskDetails.formKey = '';
                component.getTaskType();

                const customText = 'Custom Cancel Text';
                fixture.componentRef.setInput('customCancelButtonText', customText);
                fixture.detectChanges();

                const buttonsElement = fixture.debugElement.query(By.css('adf-cloud-user-task-cloud-buttons'));
                const buttonsComponent = buttonsElement?.componentInstance as UserTaskCloudButtonsComponent;

                expect(buttonsComponent.customCancelButtonText).toBe(customText);
            });

            it('should pass customSaveButtonText to task form when task type is Form', () => {
                const customText = 'Custom Save Text';
                fixture.componentRef.setInput('customSaveButtonText', customText);
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.customSaveButtonText).toBe(customText);
            });

            it('should pass customCompleteButtonText to task form when task type is Form', () => {
                const customText = 'Custom Complete Text';
                fixture.componentRef.setInput('customCompleteButtonText', customText);
                fixture.detectChanges();

                const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
                const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

                expect(taskFormComponent.customCompleteButtonText).toBe(customText);
            });
        });
    });

    it('should emit formLoaded when task form emits formLoaded event', () => {
        const mockForm = new FormModel();

        taskDetails.formKey = 'my-form';
        component.taskDetails = { ...taskDetails };
        component.getTaskType();
        component.taskId = 'taskId';
        component.appName = 'app';

        spyOn(component.formLoaded, 'emit');

        component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
        fixture.detectChanges();

        const taskFormElement = fixture.debugElement.query(By.css('adf-cloud-task-form'));
        const taskFormComponent = taskFormElement?.componentInstance as TaskFormCloudComponent;

        taskFormComponent.formLoaded.emit(mockForm);

        expect(component.formLoaded.emit).toHaveBeenCalledWith(mockForm);
    });
});
