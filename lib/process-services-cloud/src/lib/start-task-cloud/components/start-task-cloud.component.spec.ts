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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import {
    AlfrescoApiService,
    AppConfigService,
    LogService,
    StorageService,
    UserPreferencesService
} from '@alfresco/adf-core';
import { StartTaskCloudService } from '../services/start-task-cloud.service';
import { StartTaskCloudComponent } from './start-task-cloud.component';
import { StartTaskCloudTestingModule } from '../testing/start-task-cloud.testing.module';
import { of, throwError } from 'rxjs';
import { taskDetailsMock, mockUsers } from '../mock/task-details.mock';

describe('StartTaskCloudComponent', () => {

    let component: StartTaskCloudComponent;
    let fixture: ComponentFixture<StartTaskCloudComponent>;
    let service: StartTaskCloudService;
    let element: HTMLElement;
    let createNewTaskSpy: jasmine.Spy;
    let getUserSpy: jasmine.Spy;

    setupTestBed({
        imports: [StartTaskCloudTestingModule],
        providers: [StartTaskCloudService, AlfrescoApiService, AppConfigService, LogService, StorageService, UserPreferencesService]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(StartTaskCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        service = TestBed.get(StartTaskCloudService);
        createNewTaskSpy = spyOn(service, 'createNewTask').and.returnValue(of(taskDetailsMock));
        getUserSpy = spyOn(service, 'getUsers').and.returnValue(of(mockUsers));
        fixture.detectChanges();
    }));

    it('should create instance of StartTaskCloudComponent', () => {
        expect(component instanceof StartTaskCloudComponent).toBe(true, 'should create StartTaskCloudComponent');
    });

    it('should fetch users on ngonint', () => {
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.users$).toBeDefined();
        expect(getUserSpy).toHaveBeenCalled();
    });

    describe('create task', () => {

        beforeEach(() => {
            createNewTaskSpy.and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    assignee: 'fake-assignee'
                }
            ));
        });

        it('should create new task when start button is clicked', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(createNewTaskSpy).toHaveBeenCalled();
                expect(successSpy).toHaveBeenCalled();
            });
        }));

        it('should send on success event when the task is started', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['assignee'].setValue('fake-assignee');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalledWith({
                    id: 91,
                    name: 'fakeName',
                    assignee: 'fake-assignee'
                });
            });
        }));

        it('should send on success event when only name is given', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalled();
            });
        }));

        it('should not emit success event when data not present', () => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(createNewTaskSpy).not.toHaveBeenCalled();
            expect(successSpy).not.toHaveBeenCalled();
        });

        it('should assign task when an assignee is selected', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['assignee'].setValue('mock-assignee');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalledWith({
                    id: 91,
                    name: 'fakeName',
                    assignee: 'fake-assignee'
                });
            });
        }));
    });

    it('should show start task button', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        expect(element.querySelector('#button-start')).toBeDefined();
        expect(element.querySelector('#button-start')).not.toBeNull();
        expect(element.querySelector('#button-start').textContent).toContain('ADF_TASK_LIST.START_TASK.FORM.ACTION.START');
    });

    it('should disable start button if name is empty', () => {
        component.taskForm.controls['name'].setValue('');
        fixture.detectChanges();
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeTruthy();
    });

    it('should cancel start task on cancel button click', () => {
        fixture.detectChanges();
        let emitSpy = spyOn(component.cancel, 'emit');
        let cancelTaskButton = fixture.nativeElement.querySelector('#button-cancel');
        cancelTaskButton.click();
        expect(emitSpy).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should enable start button if name is filled out', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        fixture.detectChanges();
        let createTaskButton = fixture.nativeElement.querySelector('#button-start');
        expect(createTaskButton.disabled).toBeFalsy();
    });

    it('should emit error when there is an error while creating task', () => {
        component.taskForm.controls['name'].setValue('fakeName');
        let errorSpy = spyOn(component.error, 'emit');
        createNewTaskSpy.and.returnValue(throwError({}));
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        fixture.detectChanges();
        createTaskButton.click();
        expect(errorSpy).toHaveBeenCalled();
    });

    it('should emit error when task name exceeds maximum length', () => {
        component.maxTaskNameLength = 2;
        component.ngOnInit();
        fixture.detectChanges();
        let name = component.taskForm.controls['name'];
        name.setValue('task');
        fixture.detectChanges();
        expect(name.valid).toBeFalsy();
        name.setValue('ta');
        fixture.detectChanges();
        expect(name.valid).toBeTruthy();
    });

    it('should emit error when task name field is empty', () => {
        fixture.detectChanges();
        let name = component.taskForm.controls['name'];
        name.setValue('');
        fixture.detectChanges();
        expect(name.valid).toBeFalsy();
        name.setValue('task');
        fixture.detectChanges();
        expect(name.valid).toBeTruthy();
    });
});
