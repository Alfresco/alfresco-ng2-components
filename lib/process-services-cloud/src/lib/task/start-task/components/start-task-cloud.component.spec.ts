/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, IdentityUserService } from '@alfresco/adf-core';
import {
    AlfrescoApiService,
    AppConfigService,
    LogService,
    StorageService,
    UserPreferencesService,
    IdentityUserModel
} from '@alfresco/adf-core';
import { StartTaskCloudService } from '../services/start-task-cloud.service';
import { StartTaskCloudComponent } from './start-task-cloud.component';
import { of, throwError } from 'rxjs';
import { taskDetailsMock } from '../mock/task-details.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProcessServiceCloudTestingModule } from './../../../testing/process-service-cloud.testing.module';
import { StartTaskCloudTestingModule } from '../testing/start-task-cloud.testing.module';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';

describe('StartTaskCloudComponent', () => {

    let component: StartTaskCloudComponent;
    let fixture: ComponentFixture<StartTaskCloudComponent>;
    let service: StartTaskCloudService;
    let identityService: IdentityUserService;
    let element: HTMLElement;
    let createNewTaskSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, StartTaskCloudTestingModule],
        providers: [StartTaskCloudService, AlfrescoApiService, AppConfigService, LogService, StorageService, UserPreferencesService],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(StartTaskCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        service = TestBed.get(StartTaskCloudService);
        identityService = TestBed.get(IdentityUserService);
        createNewTaskSpy = spyOn(service, 'createNewTask').and.returnValue(of(taskDetailsMock));
        spyOn(identityService, 'getCurrentUserInfo').and.returnValue(new IdentityUserModel({username: 'currentUser', firstName: 'Test', lastName: 'User'}));
        fixture.detectChanges();
    }));

    it('should create instance of StartTaskCloudComponent', () => {
        expect(component instanceof StartTaskCloudComponent).toBe(true, 'should create StartTaskCloudComponent');
    });

    describe('create task', () => {

        it('should create new task when start button is clicked', async(() => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            const createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(createNewTaskSpy).toHaveBeenCalled();
                expect(successSpy).toHaveBeenCalled();
            });
        }));

        it('should send on success event when the task is started', async(() => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.assigneeName = 'fake-assignee';
            fixture.detectChanges();
            const createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalledWith(taskDetailsMock);
            });
        }));

        it('should send on success event when only name is given', async(() => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            const createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalled();
            });
        }));

        it('should not emit success event when data not present', () => {
            const successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('');
            fixture.detectChanges();
            const createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(createNewTaskSpy).not.toHaveBeenCalled();
            expect(successSpy).not.toHaveBeenCalled();
        });

        it('should assign task to the logged in user when invalid assignee is selected', async(() => {
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            const assigneeInput = <HTMLElement> element.querySelector('input.adf-cloud-input');
            assigneeInput.nodeValue = 'a';
            fixture.detectChanges();
            const createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const taskRequest = new TaskDetailsCloudModel({ name: 'fakeName', assignee: 'currentUser', candidateGroups: []});
                expect(createNewTaskSpy).toHaveBeenCalledWith(taskRequest);
            });
        }));

        it('should assign task to the logged in user when assignee is not selected', async(() => {
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            const createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const taskRequest = new TaskDetailsCloudModel({ name: 'fakeName', assignee: 'currentUser', candidateGroups: []});
                expect(createNewTaskSpy).toHaveBeenCalledWith(taskRequest);
            });
        }));
    });

    it('should select logged in user as assignee by default', () => {
        fixture.detectChanges();
        const assignee = fixture.nativeElement.querySelector('[data-automation-id="adf-people-cloud-search-input"]');
        expect(assignee.value).toBe('Test User');
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
        const createTaskButton = <HTMLElement> element.querySelector('#button-start');
        fixture.detectChanges();
        createTaskButton.click();
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
