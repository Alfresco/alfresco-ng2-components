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
import { TestBed } from '@angular/core/testing';
import { GroupCloudService } from './group-cloud.service';
import {
    AlfrescoApiServiceMock,
    CoreModule,
    setupTestBed,
    AlfrescoApiService,
    LogService
} from '@alfresco/adf-core';
import {
    applicationDetailsMockApi,
    groupsMockApi,
    returnCallQueryParameters,
    returnCallUrl,
    mockApiError,
    mockError,
    roleMappingApi,
    noRoleMappingApi
} from '../mock/group-cloud.mock';
import { GroupSearchParam } from '../models/group.model';

describe('GroupCloudService', () => {
    let service: GroupCloudService;
    let apiService: AlfrescoApiService;
    let logService: LogService;

    setupTestBed({
        imports: [CoreModule.forRoot()],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(async(() => {
        service = TestBed.get(GroupCloudService);
        apiService = TestBed.get(AlfrescoApiService);
        logService = TestBed.get(LogService);
    }));

    it('should be able to fetch groups', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(groupsMockApi);
        service.findGroupsByName(<GroupSearchParam> {name: 'mock'}).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].id).toBe('mock-id-1');
            expect(res[0].name).toBe('Mock Group 1');
            expect(res[1].id).toBe('mock-id-2');
            expect(res[1].name).toBe('Mock Group 2');
            expect(res[2].id).toBe('mock-id-3');
            expect(res[2].name).toBe('Fake Group 3');
            done();
        });
    });

    it('should return true if group has client role mapping', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(roleMappingApi);
        service.checkGroupHasClientRoleMapping('mock-group-id', 'mock-app-id').subscribe((hasRole) => {
            expect(hasRole).toBeDefined();
            expect(hasRole).toBe(true);
            done();
        });
    });

    it('should return false if group does not have client role mapping', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(noRoleMappingApi);
        service.checkGroupHasClientRoleMapping('mock-group-id', 'mock-app-id').subscribe((hasRole) => {
            expect(hasRole).toBeDefined();
            expect(hasRole).toBe(false);
            done();
        });
    });

    it('should append to the call all the parameters', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(returnCallQueryParameters);
        service.findGroupsByName(<GroupSearchParam> {name: 'mock'}).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.search).toBe('mock');
            done();
        });
    });

    it('should request groups api url', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(returnCallUrl);
        service.findGroupsByName(<GroupSearchParam> {name: 'mock'}).subscribe((requestUrl) => {
            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/groups');
            done();
        });
    });

    it('should be able to fetch the client id', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(applicationDetailsMockApi);
        service.getClientIdByApplicationName('mock-app-name').subscribe((clientId) => {
            expect(clientId).toBeDefined();
            expect(clientId).not.toBeNull();
            expect(clientId).toBe('mock-app-id');
            done();
        });
    });

    it('should notify errors returned from the API', (done) => {
        const logServiceSpy = spyOn(logService, 'error').and.callThrough();
        spyOn(apiService, 'getInstance').and.returnValue(mockApiError);
        service.findGroupsByName(<GroupSearchParam> {name: 'mock'}).subscribe(
            () => {},
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual(mockError);
                expect(logServiceSpy).toHaveBeenCalled();
                done();
            }
        );
    });
});
