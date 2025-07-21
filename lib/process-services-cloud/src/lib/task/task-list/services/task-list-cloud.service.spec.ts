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

import { TestBed } from '@angular/core/testing';
import { TaskListCloudService } from './task-list-cloud.service';
import { TaskListRequestModel, TaskQueryCloudRequestModel } from '../../../models/filter-cloud-model';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { catchError, firstValueFrom, of } from 'rxjs';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('TaskListCloudService', () => {
    let service: TaskListCloudService;
    let adfHttpClient: AdfHttpClient;
    let requestSpy: jasmine.Spy;

    const returnCallQueryParameters = (_queryUrl, options) => Promise.resolve(options.queryParams);

    const returnCallUrl = (queryUrl) => Promise.resolve(queryUrl);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule]
        });
        adfHttpClient = TestBed.inject(AdfHttpClient);
        service = TestBed.inject(TaskListCloudService);
        requestSpy = spyOn(adfHttpClient, 'request');
    });

    describe('getTaskByRequest', () => {
        it('should append to the call all the parameters', async () => {
            const taskRequest = {
                appName: 'fakeName',
                skipCount: 0,
                maxItems: 20,
                service: 'fake-service'
            } as TaskQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);

            const res = await firstValueFrom(service.getTaskByRequest(taskRequest));

            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.skipCount).toBe(0);
            expect(res.maxItems).toBe(20);
            expect(res.service).toBe('fake-service');
        });

        it('should concat the app name to the request url', async () => {
            const taskRequest = {
                appName: 'fakeName',
                skipCount: 0,
                maxItems: 20,
                service: 'fake-service'
            } as TaskQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallUrl);

            const requestUrl = await firstValueFrom(service.getTaskByRequest(taskRequest));

            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/fakeName/query/v1/tasks');
        });

        it('should concat the sorting to append as parameters', async () => {
            const taskRequest = {
                appName: 'fakeName',
                skipCount: 0,
                maxItems: 20,
                service: 'fake-service',
                sorting: [
                    { orderBy: 'NAME', direction: 'DESC' },
                    { orderBy: 'TITLE', direction: 'ASC' }
                ]
            } as TaskQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);

            const res = await firstValueFrom(service.getTaskByRequest(taskRequest));

            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.sort).toBe('NAME,DESC&TITLE,ASC');
        });

        it('should return an error when app name is not specified', async () => {
            const taskRequest = { appName: null } as TaskQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallUrl);

            const res = await firstValueFrom(service.getTaskByRequest(taskRequest).pipe(catchError((error) => of(error))));

            expect(res).toBe('Appname not configured');
        });
    });

    describe('fetchTaskList', () => {
        it('should append to the call all the parameters', async () => {
            const taskRequest = {
                appName: 'fakeName',
                pagination: { skipCount: 0, maxItems: 20 }
            } as TaskListRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);

            const res = await firstValueFrom(service.fetchTaskList(taskRequest));

            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.skipCount).toBe(0);
            expect(res.maxItems).toBe(20);
        });

        it('should concat the app name to the request url', async () => {
            const taskRequest = {
                appName: 'fakeName',
                pagination: { skipCount: 0, maxItems: 20 }
            } as TaskListRequestModel;
            requestSpy.and.callFake(returnCallUrl);

            const res = await firstValueFrom(service.fetchTaskList(taskRequest));

            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res).toContain('/fakeName/query/v1/tasks/search');
        });

        it('should concat the sorting to append as parameters', async () => {
            const taskRequest = {
                appName: 'fakeName',
                pagination: { skipCount: 0, maxItems: 20 },
                sorting: { orderBy: 'NAME', direction: 'DESC', isFieldProcessVariable: false }
            } as TaskListRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);

            const res = await firstValueFrom(service.fetchTaskList(taskRequest));

            expect(res).toBeDefined();
            expect(res).not.toBeNull();
        });

        it('should return an error when app name is not specified', async () => {
            const taskRequest = { appName: null } as TaskListRequestModel;
            requestSpy.and.callFake(returnCallUrl);

            const res = await firstValueFrom(service.fetchTaskList(taskRequest).pipe(catchError((error) => of(error.message))));

            expect(res).toBe('Appname not configured');
        });
    });
});
