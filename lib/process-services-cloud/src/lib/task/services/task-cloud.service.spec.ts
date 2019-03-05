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

import { async } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { AlfrescoApiServiceMock, LogService, AppConfigService, StorageService, CoreModule } from '@alfresco/adf-core';
import { TaskCloudService } from './task-cloud.service';
import { taskCompleteCloudMock } from '../task-header/mocks/fake-complete-task.mock';
import { taskDetailsCloudMock } from '../task-header/mocks/task-details-cloud.mock';
import { fakeTaskDetailsCloud } from '../task-header/mocks/fake-task-details-response.mock';

describe('Task Cloud Service', () => {

    let service: TaskCloudService;
    let alfrescoApiMock: AlfrescoApiServiceMock;

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

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(async(() => {
        alfrescoApiMock = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService() );
        service = new TaskCloudService(alfrescoApiMock,
                                           new AppConfigService(null),
                                           new LogService(new AppConfigService(null)),
                                           new StorageService());

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

        service.completeTask(appName, taskId).toPromise().then( (res: any) => {
        }, (error) => {
            expect(error).toBeDefined();
            done();
        });
    });

    it('should canCompleteTask', () => {
        localStorage.setItem('USERNAME', 'superadminuser');
        const canCompleteTaskResult = service.canCompleteTask(taskDetailsCloudMock);
        expect(canCompleteTaskResult).toBeTruthy();
    });

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
});
