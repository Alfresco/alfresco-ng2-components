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

import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { setupTestBed, AppConfigService } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TaskHeaderCloudModule } from '../task-header-cloud.module';
import {
    assignedTaskDetailsCloudMock,
    completedTaskDetailsCloudMock,
    createdStateTaskDetailsCloudMock,
    suspendedTaskDetailsCloudMock,
    taskDetailsWithParentTaskIdMock
} from '../mocks/task-details-cloud.mock';
import moment = require('moment');

describe('TaskHeaderCloudComponent', () => {
    let component: TaskHeaderCloudComponent;
    let fixture: ComponentFixture<TaskHeaderCloudComponent>;
    let appConfigService: AppConfigService;
    let taskCloudService: TaskCloudService;
    let getTaskByIdSpy: jasmine.Spy;
    let getCandidateGroupsSpy: jasmine.Spy;
    let getCandidateUsersSpy: jasmine.Spy;
    let isTaskEditableSpy: jasmine.Spy;

    const mockCandidateUsers = ['mockuser1', 'mockuser2', 'mockuser3'];
    const mockCandidateGroups = ['mockgroup1', 'mockgroup2', 'mockgroup3'];

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule,
            TaskHeaderCloudModule,
            RouterTestingModule
        ],
        providers: [TaskCloudService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskHeaderCloudComponent);
        component = fixture.componentInstance;
        appConfigService = TestBed.get(AppConfigService);
        taskCloudService = TestBed.get(TaskCloudService);
        component.appName = 'mock-app-name';
        component.taskId = 'mock-task-id';
        getTaskByIdSpy = spyOn(taskCloudService, 'getTaskById').and.returnValue(of(assignedTaskDetailsCloudMock));
        isTaskEditableSpy = spyOn(taskCloudService, 'isTaskEditable').and.returnValue(true);
        getCandidateUsersSpy = spyOn(taskCloudService, 'getCandidateUsers').and.returnValue(of(mockCandidateUsers));
        getCandidateGroupsSpy = spyOn(taskCloudService, 'getCandidateGroups').and.returnValue(of(mockCandidateGroups));
    });

    describe('Task Details', () => {

        beforeEach(() => {
            component.ngOnChanges();
        });

        it('should fectch task details when appName and taskId defined', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getTaskByIdSpy).toHaveBeenCalled();
                expect(component.taskDetails).toBe(assignedTaskDetailsCloudMock);
            });
        }));

        it('should display assignee', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"]'));
                expect(assigneeEl.nativeElement.value).toBe('AssignedTaskUser');
            });
        }));

        it('should display status', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
                expect(statusEl.nativeElement.value).toBe('ASSIGNED');
            });
        }));

        it('should display priority', async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const priorityEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-priority"]'));
                expect(priorityEl.nativeElement.value).toBe('5');
            });
        }));

        it('should display error if priority is not a number', async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {

                const formPriorityEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-priority"]'));
                formPriorityEl.nativeElement.value = 'stringValue';
                formPriorityEl.nativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                const errorMessageEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-error-priority"]'));
                expect(errorMessageEl).not.toBeNull();
            });
        }));

        it('should display due date', async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
                expect(valueEl.nativeElement.innerText.trim()).toBe(moment(assignedTaskDetailsCloudMock.dueDate, 'x').format('MMM D, Y, H:mm'));
            });
        }));

        it('should display placeholder if no due date', async(() => {
            component.taskDetails.dueDate = null;
            component.refreshData();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
                expect(valueEl.nativeElement.innerText.trim()).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT');
            });
        }));

        it('should display the default parent value if is undefined', async(() => {
            component.taskDetails.processInstanceId = null;
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] input'));
                expect(valueEl.nativeElement.value).toEqual('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT');
            });
        }));

        it('should be able to call update service on updating task description', async(() => {
            spyOn(taskCloudService, 'updateTask').and.returnValue(of(assignedTaskDetailsCloudMock));
            fixture.detectChanges();
            fixture.whenStable().then(() => {

                const inputEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
                inputEl.nativeElement.value = 'updated description';
                inputEl.nativeElement.dispatchEvent(new Event('input'));

                fixture.detectChanges();
                expect(taskCloudService.updateTask).toHaveBeenCalled();
            });
        }));

        it('should roll back task description on error', async () => {
            spyOn(taskCloudService, 'updateTask').and.returnValue(throwError('fake'));
            fixture.detectChanges();

            await fixture.whenStable();
            let description = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
            expect(description.nativeElement.value.trim()).toEqual('This is the description');

            const inputEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
            inputEl.nativeElement.value = 'updated description';
            inputEl.nativeElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            expect(taskCloudService.updateTask).toHaveBeenCalled();

            await fixture.whenStable();
            fixture.detectChanges();
            description = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-description"]'));
            expect(description.nativeElement.value.trim()).toEqual('This is the description');
        });
    });

    describe('Task with parentTaskId', () => {

        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(taskDetailsWithParentTaskIdMock));
            component.ngOnChanges();
        });

        it('should fectch parent task details if the task has parent id', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getTaskByIdSpy).toHaveBeenCalledTimes(2);
            });
        }));

        it('should display parent task id', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-parentTaskId"'));
                expect(assigneeEl.nativeElement.value).toBe('mock-parent-task-id');
            });
        }));

        it('should display parent task name', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-parentName"]'));
                expect(statusEl.nativeElement.value.trim()).toBe('This is a parent task name');
            });
        }));
    });

    describe('Assigned Task', () => {

        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(assignedTaskDetailsCloudMock));
            component.ngOnChanges();
        });

        it('should display assignee', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"]'));
                expect(assigneeEl.nativeElement.value).toBe('AssignedTaskUser');
            });
        }));

        it('should display status', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
                expect(statusEl.nativeElement.value).toBe('ASSIGNED');
            });
        }));

        it('should render defined edit icon for assignee property if the task in assigned state and assingee should be current user', () => {
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="header-assignee"] [data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('create');
        });

        it('should render edit icon if the task in assigned state and assingee should be current user', () => {
            fixture.detectChanges();
            const priorityEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="header-priority"] [class*="adf-textitem-edit-icon"]`));
            const descriptionEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="header-description"] [class*="adf-textitem-edit-icon"]`));
            const dueDateEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-dueDate"]`));
            expect(priorityEditIcon).not.toBeNull('Priority edit icon should be shown');
            expect(descriptionEditIcon).not.toBeNull('Description edit icon should be shown');
            expect(dueDateEditIcon).not.toBeNull('Due date edit icon should be shown');
        });

        it('should not render defined clickable edit icon for assignee property if the task in assigned state and assingned user is different from current logged-in user', () => {
            isTaskEditableSpy.and.returnValue(false);
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should not render edit icon if the task in assigned state and assingned user is different from current logged-in user', () => {
            isTaskEditableSpy.and.returnValue(false);
            fixture.detectChanges();
            const priorityEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-priority"]`));
            const descriptionEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-description"]`));
            const dueDateEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-dueDate"]`));
            expect(priorityEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(descriptionEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(dueDateEditIcon).toBeNull('Edit icon should NOT be shown');
        });
    });

    describe('Created Task', () => {

        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(createdStateTaskDetailsCloudMock));
            isTaskEditableSpy.and.returnValue(false);
            component.ngOnChanges();
        });

        it('should display status', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
                expect(statusEl.nativeElement.value).toBe('CREATED');
            });
        }));

        it('should display placeholder if no assignee', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assigneeEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"]'));
                expect(assigneeEl.nativeElement.value).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE_DEFAULT');
            });
        }));

        it('should not render defined clickable edit icon for assignee property if the task in created state and not assigned', () => {
            fixture.detectChanges();
            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should not render edit icon if the task in created state and not assigned', () => {
            fixture.detectChanges();
            const priorityEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-priority"]`));
            const descriptionEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-description"]`));
            const dueDateEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-dueDate"]`));
            expect(priorityEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(descriptionEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(dueDateEditIcon).toBeNull('Edit icon should NOT be shown');
        });
    });

    describe('Completed Task', () => {

        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(completedTaskDetailsCloudMock));
            isTaskEditableSpy.and.returnValue(false);
            component.ngOnChanges();
        });

        it('should display status', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
                expect(statusEl.nativeElement.value).toBe('COMPLETED');
            });
        }));

        it('should not render defined clickable edit icon for assignee property if the task in completed state', () => {
            fixture.detectChanges();
            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should not render edit icon if the task in completed state', () => {
            fixture.detectChanges();
            const priorityEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-priority"]`));
            const descriptionEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-description"]`));
            const dueDateEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-dueDate"]`));
            expect(priorityEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(descriptionEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(dueDateEditIcon).toBeNull('Edit icon should NOT be shown');
        });
    });

    describe('Suspended Task', () => {

        beforeEach(() => {
            getTaskByIdSpy.and.returnValue(of(suspendedTaskDetailsCloudMock));
            isTaskEditableSpy.and.returnValue(false);
            component.ngOnChanges();
        });

        it('should display status', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
                expect(statusEl.nativeElement.value).toBe('SUSPENDED');
            });
        }));

        it('should not render defined clickable edit icon for assignee property if the task in suspended state', () => {
            fixture.detectChanges();
            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-assignee"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should not render edit icon if the task in suspended state', () => {
            fixture.detectChanges();
            const priorityEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-priority"]`));
            const descriptionEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-description"]`));
            const dueDateEditIcon = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-dueDate"]`));
            expect(priorityEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(descriptionEditIcon).toBeNull('Edit icon should NOT be shown');
            expect(dueDateEditIcon).toBeNull('Edit icon should NOT be shown');
        });
    });

    describe('Task with candidates', () => {

        it('should display candidate groups', async(() => {
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const candidateGroup1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockgroup1"] span');
                const candidateGroup2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockgroup2"] span');
                expect(getCandidateGroupsSpy).toHaveBeenCalled();
                expect(candidateGroup1.innerText).toBe('mockgroup1');
                expect(candidateGroup2.innerText).toBe('mockgroup2');
            });
        }));

        it('should display candidate user', async(() => {
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const candidateUser1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockuser1"] span');
                const candidateUser2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockuser2"] span');
                expect(getCandidateUsersSpy).toHaveBeenCalled();
                expect(candidateUser1.innerText).toBe('mockuser1');
                expect(candidateUser2.innerText).toBe('mockuser2');
            });
        }));

        it('should display placeholder if no candidate groups', async(() => {
            getCandidateGroupsSpy.and.returnValue(of([]));
            fixture.detectChanges();
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const labelValue = fixture.debugElement.query(By.css('[data-automation-id="card-array-label-candidateGroups"]'));
                const defaultElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-default"]'));
                expect(labelValue.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS');
                expect(defaultElement.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS_DEFAULT');
            });

        }));

        it('should display placeholder if no candidate users', async(() => {
            getCandidateUsersSpy.and.returnValue(of([]));
            fixture.detectChanges();
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const labelValue = fixture.debugElement.query(By.css('[data-automation-id="card-array-label-candidateUsers"]'));
                const defaultElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-default"]'));
                expect(labelValue.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS');
                expect(defaultElement.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS_DEFAULT');
            });
        }));
    });

    describe('Config properties', () => {

        it('should show only the properties from the configuration file', async(() => {
            spyOn(appConfigService, 'get').and.returnValue(['assignee', 'status']);
            component.ngOnChanges();
            fixture.detectChanges();
            const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));

            fixture.whenStable().then(() => {
                expect(propertyList).toBeDefined();
                expect(propertyList).not.toBeNull();
                expect(propertyList.length).toBe(2);
                expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE');
                expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS');
            });
        }));

        it('should show all the default properties if there is no configuration', async(() => {
            spyOn(appConfigService, 'get').and.returnValue(null);
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));
                expect(propertyList).toBeDefined();
                expect(propertyList).not.toBeNull();
                expect(propertyList.length).toBe(component.properties.length);
                expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE');
                expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS');
            });
        }));
    });

    describe('Task errors', () => {

        it('should emit an error when task can not be found', async(() => {
            getTaskByIdSpy.and.returnValue(throwError('Task not found'));

            component.error.subscribe((error) => {
                expect(error).toEqual('Task not found');
            });

            component.appName = 'appName';
            component.taskId = 'taskId';
            component.ngOnChanges();
        }));

        it('should emit an error when app name and/or task id are not provided', async(() => {

            component.error.subscribe((error) => {
                expect(error).toEqual('App Name and Task Id are mandatory');
            });

            component.appName = '';
            component.taskId = '';
            component.ngOnChanges();

            component.appName = 'app';
            component.ngOnChanges();

            component.appName = '';
            component.taskId = 'taskId';
            component.ngOnChanges();
        }));

        it('should call the loadTaskDetailsById when both app name and task id are provided', async(() => {
            spyOn(component, 'loadTaskDetailsById');
            component.appName = 'appName';
            component.taskId = 'taskId';
            component.ngOnChanges();
            fixture.detectChanges();
            expect(component.loadTaskDetailsById).toHaveBeenCalledWith(component.appName, component.taskId);
        }));
    });
});
