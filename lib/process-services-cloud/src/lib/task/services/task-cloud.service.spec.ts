/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed } from '@angular/core/testing';
import { AppConfigService, TranslationService, NoopTranslateModule, NoopAuthModule } from '@alfresco/adf-core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TaskCloudService } from './task-cloud.service';
import { ADF_TASK_RUNTIME_BUNDLE_FALLBACK_ENABLED } from '../../services/task-runtime-bundle-fallback.token';
import { taskCompleteCloudMock } from '../task-header/mocks/fake-complete-task.mock';
import {
    assignedTaskDetailsCloudMock,
    createdTaskDetailsCloudMock,
    emptyOwnerTaskDetailsCloudMock
} from '../task-header/mocks/task-details-cloud.mock';
import { IdentityUserService } from '../../people/services/identity-user.service';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import {
    TASK_COMPLETED_STATE,
    TASK_CREATED_STATE,
    TASK_ASSIGNED_STATE,
    TASK_CLAIM_PERMISSION,
    TASK_RELEASE_PERMISSION,
    TASK_VIEW_PERMISSION
} from '../models/task-details-cloud.model';

const fakeTaskDetailsCloud = {
    entry: {
        appName: 'task-app',
        appVersion: '',
        id: '68d54a8f',
        assignee: 'Phil Woods',
        name: 'This is a new task',
        description: 'This is the description ',
        createdDate: 1545048055900,
        dueDate: 1545091200000,
        claimedDate: 1545140162601,
        priority: 0,
        category: null,
        processDefinitionId: null,
        processInstanceId: null,
        status: 'ASSIGNED',
        owner: 'Phil Woods',
        parentTaskId: null,
        formKey: null,
        lastModified: 1545140162601,
        lastModifiedTo: null,
        lastModifiedFrom: null,
        standalone: true
    }
};

const cloudMockUser = {
    id: 'fake-id-1',
    username: 'AssignedTaskUser',
    firstName: 'first-name-1',
    lastName: 'last-name-1',
    email: 'abc@xyz.com'
};

