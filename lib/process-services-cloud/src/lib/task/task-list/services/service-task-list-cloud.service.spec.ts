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
import { ServiceTaskListCloudService } from './service-task-list-cloud.service';
import { ServiceTaskQueryCloudRequestModel } from '../models/service-task-cloud.model';
import { firstValueFrom, of } from 'rxjs';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('Activiti ServiceTaskList Cloud Service', () => {
    let service: ServiceTaskListCloudService;
    let adfHttpClient: AdfHttpClient;
    let requestSpy: jasmine.Spy;

    const returnCallQueryParameters = (_queryUrl, options) => Promise.resolve(options.queryParams);

    const returnCallUrl = (queryUrl) => Promise.resolve(queryUrl);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule]
        });
        adfHttpClient = TestBed.inject(AdfHttpClient);
        service = TestBed.inject(ServiceTaskListCloudService);
        requestSpy = spyOn(adfHttpClient, 'request');
    });

    it('should append to the call all the parameters', (done) => {
        const taskRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ServiceTaskQueryCloudRequestModel;
        requestSpy.and.callFake(returnCallQueryParameters);
        service.getServiceTaskByRequest(taskRequest).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.skipCount).toBe(0);
            expect(res.maxItems).toBe(20);
            expect(res.service).toBe('fake-service');
            done();
        });
    });

    it('should concat the app name to the request url', (done) => {
        const taskRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ServiceTaskQueryCloudRequestModel;
        requestSpy.and.callFake(returnCallUrl);
        service.getServiceTaskByRequest(taskRequest).subscribe((requestUrl) => {
            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/fakeName/query/admin/v1/service-tasks');
            done();
        });
    });

    it('should concat the sorting to append as parameters', (done) => {
        const taskRequest = {
            appName: 'fakeName',
            skipCount: 0,
            maxItems: 20,
            service: 'fake-service',
            sorting: [
                { orderBy: 'NAME', direction: 'DESC' },
                { orderBy: 'TITLE', direction: 'ASC' }
            ]
        } as ServiceTaskQueryCloudRequestModel;
        requestSpy.and.callFake(returnCallQueryParameters);
        service.getServiceTaskByRequest(taskRequest).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.sort).toBe('NAME,DESC&TITLE,ASC');
            done();
        });
    });

    it('should return an error when app name is not specified', (done) => {
        const taskRequest = { appName: null } as ServiceTaskQueryCloudRequestModel;
        requestSpy.and.callFake(returnCallUrl);
        service.getServiceTaskByRequest(taskRequest).subscribe(
            () => {},
            (error) => {
                expect(error).toBe('Appname not configured');
                done();
            }
        );
    });

    describe('run replayServiceTaskRequest method', () => {
        beforeEach(() => {
            spyOn(service, 'getBasePath').and.returnValue('http://localhost/fakeName');
            requestSpy.and.callFake(returnCallUrl);
        });

        it('should execute post method if all parameters are provided', async () => {
            const expected = {
                expectedQueryUrl: 'http://localhost/fakeName/rb/admin/v1/executions/executionId_1/replay/service-task',
                expectedPayload: {
                    flowNodeId: 'flowNodeId_1'
                }
            };

            const spyOnPost = spyOn<any>(service, 'post').and.returnValue(of({}));
            const params = ['fakeName', 'executionId_1', 'flowNodeId_1'] as const;
            await firstValueFrom(service.replayServiceTaskRequest(...params));
            expect(spyOnPost).toHaveBeenCalledWith(expected.expectedQueryUrl, expected.expectedPayload);
        });

        it('should throw an exeption and execute logService error if appName is null', (done) => {
            const expectedErrorMessage = 'Appname/executionId/flowNodeId not configured';
            const params = [null, 'executionId_1', 'flowNodeId_1'] as const;
            firstValueFrom(service.replayServiceTaskRequest(...params)).catch((error) => {
                expect(error).toEqual(expectedErrorMessage);
                done();
            });
        });

        it('should throw an exeption and execute logService error if executionId is null', (done) => {
            const expectedErrorMessage = 'Appname/executionId/flowNodeId not configured';
            const params = ['fakeName', null, 'flowNodeId_1'] as const;
            firstValueFrom(service.replayServiceTaskRequest(...params)).catch((error) => {
                expect(error).toEqual(expectedErrorMessage);
                done();
            });
        });

        it('should throw an exeption and execute logService error if flowNodeId is null', (done) => {
            const expectedErrorMessage = 'Appname/executionId/flowNodeId not configured';
            const params = ['fakeName', 'executionId_1', null] as const;
            firstValueFrom(service.replayServiceTaskRequest(...params)).catch((error) => {
                expect(error).toEqual(expectedErrorMessage);
                done();
            });
        });

        it('should throw an exeption and execute logService error if appName, executionId and flowNodeId are null', (done) => {
            const expectedErrorMessage = 'Appname/executionId/flowNodeId not configured';
            const params = [null, null, null] as const;
            firstValueFrom(service.replayServiceTaskRequest(...params)).catch((error) => {
                expect(error).toEqual(expectedErrorMessage);
                done();
            });
        });
    });
});
