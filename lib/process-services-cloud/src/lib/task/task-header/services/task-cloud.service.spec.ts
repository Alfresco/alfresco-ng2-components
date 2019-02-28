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
import { taskComplateCloudMock } from '../mocks/fake-complete-task.mock';

describe('Task Header Cloud Service', () => {

    let service: TaskCloudService;
    let alfrescoApiMock: AlfrescoApiServiceMock;

    function returnFakeTaskCompleteResults() {
        return {
            oauth2Auth: {
                callCustomApi : () => {
                    return Promise.resolve(taskComplateCloudMock);
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
});
