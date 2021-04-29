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

import { TestBed } from '@angular/core/testing';
import { setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { TaskListCloudService } from './task-list-cloud.service';
import { TaskQueryCloudRequestModel } from '../models/filter-cloud-model';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('TaskListCloudService', () => {

    let service: TaskListCloudService;
    let alfrescoApiService: AlfrescoApiService;

    function returnCallQueryParameters() {
        return {
            oauth2Auth: {
                callCustomApi : (_queryUrl, _operation, _context, queryParams) => {
                    return Promise.resolve(queryParams);
                },
                on: jasmine.createSpy('on')
            },
            isEcmLoggedIn() {
                return false;
            }
        };
    }

    function returnCallUrl() {
        return {
            oauth2Auth: {
                callCustomApi : (queryUrl) => {
                    return Promise.resolve(queryUrl);
                }
            },
            isEcmLoggedIn() {
                return false;
            }
        };
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        service = TestBed.inject(TaskListCloudService);
    });

    it('should append to the call all the parameters', (done) => {
        const taskRequest: TaskQueryCloudRequestModel = <TaskQueryCloudRequestModel> { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' };
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallQueryParameters);
        service.getTaskByRequest(taskRequest).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.skipCount).toBe(0);
            expect(res.maxItems).toBe(20);
            expect(res.service).toBe('fake-service');
            done();
        });
    });

    it('should concat the app name to the request url', (done) => {
        const taskRequest: TaskQueryCloudRequestModel = <TaskQueryCloudRequestModel> { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' };
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallUrl);
        service.getTaskByRequest(taskRequest).subscribe((requestUrl) => {
            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/fakeName/query/v1/tasks');
            done();
        });
    });

    it('should concat the sorting to append as parameters', (done) => {
        const taskRequest: TaskQueryCloudRequestModel = <TaskQueryCloudRequestModel> { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service',
            sorting: [{ orderBy: 'NAME', direction: 'DESC'}, { orderBy: 'TITLE', direction: 'ASC'}] };
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallQueryParameters);
        service.getTaskByRequest(taskRequest).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.sort).toBe('NAME,DESC&TITLE,ASC');
            done();
        });
    });

    it('should return an error when app name is not specified', (done) => {
        const taskRequest: TaskQueryCloudRequestModel = <TaskQueryCloudRequestModel> { appName: null };
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallUrl);
        service.getTaskByRequest(taskRequest).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('Appname not configured');
                done();
            }
        );
    });
});
