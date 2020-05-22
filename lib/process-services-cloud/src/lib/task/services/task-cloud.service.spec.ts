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

import { async, TestBed } from '@angular/core/testing';
import { setupTestBed, IdentityUserService, StorageService, AlfrescoApiServiceMock, LogService, AppConfigService } from '@alfresco/adf-core';
import { TaskCloudService } from './task-cloud.service';
import { taskCompleteCloudMock } from '../task-header/mocks/fake-complete-task.mock';
import { assignedTaskDetailsCloudMock, createdTaskDetailsCloudMock, emptyOwnerTaskDetailsCloudMock } from '../task-header/mocks/task-details-cloud.mock';
import { fakeTaskDetailsCloud } from '../task-header/mocks/fake-task-details-response.mock';
import { cloudMockUser } from '../start-task/mock/user-cloud.mock';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('Task Cloud Service', () => {

    let service: TaskCloudService;
    let alfrescoApiMock: AlfrescoApiServiceMock;
    let identityUserService: IdentityUserService;

    function returnFakeTaskCompleteResults() {
        return {
            oauth2Auth: {
                callCustomApi : () => {
                    return Promise.resolve(taskCompleteCloudMock);
                }
            }
        };
    }

    function returnFakeTaskCompleteResultsError() {
        return {
            oauth2Auth: {
                callCustomApi : () => {
                    return Promise.reject(taskCompleteCloudMock);
                }
            }
        };
    }

    function returnFakeTaskDetailsResults() {
        return {
            oauth2Auth: {
                callCustomApi : () => {
                    return Promise.resolve(fakeTaskDetailsCloud);
                }
            }
        };
    }

    function returnFakeCandidateUsersResults() {
        return {
            oauth2Auth: {
                callCustomApi : () => {
                    return Promise.resolve(['mockuser1', 'mockuser2', 'mockuser3']);
                }
            }
        };
    }

    function returnFakeCandidateGroupResults() {
        return {
            oauth2Auth: {
                callCustomApi : () => {
                    return Promise.resolve(['mockgroup1', 'mockgroup2', 'mockgroup3']);
                }
            }
        };
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(async(() => {
        alfrescoApiMock = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
        identityUserService = TestBed.inject(IdentityUserService);
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(cloudMockUser);
        service = new TaskCloudService(alfrescoApiMock,
                                           new AppConfigService(null),
                                           new LogService(new AppConfigService(null)),
                                           identityUserService);

    }));

    it('should complete a task', (done) => {
        const appName = 'simple-app';
        const taskId = '68d54a8f';
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskCompleteResults);
        service.completeTask(appName, taskId).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.entry.appName).toBe('simple-app');
            expect(res.entry.id).toBe('68d54a8f');
            done();
        });
    });

    it('should not complete a task', (done) => {
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskCompleteResultsError);
        const appName = 'simple-app';
        const taskId = '68d54a8f';

        service.completeTask(appName, taskId).toPromise().then(() => {
        }, (error) => {
            expect(error).toBeDefined();
            done();
        });
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

    it('should complete task with owner as null', async(() => {
        const appName = 'simple-app';
        const taskId = '68d54a8f';
        const canCompleteTaskResult = service.canCompleteTask(emptyOwnerTaskDetailsCloudMock);
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskCompleteResults);

        service.completeTask(appName, taskId).subscribe((res: any) => {
            expect(canCompleteTaskResult).toEqual(true);
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.entry.appName).toBe('simple-app');
            expect(res.entry.id).toBe('68d54a8f');
        });
    }));

    it('should return the task details when claiming a task', (done) => {
        const appName = 'taskp-app';
        const assignee = 'user12';
        const taskId = '68d54a8f';
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
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
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.claimTask(appName, taskId, assignee).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should throw error if taskId is not defined when claiming a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        const assignee = 'user12';
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.claimTask(appName, taskId, assignee).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should return the task details when unclaiming a task', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
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
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.unclaimTask(appName, taskId).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should throw error if taskId is not defined when unclaiming a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.unclaimTask(appName, taskId).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should return the task details when querying by id', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
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
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.getTaskById(appName, taskId).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should throw error if taskId is not defined when querying by id', (done) => {
        const appName = 'task-app';
        const taskId = null;
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.getTaskById(appName, taskId).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should throw error if appName is not defined when updating a task', (done) => {
        const appName = null;
        const taskId = '68d54a8f';
        const updatePayload = { description: 'New description' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should throw error if taskId is not defined when updating a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        const updatePayload = { description: 'New description' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should return the task details when updating a task', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        const updatePayload = { description: 'New description' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe((res: any) => {
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
        const updatePayload = { description: 'New description' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should throw error if taskId is not defined updating a task', (done) => {
        const appName = 'task-app';
        const taskId = null;
        const updatePayload = { description: 'New description' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeTaskDetailsResults);
        service.updateTask(appName, taskId, updatePayload).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('AppName/TaskId not configured');
                done();
            });
    });

    it('should return the candidate users by appName and taskId', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeCandidateUsersResults);
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
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeCandidateUsersResults);
        service.getCandidateUsers(appName, taskId).subscribe(
            (res: any[]) => {
                expect(res.length).toBe(0);
                done();
            });
    });

    it('should log message and return empty array if taskId is not defined when fetching candidate users', (done) => {
        const appName = 'task-app';
        const taskId = null;
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeCandidateUsersResults);
        service.getCandidateUsers(appName, taskId).subscribe(
            (res: any[]) => {
                expect(res.length).toBe(0);
                done();
            });
    });

    it('should return the candidate groups by appName and taskId', (done) => {
        const appName = 'taskp-app';
        const taskId = '68d54a8f';
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeCandidateGroupResults);
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
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeCandidateGroupResults);
        service.getCandidateGroups(appName, taskId).subscribe(
            (res: any[]) => {
                expect(res.length).toBe(0);
                done();
            });
    });

    it('should log message and return empty array if taskId is not defined when fetching candidate groups', (done) => {
        const appName = 'task-app';
        const taskId = null;
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnFakeCandidateGroupResults);
        service.getCandidateGroups(appName, taskId).subscribe(
            (res: any[]) => {
                expect(res.length).toBe(0);
                done();
            });
    });
});
