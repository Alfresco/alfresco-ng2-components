/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { fakeProcessCloudList } from '../mock/process-list-service.mock';
import { AlfrescoApiServiceMock, LogService, AppConfigService, StorageService, CoreModule } from '@alfresco/adf-core';
import { ProcessListCloudService } from './process-list-cloud.service';
import { ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';

describe('Activiti ProcessList Cloud Service', () => {
    let service: ProcessListCloudService;
    let alfrescoApiMock: AlfrescoApiServiceMock;

    function returFakeProcessListResults() {
        return {
            oauth2Auth: {
                callCustomApi: () => {
                    return Promise.resolve(fakeProcessCloudList);
                }
            }
        };
    }

    function returnCallQueryParameters() {
        return {
            oauth2Auth: {
                callCustomApi: (queryUrl, operation, context, queryParams) => {
                    return Promise.resolve(queryParams);
                }
            }
        };
    }

    function returnCallUrl() {
        return {
            oauth2Auth: {
                callCustomApi: (queryUrl, operation, context, queryParams) => {
                    return Promise.resolve(queryUrl);
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
        alfrescoApiMock = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
        service = new ProcessListCloudService(alfrescoApiMock,
            new AppConfigService(null),
            new LogService(new AppConfigService(null)));
    }));

    it('should return the processes', (done) => {
        let processRequest: ProcessQueryCloudRequestModel = <ProcessQueryCloudRequestModel> { appName: 'fakeName' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returFakeProcessListResults);
        service.getProcessByRequest(processRequest).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.list.entries.length).toBe(3);
            expect(res.list.entries[0].entry.appName).toBe('easy-peasy-japanesey');
            expect(res.list.entries[1].entry.appName).toBe('easy-peasy-japanesey');
            expect(res.list.entries[1].entry.appName).toBe('easy-peasy-japanesey');
            done();
        });
    });

    it('should append to the call all the parameters', (done) => {
        let processRequest: ProcessQueryCloudRequestModel = <ProcessQueryCloudRequestModel> { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnCallQueryParameters);
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
        let processRequest: ProcessQueryCloudRequestModel = <ProcessQueryCloudRequestModel> { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnCallUrl);
        service.getProcessByRequest(processRequest).subscribe((requestUrl) => {
            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/fakeName-query/v1/process-instances');
            done();
        });
    });

    it('should concat the sorting to append as parameters', (done) => {
        let processRequest: ProcessQueryCloudRequestModel = <ProcessQueryCloudRequestModel> {
            appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service',
            sorting: [{ orderBy: 'NAME', direction: 'DESC' }, { orderBy: 'TITLE', direction: 'ASC' }]
        };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnCallQueryParameters);
        service.getProcessByRequest(processRequest).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.sort).toBe('NAME,DESC&TITLE,ASC');
            done();
        });
    });

    it('should return an error when app name is not specified', (done) => {
        let processRequest: ProcessQueryCloudRequestModel = <ProcessQueryCloudRequestModel> { appName: null };
        spyOn(alfrescoApiMock, 'getInstance').and.callFake(returnCallUrl);
        service.getProcessByRequest(processRequest).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('Appname not configured');
                done();
            }
        );
    });
});
