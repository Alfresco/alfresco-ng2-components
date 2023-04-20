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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { StartTaskCloudComponent } from './start-task-cloud.component';
import { of, throwError } from 'rxjs';
import { taskDetailsMock } from '../mock/task-details.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProcessServiceCloudTestingModule } from './../../../testing/process-service-cloud.testing.module';
import { FormDefinitionSelectorCloudService } from '../../../form/services/form-definition-selector-cloud.service';
import { TaskCloudService } from '../../services/task-cloud.service';
import { StartTaskCloudRequestModel } from '../models/start-task-cloud-request.model';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityUserService } from '../../../people/services/identity-user.service';
import { IdentityUserModel } from '../../../people/models/identity-user.model';

describe('StartTaskCloudComponent', () => {

    let component: StartTaskCloudComponent;
    let fixture: ComponentFixture<StartTaskCloudComponent>;
    let service: TaskCloudService;
    let identityService: IdentityUserService;
    let formDefinitionSelectorCloudService: FormDefinitionSelectorCloudService;
    let element: HTMLElement;
    let createNewTaskSpy: jasmine.Spy;
    let alfrescoApiService: AlfrescoApiService;

    const mock: any = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(taskDetailsMock)
        },
        isEcmLoggedIn: () => false,
        reply: jasmine.createSpy('reply')
    };

    const mockUser: IdentityUserModel = {username: 'currentUser', firstName: 'Test', lastName: 'User', email: 'currentUser@test.com'};

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StartTaskCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        service = TestBed.inject(TaskCloudService);
        identityService = TestBed.inject(IdentityUserService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        formDefinitionSelectorCloudService = TestBed.inject(FormDefinitionSelectorCloudService);
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
        createNewTaskSpy = spyOn(service, 'createNewTask').and.returnValue(of(taskDetailsMock as any));
        spyOn(identityService, 'getCurrentUserInfo').and.returnValue(mockUser);
        spyOn(formDefinitionSelectorCloudService, 'getForms').and.returnValue(of([]));
        fixture.detectChanges();
    });

    describe('create task', () => {

        it('should create new task when start button is clicked', async () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(createNewTaskSpy).toHaveBeenCalled();
            expect(successSpy).toHaveBeenCalled();
        });

        it('should send on success event when the task is started', async () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.assigneeName = 'fake-assignee';

            fixture.detectChanges();
            await fixture.whenStable();

            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(successSpy).toHaveBeenCalledWith(taskDetailsMock);
        });

        it('should send on success event when only name is given', async () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');

            fixture.detectChanges();
            await fixture.whenStable();

            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(successSpy).toHaveBeenCalled();
        });

        it('should not emit success event when data not present', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('');
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            expect(createNewTaskSpy).not.toHaveBeenCalled();
            expect(successSpy).not.toHaveBeenCalled();
        });

        it('should not start task to the logged in user when invalid assignee is selected', (done) => {
            component.taskForm.controls['name'].setValue('fakeName');
            component.appName = 'fakeAppName';
            fixture.detectChanges();
            const assigneeInput = element.querySelector<HTMLElement>('input.adf-cloud-input');
            assigneeInput.nodeValue = 'a';
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const taskRequest = new StartTaskCloudRequestModel({ name: 'fakeName', assignee: 'currentUser', candidateGroups: []});
                expect(createNewTaskSpy).toHaveBeenCalledWith(taskRequest, 'fakeAppName');
                done();
            });
        });

        it('should not start task to the logged in user when assignee is not selected', (done) => {
            component.taskForm.controls['name'].setValue('fakeName');
            component.appName = 'fakeAppName';
            fixture.detectChanges();
            const createTaskButton = element.querySelector<HTMLElement>('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const taskRequest = new StartTaskCloudRequestModel({ name: 'fakeName', assignee: 'currentUser', candidateGroups: []});
                expect(createNewTaskSpy).toHaveBeenCalledWith(taskRequest, 'fakeAppName');
                done();
            });
        });
    });

    it('should show logged in user as assignee by default', () => {
        fixture.detectChanges();
        const assignee = fixture.nativeElement.querySelector('[data-automation-id="adf-people-cloud-chip-currentUser"]');
        expect(assignee).toBeDefined();
        expect(assignee.innerText).toContain('Test User');
    });

    it('should show start task button', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        const startButton = element.querySelector('#button-start');
        expect(startButton).toBeDefined();
        expect(startButton.textContent).toContain('ADF_CLOUD_TASK_LIST.START_TASK.FORM.ACTION.START');
    });

    it('should disable start button if name is empty', () => {
        component.taskForm.controls['name'].setValue('');
        fixture.detectChanges();
        const createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeTruthy();
    });

    it('should cancel start task on cancel button click', () => {
        fixture.detectChanges();
        const emitSpy = spyOn(component.cancel, 'emit');
        const cancelTaskButton = fixture.nativeElement.querySelector('#button-cancel');
        cancelTaskButton.click();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should enable start button if name is filled out', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        const createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeFalsy();
    });

    it('should emit error when there is an error while creating task', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        const errorSpy = spyOn(component.error, 'emit');
        createNewTaskSpy.and.returnValue(throwError({}));
        component.appName = 'fakeAppName';
        fixture.detectChanges();
        const assigneeInput = element.querySelector<HTMLElement>('input.adf-cloud-input');
        assigneeInput.nodeValue = 'a';
        fixture.detectChanges();
        const createTaskButton = element.querySelector<HTMLElement>('#button-start');
        createTaskButton.click();
        fixture.detectChanges();
        expect(errorSpy).toHaveBeenCalled();
    });

    it('should emit error when task name exceeds maximum length', () => {
        component.maxNameLength = 2;
        component.ngOnInit();
        fixture.detectChanges();
        const name = component.taskForm.controls['name'];
        name.setValue('task');
        fixture.detectChanges();
        expect(name.valid).toBeFalsy();
        name.setValue('ta');
        fixture.detectChanges();
        expect(name.valid).toBeTruthy();
    });

    it('should emit error when task name field is empty', () => {
        fixture.detectChanges();
        const name = component.taskForm.controls['name'];
        name.setValue('');
        fixture.detectChanges();
        expect(name.valid).toBeFalsy();
        name.setValue('task');
        fixture.detectChanges();
        expect(name.valid).toBeTruthy();
    });
    it('should emit error when description have only white spaces', () => {
        fixture.detectChanges();
        const description = component.taskForm.controls['description'];
        description.setValue('     ');
        fixture.detectChanges();
        expect(description.valid).toBeFalsy();
        description.setValue('');
        fixture.detectChanges();
        expect(description.valid).toBeTruthy();
    });
});
