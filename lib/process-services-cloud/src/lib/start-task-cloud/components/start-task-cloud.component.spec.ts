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
// import { Observable } from 'rxjs/Observable';
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
import { of } from 'rxjs';
import { taskDetailsMock, mockUsers } from '../mock/task-details.mock';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
// import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
// import { taskDetailsMock } from '../mock/task-details.mock';

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
                    assignee: 'mock-assignee'
                }
            ));
        });

        it('should create new task when start is clicked', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('task');
            component.taskForm.controls['dueDate'].setValue('Mon Oct 22 2018 20:12:43 GMT+0530 (IST)');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalled();
                expect(createNewTaskSpy).toHaveBeenCalled();
            });
        }));

        it('should send on success event when the task is started', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskDetailsModel = new TaskDetailsCloudModel(taskDetailsMock);
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['dueDate'].setValue('Mon Oct 22 2018 20:12:43 GMT+0530 (IST)');
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalledWith({
                    id: 91,
                    name: 'fakeName',
                    assignee: 'mock-assignee'
                });
            });
        }));

        it('should send on success event when only name is given', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.runtimeBundle = 'runtimBundle-id';
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['dueDate'].setValue('Mon Oct 22 2018 20:12:43 GMT+0530 (IST)');
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
            component.taskDetailsModel = new TaskDetailsCloudModel(null);
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            expect(createNewTaskSpy).not.toHaveBeenCalled();
            expect(successSpy).not.toHaveBeenCalled();
        });
    });

    describe('assign user', () => {
        beforeEach(() => {
            createNewTaskSpy.and.returnValue(of(
                {
                    id: 91,
                    name: 'fakeName',
                    assignee: 'mock-assignee'
                }
            ));
        });

        it('should assign task when an assignee is selected', async(() => {
            let successSpy = spyOn(component.success, 'emit');
            component.taskForm.controls['name'].setValue('fakeName');
            component.taskForm.controls['dueDate'].setValue('Mon Oct 22 2018 20:12:43 GMT+0530 (IST)');
            component.taskForm.controls['assignee'].setValue('mock-assignee');
            component.runtimeBundle = 'runtimBundle-id';
            fixture.detectChanges();
            let createTaskButton = <HTMLElement> element.querySelector('#button-start');
            createTaskButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(successSpy).toHaveBeenCalledWith({
                    id: 91,
                    name: 'fakeName',
                    assignee: 'mock-assignee'
                });
            });
        }));
    });

});
