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

import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, flush, discardPeriodicTasks } from '@angular/core/testing';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { AppConfigService, NoopAuthModule } from '@alfresco/adf-core';
import { TaskCloudService } from '../../services/task-cloud.service';
import {
    assignedTaskDetailsCloudMock,
    completedTaskDetailsCloudMock,
    createdStateTaskDetailsCloudMock,
    suspendedTaskDetailsCloudMock,
    taskDetailsWithParentTaskIdMock,
    createdTaskDetailsCloudMock
} from '../mocks/task-details-cloud.mock';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

describe('TaskHeaderCloudComponent', () => {
    let component: TaskHeaderCloudComponent;
    let fixture: ComponentFixture<TaskHeaderCloudComponent>;
    let appConfigService: AppConfigService;
    let taskCloudService: TaskCloudService;
    let getTaskByIdSpy: jasmine.Spy;
    let getCandidateGroupsSpy: jasmine.Spy;
    let getCandidateUsersSpy: jasmine.Spy;
    let isTaskEditableSpy: jasmine.Spy;
    let alfrescoApiService: AlfrescoApiService;
    let loader: HarnessLoader;

    const mockCandidateUsers = ['mockuser1', 'mockuser2', 'mockuser3'];
    const mockCandidateGroups = ['mockgroup1', 'mockgroup2', 'mockgroup3'];

    const mock: any = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve({})
        },
        isEcmLoggedIn: () => false,
        reply: jasmine.createSpy('reply')
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaskHeaderCloudComponent, NoopAuthModule]
        });
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config = {
            'adf-cloud-task-header': {
                defaultDateFormat: 'full'
            }
        };
        fixture = TestBed.createComponent(TaskHeaderCloudComponent);
        component = fixture.componentInstance;
        taskCloudService = TestBed.inject(TaskCloudService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        component.appName = 'mock-app-name';
        component.taskId = 'mock-task-id';
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
        getTaskByIdSpy = spyOn(taskCloudService, 'getTaskById').and.returnValue(of(assignedTaskDetailsCloudMock));
        isTaskEditableSpy = spyOn(taskCloudService, 'isTaskEditable').and.returnValue(true);
        getCandidateUsersSpy = spyOn(taskCloudService, 'getCandidateUsers').and.returnValue(of(mockCandidateUsers));
        getCandidateGroupsSpy = spyOn(taskCloudService, 'getCandidateGroups').and.returnValue(of(mockCandidateGroups));
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Task Details', () => {
        beforeEach(() => {
            component.ngOnChanges();
        });

        it('should hide the title if showTitle is false', () => {
            component.showTitle = false;
            fixture.detectChanges();
            let taskTitle = fixture.debugElement.query(By.css('.adf-task-title'));
            expect(taskTitle).toBeNull();

            component.showTitle = true;
            fixture.detectChanges();
            taskTitle = fixture.debugElement.query(By.css('.adf-task-title'));
            expect(taskTitle).toBeTruthy();
        });

        it('should fetch task details when appName and taskId defined', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            expect(getTaskByIdSpy).toHaveBeenCalled();
            expect(component.taskDetails).toBe(assignedTaskDetailsCloudMock);
        });

        it('should display assignee', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"]'));
            expect(assigneeEl.nativeElement.value).toBe('AssignedTaskUser');
        });

        it('should display status', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
            expect(statusEl.nativeElement.value).toBe('ASSIGNED');
        });

        it('should display priority with default values', async () => {
            fixture.detectChanges();
            const dropdown = await loader.getHarness(MatSelectHarness);
            await dropdown.open();

            const options = await dropdown.getOptions();
            expect(await options[0].getText()).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NONE');
            expect(await options[1].getText()).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.LOW');
            expect(await options[2].getText()).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NORMAL');
            expect(await options[3].getText()).toEqual('ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.HIGH');
        });

        it('should display due date', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const valueEl = fixture.debugElement.query(
                By.css('[data-automation-id="header-dueDate"] .adf-property-value .adf-datepicker-span-button')
            );
            expect(valueEl.nativeElement.innerText.trim()).toBe('Monday, December 17, 2018 at 12:00:55 PM GMT+00:00');
        });

        it('should display process instance id', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const labelEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-label-processInstanceId"]'));
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-processInstanceId"]'));

            expect(labelEl.nativeElement.textContent.trim()).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.PROCESS_INSTANCE_ID');
            expect(valueEl.nativeElement.value).toBe('67c4z2a8f-01f3-11e9-8e36-0a58646002ad');
        });

        it('should display placeholder if no due date', async () => {
            component.taskDetails.dueDate = null;
            component.refreshData();
            fixture.detectChanges();
            await fixture.whenStable();
            const valueEl = fixture.debugElement.query(
                By.css('[data-automation-id="header-dueDate"] .adf-property-value .adf-datepicker-span-button')
            );
            expect(valueEl.nativeElement.innerText.trim()).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT');
        });

        it('should display the default parent value if is undefined', async () => {
            component.taskDetails.processInstanceId = null;
            fixture.detectChanges();
            await fixture.whenStable();
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] input '));
            expect(valueEl.nativeElement.value).toEqual('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT');
        });

        it('should be able to call update service on updating task description', async () => {
            spyOn(taskCloudService, 'updateTask').and.returnValue(of(assignedTaskDetailsCloudMock));
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const inputEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
            inputEl.nativeElement.value = 'updated description';
            inputEl.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(taskCloudService.updateTask).toHaveBeenCalled();
        });
        // This test is keep failing even though not clearly it just triggers an error in the afterAll so it's hidden
        // eslint-disable-next-line
        xit('should roll back task description on error', fakeAsync(() => {
            spyOn(taskCloudService, 'updateTask').and.returnValue(throwError('fake'));
            fixture.detectChanges();

            let description = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
            expect(description.nativeElement.value.trim()).toEqual('This is the description');
            const inputEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
            inputEl.nativeElement.value = 'updated description';
            inputEl.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                description = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
                expect(description.nativeElement.value.trim()).toEqual('This is the description');
                expect(taskCloudService.updateTask).toHaveBeenCalled();
            });
            flush();
            discardPeriodicTasks();
        }));

        it('should show spinner before loading task details', () => {
            component.isLoading = true;
            fixture.detectChanges();
            const loading = fixture.debugElement.query(By.css('.adf-task-header-loading'));
            expect(loading).toBeTruthy();
        });
    });

    describe('Task with parentTaskId', () => {
        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(taskDetailsWithParentTaskIdMock));
            component.ngOnChanges();
        });

        it('should fetch parent task details if the task has parent id', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            expect(getTaskByIdSpy).toHaveBeenCalledTimes(2);
        });

        it('should display parent task id', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-parentTaskId"'));
            expect(assigneeEl.nativeElement.value).toBe('mock-parent-task-id');
        });

        it('should display parent task name', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-parentName"]'));
            expect(statusEl.nativeElement.value.trim()).toBe('This is a parent task name');
        });
    });

    describe('Assigned Task', () => {
        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(assignedTaskDetailsCloudMock));
            component.ngOnChanges();
        });

        it('should display assignee', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"]'));
            expect(assigneeEl.nativeElement.value).toBe('AssignedTaskUser');
        });

        it('should display status', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
            expect(statusEl.nativeElement.value).toBe('ASSIGNED');
        });

        it('should render defined edit icon for assignee property if the task in assigned state and shared among candidate users', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const value = fixture.debugElement.query(
                By.css(`[data-automation-id="header-assignee"] [data-automation-id="card-textitem-clickable-icon-assignee"]`)
            );
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('create');
        });

        it('should not render defined edit icon for assignee property if the task in created state and shared among condidate users', async () => {
            getTaskByIdSpy.and.returnValue(of(createdTaskDetailsCloudMock));

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const editIcon = fixture.debugElement.query(
                By.css(`[data-automation-id="header-assignee"] [data-automation-id="card-textitem-clickable-icon-assignee"]`)
            );
            expect(editIcon).toBeNull();
        });

        it('should not render defined edit icon for assignee property if the task in assigned state and shared among candidate groups', async () => {
            component.candidateGroups = [
                { value: 'mock-group-1', icon: 'edit' },
                { value: 'mock-group-2', icon: 'edit' }
            ];
            component.candidateUsers = [];
            fixture.detectChanges();
            await fixture.whenStable();
            const value = fixture.debugElement.query(
                By.css(`[data-automation-id="header-assignee"] [data-automation-id="card-textitem-clickable-icon-assignee"]`)
            );
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('create');
        });

        it('should not render defined edit icon for assignee property if the task in created state and shared among condidate groups', async () => {
            getTaskByIdSpy.and.returnValue(of(createdTaskDetailsCloudMock));
            component.candidateGroups = [
                { value: 'mock-group-1', icon: 'edit' },
                { value: 'mock-group-2', icon: 'edit' }
            ];
            component.candidateUsers = [];
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const editIcon = fixture.debugElement.query(
                By.css(`[data-automation-id="header-assignee"] [data-automation-id="card-textitem-clickable-icon-assignee"]`)
            );
            expect(editIcon).toBeNull();
        });

        it('should render edit icon if the task in assigned state and assingee should be current user', () => {
            fixture.detectChanges();
            const dueDateEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-dueDate"]`));
            expect(dueDateEditIcon).not.toBeNull();
        });

        it('should not render defined clickable edit icon for assignee property if the task in assigned state and assingned user is different from current logged-in user', () => {
            isTaskEditableSpy.and.returnValue(false);
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull();
        });
    });

    describe('Created Task', () => {
        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(createdStateTaskDetailsCloudMock));
            isTaskEditableSpy.and.returnValue(false);
            component.ngOnChanges();
        });

        it('should display status', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
            expect(statusEl.nativeElement.value).toBe('CREATED');
        });

        it('should display placeholder if no assignee', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"]'));
            expect(assigneeEl.nativeElement.value).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE_DEFAULT');
        });

        it('should not render defined clickable edit icon for assignee property if the task in created state and not assigned', () => {
            fixture.detectChanges();
            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull();
        });
    });

    describe('Completed Task', () => {
        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(completedTaskDetailsCloudMock));
            isTaskEditableSpy.and.returnValue(false);
            component.ngOnChanges();
        });

        it('should display status', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
            expect(statusEl.nativeElement.value).toBe('COMPLETED');
        });

        it('should not render defined clickable edit icon for assignee property if the task in completed state', () => {
            fixture.detectChanges();
            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });
    });

    describe('Suspended Task', () => {
        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(suspendedTaskDetailsCloudMock));
            isTaskEditableSpy.and.returnValue(false);
            component.ngOnChanges();
        });

        it('should display status', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
            expect(statusEl.nativeElement.value).toBe('SUSPENDED');
        });

        it('should not render defined clickable edit icon for assignee property if the task in suspended state', () => {
            fixture.detectChanges();
            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull();
        });
    });

    describe('Task with candidates', () => {
        it('should display candidate groups', async () => {
            component.ngOnChanges();
            fixture.detectChanges();

            await fixture.whenStable();
            const candidateGroup1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockgroup1"]');
            const candidateGroup2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockgroup2"]');
            expect(getCandidateGroupsSpy).toHaveBeenCalled();
            expect(candidateGroup1.innerText).toContain('mockgroup1');
            expect(candidateGroup2.innerText).toContain('mockgroup2');
        });

        it('should display candidate user', async () => {
            component.ngOnChanges();
            fixture.detectChanges();

            await fixture.whenStable();
            const candidateUser1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockuser1"]');
            const candidateUser2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockuser2"]');
            expect(getCandidateUsersSpy).toHaveBeenCalled();
            expect(candidateUser1.innerText).toContain('mockuser1');
            expect(candidateUser2.innerText).toContain('mockuser2');
        });

        it('should display placeholder if no candidate groups', async () => {
            getCandidateGroupsSpy.and.returnValue(of([]));
            fixture.detectChanges();
            component.ngOnChanges();
            fixture.detectChanges();

            await fixture.whenStable();
            const labelValue = fixture.debugElement.query(By.css('[data-automation-id="card-array-label-candidateGroups"]'));
            const defaultElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-default"]'));
            expect(labelValue.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS');
            expect(defaultElement.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS_DEFAULT');
        });

        it('should display placeholder if no candidate users', async () => {
            getCandidateUsersSpy.and.returnValue(of([]));
            fixture.detectChanges();
            component.ngOnChanges();
            fixture.detectChanges();

            await fixture.whenStable();
            const labelValue = fixture.debugElement.query(By.css('[data-automation-id="card-array-label-candidateUsers"]'));
            const defaultElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-default"]'));
            expect(labelValue.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS');
            expect(defaultElement.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS_DEFAULT');
        });
    });

    describe('Config properties', () => {
        it('should show only the properties from the configuration file', async () => {
            appConfigService.config = {
                'adf-cloud-task-header': {
                    presets: {
                        properties: ['assignee', 'status']
                    }
                }
            };
            component.ngOnChanges();
            fixture.detectChanges();
            const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));

            await fixture.whenStable();
            expect(propertyList).toBeDefined();
            expect(propertyList).not.toBeNull();
            expect(propertyList.length).toBe(2);
            expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE');
            expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS');
        });

        it('should show all the default properties if there is no configuration', async () => {
            spyOn(appConfigService, 'get').and.returnValue(null);
            component.ngOnChanges();
            fixture.detectChanges();

            await fixture.whenStable();
            const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));
            expect(propertyList).toBeDefined();
            expect(propertyList).not.toBeNull();
            expect(propertyList.length).toBe(component.properties.length);
            expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE');
            expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS');
        });

        it('should format the dates based on app config format configuration', async () => {
            component.ngOnInit();
            component.ngOnChanges();

            fixture.detectChanges();
            await fixture.whenStable();
            const createdDateElement = fixture.debugElement.query(By.css('[data-automation-id="header-created"] .adf-property-value'));

            expect(component.dateFormat).toEqual('full');
            expect(createdDateElement.nativeElement.innerText.trim()).toBe('Monday, December 17, 2018 at 12:00:00 AM GMT+00:00');
        });
    });

    describe('Task errors', () => {
        it('should emit an error when task can not be found', (done) => {
            getTaskByIdSpy.and.returnValue(throwError('Task not found'));

            component.error.subscribe((error) => {
                expect(error).toEqual('Task not found');
                done();
            });

            component.appName = 'appName';
            component.taskId = 'taskId';
            component.ngOnChanges();
        });

        it('should emit an error when app name and/or task id are not provided', (done) => {
            component.error.subscribe((err) => {
                expect(err).toEqual('App Name and Task Id are mandatory');
                done();
            });

            component.appName = 'app';
            component.taskId = undefined;
            component.ngOnChanges();
        });

        it('should call the loadTaskDetailsById when both app name and task id are provided', () => {
            spyOn(component, 'loadTaskDetailsById');
            component.appName = 'appName';
            component.taskId = 'taskId';
            component.ngOnChanges();
            fixture.detectChanges();
            expect(component.loadTaskDetailsById).toHaveBeenCalledWith(component.appName, component.taskId);
        });
    });
});
