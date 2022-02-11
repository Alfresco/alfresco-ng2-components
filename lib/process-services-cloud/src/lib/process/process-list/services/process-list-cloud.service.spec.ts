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
import { fakeAsync, TestBed } from '@angular/core/testing';
import { setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { ProcessListCloudService } from './process-list-cloud.service';
import { ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';

describe('ProcessListCloudService', () => {
    let service: ProcessListCloudService;
    let alfrescoApiService: AlfrescoApiService;

    const returnCallQueryParameters = (): any => ({
        oauth2Auth: {
            callCustomApi: (_queryUrl, _operation, _context, queryParams) => Promise.resolve(queryParams)
        },
        isEcmLoggedIn: () => false
    });

    const returnCallUrl = (): any => ({
        oauth2Auth: {
            callCustomApi: (queryUrl) => Promise.resolve(queryUrl)
        },
        isEcmLoggedIn: () => false
    });

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(fakeAsync(() => {
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        service = TestBed.inject(ProcessListCloudService);
    }));

    it('should append to the call all the parameters', (done) => {
        const processRequest = { appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service' } as ProcessQueryCloudRequestModel;
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallQueryParameters);
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
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallUrl);
        service.getProcessByRequest(processRequest).subscribe((requestUrl) => {
            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/fakeName/query/v1/process-instances');
            done();
        });
    });

    it('should concat the sorting to append as parameters', (done) => {
        const processRequest = {
            appName: 'fakeName', skipCount: 0, maxItems: 20, service: 'fake-service',
            sorting: [{ orderBy: 'NAME', direction: 'DESC' }, { orderBy: 'TITLE', direction: 'ASC' }]
        } as ProcessQueryCloudRequestModel;
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallQueryParameters);
        service.getProcessByRequest(processRequest).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.sort).toBe('NAME,DESC&TITLE,ASC');
            done();
        });
    });

    it('should return an error when app name is not specified', (done) => {
        const processRequest = { appName: null } as ProcessQueryCloudRequestModel;
        spyOn(alfrescoApiService, 'getInstance').and.callFake(returnCallUrl);
        service.getProcessByRequest(processRequest).subscribe(
            () => { },
            (error) => {
                expect(error).toBe('Appname not configured');
                done();
            }
        );
    });
});