describe('Task Cloud Service', () => {
    let service: TaskCloudService;
    let adfHttpClient: AdfHttpClient;
    let identityUserService: IdentityUserService;
    let translateService: TranslationService;
    let appConfigService: AppConfigService;
    let requestSpy: jasmine.Spy;
    let runtimeBundleFallback$: BehaviorSubject<boolean>;

    const returnFakeTaskCompleteResults = () => Promise.resolve(taskCompleteCloudMock);

    const returnFakeTaskCompleteResultsError = () => Promise.reject(taskCompleteCloudMock);

    const returnFakeTaskDetailsResults = () => Promise.resolve(fakeTaskDetailsCloud);

    const returnFakeCandidateUsersResults = () => Promise.resolve(['mockuser1', 'mockuser2', 'mockuser3']);

    const returnFakeCandidateGroupResults = () => Promise.resolve(['mockgroup1', 'mockgroup2', 'mockgroup3']);

    beforeEach(() => {
        runtimeBundleFallback$ = new BehaviorSubject<boolean>(false);
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAuthModule],
            providers: [{ provide: ADF_TASK_RUNTIME_BUNDLE_FALLBACK_ENABLED, useValue: runtimeBundleFallback$ }]
        });
        adfHttpClient = TestBed.inject(AdfHttpClient);
        identityUserService = TestBed.inject(IdentityUserService);
        translateService = TestBed.inject(TranslationService);
        appConfigService = TestBed.inject(AppConfigService);
        service = TestBed.inject(TaskCloudService);
        spyOn(translateService, 'instant').and.callFake((key) => (key ? `${key}_translated` : null));
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(cloudMockUser);
        requestSpy = spyOn(adfHttpClient, 'request');
    });

    describe('get priorities', () => {
        it('should return task priorities from app config if defined', () => {
            spyOn(appConfigService, 'get').and.returnValue([
                { label: 'Low', value: '1', key: '1' },
                { label: 'Medium', value: '2', key: '2' },
                { label: 'High', value: '3', key: '3' }
            ]);
            const priorities = service.priorities;

            expect(priorities.map((p) => p.label)).toEqual(['Low', 'Medium', 'High']);
        });

        it('should return default task priorities if app config is not defined', () => {
            spyOn(appConfigService, 'get').and.returnValue(null);
            const priorities = service.priorities;

            expect(priorities.map((p) => p.label)).toEqual([
                'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NONE',
                'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.LOW',
                'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NORMAL',
                'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.HIGH'
            ]);
        });
    });

    it('should complete a task', (done) => {
        const appName = 'simple-app';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskCompleteResults);
        service.completeTask(appName, taskId).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.entry.appName).toBe('simple-app');
            expect(res.entry.id).toBe('68d54a8f');
            done();
        });
    });

    it('should not complete a task', (done) => {
        requestSpy.and.callFake(returnFakeTaskCompleteResultsError);
        const appName = 'simple-app';
        const taskId = '68d54a8f';

        service.completeTask(appName, taskId).subscribe(
            () => {},
            (err) => {
                expect(err).toBeDefined();
                done();
            }
        );
    });

    it('should canCompleteTask', () => {
        const canCompleteTaskResult = service.canCompleteTask(assignedTaskDetailsCloudMock);
        expect(canCompleteTaskResult).toBeTruthy();
    });

    it('should not complete with wrong asignee and owner different from asigned user', () => {
        const canCompleteTaskResult = service.canCompleteTask(createdTaskDetailsCloudMock);
        expect(canCompleteTaskResult).toEqual(false);
    });

    it('should verify if the task is editable', () => {
        const isTaskEditable = service.isTaskEditable(assignedTaskDetailsCloudMock);
        expect(isTaskEditable).toEqual(true);
    });

    it('should verify if the task assignee property is clickable', () => {
        const isAssigneePropertyClickable = service.isAssigneePropertyClickable(
            assignedTaskDetailsCloudMock,
            [{ icon: '', value: 'user' }],
            [{ icon: '', value: 'group' }]
        );
        expect(isAssigneePropertyClickable).toEqual(true);
    });

    it('should complete task with owner as null', (done) => {
        const appName = 'simple-app';
        const taskId = '68d54a8f';
        const canCompleteTaskResult = service.canCompleteTask(emptyOwnerTaskDetailsCloudMock);
        requestSpy.and.callFake(returnFakeTaskCompleteResults);

        service.completeTask(appName, taskId).subscribe((res: any) => {
            expect(canCompleteTaskResult).toEqual(true);
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.entry.appName).toBe('simple-app');
            expect(res.entry.id).toBe('68d54a8f');
            done();
        });
    });

    it('should return the task details when claiming a task', (done) => {
        const appName = 'taskp-app';
        const assignee = 'user12';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.claimTask(appName, taskId, assignee).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('task-app');
            expect(res.id).toBe('68d54a8f');
            done();
        });
    });

    it('should throw error if appName is not defined when claiming a task', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        const assignee = 'user12';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.claimTask(appName, taskId, assignee).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should throw error if taskId is not defined when claiming a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        const assignee = 'user12';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.claimTask(appName, taskId, assignee).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should return the task details when unclaiming a task', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.unclaimTask(appName, taskId).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('task-app');
            expect(res.id).toBe('68d54a8f');
            done();
        });
    });

    it('should throw error if appName is not defined when unclaiming a task', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.unclaimTask(appName, taskId).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should throw error if taskId is not defined when unclaiming a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.unclaimTask(appName, taskId).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should return the task details when querying by id', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.getTaskById(appName, taskId).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('task-app');
            expect(res.id).toBe('68d54a8f');
            done();
        });
    });

    it('should throw error if appName is not defined when querying by id', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.getTaskById(appName, taskId).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should throw error if taskId is not defined when querying by id', (done) => {
        const appName = 'task-app';
        const taskId = null;
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.getTaskById(appName, taskId).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should throw error if appName is not defined when updating a task', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        const updatePayload = { description: 'New description' };
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should throw error if taskId is not defined when updating a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        const updatePayload = { description: 'New description' };
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should return the task details when updating a task', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        const updatePayload = { description: 'New description' };
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('task-app');
            expect(res.id).toBe('68d54a8f');
            done();
        });
    });

    it('should throw error if appName is not defined when querying by id with update playload', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        const updatePayload = { description: 'New description' };
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should throw error if taskId is not defined updating a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        const updatePayload = { description: 'New description' };
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should return the candidate users by appName and taskId', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeCandidateUsersResults);
        service.getCandidateUsers(appName, taskId).subscribe((res: string[]) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0]).toBe('mockuser1');
            expect(res[1]).toBe('mockuser2');
            done();
        });
    });

    it('should log message and return empty array if appName is not defined when fetching candidate users', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeCandidateUsersResults);
        service.getCandidateUsers(appName, taskId).subscribe((res: any[]) => {
            expect(res.length).toBe(0);
            done();
        });
    });

    it('should log message and return empty array if taskId is not defined when fetching candidate users', (done) => {
        const appName = 'task-app';
        const taskId = null;
        requestSpy.and.callFake(returnFakeCandidateUsersResults);
        service.getCandidateUsers(appName, taskId).subscribe((res: any[]) => {
            expect(res.length).toBe(0);
            done();
        });
    });

    it('should return the candidate groups by appName and taskId', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeCandidateGroupResults);
        service.getCandidateGroups(appName, taskId).subscribe((res: string[]) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0]).toBe('mockgroup1');
            expect(res[1]).toBe('mockgroup2');
            done();
        });
    });

    it('should log message and return empty array if appName is not defined when fetching candidate groups', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeCandidateGroupResults);
        service.getCandidateGroups(appName, taskId).subscribe((res: any[]) => {
            expect(res.length).toBe(0);
            done();
        });
    });

    it('should log message and return empty array if taskId is not defined when fetching candidate groups', (done) => {
        const appName = 'task-app';
        const taskId = null;
        requestSpy.and.callFake(returnFakeCandidateGroupResults);
        service.getCandidateGroups(appName, taskId).subscribe((res: any[]) => {
            expect(res.length).toBe(0);
            done();
        });
    });

    it('should call assign api and return updated task details', (done) => {
        const appName = 'task-app';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.assign(appName, taskId, 'Phil Woods').subscribe((res) => {
            expect(res.assignee).toBe('Phil Woods');
            done();
        });
    });

    it('should throw error if appName is not defined when changing task assignee', (done) => {
        const appName = '';
        const taskId = '68d54a8f';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.assign(appName, taskId, 'mock-assignee').subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    it('should throw error if taskId is not defined when changing task assignee', (done) => {
        const appName = 'task-app';
        const taskId = '';
        requestSpy.and.callFake(returnFakeTaskDetailsResults);
        service.assign(appName, taskId, 'mock-assignee').subscribe(
            () => {},
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            }
        );
    });

    describe('nextTask', () => {
        const appName = 'task-app';
        const nextTaskResponse = {
            entry: {
                appName: 'task-app',
                id: 'next-task-id',
                name: 'Next Task',
                status: 'CREATED',
                assignee: null
            }
        };

        it('should return the next task details when called with a valid appName', (done) => {
            requestSpy.and.returnValue(Promise.resolve(nextTaskResponse));

            service.nextTask(appName).subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.id).toBe('next-task-id');
                expect(res.appName).toBe('task-app');
                done();
            });
        });

        it('should call the API without strategy when strategy is not provided', (done) => {
            requestSpy.and.returnValue(Promise.resolve(nextTaskResponse));

            service.nextTask(appName).subscribe(() => {
                const [url, options] = requestSpy.calls.mostRecent().args;
                expect(url).toContain('/rb/v1/tasks/next');
                expect(options?.queryParams?.strategy).toBeUndefined();
                done();
            });
        });

        it('should pass strategy query param when strategy is provided', (done) => {
            requestSpy.and.returnValue(Promise.resolve(nextTaskResponse));

            service.nextTask(appName, 'FIFO').subscribe(() => {
                const [url, options] = requestSpy.calls.mostRecent().args;
                expect(url).toContain('/rb/v1/tasks/next');
                expect(options?.queryParams?.strategy).toBe('FIFO');
                done();
            });
        });

        it('should emit dataChangesDetected$ when next task is returned', (done) => {
            requestSpy.and.returnValue(Promise.resolve(nextTaskResponse));
            const dataChangeSpy = jasmine.createSpy('dataChangesDetected$');
            service.dataChangesDetected$.subscribe(dataChangeSpy);

            service.nextTask(appName).subscribe(() => {
                expect(dataChangeSpy).toHaveBeenCalledWith(nextTaskResponse);
                done();
            });
        });
    });

    describe('wasTaskCompletedByCurrentUser', () => {
        it('should return true when task was completed by current user', () => {
            const completedTaskByCurrentUser = {
                ...assignedTaskDetailsCloudMock,
                status: TASK_COMPLETED_STATE,
                assignee: 'AssignedTaskUser'
            };
            const result = service.wasTaskCompletedByCurrentUser(completedTaskByCurrentUser);
            expect(result).toBe(true);
        });

        it('should return false when task was completed but not by current user', () => {
            const completedTaskByDifferentUser = {
                ...assignedTaskDetailsCloudMock,
                status: TASK_COMPLETED_STATE,
                assignee: 'DifferentUser'
            };
            const result = service.wasTaskCompletedByCurrentUser(completedTaskByDifferentUser);
            expect(result).toBe(false);
        });

        it('should return false when task is not completed', () => {
            const uncompletedTask = {
                ...assignedTaskDetailsCloudMock,
                status: TASK_ASSIGNED_STATE,
                assignee: 'AssignedTaskUser'
            };
            const result = service.wasTaskCompletedByCurrentUser(uncompletedTask);
            expect(result).toBe(false);
        });

        it('should return false when task is in other states', () => {
            const createdTask = {
                ...assignedTaskDetailsCloudMock,
                status: TASK_CREATED_STATE,
                assignee: 'AssignedTaskUser'
            };
            const result = service.wasTaskCompletedByCurrentUser(createdTask);
            expect(result).toBe(false);
        });
    });

    describe('canClaimTask', () => {
        describe('when the task exposes permissions', () => {
            it('should allow claiming when the task is created and has the CLAIM permission', () => {
                const task = {
                    ...createdTaskDetailsCloudMock,
                    status: TASK_CREATED_STATE,
                    standalone: false,
                    permissions: [TASK_CLAIM_PERMISSION]
                };
                expect(service.canClaimTask(task)).toBe(true);
            });

            it('should not allow claiming when the task is standalone', () => {
                const task = {
                    ...createdTaskDetailsCloudMock,
                    status: TASK_CREATED_STATE,
                    standalone: true,
                    permissions: [TASK_CLAIM_PERMISSION]
                };
                expect(service.canClaimTask(task)).toBe(false);
            });

            it('should not allow claiming when the task is not created', () => {
                const task = {
                    ...createdTaskDetailsCloudMock,
                    status: TASK_ASSIGNED_STATE,
                    standalone: false,
                    permissions: [TASK_CLAIM_PERMISSION]
                };
                expect(service.canClaimTask(task)).toBe(false);
            });

            it('should not allow claiming when the CLAIM permission is missing', () => {
                const task = {
                    ...createdTaskDetailsCloudMock,
                    status: TASK_CREATED_STATE,
                    standalone: false,
                    permissions: [TASK_VIEW_PERMISSION]
                };
                expect(service.canClaimTask(task)).toBe(false);
            });
        });

        describe('when the task does not expose permissions', () => {
            it('should allow claiming a created, non-standalone task when permissions are missing', () => {
                const task = { ...createdTaskDetailsCloudMock, status: TASK_CREATED_STATE, standalone: false, permissions: undefined };
                expect(service.canClaimTask(task)).toBe(true);
            });

            it('should not allow claiming a standalone task when permissions are empty', () => {
                const task = { ...createdTaskDetailsCloudMock, status: TASK_CREATED_STATE, standalone: true, permissions: [] };
                expect(service.canClaimTask(task)).toBe(false);
            });
        });
    });

    describe('canUnclaimTask', () => {
        describe('when the task exposes permissions', () => {
            it('should allow releasing when the task is assigned to me and has the RELEASE permission', () => {
                const task = {
                    ...assignedTaskDetailsCloudMock,
                    status: TASK_ASSIGNED_STATE,
                    assignee: cloudMockUser.username,
                    standalone: false,
                    permissions: [TASK_RELEASE_PERMISSION]
                };
                expect(service.canUnclaimTask(task)).toBe(true);
            });

            it('should not allow releasing when the task is standalone', () => {
                const task = {
                    ...assignedTaskDetailsCloudMock,
                    status: TASK_ASSIGNED_STATE,
                    assignee: cloudMockUser.username,
                    standalone: true,
                    permissions: [TASK_RELEASE_PERMISSION]
                };
                expect(service.canUnclaimTask(task)).toBe(false);
            });

            it('should not allow releasing when the task is assigned to someone else', () => {
                const task = {
                    ...assignedTaskDetailsCloudMock,
                    status: TASK_ASSIGNED_STATE,
                    assignee: 'DifferentUser',
                    standalone: false,
                    permissions: [TASK_RELEASE_PERMISSION]
                };
                expect(service.canUnclaimTask(task)).toBe(false);
            });

            it('should not allow releasing when the RELEASE permission is missing', () => {
                const task = {
                    ...assignedTaskDetailsCloudMock,
                    status: TASK_ASSIGNED_STATE,
                    assignee: cloudMockUser.username,
                    standalone: false,
                    permissions: [TASK_VIEW_PERMISSION]
                };
                expect(service.canUnclaimTask(task)).toBe(false);
            });
        });

        describe('when the task does not expose permissions', () => {
            it('should allow releasing a task assigned to me when permissions are missing', () => {
                const task = {
                    ...assignedTaskDetailsCloudMock,
                    status: TASK_ASSIGNED_STATE,
                    assignee: cloudMockUser.username,
                    standalone: false,
                    permissions: undefined
                };
                expect(service.canUnclaimTask(task)).toBe(true);
            });

            it('should not allow releasing a task assigned to someone else when permissions are empty', () => {
                const task = {
                    ...assignedTaskDetailsCloudMock,
                    status: TASK_ASSIGNED_STATE,
                    assignee: 'DifferentUser',
                    standalone: false,
                    permissions: []
                };
                expect(service.canUnclaimTask(task)).toBe(false);
            });
        });
    });

    describe('canClaimTaskByState', () => {
        it('should return true for a created, non-standalone task without relying on permissions', () => {
            const task = { ...createdTaskDetailsCloudMock, status: TASK_CREATED_STATE, standalone: false, permissions: undefined };
            expect(service.canClaimTaskByState(task)).toBe(true);
        });

        it('should return false when the task is not in the created state', () => {
            const task = { ...createdTaskDetailsCloudMock, status: TASK_ASSIGNED_STATE, standalone: false };
            expect(service.canClaimTaskByState(task)).toBe(false);
        });

        it('should return false when the task is standalone', () => {
            const task = { ...createdTaskDetailsCloudMock, status: TASK_CREATED_STATE, standalone: true };
            expect(service.canClaimTaskByState(task)).toBe(false);
        });
    });

    describe('canUnclaimTaskByState', () => {
        it('should return true for an assigned, non-standalone task assigned to the current user without relying on permissions', () => {
            const task = {
                ...assignedTaskDetailsCloudMock,
                status: TASK_ASSIGNED_STATE,
                assignee: 'AssignedTaskUser',
                standalone: false,
                permissions: undefined
            };
            expect(service.canUnclaimTaskByState(task)).toBe(true);
        });

        it('should return false when the task is assigned to a different user', () => {
            const task = { ...assignedTaskDetailsCloudMock, status: TASK_ASSIGNED_STATE, assignee: 'DifferentUser', standalone: false };
            expect(service.canUnclaimTaskByState(task)).toBe(false);
        });

        it('should return false when the task is not in the assigned state', () => {
            const task = { ...assignedTaskDetailsCloudMock, status: TASK_CREATED_STATE, assignee: 'AssignedTaskUser', standalone: false };
            expect(service.canUnclaimTaskByState(task)).toBe(false);
        });

        it('should return false when the task is standalone', () => {
            const task = { ...assignedTaskDetailsCloudMock, status: TASK_ASSIGNED_STATE, assignee: 'AssignedTaskUser', standalone: true };
            expect(service.canUnclaimTaskByState(task)).toBe(false);
        });
    });

    describe('getTaskById fallback', () => {
        const appName = 'task-app';
        const taskId = '12345678';

        it('should use the Query Service only when the Runtime Bundle fallback is disabled', async () => {
            runtimeBundleFallback$.next(false);
            requestSpy.and.callFake(returnFakeTaskDetailsResults);

            await firstValueFrom(service.getTaskById(appName, taskId));

            const requestedUrls = requestSpy.calls.all().map((call) => call.args[0]);
            expect(requestedUrls[0]).toContain(`/query/v1/tasks/${taskId}`);
            expect(requestedUrls.some((url) => url.includes('/rb/'))).toBe(false);
        });

        it('should call the Runtime Bundle first when the fallback is enabled', async () => {
            runtimeBundleFallback$.next(true);
            requestSpy.and.callFake(returnFakeTaskDetailsResults);

            await firstValueFrom(service.getTaskById(appName, taskId));

            const [url] = requestSpy.calls.first().args;
            expect(url).toContain(`/rb/v1/tasks/${taskId}`);
        });

        it('should use the Query Service when the Runtime Bundle returns 404', async () => {
            runtimeBundleFallback$.next(true);
            const notFoundError = Object.assign(new Error('Not Found'), { status: 404 });
            requestSpy.and.callFake((url: string) => (url.includes('/rb/') ? Promise.reject(notFoundError) : Promise.resolve(fakeTaskDetailsCloud)));

            const task: any = await firstValueFrom(service.getTaskById(appName, taskId));

            const requestedUrls = requestSpy.calls.all().map((call) => call.args[0]);
            expect(requestedUrls[0]).toContain(`/rb/v1/tasks/${taskId}`);
            expect(requestedUrls[1]).toContain(`/query/v1/tasks/${taskId}`);
            expect(task.id).toBe(fakeTaskDetailsCloud.entry.id);
        });

        it('should not use the Query Service for errors other than 404', async () => {
            runtimeBundleFallback$.next(true);
            const error = Object.assign(new Error('Server Error'), { status: 500 });
            requestSpy.and.callFake((url: string) => (url.includes('/rb/') ? Promise.reject(error) : Promise.resolve(fakeTaskDetailsCloud)));

            await expectAsync(firstValueFrom(service.getTaskById(appName, taskId))).toBeRejectedWith(error);

            const requestedUrls = requestSpy.calls.all().map((call) => call.args[0]);
            expect(requestedUrls.some((url) => url.includes('/query/'))).toBe(false);
        });
    });
});
