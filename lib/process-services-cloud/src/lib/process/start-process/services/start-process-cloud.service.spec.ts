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
import { firstValueFrom, of, throwError } from 'rxjs';
import { StartProcessCloudService } from './start-process-cloud.service';
import { fakeProcessInstance, fakeProcessPayload, fakeProcessWithFormInstance, getFakeProcessPayload } from '../mock/start-process.component.mock';
import { provideAppConfigTesting } from '@alfresco/adf-core';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ProcessDefinitionCloud } from '@alfresco/adf-process-services-cloud';

describe('StartProcessCloudService', () => {
    let service: StartProcessCloudService;
    let adfHttpClient: AdfHttpClient;
    let adfClientHttpRequestSpy: jasmine.Spy;
    const bpmHost = 'http://adf-bpm-host.com';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideAppConfigTesting({
                    bpmHost
                })
            ]
        });
        service = TestBed.inject(StartProcessCloudService);
        adfHttpClient = TestBed.inject(AdfHttpClient);
        adfClientHttpRequestSpy = spyOn(adfHttpClient, 'request');
    });

    it('should be able to create a new process', async () => {
        const appName = 'appName1';
        const payload = getFakeProcessPayload();
        const expectedPayload = getFakeProcessPayload({ payloadType: 'StartProcessPayload' });

        adfClientHttpRequestSpy.and.returnValue(Promise.resolve({ entry: fakeProcessInstance }));

        const result = await firstValueFrom(service.startProcess(appName, payload));

        expect(result).toEqual(fakeProcessInstance);

        expect(adfClientHttpRequestSpy).toHaveBeenCalledWith(`${bpmHost}/${appName}/rb/v1/process-instances`, {
            path: `${bpmHost}/${appName}/rb/v1/process-instances`,
            httpMethod: 'POST',
            contentTypes: ['application/json'],
            accepts: ['application/json'],
            bodyParam: expectedPayload,
            queryParams: undefined
        });
    });

    it('should be able to create a new process with form', async () => {
        const appName = 'appName1';
        const formId = 'mockFormId';
        const payload = getFakeProcessPayload();
        const expectedPayload = getFakeProcessPayload({ payloadType: 'StartProcessPayload' });

        adfClientHttpRequestSpy.and.returnValue(Promise.resolve(fakeProcessWithFormInstance));

        const result = await firstValueFrom(service.startProcessWithForm(appName, formId, 1, payload));

        expect(result.id).toEqual(fakeProcessWithFormInstance.id);
        expect(result.name).toEqual(fakeProcessWithFormInstance.name);

        expect(adfClientHttpRequestSpy).toHaveBeenCalledWith(`${bpmHost}/${appName}/form/v1/forms/${formId}/submit/versions/1`, {
            path: `${bpmHost}/${appName}/form/v1/forms/${formId}/submit/versions/1`,
            httpMethod: 'POST',
            contentTypes: ['application/json'],
            accepts: ['application/json'],
            bodyParam: expectedPayload,
            queryParams: undefined
        });
    });

    it('should not be able to create a process if error occurred', async () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404,
            statusText: 'Not Found'
        });

        adfClientHttpRequestSpy.and.returnValue(Promise.reject(errorResponse));

        await firstValueFrom(service.startProcess('appName1', fakeProcessPayload)).catch((error) => {
            expect(error.status).toEqual(404);
            expect(error.statusText).toEqual('Not Found');
            expect(error.error).toEqual('Mock Error');
        });
    });

    it('should be able to get all the process definitions', async () => {
        spyOn(service, 'getProcessDefinitions').and.returnValue(of([new ProcessDefinitionCloud({ id: 'fake-id', name: 'fake-name' })]));
        const result = await firstValueFrom(service.getProcessDefinitions('appName1'));

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
        const result = await firstValueFrom(service.getProcessDefinitions('appName1')).catch((error) => {
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
        adfClientHttpRequestSpy.and.returnValue(Promise.resolve({ static1: 'value', static2: 0, static3: true }));

        const result = await firstValueFrom(service.getStartEventFormStaticValuesMapping(appName, processDefinitionId));
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
        expect(adfClientHttpRequestSpy.calls.mostRecent().args[0]).toContain(
            `${appName}/rb/v1/process-definitions/${processDefinitionId}/static-values`
        );
        expect(adfClientHttpRequestSpy.calls.mostRecent().args[1].httpMethod).toBe('GET');
    });

    it('should transform the response into task variables when retrieving the constant values for the start event', async () => {
        const appName = 'test-app';
        const processDefinitionId = 'processDefinitionId';
        adfClientHttpRequestSpy.and.returnValue(Promise.resolve({ constant1: 'value', constant2: '0', constant3: 'true' }));

        const result = await firstValueFrom(service.getStartEventConstants(appName, processDefinitionId));

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
        expect(adfClientHttpRequestSpy.calls.mostRecent().args[0]).toContain(
            `${appName}/rb/v1/process-definitions/${processDefinitionId}/constant-values`
        );
        expect(adfClientHttpRequestSpy.calls.mostRecent().args[1].httpMethod).toBe('GET');
    });
});
