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

import { fakeAsync, TestBed } from '@angular/core/testing';
import { ProcessListCloudService } from './process-list-cloud.service';
import { ProcessListRequestModel, ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { catchError, firstValueFrom, of } from 'rxjs';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('ProcessListCloudService', () => {
    let service: ProcessListCloudService;
    let adfHttpClient: AdfHttpClient;
    let requestSpy: jasmine.Spy;

    const returnCallQueryParameters = (_queryUrl, options) => Promise.resolve(options.queryParams);

    const returnCallUrl = (queryUrl) => Promise.resolve(queryUrl);

    const returnCallOperation = (_queryUrl, options) => Promise.resolve(options);

    const returnCallBody = (_queryUrl, options) => Promise.resolve(options.bodyParam);

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule]
        });
        adfHttpClient = TestBed.inject(AdfHttpClient);
        service = TestBed.inject(ProcessListCloudService);
        requestSpy = spyOn(adfHttpClient, 'request');
    }));

    describe('getProcessByRequest', () => {
        it('should append to the call all the parameters', (done) => {
            const processRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);
            service.getProcessByRequest(processRequest).subscribe((res) => {
                expect(res).toBeDefined();
                expect(res).not.toBeNull();
                expect(res.skipCount).toBe(0);
                expect(res.maxItems).toBe(20);
                expect(res.service).toBe('fake-service');
                done();
            });
        });

        it('should concat the app name to the request url', (done) => {
            const processRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallUrl);
            service.getProcessByRequest(processRequest).subscribe((requestUrl) => {
                expect(requestUrl).toBeDefined();
                expect(requestUrl).not.toBeNull();
                expect(requestUrl).toContain('/fakeName/query/v1/process-instances');
                done();
            });
        });

        it('should concat the sorting to append as parameters', (done) => {
            const processRequest = {
                appName: 'fakeName',
                skipCount: 0,
                maxItems: 20,
                service: 'fake-service',
                sorting: [
                    { orderBy: 'NAME', direction: 'DESC' },
                    { orderBy: 'TITLE', direction: 'ASC' }
                ]
            } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);
            service.getProcessByRequest(processRequest).subscribe((res) => {
                expect(res).toBeDefined();
                expect(res).not.toBeNull();
                expect(res.sort).toBe('NAME,DESC&TITLE,ASC');
                done();
            });
        });

        it('should return an error when app name is not specified', (done) => {
            const processRequest = { appName: null } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallUrl);
            service.getProcessByRequest(processRequest).subscribe(
                () => {},
                (error) => {
                    expect(error).toBe('Appname not configured');
                    done();
                }
            );
        });

        it('should return number of total items of processes ', async () => {
            const processRequest = { appName: 'fakeName', skipCount: 0, maxItems: 1, service: 'fake-service' } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);
            const result = await firstValueFrom(service.getProcessByRequest(processRequest));

            expect(result).toBeDefined();
            expect(result).not.toBeNull();
            expect(result.skipCount).toBe(0);
            expect(result.maxItems).toBe(1);
            expect(result.service).toBe('fake-service');
        });
    });

    describe('fetchProcessList', () => {
        it('should append to the call all the query parameters', async () => {
            const processRequest = {
                appName: 'fakeName',
                pagination: { skipCount: 0, maxItems: 20 },
                parentId: ['fakeParentId'],
                excludeByProcessCategoryName: 'fakeCategory'
            } as ProcessListRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);

            const requestQueryParams = await firstValueFrom(service.fetchProcessList(processRequest));

            expect(requestQueryParams).toEqual({ skipCount: 0, maxItems: 20 });
        });

        it('should append to the call all the body parameters', async () => {
            const processRequest = {
                appName: 'fakeName',
                pagination: { skipCount: 0, maxItems: 20 },
                parentId: ['fakeParentId'],
                excludeByProcessCategoryName: 'fakeCategory'
            } as ProcessListRequestModel;
            requestSpy.and.callFake(returnCallBody);

            const requestBodyParams = await firstValueFrom(service.fetchProcessList(processRequest));

            expect(requestBodyParams).toEqual({ excludeByProcessCategoryName: 'fakeCategory', parentId: ['fakeParentId'] });
        });

        it('should concat the app name to the request url', async () => {
            const processRequest = {
                appName: 'fakeName',
                pagination: { skipCount: 0, maxItems: 20 }
            } as ProcessListRequestModel;
            requestSpy.and.callFake(returnCallUrl);

            const requestUrl = await firstValueFrom(service.fetchProcessList(processRequest));

            expect(requestUrl).toContain('/fakeName/query/v1/process-instances/search');
        });

        it('should concat the sorting to append as a body sort parameter', async () => {
            const processRequest = {
                appName: 'fakeName',
                pagination: { skipCount: 0, maxItems: 20 },
                sorting: { orderBy: 'NAME', direction: 'DESC', isFieldProcessVariable: false }
            } as ProcessListRequestModel;
            requestSpy.and.callFake(returnCallBody);

            const requestBodyParams = await firstValueFrom(service.fetchProcessList(processRequest));

            expect(requestBodyParams).toEqual({ sort: { field: 'NAME', direction: 'desc', isProcessVariable: false } });
        });

        it('should return an error when app name is not specified', async () => {
            const taskRequest = { appName: null } as ProcessListRequestModel;
            requestSpy.and.callFake(returnCallUrl);

            const error = await firstValueFrom(service.fetchProcessList(taskRequest).pipe(catchError((error) => of(error.message))));

            expect(error).toBe('Appname not configured');
        });
    });

    describe('getAdminProcessRequest', () => {
        it('should append to the call all the parameters', async () => {
            const processRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);
            const request = await service.getAdminProcessByRequest(processRequest).toPromise();

            expect(request).toBeDefined();
            expect(request).not.toBeNull();
            expect(request.skipCount).toBe(0);
            expect(request.maxItems).toBe(20);
            expect(request.service).toBe('fake-service');
        });

        it('should concat the app name to the request url', async () => {
            const processRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallUrl);
            const requestUrl = await service.getAdminProcessByRequest(processRequest).toPromise();

            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/fakeName/query/admin/v1/process-instances');
        });

        it('should concat the sorting to append as parameters', async () => {
            const processRequest = {
                appName: 'fakeName',
                skipCount: 0,
                maxItems: 20,
                service: 'fake-service',
                sorting: [
                    { orderBy: 'NAME', direction: 'DESC' },
                    { orderBy: 'TITLE', direction: 'ASC' }
                ]
            } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);
            const request = await service.getAdminProcessByRequest(processRequest).toPromise();

            expect(request).toBeDefined();
            expect(request).not.toBeNull();
            expect(request.sort).toBe('NAME,DESC&TITLE,ASC');
        });

        it('should return an error when app name is not specified', async () => {
            const processRequest = { appName: null } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallUrl);

            try {
                await service.getAdminProcessByRequest(processRequest).toPromise();

                fail('Should have thrown error');
            } catch (error) {
                expect(error).toBe('Appname not configured');
            }
        });

        it('should make post request', async () => {
            const processRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallOperation);
            const adminProcessResponse = await service.getAdminProcessByRequest(processRequest).toPromise();
            expect(adminProcessResponse).toBeDefined();
            expect(adminProcessResponse).not.toBeNull();
            expect(adminProcessResponse.httpMethod).toBe('POST');
        });

        it('should not have variable keys as part of query parameters', async () => {
            const processRequest = {
                appName: 'fakeName',
                skipCount: 0,
                maxItems: 20,
                service: 'fake-service',
                variableKeys: ['test-one', 'test-two']
            } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallQueryParameters);
            const requestParams = await service.getAdminProcessByRequest(processRequest).toPromise();

            expect(requestParams).toBeDefined();
            expect(requestParams).not.toBeNull();
            expect(requestParams.variableKeys).not.toBeDefined();
        });

        it('should send right variable keys as post body', async () => {
            const processRequest = {
                appName: 'fakeName',
                skipCount: 0,
                maxItems: 20,
                service: 'fake-service',
                variableKeys: ['test-one', 'test-two']
            } as ProcessQueryCloudRequestModel;
            requestSpy.and.callFake(returnCallBody);
            const requestBodyParams = await service.getAdminProcessByRequest(processRequest).toPromise();

            expect(requestBodyParams).toBeDefined();
            expect(requestBodyParams).not.toBeNull();
            expect(requestBodyParams.variableKeys).toBeDefined();
            expect(requestBodyParams.variableKeys.length).toBe(2);
            expect(requestBodyParams.variableKeys[0]).toBe('test-one');
            expect(requestBodyParams.variableKeys[1]).toBe('test-two');
        });
    });
});
