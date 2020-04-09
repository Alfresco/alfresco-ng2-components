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
import { of, throwError } from 'rxjs';
import {
    setupTestBed,
    AlfrescoApiService,
    AppConfigService,
    LogService,
    StorageService
} from '@alfresco/adf-core';
import { StartProcessCloudService } from './start-process-cloud.service';
import { fakeProcessPayload } from '../mock/start-process.component.mock';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { ProcessDefinitionCloud } from '../models/process-definition-cloud.model';

describe('StartProcessCloudService', () => {

    let service: StartProcessCloudService;

    setupTestBed({
        imports: [HttpClientModule],
        providers: [StartProcessCloudService, AlfrescoApiService, AppConfigService, LogService, StorageService]
    });

    beforeEach(() => {
        service = TestBed.get(StartProcessCloudService);
    });

    it('should be able to create a new process', (done) => {
        spyOn(service, 'startProcess').and.returnValue(of({ id: 'fake-id', name: 'fake-name' }));
        service.startProcess('appName1', fakeProcessPayload)
            .subscribe(
                (res: ProcessInstanceCloud) => {
                    expect(res).toBeDefined();
                    expect(res.id).toEqual('fake-id');
                    expect(res.name).toEqual('fake-name');
                    done();
                }
            );
    });

    it('Should not be able to create a process if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'startProcess').and.returnValue(throwError(errorResponse));
        service.startProcess('appName1', fakeProcessPayload)
            .subscribe(
                () => {
                    fail('expected an error, not applications');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                }
            );
    });

    it('should be able to get all the process definitions', (done) => {
        spyOn(service, 'getProcessDefinitions').and.returnValue(of([{ id: 'fake-id', name: 'fake-name' }]));
        service.getProcessDefinitions('appName1')
            .subscribe(
                (res: ProcessDefinitionCloud[]) => {
                    expect(res).toBeDefined();
                    expect(res[0].id).toEqual('fake-id');
                    expect(res[0].name).toEqual('fake-name');
                    done();
                }
            );
    });

    it('should not be able to get all the process definitions if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });
        spyOn(service, 'getProcessDefinitions').and.returnValue(throwError(errorResponse));
        service.getProcessDefinitions('appName1')
            .subscribe(
                () => {
                    fail('expected an error, not applications');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                }
            );
    });

    it('should be able to create a new process instance without starting it', (done) => {
        spyOn(service, 'createProcess').and.returnValue(of({ id: 'fake-id', name: 'fake-name', status: 'CREATED' }));
        service.createProcess('appName1', fakeProcessPayload)
            .subscribe(
                (res: ProcessInstanceCloud) => {
                    expect(res).toBeDefined();
                    expect(res.id).toEqual('fake-id');
                    expect(res.name).toEqual('fake-name');
                    expect(res.status).toEqual('CREATED');
                    done();
                }
            );
    });

    it('should be able to start a created new process instance', (done) => {
        spyOn(service, 'startCreatedProcess').and.returnValue(of({ id: 'fake-id', name: 'fake-name', status: 'RUNNING' }));
        service.startCreatedProcess('appName1', 'fake-id')
            .subscribe(
                (res: ProcessInstanceCloud) => {
                    expect(res).toBeDefined();
                    expect(res.id).toEqual('fake-id');
                    expect(res.name).toEqual('fake-name');
                    expect(res.status).toEqual('RUNNING');
                    done();
                }
            );
    });
});
