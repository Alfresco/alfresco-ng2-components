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

import { DebugElement, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormModel, FormOutcomeEvent, FormOutcomeModel, setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFormCloudComponent } from './task-form-cloud.component';
import {
    TaskDetailsCloudModel,
    TASK_ASSIGNED_STATE,
    TASK_CLAIM_PERMISSION,
    TASK_CREATED_STATE,
    TASK_RELEASE_PERMISSION,
    TASK_VIEW_PERMISSION
} from '../../start-task/models/task-details-cloud.model';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityUserService } from '../../../people/services/identity-user.service';

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

describe('TaskFormCloudComponent', () => {

    let taskCloudService: TaskCloudService;
    let identityUserService: IdentityUserService;

    let getTaskSpy: jasmine.Spy;
    let getCurrentUserSpy: jasmine.Spy;
    let debugElement: DebugElement;

    let component: TaskFormCloudComponent;
    let fixture: ComponentFixture<TaskFormCloudComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        taskDetails.status = TASK_ASSIGNED_STATE;
        taskDetails.permissions = [TASK_VIEW_PERMISSION];
        taskDetails.standalone = false;

        identityUserService = TestBed.inject(IdentityUserService);
        getCurrentUserSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({ username: 'admin.adf' });
        taskCloudService = TestBed.inject(TaskCloudService);
        getTaskSpy = spyOn(taskCloudService, 'getTaskById').and.returnValue(of(taskDetails));
        spyOn(taskCloudService, 'getCandidateGroups').and.returnValue(of([]));
        spyOn(taskCloudService, 'getCandidateUsers').and.returnValue(of([]));

        fixture = TestBed.createComponent(TaskFormCloudComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Complete button', () => {

        beforeEach(() => {
            component.taskId = 'task1';
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
        });

        it('should show complete button when status is ASSIGNED', () => {
            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn.nativeElement).toBeDefined();
            expect(completeBtn.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.COMPLETE');
        });

        it('should not show complete button when status is ASSIGNED but assigned to a different person', () => {
            getCurrentUserSpy.and.returnValue({});
            fixture.detectChanges();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn).toBeNull();
        });

        it('should not show complete button when showCompleteButton=false', () => {
            component.showCompleteButton = false;
            fixture.detectChanges();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn).toBeNull();
        });
    });

    describe('Claim/Unclaim buttons', () => {

        beforeEach(() => {
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);
            getTaskSpy.and.returnValue(of(taskDetails));
            component.taskId = 'task1';
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
        });

        it('should not show release button for standalone task', () => {
            taskDetails.permissions = [TASK_RELEASE_PERMISSION];
            taskDetails.standalone = true;
            getTaskSpy.and.returnValue(of(taskDetails));
            fixture.detectChanges();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();
        });

        it('should not show claim button for standalone task', () => {
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            taskDetails.standalone = true;
            getTaskSpy.and.returnValue(of(taskDetails));
            fixture.detectChanges();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn).toBeNull();
        });

        it('should show release button when task is assigned to one of the candidate users', () => {
            taskDetails.permissions = [TASK_RELEASE_PERMISSION];
            fixture.detectChanges();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn.nativeElement).toBeDefined();
            expect(unclaimBtn.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.UNCLAIM');
        });

        it('should not show unclaim button when status is ASSIGNED but assigned to different person', () => {
            getCurrentUserSpy.and.returnValue({});
            fixture.detectChanges();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();
        });

        it('should not show unclaim button when status is not ASSIGNED', () => {
            taskDetails.status = undefined;
            fixture.detectChanges();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();
        });

        it('should not show unclaim button when status is ASSIGNED and permissions not include RELEASE', () => {
            taskDetails.status = TASK_ASSIGNED_STATE;
            taskDetails.permissions = [TASK_VIEW_PERMISSION];
            fixture.detectChanges();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();
        });

        it('should show claim button when status is CREATED and permission includes CLAIM', () => {
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            fixture.detectChanges();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn.nativeElement).toBeDefined();
            expect(claimBtn.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.CLAIM');
        });

        it('should not show claim button when status is not CREATED', () => {
            taskDetails.status = undefined;
            fixture.detectChanges();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn).toBeNull();
        });

        it('should not show claim button when status is CREATED and permission not includes CLAIM', () => {
            taskDetails.status = TASK_CREATED_STATE;
            taskDetails.permissions = [TASK_VIEW_PERMISSION];
            fixture.detectChanges();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn).toBeNull();
        });
    });

    describe('Cancel button', () => {

        it('should show cancel button by default', () => {
            component.appName = 'app1';
            component.taskId = 'task1';

            fixture.detectChanges();

            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
            expect(cancelBtn.nativeElement).toBeDefined();
            expect(cancelBtn.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.CANCEL');
        });

        it('should not show cancel button when showCancelButton=false', () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showCancelButton = false;

            fixture.detectChanges();

            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
            expect(cancelBtn).toBeNull();
        });
    });

    describe('Inputs', () => {

        it('should not show complete/claim/unclaim buttons when readOnly=true', () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.readOnly = true;

            fixture.detectChanges();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn).toBeNull();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn).toBeNull();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();

            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
            expect(cancelBtn.nativeElement).toBeDefined();
            expect(cancelBtn.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_FORM.EMPTY_FORM.BUTTONS.CANCEL');
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

        it('should not load data when appName changes and taskId is not defined', () => {
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            expect(getTaskSpy).not.toHaveBeenCalled();
        });

        it('should not load data when taskId changes and appName is not defined', () => {
            component.ngOnChanges({ taskId: new SimpleChange(null, 'task1', false) });
            expect(getTaskSpy).not.toHaveBeenCalled();
        });
    });

    describe('Events', () => {

        beforeEach(() => {
            component.appName = 'app1';
            component.taskId = 'task1';
            fixture.detectChanges();
        });

        it('should emit cancelClick when cancel button is clicked', async () => {
            spyOn(component.cancelClick,'emit').and.stub();

            fixture.detectChanges();
            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
            cancelBtn.triggerEventHandler('click', {});
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.cancelClick.emit).toHaveBeenCalledOnceWith('task1');
        });

        it('should emit taskCompleted when task is completed', async () => {
            spyOn(taskCloudService, 'completeTask').and.returnValue(of({}));
            spyOn(component.taskCompleted, 'emit').and.stub();

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            completeBtn.triggerEventHandler('click', {});
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.taskCompleted.emit).toHaveBeenCalledOnceWith('task1');
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
            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            claimBtn.triggerEventHandler('click', {});
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.taskClaimed.emit).toHaveBeenCalledOnceWith('task1');
        });

        it('should emit error when error occurs', async () => {
            spyOn(component.error, 'emit').and.stub();

            component.onError({});
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.error.emit).toHaveBeenCalled();
        });

        it('should reload when task is completed', () => {
            spyOn(taskCloudService, 'completeTask').and.returnValue(of({}));
            const reloadSpy = spyOn(component, 'ngOnChanges').and.callThrough();

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));

            completeBtn.nativeElement.click();
            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should reload when task is claimed', () => {
            spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);
            const reloadSpy = spyOn(component, 'ngOnChanges').and.callThrough();
            taskDetails.permissions = [TASK_CLAIM_PERMISSION];
            taskDetails.status = TASK_CREATED_STATE;
            getTaskSpy.and.returnValue(of(taskDetails));

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));

            claimBtn.nativeElement.click();
            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should emit taskUnclaimed when task is unclaimed', () => {
            spyOn(taskCloudService, 'unclaimTask').and.returnValue(of({}));
            const reloadSpy = spyOn(component, 'ngOnChanges').and.callThrough();
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);

            taskDetails.status = TASK_ASSIGNED_STATE;
            taskDetails.permissions = [TASK_RELEASE_PERMISSION];
            getTaskSpy.and.returnValue(of(taskDetails));

            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            fixture.detectChanges();
            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));

            unclaimBtn.nativeElement.click();
            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should show loading template while task data is being loaded', () => {
            component.loading = true;
            fixture.detectChanges();

            const loadingTemplate = debugElement.query(By.css('mat-progress-spinner'));

            expect(loadingTemplate).toBeDefined();
        });

        it('should not show loading template while task data is not being loaded', () => {
            component.loading = false;
            fixture.detectChanges();

            const loadingTemplate = debugElement.query(By.css('mat-progress-spinner'));

            expect(loadingTemplate).toBeNull();
        });

        it('should emit an executeOutcome event when form outcome executed', () => {
            const executeOutcomeSpy: jasmine.Spy = spyOn(component.executeOutcome, 'emit');

            component.onFormExecuteOutcome(new FormOutcomeEvent(new FormOutcomeModel(new FormModel())));

            expect(executeOutcomeSpy).toHaveBeenCalled();
        });

        it('should emit onTaskLoaded on initial load of component', () => {
            component.appName = '';
            spyOn(component.onTaskLoaded, 'emit');

            component.ngOnInit();
            fixture.detectChanges();
            expect(component.onTaskLoaded.emit).toHaveBeenCalledWith(taskDetails);
        });
    });

    it('should display task name as title on no form template if showTitle is true', () => {
        component.taskId = taskDetails.id;

        fixture.detectChanges();
        const noFormTemplateTitle = debugElement.query(By.css('.adf-form-title'));

        expect(noFormTemplateTitle.nativeElement.innerText).toEqual('Task1');
    });

    it('should display default name as title on no form template if the task name empty/undefined', () => {
        const mockTaskDetailsWithOutName = { id: 'mock-task-id', name: null, formKey: null };
        getTaskSpy.and.returnValue(of(mockTaskDetailsWithOutName));
        component.taskId = 'mock-task-id';

        fixture.detectChanges();
        const noFormTemplateTitle = debugElement.query(By.css('.adf-form-title'));

        expect(noFormTemplateTitle.nativeElement.innerText).toEqual('FORM.FORM_RENDERER.NAMELESS_TASK');
    });

    it('should not display no form title if showTitle is set to false', () => {
        component.taskId = taskDetails.id;
        component.showTitle = false;

        fixture.detectChanges();
        const noFormTemplateTitle = debugElement.query(By.css('.adf-form-title'));

        expect(noFormTemplateTitle).toBeNull();
    });
});
