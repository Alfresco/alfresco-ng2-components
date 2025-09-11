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
import { of, throwError } from 'rxjs';
import { StartProcessCloudService } from './start-process-cloud.service';
import { fakeProcessPayload } from '../mock/start-process.component.mock';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { AdfHttpClient } from '@alfresco/adf-core/api';

describe('StartProcessCloudService', () => {
    let service: StartProcessCloudService;
    let adfHttpClient: AdfHttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(StartProcessCloudService);
        adfHttpClient = TestBed.inject(AdfHttpClient);
    });

    it('should be able to create a new process', async () => {
        spyOn(service, 'startProcess').and.returnValue(of({ id: 'fake-id', name: 'fake-name' }));
        const result = await service.startProcess('appName1', fakeProcessPayload).toPromise();

        expect(result).toBeDefined();
        expect(result.id).toEqual('fake-id');
        expect(result.name).toEqual('fake-name');
    });

    it('should be able to create a new process with form', async () => {
        spyOn(service, 'startProcessWithForm').and.returnValue(of({ id: 'fake-id', name: 'fake-name' }));
        const result = await service.startProcessWithForm('appName1', 'mockFormId', 1, fakeProcessPayload).toPromise();

        expect(result).toBeDefined();
        expect(result.id).toEqual('fake-id');
        expect(result.name).toEqual('fake-name');
    });

    it('Should not be able to create a process if error occurred', async () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404,
            statusText: 'Not Found'
        });

        spyOn(service, 'startProcess').and.returnValue(throwError(errorResponse));
        const result = await service
            .startProcess('appName1', fakeProcessPayload)
            .toPromise()
            .catch((error) => {
                expect(error.status).toEqual(404);
                expect(error.statusText).toEqual('Not Found');
                expect(error.error).toEqual('Mock Error');
            });

        if (result) {
            fail('expected an error, not applications');
        }
    });

    it('should be able to get all the process definitions', async () => {
        spyOn(service, 'getProcessDefinitions').and.returnValue(of([new ProcessDefinitionCloud({ id: 'fake-id', name: 'fake-name' })]));
        const result = await service.getProcessDefinitions('appName1').toPromise();

        expect(result).toBeDefined();
        expect(result[0].id).toEqual('fake-id');
        expect(result[0].name).toEqual('fake-name');
    });

    it('should not be able to get all the process definitions if error occurred', async () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404,
            statusText: 'Not Found'
        });
        spyOn(service, 'getProcessDefinitions').and.returnValue(throwError(errorResponse));
        const result = await service
            .getProcessDefinitions('appName1')
            .toPromise()
            .catch((error) => {
                expect(error.status).toEqual(404);
                expect(error.statusText).toEqual('Not Found');
                expect(error.error).toEqual('Mock Error');
            });

        if (result) {
            fail('expected an error, not applications');
        }
    });

    it('should transform the response into task variables', async () => {
        const appName = 'test-app';
        const processDefinitionId = 'processDefinitionId';
        const requestSpy = spyOn(adfHttpClient, 'request');
        requestSpy.and.returnValue(Promise.resolve({ static1: 'value', static2: 0, static3: true }));

        const result = await service.getStartEventFormStaticValuesMapping(appName, processDefinitionId).toPromise();
        expect(result.length).toEqual(3);
        expect(result[0].name).toEqual('static1');
        expect(result[0].id).toEqual('static1');
        expect(result[0].value).toEqual('value');
        expect(result[1].name).toEqual('static2');
        expect(result[1].id).toEqual('static2');
        expect(result[1].value).toEqual(0);
        expect(result[2].name).toEqual('static3');
        expect(result[2].id).toEqual('static3');
        expect(result[2].value).toEqual(true);
        expect(requestSpy.calls.mostRecent().args[0]).toContain(`${appName}/rb/v1/process-definitions/${processDefinitionId}/static-values`);
        expect(requestSpy.calls.mostRecent().args[1].httpMethod).toBe('GET');
    });

    it('should transform the response into task variables when retrieving the constant values for the start event', async () => {
        const appName = 'test-app';
        const processDefinitionId = 'processDefinitionId';
        const requestSpy = spyOn(adfHttpClient, 'request');
        requestSpy.and.returnValue(Promise.resolve({ constant1: 'value', constant2: '0', constant3: 'true' }));

        const result = await service.getStartEventConstants(appName, processDefinitionId).toPromise();

        expect(result.length).toEqual(3);
        expect(result[0].name).toEqual('constant1');
        expect(result[0].id).toEqual('constant1');
        expect(result[0].value).toEqual('value');
        expect(result[0].type).toEqual('string');
        expect(result[1].name).toEqual('constant2');
        expect(result[1].id).toEqual('constant2');
        expect(result[1].value).toEqual('0');
        expect(result[1].type).toEqual('string');
        expect(result[2].name).toEqual('constant3');
        expect(result[2].id).toEqual('constant3');
        expect(result[2].value).toEqual('true');
        expect(result[2].type).toEqual('string');
        expect(requestSpy.calls.mostRecent().args[0]).toContain(`${appName}/rb/v1/process-definitions/${processDefinitionId}/constant-values`);
        expect(requestSpy.calls.mostRecent().args[1].httpMethod).toBe('GET');
    });
});
